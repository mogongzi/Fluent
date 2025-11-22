export interface AnalysisResult {
  score: number;
  summary: string;
  rewrittenText: string;
  markedUpText: string;
  improvements: string[];
}

export interface EditorProps {
  text: string;
  setText: (text: string) => void;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  onEditMode: () => void;
}

export interface SuggestionPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  onAcceptAll: () => void;
  onRejectAll: () => void;
}
