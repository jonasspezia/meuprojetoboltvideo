import React from 'react';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  return (
    <motion.div 
      className="relative rounded-xl overflow-hidden shadow-2xl shadow-blue-500/10"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="aspect-video bg-black">
        <video 
          src={url} 
          controls 
          className="w-full h-full object-contain"
          poster="https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
        />
      </div>
      
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 blur-xl rounded-xl -z-10"></div>
    </motion.div>
  );
};

export default VideoPlayer;
