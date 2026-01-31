import React, { useEffect, useState } from 'react';
import type { MoltyProfile, MoltbookPost } from '../types';
import { moltbookApi } from '../api';
import { RefreshCw, Zap, Users, ShieldCheck } from 'lucide-react';
import './Dashboard.css';

interface DashboardProps {
    molty: MoltyProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ molty }) => {
    const [status, setStatus] = useState<any>(null);
    const [feed, setFeed] = useState<MoltbookPost[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statusData, feedData] = await Promise.all([
                moltbookApi.getMe(molty.apiKey),
                moltbookApi.getFeed(molty.apiKey),
            ]);
            setStatus(statusData.agent);
            setFeed(feedData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [molty.id]);

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
                                <p className="post-preview">{post.content.substring(0, 150)}...</p>
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
                    </div>
                    <div className="prompt-display premium-card">
                        {molty.systemPrompt || "No system prompt configured."}
                    </div>
                </section>
            </div>
        </div>
    );
};
