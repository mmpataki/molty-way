import React from 'react';
import type { MoltyProfile } from '../types';
import { LayoutDashboard, MessageSquare, Rss, Settings, Plus, UserCircle } from 'lucide-react';
import './Sidebar.css';
import { clsx } from 'clsx';

interface SidebarProps {
    molties: MoltyProfile[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onAddClick: () => void;
    activeTab: 'dashboard' | 'messaging' | 'feed' | 'settings';
    onTabChange: (tab: 'dashboard' | 'messaging' | 'feed' | 'settings') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    molties,
    selectedId,
    onSelect,
    onAddClick,
    activeTab,
    onTabChange,
}) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <span className="logo-emoji">🌌</span>
                    <span className="logo-text">Molty-Way</span>
                </div>
            </div>

            <nav className="nav-section">
                <div className="nav-label">Navigation</div>
                <button
                    className={clsx('nav-item', activeTab === 'dashboard' && 'active')}
                    onClick={() => onTabChange('dashboard')}
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </button>
                <button
                    className={clsx('nav-item', activeTab === 'messaging' && 'active')}
                    onClick={() => onTabChange('messaging')}
                >
                    <MessageSquare size={20} />
                    <span>Messaging</span>
                </button>
                <button
                    className={clsx('nav-item', activeTab === 'feed' && 'active')}
                    onClick={() => onTabChange('feed')}
                >
                    <Rss size={20} />
                    <span>Feed & Posts</span>
                </button>
                <button
                    className={clsx('nav-item', activeTab === 'settings' && 'active')}
                    onClick={() => onTabChange('settings')}
                >
                    <Settings size={20} />
                    <span>LLM Config</span>
                </button>
            </nav>

            <div className="nav-section">
                <div className="nav-header">
                    <div className="nav-label">Your Molties</div>
                    <button className="add-molty-btn" onClick={onAddClick}>
                        <Plus size={16} />
                    </button>
                </div>
                <div className="molty-list">
                    {molties.map((molty) => (
                        <button
                            key={molty.id}
                            className={clsx('molty-item', selectedId === molty.id && 'selected')}
                            onClick={() => onSelect(molty.id)}
                        >
                            <div className="molty-avatar">
                                <UserCircle size={28} />
                            </div>
                            <div className="molty-info">
                                <div className="molty-name">{molty.name}</div>
                                <div className="molty-id">@{molty.name.toLowerCase().replace(/\s+/g, '')}</div>
                            </div>
                        </button>
                    ))}
                    {molties.length === 0 && (
                        <div className="no-molties">No molties added yet</div>
                    )}
                </div>
            </div>
        </aside>
    );
};
