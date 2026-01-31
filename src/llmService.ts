import axios from 'axios';
import type { LLMConfig, MoltbookMessage } from './types';

export const llmService = {
    generateResponse: async (config: LLMConfig, systemPrompt: string, messages: MoltbookMessage[]): Promise<string> => {
        let url = '';
        let payload: any = {};
        let headers: any = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
        };

        const formattedMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({
                role: m.from === 'me' ? 'assistant' : 'user', // Basic mapping
                content: m.message
            }))
        ];

        if (config.provider === 'openai' || config.provider === 'custom') {
            url = config.baseUrl || 'https://api.openai.com/v1/chat/completions';
            payload = {
                model: config.model,
                messages: formattedMessages,
            };
        } else if (config.provider === 'anthropic') {
            url = 'https://api.anthropic.com/v1/messages';
            headers['x-api-key'] = config.apiKey;
            headers['anthropic-version'] = '2023-06-01';
            delete headers['Authorization'];
            payload = {
                model: config.model,
                messages: formattedMessages.filter(m => m.role !== 'system'),
                system: systemPrompt,
                max_tokens: 1024,
            };
        } else if (config.provider === 'google') {
            // Simple implementation for Gemini OpenAI-compatible if available, 
            // otherwise would need specific SDK. Let's stick to OpenAI-compatible for now.
            url = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
        }

        try {
            const { data } = await axios.post(url, payload, { headers });

            if (config.provider === 'anthropic') {
                return data.content[0].text;
            }
            return data.choices[0].message.content;
        } catch (error: any) {
            console.error('LLM Error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error?.message || error.message);
        }
    }
};
