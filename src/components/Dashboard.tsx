import React, { useEffect, useState } from 'react';
import type { MoltyProfile, MoltbookPost } from '../types';
import { moltbookApi } from '../api';
import { RefreshCw, Zap, Users, ShieldCheck } from 'lucide-react';
import { storage } from '../storage';
import './Dashboard.css';

interface DashboardProps {
    molty: MoltyProfile;
    onUpdate: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ molty, onUpdate }) => {
    const [status, setStatus] = useState<any>(null);
    const [feed, setFeed] = useState<MoltbookPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditingPrompt, setIsEditingPrompt] = useState(false);
    const [editedPrompt, setEditedPrompt] = useState(molty.systemPrompt);
    const [savingPrompt, setSavingPrompt] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statusData, feedData] = await Promise.all([
                moltbookApi.getMe(molty.apiKey),
                moltbookApi.getFeed(molty.apiKey),
            ]);
            setStatus(statusData?.agent || null);
            setFeed(Array.isArray(feedData) ? feedData : []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        setEditedPrompt(molty.systemPrompt);
        setIsEditingPrompt(false);
    }, [molty.id, molty.systemPrompt]);

    const handleSavePrompt = async () => {
        setSavingPrompt(true);
        try {
            await storage.updateMolty(molty.id, { systemPrompt: editedPrompt });
            onUpdate();
            setIsEditingPrompt(false);
        } catch (error) {
            console.error('Error saving prompt:', error);
            alert('Failed to save prompt');
        } finally {
            setSavingPrompt(false);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-info">
                    <h1>{molty.name}</h1>
                    <p className="subtitle">ID: @{molty.name.toLowerCase().replace(/\s+/g, '')}</p>
                </div>
                <button className="refresh-btn" onClick={fetchData} disabled={loading}>
                    <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                    Refresh
                </button>
            </header>

            <div className="stats-grid">
                <div className="stat-card premium-card">
                    <div className="stat-icon karma"><Zap size={20} /></div>
                    <div className="stat-content">
                        <div className="stat-value">{status?.karma || 0}</div>
                        <div className="stat-label">Karma</div>
                    </div>
                </div>
                <div className="stat-card premium-card">
                    <div className="stat-icon followers"><Users size={20} /></div>
                    <div className="stat-content">
                        <div className="stat-value">{status?.follower_count || 0}</div>
                        <div className="stat-label">Followers</div>
                    </div>
                </div>
                <div className="stat-card premium-card">
                    <div className="stat-icon status"><ShieldCheck size={20} /></div>
                    <div className="stat-content">
                        <div className="stat-value">{status?.is_claimed ? 'Claimed' : 'Pending'}</div>
                        <div className="stat-label">Status</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <section className="feed-section">
                    <div className="section-header">
                        <h2>Recent Feed</h2>
                        <button className="text-link">View All</button>
                    </div>
                    <div className="feed-list">
                        {feed.map((post) => (
                            <div key={post.id} className="post-card premium-card">
                                <div className="post-header">
                                    <span className="post-submolt">m/{post.submolt.name}</span>
                                    <span className="post-author">by @{post.author.name}</span>
                                </div>
                                <h3 className="post-title">{post.title}</h3>
                                <p className="post-preview">{post.content ? (post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content) : 'No content available.'}</p>
                                <div className="post-footer">
                                    <span>👍 {post.upvotes}</span>
                                    <span>👎 {post.downvotes}</span>
                                </div>
                            </div>
                        ))}
                        {feed.length === 0 && !loading && (
                            <div className="empty-feed">No posts in feed yet.</div>
                        )}
                        {loading && <div className="loading-placeholder">Loading feed...</div>}
                    </div>
                </section>

                <section className="system-prompt-section">
                    <div className="section-header">
                        <h2>System Prompt</h2>
                        {!isEditingPrompt ? (
                            <button className="text-link" onClick={() => setIsEditingPrompt(true)}>Edit</button>
                        ) : (
                            <div className="edit-actions">
                                <button className="text-link" onClick={() => setIsEditingPrompt(false)}>Cancel</button>
                                <button className="text-link save" onClick={handleSavePrompt} disabled={savingPrompt}>
                                    {savingPrompt ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        )}
                    </div>
                    {isEditingPrompt ? (
                        <textarea
                            className="prompt-textarea premium-card"
                            value={editedPrompt}
                            onChange={(e) => setEditedPrompt(e.target.value)}
                            placeholder="Describe how this bot should behave..."
                            rows={6}
                        />
                    ) : (
                        <div className="prompt-display premium-card">
                            {molty.systemPrompt || "No system prompt configured. Click edit to add one."}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};
