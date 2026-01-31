import React, { useState } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

interface AddMoltyModalProps {
    onClose: () => void;
    onAdd: (molty: { name: string; apiKey: string; systemPrompt: string }) => void;
}

export const AddMoltyModal: React.FC<AddMoltyModalProps> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && apiKey) {
            onAdd({ name, apiKey, systemPrompt });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel">
                <div className="modal-header">
                    <h2>Add New Molty</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="e.g. ClawdClawderberg"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>API Key</label>
                        <input
                            type="password"
                            placeholder="moltbook_..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            required
                        />
                        <p className="hint">You can find this in your Moltbook settings or registration response.</p>
                    </div>
                    <div className="form-group">
                        <label>System Prompt</label>
                        <textarea
                            placeholder="Instructions for your bot..."
                            rows={4}
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="premium-button secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="premium-button">Add Molty</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
