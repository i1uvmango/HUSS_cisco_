'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, getGreeting, ChatMessage } from '@/lib/api';

interface ChatInterfaceProps {
    onSessionReady?: (sessionId: string, messages: ChatMessage[]) => void;
}

export default function ChatInterface({ onSessionReady }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch initial greeting when component mounts
    useEffect(() => {
        const initChat = async () => {
            if (isInitialized) return;

            try {
                const response = await getGreeting();
                setSessionId(response.session_id);
                setMessages([{ role: 'assistant', content: response.greeting }]);
                setIsInitialized(true);
            } catch (error) {
                console.error('Greeting error:', error);
                // Fallback greeting
                setMessages([{ role: 'assistant', content: "안녕! 😊 여기는 네가 편하게 이야기할 수 있는 공간이야. 오늘 기분은 어때?" }]);
                setIsInitialized(true);
            }
        };

        initChat();
    }, [isInitialized]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await sendChatMessage(userMessage, sessionId || undefined);
            setSessionId(response.session_id);

            setMessages((prev) => {
                const newMessages: ChatMessage[] = [...prev, { role: 'assistant', content: response.response }];

                // If crisis detected and meeting created automatically
                if (response.meeting_url) {
                    newMessages.push({
                        role: 'assistant',
                        content: `🚨 [긴급 상담 연결]\n\n전문 상담사가 대기 중입니다.\n\n[상담실 입장하기](${response.meeting_url})`
                    });
                }
                return newMessages;
            });

            if (messages.length >= 4 && onSessionReady) {
                onSessionReady(response.session_id, [
                    ...messages,
                    { role: 'user', content: userMessage },
                    { role: 'assistant', content: response.response },
                ]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: '죄송합니다. 연결에 문제가 있습니다. 잠시 후 다시 시도해 주세요.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Messages area */}
            <div style={{ flex: 1, overflowY: 'auto', paddingTop: '4cm', paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '0.5rem' }}>
                {!isInitialized && isLoading && messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }} className="animate-fadeIn">
                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }} className="animate-float">🌿</div>
                        <p style={{ color: '#6b7280' }}>연결 중...</p>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                            className="animate-fadeIn"
                        >
                            <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                                {msg.content.split('\n').map((line, i) => {
                                    const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
                                    if (linkMatch) {
                                        return (
                                            <div key={i} style={{ marginTop: '0.5rem' }}>
                                                <a
                                                    href={linkMatch[2]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: 'inline-block',
                                                        background: '#ef4444',
                                                        color: 'white',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '0.5rem',
                                                        textDecoration: 'none',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {linkMatch[1]}
                                                </a>
                                            </div>
                                        );
                                    }
                                    return <div key={i}>{line}</div>;
                                })}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }} className="animate-fadeIn">
                            <div className="chat-bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: '#6b7280' }} className="animate-pulse-slow">생각하는 중</span>
                                <span style={{ display: 'flex', gap: '0.25rem' }}>
                                    <span style={{ width: '0.5rem', height: '0.5rem', background: '#6B9BD2', borderRadius: '9999px', animation: 'bounce 1s infinite', animationDelay: '0ms' }}></span>
                                    <span style={{ width: '0.5rem', height: '0.5rem', background: '#6B9BD2', borderRadius: '9999px', animation: 'bounce 1s infinite', animationDelay: '150ms' }}></span>
                                    <span style={{ width: '0.5rem', height: '0.5rem', background: '#6B9BD2', borderRadius: '9999px', animation: 'bounce 1s infinite', animationDelay: '300ms' }}></span>
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb', flexShrink: 0, background: '#fff' }}>
                <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '48rem', margin: '0 auto' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="마음속 이야기를 들려주세요..."
                        className="input"
                        style={{ flex: 1 }}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="btn-primary"
                        style={{ padding: '0.75rem 1.5rem', opacity: isLoading || !input.trim() ? 0.5 : 1, cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer' }}
                    >
                        전송
                    </button>
                </div>
                {sessionId && messages.length >= 6 && (
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem', textAlign: 'center' }}>
                        대화가 충분히 진행되었습니다. 상담사 연결을 원하시면 &quot;상담 요청&quot; 버튼을 눌러주세요.
                    </p>
                )}
            </div>
        </div>
    );
}
