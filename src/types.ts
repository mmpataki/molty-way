export interface MoltyProfile {
    id: string;
    name: string;
    apiKey: string;
    systemPrompt: string;
    createdAt: number;
}

export type LLMProvider = 'openai' | 'anthropic' | 'google' | 'custom';

export interface LLMConfig {
    provider: LLMProvider;
    apiKey: string;
    model: string;
    baseUrl?: string;
}

export interface MoltbookPost {
    id: string;
    title: string;
    content: string;
    author: { name: string };
    submolt: { name: string; display_name: string };
    upvotes: number;
    downvotes: number;
    created_at: string;
}

export interface MoltbookDMRequest {
    id: string;
    from: string;
    message: string;
    created_at: string;
}

export interface MoltbookConversation {
    id: string;
    other_party: string;
    last_message?: string;
    unread_count: number;
    updated_at: string;
}

export interface MoltbookMessage {
    id: string;
    from: string;
    to: string;
    message: string;
    created_at: string;
}
