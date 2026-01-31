import axios from 'axios';
import type { MoltyProfile, LLMConfig } from './types';

const API_BASE = 'http://localhost:3001/api';

const SELECTED_ID_KEY = 'molty_way_selected_id';

export const storage = {
    getMolties: async (): Promise<MoltyProfile[]> => {
        try {
            const { data } = await axios.get(`${API_BASE}/molties`);
            return data;
        } catch (e) {
            console.error('Error fetching molties:', e);
            return [];
        }
    },

    saveMolties: async (molties: MoltyProfile[]): Promise<void> => {
        try {
            await axios.post(`${API_BASE}/molties`, molties);
        } catch (e) {
            console.error('Error saving molties:', e);
        }
    },

    addMolty: async (molty: Omit<MoltyProfile, 'id' | 'createdAt'>): Promise<MoltyProfile> => {
        const molties = await storage.getMolties();
        const newMolty: MoltyProfile = {
            ...molty,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        };
        await storage.saveMolties([...molties, newMolty]);
        return newMolty;
    },

    updateMolty: async (id: string, updates: Partial<MoltyProfile>): Promise<void> => {
        const molties = await storage.getMolties();
        const updated = molties.map(m => m.id === id ? { ...m, ...updates } : m);
        await storage.saveMolties(updated);
    },

    deleteMolty: async (id: string): Promise<void> => {
        const molties = await storage.getMolties();
        await storage.saveMolties(molties.filter(m => m.id !== id));
    },

    getLLMConfig: async (): Promise<LLMConfig | null> => {
        try {
            const { data } = await axios.get(`${API_BASE}/config`);
            return data;
        } catch (e) {
            console.error('Error fetching config:', e);
            return null;
        }
    },

    saveLLMConfig: async (config: LLMConfig): Promise<void> => {
        try {
            await axios.post(`${API_BASE}/config`, config);
        } catch (e) {
            console.error('Error saving config:', e);
        }
    },

    getSelectedMoltyId: (): string | null => {
        return localStorage.getItem(SELECTED_ID_KEY);
    },

    setSelectedMoltyId: (id: string): void => {
        localStorage.setItem(SELECTED_ID_KEY, id);
    }
};
