import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoIcon, FileVideo, Upload, Sparkles, Brain, FileText, Loader2 } from 'lucide-react';
import { analyzeVideo } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import VideoPlayer from './components/VideoPlayer';
import ResultsPanel from './components/ResultsPanel';
import ApiKeyInput from './components/ApiKeyInput';
import ModelSelector from './components/ModelSelector';

function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    summary: string;
    keyPoints: string[];
    sentiment: string;
    topics: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setResults(null);
      setError(null);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('videoUrl') as string;
    
    if (url) {
      setVideoUrl(url);
      setVideoFile(null);
      setResults(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!videoUrl) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // In a real app, you would extract video frames or transcribe audio
      // For this demo, we'll use the video URL or filename
      const videoInfo = videoFile ? videoFile.name : videoUrl;
      const analysisResults = await analyzeVideo(videoInfo);
      setResults(analysisResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white">
      {/* Bioluminescent glow effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-xl border border-white/20">
              <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Brain className="h-8 w-8 text-cyan-400" />
                <span>Video Analysis & Summary</span>
                <span className="ml-2 text-xs bg-gradient-to-r from-cyan-400 to-blue-500 px-2 py-1 rounded-full">
                  Gemini AI
                </span>
              </h1>

              {/* API Key Input Component */}
              <ApiKeyInput />
              
              {/* Model Selector Component */}
              <ModelSelector />

              {!videoUrl ? (
                <motion.div 
                  className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/30 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <VideoIcon className="h-16 w-16 text-cyan-400 mb-4" />
                  <h2 className="text-xl font-semibold mb-6">Upload or provide a video URL to analyze</h2>
                  
                  <div className="w-full max-w-md space-y-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 py-3 px-6 rounded-lg font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-5 w-5" />
                      Upload Video File
                    </motion.button>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="video/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                    
                    <div className="relative flex items-center">
                      <div className="flex-grow border-t border-white/20"></div>
                      <span className="flex-shrink mx-4 text-white/60">or</span>
                      <div className="flex-grow border-t border-white/20"></div>
                    </div>
                    
                    <form onSubmit={handleUrlSubmit} className="space-y-3">
                      <input
                        type="url"
                        name="videoUrl"
                        placeholder="Enter video URL"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-sm"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/20 py-3 px-6 rounded-lg font-medium hover:bg-white/20 transition-all"
                      >
                        <FileVideo className="h-5 w-5" />
                        Use Video URL
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-8">
                  <VideoPlayer url={videoUrl} />
                  
                  {!isAnalyzing && !results && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAnalyze}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 py-3 px-6 rounded-lg font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                    >
                      <Sparkles className="h-5 w-5" />
                      Analyze with Gemini AI
                    </motion.button>
                  )}
                  
                  {isAnalyzing && (
                    <div className="flex flex-col items-center justify-center p-8">
                      <Loader2 className="h-10 w-10 text-cyan-400 animate-spin mb-4" />
                      <p className="text-lg">Analyzing video content with Gemini AI...</p>
                    </div>
                  )}
                  
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
                      <p className="text-red-200">{error}</p>
                    </div>
                  )}
                  
                  <AnimatePresence>
                    {results && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ResultsPanel results={results} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {videoUrl && (
                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setVideoUrl(null);
                          setVideoFile(null);
                          setResults(null);
                          setError(null);
                        }}
                        className="text-white/70 hover:text-white flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-white/10 transition-all"
                      >
                        Try another video
                      </motion.button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
