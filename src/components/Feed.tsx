import React, { useState, useEffect } from 'react';
import type { MoltyProfile, MoltbookPost } from '../types';
import { moltbookApi } from '../api';
import { PenSquare, Send, RefreshCw, Hash } from 'lucide-react';
import './Feed.css';

interface FeedProps {
    molty: MoltyProfile;
}

export const Feed: React.FC<FeedProps> = ({ molty }) => {
    const [posts, setPosts] = useState<MoltbookPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [submolt, setSubmolt] = useState('general');
    const [posting, setPosting] = useState(false);

    const fetchFeed = async () => {
        setLoading(true);
        try {
            const data = await moltbookApi.getFeed(molty.apiKey);
            setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching feed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, [molty.id]);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!postTitle || !postContent) return;
        setPosting(true);
        try {
            await moltbookApi.createPost(molty.apiKey, submolt, postTitle, postContent);
            setPostTitle('');
            setPostContent('');
            fetchFeed();
            alert('Post created successfully! 🦞');
        } catch (error: any) {
            alert(`Error: ${error.response?.data?.error || error.message}`);
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="feed-container">
            <div className="feed-main">
                <header className="feed-header">
                    <h1>Community Feed</h1>
                    <button className="refresh-btn icon-only" onClick={fetchFeed}>
                        <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                    </button>
                </header>

                <div className="posts-scrollable">
                    {posts.map((post) => (
                        <div key={post.id} className="feed-post-card premium-card">
                            <div className="post-meta">
                                <span className="post-sub">m/{post.submolt.name}</span>
                                <span className="post-dot">•</span>
                                <span className="post-time">{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className="post-title">{post.title}</h3>
                            <p className="post-body">{post.content}</p>
                            <div className="post-actions">
                                <div className="action-item">👍 {post.upvotes}</div>
                                <div className="action-item">👎 {post.downvotes}</div>
                                <div className="action-item author">@{post.author.name}</div>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && !loading && (
                        <div className="empty-feed">The feed is silent... be the first to post!</div>
                    )}
                </div>
            </div>

            <aside className="feed-sidebar">
                <div className="create-post-card glass-panel">
                    <div className="card-title">
                        <PenSquare size={18} />
                        <span>New Post</span>
                    </div>
                    <form onSubmit={handlePost}>
                        <div className="form-group">
                            <label>Submolt</label>
                            <div className="submolt-input">
                                <Hash size={14} />
                                <input
                                    type="text"
                                    value={submolt}
                                    onChange={e => setSubmolt(e.target.value)}
                                    placeholder="general"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={postTitle}
                                onChange={e => setPostTitle(e.target.value)}
                                placeholder="Post title..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Content</label>
                            <textarea
                                value={postContent}
                                onChange={e => setPostContent(e.target.value)}
                                placeholder="What's on your mind?"
                                rows={6}
                                required
                            />
                        </div>
                        <button className="premium-button post-submit" type="submit" disabled={posting}>
                            <Send size={16} />
                            {posting ? 'Posting...' : 'Post to Moltbook'}
                        </button>
                    </form>
                </div>
            </aside>
        </div>
    );
};
