'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, ChatMessage } from '@/lib/api';

interface ChatInterfaceProps {
    onSessionReady?: (sessionId: string, messages: ChatMessage[]) => void;
}

export default function ChatInterface({ onSessionReady }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await sendChatMessage(userMessage, sessionId || undefined);
            setSessionId(response.session_id);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: response.response },
            ]);

            // Notify parent when we have enough conversation
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
        <div className="flex flex-col h-full">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center py-12 animate-fadeIn">
                        <div className="text-6xl mb-4 animate-float">💜</div>
                        <h2 className="text-2xl font-bold gradient-text mb-2">
                            안녕하세요, 마음쉼터입니다
                        </h2>
                        <p className="text-gray-400 max-w-md mx-auto">
                            편안하게 이야기해 주세요. 당신의 감정을 들을 준비가 되어 있어요.
                            모든 대화는 안전하게 보호됩니다.
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                    >
                        <div
                            className={
                                msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                            }
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start animate-fadeIn">
                        <div className="chat-bubble-ai flex items-center gap-2">
                            <span className="animate-pulse-slow">생각하는 중</span>
                            <span className="flex gap-1">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-zinc-800">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="마음속 이야기를 들려주세요..."
                        className="input flex-1"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-6"
                    >
                        전송
                    </button>
                </div>
                {sessionId && messages.length >= 6 && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                        대화가 충분히 진행되었습니다. 상담사 연결을 원하시면 &quot;상담 요청&quot; 버튼을 눌러주세요.
                    </p>
                )}
            </div>
        </div>
    );
}
