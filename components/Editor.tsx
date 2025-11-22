import React from 'react';
import { AnalysisResult } from '../types';
import { Pencil } from 'lucide-react';

interface EditorProps {
  text: string;
  setText: (text: string) => void;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  onEditMode: () => void;
}

const Editor: React.FC<EditorProps> = ({ text, setText, isAnalyzing, result, onEditMode }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md focus-within:shadow-lg focus-within:border-indigo-300 relative">
      
      <div className="flex-1 relative overflow-hidden">
        {/* Edit Mode: Textarea */}
        {!result && (
          <>
            <textarea
              value={text}
              onChange={handleChange}
              placeholder="Type or paste your text here to review..."
              className={`w-full h-full p-8 resize-none focus:outline-none text-lg leading-8 text-gray-800 placeholder-gray-400 font-light ${
                isAnalyzing ? 'opacity-50 cursor-wait' : ''
              }`}
              spellCheck={false} 
              disabled={isAnalyzing}
            />
            {text.length === 0 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-gray-300 text-sm">Start typing to review your writing</p>
              </div>
            )}
          </>
        )}

        {/* Review Mode: Rendered HTML */}
        {result && (
          <div className="w-full h-full flex flex-col">
             <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={onEditMode}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 shadow-sm text-gray-600 text-xs font-medium rounded-full hover:text-indigo-600 hover:border-indigo-200 transition-all"
                >
                  <Pencil className="w-3 h-3" />
                  Edit Original
                </button>
             </div>
             <div 
               className="w-full h-full p-8 overflow-y-auto text-lg leading-8 font-light text-gray-800"
               dangerouslySetInnerHTML={{ __html: result.markedUpText }}
             />
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500 font-medium">
        <span>
            {result ? "Reviewing Changes" : `${text.split(/\s+/).filter(w => w.length > 0).length} words`}
        </span>
        <span>{text.length} characters</span>
      </div>
    </div>
  );
};

export default Editor;
