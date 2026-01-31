import React, { useState, useEffect } from 'react';
import { storage } from '../storage';
import type { LLMProvider } from '../types';
import { Save, Brain, Info } from 'lucide-react';
import './LLMConfigView.css';

export const LLMConfigView: React.FC = () => {
    const [provider, setProvider] = useState<LLMProvider>('openai');
    const [apiKey, setApiKey] = useState('');
    const [model, setModel] = useState('gpt-4o');
    const [baseUrl, setBaseUrl] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const loadConfig = async () => {
            const config = await storage.getLLMConfig();
            if (config) {
                setProvider(config.provider);
                setApiKey(config.apiKey);
                setModel(config.model);
                setBaseUrl(config.baseUrl || '');
            }
        };
        loadConfig();
    }, []);

    const handleSave = async () => {
        await storage.saveLLMConfig({
            provider,
            apiKey,
            model,
            baseUrl: provider === 'custom' ? baseUrl : undefined,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="settings-container">
            <header className="settings-header">
                <h1>LLM Configuration</h1>
                <p>Configure which AI model will help you draft responses for your Molties.</p>
            </header>

            <div className="settings-grid">
                <div className="settings-card premium-card">
                    <div className="form-group">
                        <label>Provider</label>
                        <select
                            value={provider}
                            onChange={(e) => setProvider(e.target.value as LLMProvider)}
                            className="premium-select"
                        >
                            <option value="openai">OpenAI</option>
                            <option value="anthropic">Anthropic</option>
                            <option value="google">Google (Gemini OpenAI API)</option>
                            <option value="custom">Custom OpenAI-Compatible</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>API Key</label>
                        <input
                            type="password"
                            placeholder="sk-..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Model Name</label>
                        <input
                            type="text"
                            placeholder="e.g. gpt-4o, claude-3-5-sonnet"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                        />
                    </div>

                    {provider === 'custom' && (
                        <div className="form-group">
                            <label>Base URL</label>
                            <input
                                type="text"
                                placeholder="https://your-proxy.com/v1"
                                value={baseUrl}
                                onChange={(e) => setBaseUrl(e.target.value)}
                            />
                        </div>
                    )}

                    <button className="premium-button save-btn" onClick={handleSave}>
                        <Save size={18} />
                        {saved ? 'Saved!' : 'Save Configuration'}
                    </button>
                </div>

                <div className="info-card premium-card">
                    <div className="info-header">
                        <Brain size={24} className="info-icon" />
                        <h3>How it works</h3>
                    </div>
                    <p>When you click "Generate with LLM" in a conversation:</p>
                    <ul className="info-list">
                        <li>We pull the last few messages from the chat.</li>
                        <li>We attach your Molty's <b>System Prompt</b>.</li>
                        <li>The model generates a response in character.</li>
                        <li>You can then review and edit before sending.</li>
                    </ul>
                    <div className="privacy-note">
                        <Info size={16} />
                        <span>API keys are stored locally in your browser.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
