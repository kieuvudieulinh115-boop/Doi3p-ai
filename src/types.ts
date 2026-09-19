export type WasteCondition = 'clean' | 'dirty' | 'has_content' | 'uncertain';

export type BinType = 'recycle' | 'organic' | 'residual' | 'hazardous' | 'uncertain';

export type ConfidenceLevel = 'sufficient' | 'needs_check' | 'insufficient';

export interface SampleWasteItem {
  id: string;
  name: string;
  category: string;
  defaultMaterial: string;
  defaultCondition: WasteCondition;
  description: string;
  imageUrl: string;
  iconName: string;
  badge: string;
}

export interface ObservedWasteInput {
  objectName: string;
  materialPredicted: string;
  condition: WasteCondition;
  description: string;
  imageUrl?: string;
  imageBase64?: string;
}

export interface StudentHypothesis {
  material: string;
  suggestedBin: BinType;
  reasoning: string;
}

export interface AIAnalysisResult {
  objectIdentified: string;
  materialIdentified: string;
  conditionAssessed: string;
  questionsToClarify: string[];
  regulationsToCheck: string;
  preliminaryAdvice: string;
  confidenceLevel: ConfidenceLevel;
  isInsufficientData: boolean;
  notes: string;
}

export interface SchoolRule {
  id: string;
  materialPattern: string;
  conditionPattern: string;
  sampleRegulation: string;
  suggestedBin: BinType;
  binName: string;
  requiredPreActions: string[];
  notes: string;
}

export interface RuleEngineResult {
  matchedRule: SchoolRule | null;
  status: 'matched' | 'partial' | 'uncertain';
  guidance: string;
  requiredActions: string[];
  binRecommendation: BinType;
  confidence: ConfidenceLevel;
  disclaimer: string;
}

export interface CombinedFinalResult {
  aiAnalysis: AIAnalysisResult;
  ruleResult: RuleEngineResult;
  studentHypothesis: StudentHypothesis;
  finalTargetBin: BinType;
  finalBinTitle: string;
  prerequisites: string[];
  confidence: ConfidenceLevel;
  confidenceDescription: string;
  learningComparison: {
    studentBinMatched: boolean;
    studentMaterialMatched: boolean;
    feedbackMessage: string;
    pointsToReflect: string[];
  };
}
