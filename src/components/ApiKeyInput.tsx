import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Save, Check, AlertCircle } from 'lucide-react';
import { setApiKey } from '../services/geminiService';

const ApiKeyInput: React.FC = () => {
  const [apiKey, setApiKeyState] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load saved API key on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('geminiApiKey') || '';
    setApiKeyState(savedKey);
    setSaved(!!savedKey);
  }, []);
  
  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    
    try {
      setApiKey(apiKey.trim());
      setSaved(true);
      setError(null);
      
      // Show saved message for 2 seconds
      setTimeout(() => {
        setSaved(false);
      }, 2000);
      
      // Trigger a page refresh to load models with the new API key
      window.location.reload();
    } catch (err) {
      setError('Failed to save API key');
    }
  };
  
  return (
    <div className="mb-6 backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Key className="h-5 w-5 text-cyan-400" />
        <h3 className="text-lg font-medium">Gemini API Key</h3>
      </div>
      
      <div className="text-white/70 text-sm mb-4">
        <p>Enter your Gemini API key to enable video analysis. Get your API key from the <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google AI Studio</a>.</p>
      </div>
      
      <div className="flex gap-2">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKeyState(e.target.value)}
          placeholder="Enter your Gemini API key"
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveKey}
          className="flex items-center justify-center gap-1 bg-gradient-to-r from-cyan-500 to-blue-600 py-2 px-4 rounded-lg font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved' : 'Save'}
        </motion.button>
      </div>
      
      {error && (
        <div className="mt-2 flex items-center gap-1 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      
      <div className="mt-2 text-white/50 text-xs">
        Your API key is stored locally in your browser and is never sent to our servers.
      </div>
    </div>
  );
};

export default ApiKeyInput;
