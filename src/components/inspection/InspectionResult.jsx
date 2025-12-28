import React from 'react';
import { CheckCircle2, AlertCircle, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InspectionResult = ({ result }) => {
  return (
    <div className="h-full lg:col-span-1">
      <AnimatePresence mode="wait">
        {result ? (
          /* Result Card */
          <motion.div 
            key="result"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`p-2 rounded-full ${result.color === 'red' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {result.color === 'red' ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
              </div>
              <h3 className="text-lg font-bold text-slate-800">Analysis Complete</h3>
            </div>

            {/* Details Grid */}
            <div className="space-y-6 flex-1">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Status</p>
                <p className={`text-xl font-bold ${result.color === 'red' ? 'text-red-600' : 'text-green-600'}`}>
                  {result.status}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Defect Type</p>
                  <p className="font-semibold text-slate-800">{result.type}</p>
                </div>
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">AI Confidence</p>
                  <p className="font-semibold text-slate-800">{result.confidence}</p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-auto pt-6">
               <button className="w-full py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                 Download Report
               </button>
            </div>
          </motion.div>
        ) : (
          /* Empty State / Placeholder */
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center"
          >
            <ScanLine size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Ready for Inspection</p>
            <p className="text-sm mt-1">Upload an image to see detailed AI diagnostics here.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InspectionResult;