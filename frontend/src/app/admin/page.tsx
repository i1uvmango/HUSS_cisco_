'use client';

import { useState, useEffect } from 'react';
import { getAdminSessions, AdminSession } from '@/lib/api';

export default function AdminPage() {
    const [sessions, setSessions] = useState<AdminSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setIsLoading(true);
        try {
            const data = await getAdminSessions();
            setSessions(data.sessions);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            // Demo data
            setSessions([
                {
                    session_id: 'demo-1',
                    user: { nickname: '희망이', region: '분쟁지역A' },
                    summary: {
                        dominant_emotion: '불안',
                        emotion_tags: ['불안', '외로움', '희망'],
                        risk_flag: false,
                        intensity_score: 0.65,
                    },
                    status: 'scheduled',
                    meeting_url: 'https://webex.com/meet/demo1',
                    created_at: new Date().toISOString(),
                },
                {
                    session_id: 'demo-2',
                    user: { nickname: '용기', region: '분쟁지역B' },
                    summary: {
                        dominant_emotion: '슬픔',
                        emotion_tags: ['슬픔', '그리움', '분노'],
                        risk_flag: true,
                        intensity_score: 0.85,
                    },
                    status: 'in_progress',
                    meeting_url: 'https://webex.com/meet/demo2',
                    created_at: new Date().toISOString(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            scheduled: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            completed: 'bg-green-500/20 text-green-400 border-green-500/30',
            cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        };
        const labels: Record<string, string> = {
            scheduled: '예약됨',
            in_progress: '진행 중',
            completed: '완료',
            cancelled: '취소됨',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs border ${styles[status] || styles.scheduled}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold gradient-text mb-2">
                        관리자 대시보드
                    </h1>
                    <p className="text-gray-400">
                        상담 세션을 관리하고 청소년들의 감정 상태를 모니터링합니다
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: '전체 세션', value: sessions.length, icon: '📊' },
                        { label: '예약됨', value: sessions.filter(s => s.status === 'scheduled').length, icon: '📅' },
                        { label: '진행 중', value: sessions.filter(s => s.status === 'in_progress').length, icon: '🎥' },
                        { label: '주의 필요', value: sessions.filter(s => s.summary?.risk_flag).length, icon: '⚠️' },
                    ].map((stat, idx) => (
                        <div key={idx} className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">{stat.label}</p>
                                    <p className="text-3xl font-bold">{stat.value}</p>
                                </div>
                                <div className="text-3xl">{stat.icon}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sessions Table */}
                <div className="card overflow-hidden">
                    <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                        <h2 className="text-xl font-bold">상담 세션 목록</h2>
                        <button onClick={fetchSessions} className="btn-secondary text-sm">
                            🔄 새로고침
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="text-4xl animate-pulse-slow mb-4">⏳</div>
                            <p className="text-gray-400">데이터를 불러오는 중...</p>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-4xl mb-4">📭</div>
                            <p className="text-gray-400">아직 상담 세션이 없습니다</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-zinc-900/50">
                                    <tr>
                                        <th className="text-left p-4 text-gray-400 font-medium">사용자</th>
                                        <th className="text-left p-4 text-gray-400 font-medium">주요 감정</th>
                                        <th className="text-left p-4 text-gray-400 font-medium">감정 태그</th>
                                        <th className="text-left p-4 text-gray-400 font-medium">강도</th>
                                        <th className="text-left p-4 text-gray-400 font-medium">위험</th>
                                        <th className="text-left p-4 text-gray-400 font-medium">상태</th>
                                        <th className="text-left p-4 text-gray-400 font-medium">액션</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map((session) => (
                                        <tr key={session.session_id} className="border-t border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium">{session.user?.nickname || '익명'}</p>
                                                    <p className="text-sm text-gray-500">{session.user?.region || '-'}</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-indigo-400 font-medium">
                                                    {session.summary?.dominant_emotion || '-'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {session.summary?.emotion_tags?.slice(0, 3).map((tag, idx) => (
                                                        <span key={idx} className="px-2 py-0.5 bg-zinc-700 rounded text-xs">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-zinc-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-indigo-500 to-pink-500"
                                                            style={{ width: `${(session.summary?.intensity_score || 0) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-400">
                                                        {Math.round((session.summary?.intensity_score || 0) * 100)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={session.summary?.risk_flag ? 'badge-risk' : 'badge-safe'}>
                                                    {session.summary?.risk_flag ? '주의' : '안정'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {getStatusBadge(session.status)}
                                            </td>
                                            <td className="p-4">
                                                {session.meeting_url && (
                                                    <a
                                                        href={session.meeting_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-400 hover:text-indigo-300 text-sm"
                                                    >
                                                        🎥 참여
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
