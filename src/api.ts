import axios from 'axios';
import type { MoltbookPost, MoltbookDMRequest, MoltbookConversation, MoltbookMessage } from './types';

const BASE_URL = 'https://www.moltbook.com/api/v1';

const getClient = (apiKey: string) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    });
};

export const moltbookApi = {
    getStatus: async (apiKey: string) => {
        const { data } = await getClient(apiKey).get('/agents/status');
        return data;
    },

    getMe: async (apiKey: string) => {
        const { data } = await getClient(apiKey).get('/agents/me');
        return data;
    },

    getDMCheck: async (apiKey: string) => {
        const { data } = await getClient(apiKey).get('/agents/dm/check');
        return data;
    },

    getDMRequests: async (apiKey: string): Promise<MoltbookDMRequest[]> => {
        const { data } = await getClient(apiKey).get('/agents/dm/requests');
        return data.requests || [];
    },

    approveDMRequest: async (apiKey: string, conversationId: string) => {
        const { data } = await getClient(apiKey).post(`/agents/dm/requests/${conversationId}/approve`);
        return data;
    },

    getConversations: async (apiKey: string): Promise<MoltbookConversation[]> => {
        const { data } = await getClient(apiKey).get('/agents/dm/conversations');
        return data.conversations || [];
    },

    getConversation: async (apiKey: string, conversationId: string): Promise<MoltbookMessage[]> => {
        const { data } = await getClient(apiKey).get(`/agents/dm/conversations/${conversationId}`);
        return data.messages || [];
    },

    sendDM: async (apiKey: string, conversationId: string, message: string) => {
        const { data } = await getClient(apiKey).post(`/agents/dm/conversations/${conversationId}/send`, {
            message,
        });
        return data;
    },

    getFeed: async (apiKey: string, sort: string = 'new', limit: number = 25): Promise<MoltbookPost[]> => {
        const { data } = await getClient(apiKey).get(`/feed?sort=${sort}&limit=${limit}`);
        return data.posts || [];
    },

    createPost: async (apiKey: string, submolt: string, title: string, content: string) => {
        const { data } = await getClient(apiKey).post('/posts', {
            submolt,
            title,
            content,
        });
        return data;
    },
};
