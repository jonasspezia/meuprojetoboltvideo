import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 border-t border-white/10 backdrop-blur-md bg-black/20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-white/60 text-sm">
            Powered by Gemini 2.0 Pro API
          </div>
          
          <div className="flex items-center gap-1 text-white/60 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400 fill-red-400" />
            <span>using React & Tailwind CSS</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
