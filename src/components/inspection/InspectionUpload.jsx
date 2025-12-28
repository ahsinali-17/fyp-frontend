import React from 'react';
import { UploadCloud, X, Loader2, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';

const InspectionUpload = ({ image, loading, hasResult, onFileChange, onAnalyze, onClear }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 h-full">
      {/* 1. Upload State */}
      {!image ? (
        <label className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-blue-500 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-10 h-10 text-blue-500" />
            </div>
            <p className="mb-2 text-lg text-slate-700 font-medium">Click to upload or drag and drop</p>
            <p className="text-sm text-slate-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
        </label>
      ) : (
        /* 2. Preview State */
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-96 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center"
        >
          <img src={image} alt="Preview" className="max-h-full max-w-full object-contain" />
          
          {/* Close Button */}
          <button 
            onClick={onClear}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}

      {/* 3. Analyze Button*/}
      {image && !hasResult && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAnalyze}
          disabled={loading}
          className="mt-6 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <ScanLine />}
          {loading ? 'Analyzing Structure...' : 'Run AI Diagnostics'}
        </motion.button>
      )}
    </div>
  );
};

export default InspectionUpload;