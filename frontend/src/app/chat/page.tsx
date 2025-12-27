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

            // If risk detected, meeting URL might be returned automatically
            if (result.meeting_url) {
                setMeetingUrl(result.meeting_url);
            }

            setStep('summary');
        } catch (error) {
            console.error('Summary error:', error);
            // Fallback for demo if API fails
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

        // If we already have a meeting URL from the summary (automatic creation), just open it
        if (meetingUrl) {
            window.open(meetingUrl, '_blank');
            setStep('counseling');
            return;
        }

        setIsProcessing(true);
        try {
            const result = await requestCounseling(userId, summary.summary_id);
            setMeetingUrl(result.meeting_url);
            window.open(result.meeting_url, '_blank'); // Open immediately
            setStep('counseling');
        } catch (error) {
            console.error('Counseling error:', error);
            const demoUrl = 'https://webex.com/meet/demo';
            setMeetingUrl(demoUrl);
            window.open(demoUrl, '_blank');
            setStep('counseling');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isStarted) {
        return (
            <div style={{ height: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'linear-gradient(180deg, #e8f4fc 0%, #d4e8f5 100%)' }}>
                <div style={{ maxWidth: '28rem', width: '100%', textAlign: 'center', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '1rem', padding: '2rem', border: '1px solid rgba(107, 155, 210, 0.2)', boxShadow: '0 4px 20px rgba(107, 155, 210, 0.15)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌉</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(90deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        Welcome to Bridge-X
                    </h1>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                        Enter your nickname to start.
                        <br />
                        It doesn't have to be your real name.
                    </p>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Enter your nickname"
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(107, 155, 210, 0.3)', background: 'white', color: '#374151', marginBottom: '1rem', fontSize: '1rem' }}
                        onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                    />
                    <button
                        onClick={handleStart}
                        disabled={!nickname.trim()}
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: !nickname.trim() ? 'rgba(59, 130, 246, 0.3)' : 'linear-gradient(135deg, #3b82f6, #10b981)', color: 'white', fontWeight: '600', border: 'none', cursor: !nickname.trim() ? 'not-allowed' : 'pointer', fontSize: '1rem' }}
                    >
                        Start Counseling
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '56rem', width: '100%', height: '100%' }}>
                {step === 'chat' && (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <ChatInterface onSessionReady={handleSessionReady} />
                        </div>
                        {sessionId && (
                            <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb', textAlign: 'center', flexShrink: 0 }}>
                                <button
                                    onClick={handleCreateSummary}
                                    disabled={isProcessing}
                                    className="btn-primary"
                                >
                                    {isProcessing ? '분석 중...' : '📊 감정 분석하기'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {step === 'summary' && summary && (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', overflow: 'auto' }}>
                        <div className="card animate-fadeIn" style={{ maxWidth: '42rem', width: '100%' }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                                <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    감정 분석 결과
                                </h2>
                                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                                    AI가 대화를 바탕으로 분석한 결과입니다
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'rgba(107, 155, 210, 0.1)', borderRadius: '0.75rem', padding: '1rem' }}>
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>주요 감정</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#5A8BC2' }}>
                                        {summary.dominant_emotion}
                                    </p>
                                </div>
                                <div style={{ background: 'rgba(168, 213, 186, 0.1)', borderRadius: '0.75rem', padding: '1rem' }}>
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>감정 강도</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ flex: 1, height: '0.5rem', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                                            <div
                                                style={{ height: '100%', background: 'linear-gradient(90deg, #6B9BD2, #A8D5BA)', width: `${Math.min(summary.intensity_score > 1 ? summary.intensity_score * 10 : summary.intensity_score * 100, 100)}%` }}
                                            />
                                        </div>
                                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                                            {Math.min(Math.round(summary.intensity_score > 1 ? summary.intensity_score * 10 : summary.intensity_score * 100), 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>감정 태그</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {summary.emotion_tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            style={{ padding: '0.25rem 0.75rem', background: 'rgba(107, 155, 210, 0.2)', color: '#5A8BC2', borderRadius: '9999px', fontSize: '0.875rem' }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>반복 주제</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {summary.repeated_topics.map((topic, idx) => (
                                        <span
                                            key={idx}
                                            style={{ padding: '0.25rem 0.75rem', background: 'rgba(168, 213, 186, 0.2)', color: '#6B9B7A', borderRadius: '9999px', fontSize: '0.875rem' }}
                                        >
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <span className={summary.risk_flag ? 'badge-risk' : 'badge-safe'}>
                                    {summary.risk_flag ? '⚠️ 주의 필요' : '✅ 안정적'}
                                </span>
                                {summary.risk_flag && (
                                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 500 }}>
                                        전문가와의 상담이 권장됩니다. 자동으로 상담이 예약되었습니다.
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => setStep('chat')}
                                    className="btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    대화 계속하기
                                </button>
                                {meetingUrl ? (
                                    <a
                                        href={meetingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`btn-primary ${summary.risk_flag ? 'animate-pulse-slow' : ''}`}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                                        onClick={() => setStep('counseling')}
                                    >
                                        {summary.risk_flag ? '🚨 상담실 바로 입장하기' : '👩‍⚕️ 상담실 입장하기'}
                                    </a>
                                ) : (
                                    <button
                                        onClick={handleRequestCounseling}
                                        disabled={isProcessing}
                                        className={`btn-primary ${summary.risk_flag ? 'animate-pulse-slow' : ''}`}
                                        style={{ flex: 1 }}
                                    >
                                        {isProcessing ? '연결 중...' : '👩‍⚕️ 상담사 연결하기'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {step === 'counseling' && meetingUrl && (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                        <div className="card animate-fadeIn" style={{ maxWidth: '28rem', width: '100%', textAlign: 'center' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }} className="animate-float">🎉</div>
                            <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                                상담이 준비되었습니다!
                            </h2>
                            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                                전문 상담사와의 화상 상담이 예약되었습니다.
                                <br />
                                아래 버튼을 클릭하여 상담실에 입장해주세요.
                            </p>
                            <a
                                href={meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                style={{ display: 'block', width: '100%', padding: '1rem', fontSize: '1.125rem' }}
                            >
                                🎥 상담실 입장하기
                            </a>
                            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '1rem' }}>
                                새 창에서 Cisco Webex가 열립니다
                            </p>
                            <button
                                onClick={() => setStep('chat')}
                                style={{ marginTop: '1rem', color: '#6b7280', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                초기 화면으로 돌아가기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
