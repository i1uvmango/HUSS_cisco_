const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    response: string;
    session_id: string;
}

export interface SummaryResponse {
    summary_id: string;
    emotion_tags: string[];
    dominant_emotion: string;
    repeated_topics: string[];
    risk_flag: boolean;
    intensity_score: number;
}

export interface CounselingResponse {
    session_id: string;
    meeting_url: string;
    status: string;
}

export interface User {
    user_id: string;
    nickname: string;
    region?: string;
}

export interface AdminSession {
    session_id: string;
    user: {
        nickname: string;
        region: string;
    } | null;
    summary: {
        dominant_emotion: string;
        emotion_tags: string[];
        risk_flag: boolean;
        intensity_score: number;
    } | null;
    status: string;
    meeting_url: string;
    created_at: string;
}

// User API
export async function createUser(nickname: string, region?: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, region }),
    });
    return res.json();
}

// Chat API
export async function sendChatMessage(
    message: string,
    sessionId?: string,
    userId?: string
): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            session_id: sessionId,
            user_id: userId,
        }),
    });
    return res.json();
}

// Summary API
export async function createSummary(
    userId: string,
    sessionId: string
): Promise<SummaryResponse> {
    const res = await fetch(`${API_BASE_URL}/api/summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            session_id: sessionId,
        }),
    });
    return res.json();
}

// Counseling API
export async function requestCounseling(
    userId: string,
    summaryId: string
): Promise<CounselingResponse> {
    const res = await fetch(`${API_BASE_URL}/api/counseling/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            summary_id: summaryId,
        }),
    });
    return res.json();
}

// Admin API
export async function getAdminSessions(): Promise<{ sessions: AdminSession[] }> {
    const res = await fetch(`${API_BASE_URL}/api/admin/sessions`);
    return res.json();
}
