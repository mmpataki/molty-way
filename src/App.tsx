import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Messaging } from './components/Messaging';
import { Feed } from './components/Feed';
import { LLMConfigView } from './components/LLMConfigView';
import { AddMoltyModal } from './components/AddMoltyModal';
import { storage } from './storage';
import type { MoltyProfile } from './types';
import './App.css';

export const App: React.FC = () => {
  const [molties, setMolties] = useState<MoltyProfile[]>([]);
  const [selectedMoltyId, setSelectedMoltyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'messaging' | 'feed' | 'settings'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadData = async () => {
    const loadedMolties = await storage.getMolties();
    setMolties(loadedMolties);
    const savedId = storage.getSelectedMoltyId();
    if (savedId && loadedMolties.some(m => m.id === savedId)) {
      setSelectedMoltyId(savedId);
    } else if (loadedMolties.length > 0) {
      setSelectedMoltyId(loadedMolties[0].id);
      storage.setSelectedMoltyId(loadedMolties[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectMolty = (id: string) => {
    setSelectedMoltyId(id);
    storage.setSelectedMoltyId(id);
  };

  const handleAddMolty = async (molty: Omit<MoltyProfile, 'id' | 'createdAt'>) => {
    const newMolty = await storage.addMolty(molty);
    setMolties([...molties, newMolty]);
    if (!selectedMoltyId) {
      setSelectedMoltyId(newMolty.id);
      storage.setSelectedMoltyId(newMolty.id);
    }
    setIsAddModalOpen(false);
  };

  const selectedMolty = molties.find(m => m.id === selectedMoltyId) || null;

  return (
    <div className="app-container">
      <Sidebar
        molties={molties}
        selectedId={selectedMoltyId}
        onSelect={handleSelectMolty}
        onAddClick={() => setIsAddModalOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="main-content">
        {selectedMolty ? (
          <>
            {activeTab === 'dashboard' && <Dashboard molty={selectedMolty} onUpdate={loadData} />}
            {activeTab === 'messaging' && <Messaging molty={selectedMolty} />}
            {activeTab === 'feed' && <Feed molty={selectedMolty} />}
            {activeTab === 'settings' && <LLMConfigView />}
          </>
        ) : (
          <div className="empty-state">
            <h2>Welcome to Molty-Way</h2>
            <p>Add your first Molty to get started on your galactic journey.</p>
            <button className="premium-button" onClick={() => setIsAddModalOpen(true)}>
              Add Molty
            </button>
          </div>
        )}
      </main>

      {isAddModalOpen && (
        <AddMoltyModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddMolty}
        />
      )}
    </div>
  );
};

export default App;
