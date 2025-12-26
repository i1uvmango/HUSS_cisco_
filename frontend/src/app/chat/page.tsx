'use client';

import { useState } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import { createSummary, requestCounseling, createUser, ChatMessage, SummaryResponse } from '@/lib/api';

export default function ChatPage() {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [summary, setSummary] = useState<SummaryResponse | null>(null);
    const [meetingUrl, setMeetingUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<'chat' | 'summary' | 'counseling'>('chat');
    const [nickname, setNickname] = useState('');
    const [isStarted, setIsStarted] = useState(false);

    const handleStart = async () => {
        if (!nickname.trim()) return;

        try {
            const user = await createUser(nickname);
            setUserId(user.user_id);
            setIsStarted(true);
        } catch (error) {
            console.error('User creation error:', error);
            // For demo, proceed without backend
            setUserId('demo-user-id');
            setIsStarted(true);
        }
    };

    const handleSessionReady = (sid: string, messages: ChatMessage[]) => {
        setSessionId(sid);
    };

    const handleCreateSummary = async () => {
        if (!userId || !sessionId) return;

        setIsProcessing(true);
        try {
            const result = await createSummary(userId, sessionId);
            setSummary(result);
            setStep('summary');
        } catch (error) {
            console.error('Summary error:', error);
            // Demo fallback
            setSummary({
                summary_id: 'demo-summary-id',
                emotion_tags: ['불안', '슬픔', '희망'],
                dominant_emotion: '불안',
                repeated_topics: ['학교', '가족', '미래'],
                risk_flag: false,
                intensity_score: 0.65,
            });
            setStep('summary');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRequestCounseling = async () => {
        if (!userId || !summary) return;

        setIsProcessing(true);
        try {
            const result = await requestCounseling(userId, summary.summary_id);
            setMeetingUrl(result.meeting_url);
            setStep('counseling');
        } catch (error) {
            console.error('Counseling error:', error);
            // Demo fallback
            setMeetingUrl('https://webex.com/meet/demo');
            setStep('counseling');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isStarted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="card max-w-md w-full text-center">
                    <div className="text-5xl mb-6 animate-float">💜</div>
                    <h1 className="text-2xl font-bold gradient-text mb-4">
                        마음쉼터에 오신 것을 환영해요
                    </h1>
                    <p className="text-gray-400 mb-6">
                        상담을 시작하기 전에 닉네임을 알려주세요.
                        <br />
                        실명이 아니어도 괜찮아요.
                    </p>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임을 입력해주세요"
                        className="input mb-4"
                        onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                    />
                    <button
                        onClick={handleStart}
                        disabled={!nickname.trim()}
                        className="btn-primary w-full disabled:opacity-50"
                    >
                        시작하기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Chat Panel */}
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
                {step === 'chat' && (
                    <>
                        <div className="flex-1 h-[calc(100vh-200px)]">
                            <ChatInterface onSessionReady={handleSessionReady} />
                        </div>
                        {sessionId && (
                            <div className="p-4 border-t border-zinc-800 text-center">
                                <button
                                    onClick={handleCreateSummary}
                                    disabled={isProcessing}
                                    className="btn-primary"
                                >
                                    {isProcessing ? '분석 중...' : '📊 감정 분석하기'}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {step === 'summary' && summary && (
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="card max-w-2xl w-full animate-fadeIn">
                            <div className="text-center mb-8">
                                <div className="text-5xl mb-4">📊</div>
                                <h2 className="text-2xl font-bold gradient-text">
                                    감정 분석 결과
                                </h2>
                                <p className="text-gray-400 mt-2">
                                    AI가 대화를 바탕으로 분석한 결과입니다
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-zinc-800/50 rounded-xl p-4">
                                    <p className="text-gray-400 text-sm mb-1">주요 감정</p>
                                    <p className="text-2xl font-bold text-indigo-400">
                                        {summary.dominant_emotion}
                                    </p>
                                </div>
                                <div className="bg-zinc-800/50 rounded-xl p-4">
                                    <p className="text-gray-400 text-sm mb-1">감정 강도</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500"
                                                style={{ width: `${summary.intensity_score * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-300">
                                            {Math.round(summary.intensity_score * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-400 text-sm mb-2">감정 태그</p>
                                <div className="flex flex-wrap gap-2">
                                    {summary.emotion_tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-400 text-sm mb-2">반복 주제</p>
                                <div className="flex flex-wrap gap-2">
                                    {summary.repeated_topics.map((topic, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm"
                                        >
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <span className={summary.risk_flag ? 'badge-risk' : 'badge-safe'}>
                                    {summary.risk_flag ? '⚠️ 주의 필요' : '✅ 안정적'}
                                </span>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep('chat')}
                                    className="btn-secondary flex-1"
                                >
                                    대화 계속하기
                                </button>
                                <button
                                    onClick={handleRequestCounseling}
                                    disabled={isProcessing}
                                    className="btn-primary flex-1"
                                >
                                    {isProcessing ? '연결 중...' : '👩‍⚕️ 상담사 연결하기'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'counseling' && meetingUrl && (
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="card max-w-md w-full text-center animate-fadeIn">
                            <div className="text-6xl mb-6 animate-float">🎉</div>
                            <h2 className="text-2xl font-bold gradient-text mb-4">
                                상담이 준비되었습니다!
                            </h2>
                            <p className="text-gray-400 mb-6">
                                전문 상담사와의 화상 상담이 예약되었습니다.
                                <br />
                                아래 버튼을 클릭하여 상담실에 입장해주세요.
                            </p>
                            <a
                                href={meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary inline-block w-full py-4 text-lg"
                            >
                                🎥 상담실 입장하기
                            </a>
                            <p className="text-sm text-gray-500 mt-4">
                                Cisco Webex를 통해 안전하게 연결됩니다
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
