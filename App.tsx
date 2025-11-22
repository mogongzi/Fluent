import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Editor from './components/Editor';
import SuggestionPanel from './components/SuggestionPanel';
import { analyzeText } from './services/geminiService';
import { AnalysisResult } from './types';
import { Play, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeText(text);
      setResult(analysis);
    } catch (err) {
      setError("Failed to analyze text. Please try again later or check your API key.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [text]);

  const handleAcceptAll = () => {
    if (result) {
      setText(result.rewrittenText);
      setResult(null); // Return to edit mode with clean text
    }
  };

  const handleEditOriginal = () => {
    setResult(null); // Just clear the overlay, keeping original text
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile Action Bar */}
        <div className="md:hidden mb-4">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !text.trim() || !!result}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold shadow-sm text-white transition-all ${
               isAnalyzing || !text.trim() || result
               ? 'bg-gray-400 cursor-not-allowed' 
               : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
            }`}
          >
            {isAnalyzing ? (
               <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
               <Sparkles className="w-5 h-5 fill-current" />
            )}
            {isAnalyzing ? 'Reviewing...' : 'Review'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)] min-h-[600px]">
          {/* Left Column: Editor */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="bg-white rounded-t-xl border-x border-t border-gray-200 px-4 py-3 flex justify-between items-center">
               <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Document</span>
               <div className="hidden md:block">
                 {!result && (
                   <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !text.trim()}
                      className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                         isAnalyzing || !text.trim() 
                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                         : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow'
                      }`}
                   >
                     {isAnalyzing ? (
                       <>
                         <RefreshCw className="w-4 h-4 animate-spin" />
                         <span>Reviewing...</span>
                       </>
                     ) : (
                       <>
                         <Sparkles className="w-4 h-4 fill-current" />
                         <span>Review</span>
                       </>
                     )}
                   </button>
                 )}
               </div>
            </div>
            <Editor 
              text={text} 
              setText={setText} 
              isAnalyzing={isAnalyzing}
              result={result}
              onEditMode={handleEditOriginal}
            />
          </div>

          {/* Right Column: Assistant Panel */}
          <div className="w-full md:w-96 shrink-0 flex flex-col bg-gray-50/50 rounded-xl border border-gray-200/60 p-4 md:p-0 md:bg-transparent md:border-none md:rounded-none">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Error</h3>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            ) : (
              <SuggestionPanel 
                result={result}
                isAnalyzing={isAnalyzing}
                onAcceptAll={handleAcceptAll}
                onRejectAll={handleEditOriginal}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
