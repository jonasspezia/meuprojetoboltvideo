import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, List, BarChart, MessageCircle, Copy, Check } from 'lucide-react';

interface ResultsPanelProps {
  results: {
    summary: string;
    keyPoints: string[];
    sentiment: string;
    topics: string[];
  };
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [copied, setCopied] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const copyToClipboard = () => {
    let textToCopy = '';
    
    if (activeTab === 'summary') {
      textToCopy = results.summary;
    } else if (activeTab === 'keyPoints') {
      textToCopy = results.keyPoints.map(point => `• ${point}`).join('\n');
    } else if (activeTab === 'topics') {
      textToCopy = results.topics.join(', ');
    } else if (activeTab === 'sentiment') {
      textToCopy = results.sentiment;
    }
    
    // Use the textarea method as a fallback for clipboard API
    if (textAreaRef.current) {
      textAreaRef.current.value = textToCopy;
      textAreaRef.current.select();
      
      try {
        // Try to use the Clipboard API first
        navigator.clipboard.writeText(textToCopy).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          // Fallback to document.execCommand
          try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Copy to clipboard failed. Please select and copy the text manually.');
          }
        });
      } catch (err) {
        console.error('Clipboard API error: ', err);
        // Try the execCommand as fallback
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (execErr) {
          console.error('execCommand error: ', execErr);
          alert('Copy to clipboard failed. Please select and copy the text manually.');
        }
      }
    }
  };
  
  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'keyPoints', label: 'Key Points', icon: List },
    { id: 'topics', label: 'Topics', icon: BarChart },
    { id: 'sentiment', label: 'Sentiment', icon: MessageCircle },
  ];

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl overflow-hidden">
      {/* Hidden textarea for copying text */}
      <textarea
        ref={textAreaRef}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        readOnly
      />
      
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white/10 text-cyan-400 border-b-2 border-cyan-400' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-cyan-400">
            {tabs.find(tab => tab.id === activeTab)?.label}
          </h3>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg px-3 py-1.5 text-sm transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </motion.button>
        </div>
        
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="prose prose-invert max-w-none"
        >
          {activeTab === 'summary' && (
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/90 leading-relaxed">{results.summary}</p>
            </div>
          )}
          
          {activeTab === 'keyPoints' && (
            <ul className="space-y-2 bg-white/5 rounded-lg p-4">
              {results.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="inline-block h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-white/90">{point}</span>
                </li>
              ))}
            </ul>
          )}
          
          {activeTab === 'topics' && (
            <div className="flex flex-wrap gap-2 bg-white/5 rounded-lg p-4">
              {results.topics.map((topic, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white/90 text-sm border border-white/10"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
          
          {activeTab === 'sentiment' && (
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/90">{results.sentiment}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPanel;
