import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchAvailableModels, getSelectedModel, setSelectedModel } from '../services/geminiService';

interface Model {
  id: string;
  name: string;
  description: string;
}

const ModelSelector: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModelState] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Load the currently selected model
    const currentModel = getSelectedModel();
    setSelectedModelState(currentModel);
    
    // Fetch available models
    const loadModels = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const availableModels = await fetchAvailableModels();
        setModels(availableModels);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load models');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadModels();
  }, []);
  
  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    setSelectedModelState(modelId);
    setIsOpen(false);
  };
  
  const getModelName = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    return model ? model.name : modelId;
  };
  
  return (
    <div className="mb-6 backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Cpu className="h-5 w-5 text-cyan-400" />
        <h3 className="text-lg font-medium">Gemini Model Selection</h3>
      </div>
      
      <div className="text-white/70 text-sm mb-4">
        <p>Select which Gemini model to use for video analysis. Different models have different capabilities and performance characteristics.</p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center gap-2 text-white/70">
          <div className="animate-spin h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
          Loading available models...
        </div>
      ) : error ? (
        <div className="flex items-center gap-1 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <span>{getModelName(selectedModel)}</span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 mt-1 w-full bg-gray-800/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl overflow-hidden"
            >
              <ul className="py-1">
                {models.map((model) => (
                  <li key={model.id}>
                    <button
                      onClick={() => handleSelectModel(model.id)}
                      className={`w-full text-left px-4 py-2 hover:bg-white/10 flex items-center justify-between ${
                        selectedModel === model.id ? 'bg-white/10 text-cyan-400' : 'text-white'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-white/70">{model.description}</div>
                      </div>
                      {selectedModel === model.id && <Check className="h-4 w-4" />}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
