import React, { useState, useEffect } from 'react';
import type { MoltyProfile, MoltbookDMRequest, MoltbookConversation, MoltbookMessage } from '../types';
import { moltbookApi } from '../api';
import { Send, User, Check, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';
import { llmService } from '../llmService';
import { storage } from '../storage';
import { clsx } from 'clsx';
import './Messaging.css';

interface MessagingProps {
    molty: MoltyProfile;
}

export const Messaging: React.FC<MessagingProps> = ({ molty }) => {
    const [requests, setRequests] = useState<MoltbookDMRequest[]>([]);
    const [conversations, setConversations] = useState<MoltbookConversation[]>([]);
    const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);
    const [messages, setMessages] = useState<MoltbookMessage[]>([]);
    const [replyText, setReplyText] = useState('');
    const [generating, setGenerating] = useState(false);

    const fetchData = async () => {
        try {
            const [reqs, convos] = await Promise.all([
                moltbookApi.getDMRequests(molty.apiKey),
                moltbookApi.getConversations(molty.apiKey),
            ]);
            setRequests(Array.isArray(reqs) ? reqs : []);
            setConversations(Array.isArray(convos) ? convos : []);
        } catch (error) {
            console.error('Error fetching messaging data:', error);
        }
    };

    const fetchMessages = async (convoId: string) => {
        try {
            const msgs = await moltbookApi.getConversation(molty.apiKey, convoId);
            setMessages(Array.isArray(msgs) ? msgs : []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchData();
        setSelectedConvoId(null);
        setMessages([]);
    }, [molty.id]);

    useEffect(() => {
        if (selectedConvoId) {
            fetchMessages(selectedConvoId);
        }
    }, [selectedConvoId]);

    const handleApprove = async (id: string) => {
        try {
            await moltbookApi.approveDMRequest(molty.apiKey, id);
            fetchData();
        } catch (error) {
            alert('Failed to approve request');
        }
    };

    const handleSend = async () => {
        if (!selectedConvoId || !replyText.trim()) return;
        try {
            await moltbookApi.sendDM(molty.apiKey, selectedConvoId, replyText);
            setReplyText('');
            fetchMessages(selectedConvoId);
        } catch (error) {
            alert('Failed to send message');
        }
    };

    const handleGenerateResponse = async () => {
        const config = await storage.getLLMConfig();
        if (!config) {
            alert('Please configure your LLM settings first in the LLM Config tab.');
            return;
        }
        setGenerating(true);
        try {
            const response = await llmService.generateResponse(config, molty.systemPrompt, messages);
            setReplyText(response);
        } catch (error: any) {
            alert(`Error generating response: ${error.message}`);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="messaging-container">
            <div className="inbox-list">
                <section className="requests-section">
                    <h3>Pending Requests ({Array.isArray(requests) ? requests.length : 0})</h3>
                    <div className="requests-list">
                        {Array.isArray(requests) && requests.map(req => (
                            <div key={req.id} className="request-card premium-card">
                                <div className="request-info">
                                    <div className="request-from">@{req.from}</div>
                                    <div className="request-msg">{req.message}</div>
                                </div>
                                <div className="request-actions">
                                    <button className="action-btn approve" onClick={() => handleApprove(req.id)}><Check size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="convos-section">
                    <h3>Conversations</h3>
                    <div className="convos-list scrollable">
                        {Array.isArray(conversations) && conversations.map(convo => (
                            <button
                                key={convo.id}
                                className={clsx('convo-item premium-card', selectedConvoId === convo.id && 'selected')}
                                onClick={() => setSelectedConvoId(convo.id)}
                            >
                                <div className="convo-avatar"><User size={20} /></div>
                                <div className="convo-info">
                                    <div className="convo-party">@{convo.other_party}</div>
                                    <div className="convo-last">{convo.last_message || 'No messages yet'}</div>
                                </div>
                                {convo.unread_count > 0 && <div className="unread-badge">{convo.unread_count}</div>}
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            <div className="chat-area">
                {selectedConvoId ? (
                    <>
                        <div className="chat-header">
                            <div className="chat-title">
                                <User size={20} />
                                <span>@{conversations.find(c => c.id === selectedConvoId)?.other_party}</span>
                            </div>
                            <button className="refresh-btn icon-only" onClick={() => fetchMessages(selectedConvoId)}>
                                <RefreshCw size={16} />
                            </button>
                        </div>
                        <div className="chat-messages scrollable">
                            {Array.isArray(messages) && messages.map(msg => (
                                <div key={msg.id} className={clsx('msg-bubble', msg.from === molty.name ? 'sent' : 'received')}>
                                    <div className="msg-content">{msg.message || ''}</div>
                                </div>
                            ))}
                        </div>
                        <div className="chat-input-area">
                            <div className="input-actions">
                                <button
                                    className="ai-btn"
                                    onClick={handleGenerateResponse}
                                    disabled={generating}
                                >
                                    <Sparkles size={16} />
                                    <span>{generating ? 'Thinking...' : 'Generate with LLM'}</span>
                                </button>
                            </div>
                            <div className="input-row">
                                <textarea
                                    placeholder="Type a message..."
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                />
                                <button className="send-btn" onClick={handleSend} disabled={!replyText.trim()}>
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="chat-empty">
                        <MessageSquare size={48} />
                        <p>Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};
