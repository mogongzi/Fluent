import React from 'react';
import { AnalysisResult } from '../types';
import { Check, X, Sparkles, SpellCheck, ListChecks, ArrowRight } from 'lucide-react';

interface SuggestionPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  onAcceptAll: () => void;
  onRejectAll: () => void;
}

const SuggestionPanel: React.FC<SuggestionPanelProps> = ({ 
  result, 
  isAnalyzing, 
  onAcceptAll,
  onRejectAll
}) => {
  
  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 animate-pulse">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
          <SpellCheck className="w-8 h-8 text-indigo-600 animate-bounce" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Reviewing your text...</h3>
          <p className="text-sm text-gray-500 mt-1">Generating track changes and improvements.</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Ready to Review</h3>
          <p className="text-sm text-gray-500 mt-1">Click the Review button to let AI polish your writing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Summary Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">{result.score}</h2>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mt-1">Quality Score</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
             <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Improvements List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 px-1">
            <ListChecks className="w-4 h-4" />
            Why these changes?
        </h3>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
           {result.improvements.map((reason, index) => (
               <div key={index} className="flex gap-3 p-3 bg-white rounded-lg border border-gray-100 text-sm text-gray-700">
                   <div className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                   <span className="leading-snug">{reason}</span>
               </div>
           ))}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 space-y-3 border-t border-gray-200">
          <button
            onClick={onAcceptAll}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-semibold shadow-sm transition-all hover:shadow-md"
          >
            <Check className="w-5 h-5" />
            <span>Accept All Changes</span>
          </button>
          
          <button
            onClick={onRejectAll}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2.5 px-4 rounded-xl font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Reject & Edit Original</span>
          </button>
      </div>
    </div>
  );
};

export default SuggestionPanel;
