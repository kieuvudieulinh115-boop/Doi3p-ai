import React, { useState } from 'react';
import { Header } from './components/Header';
import { Step1Observe } from './components/Step1Observe';
import { Step2Hypothesis } from './components/Step2Hypothesis';
import { Step3Analysis } from './components/Step3Analysis';
import { Step4Result } from './components/Step4Result';
import { RulesModal } from './components/RulesModal';
import {
  ObservedWasteInput,
  StudentHypothesis,
  AIAnalysisResult,
  RuleEngineResult,
  SampleWasteItem,
} from './types';
import { SAMPLE_WASTE_ITEMS, evaluateRuleEngine } from './data/rulesAndSamples';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(1);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);

  // Default sample initialized with the exact sample from prompt ("Chai nước")
  const defaultSample = SAMPLE_WASTE_ITEMS[0];
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(defaultSample.id);

  const [inputData, setInputData] = useState<ObservedWasteInput>({
    objectName: defaultSample.name,
    materialPredicted: defaultSample.defaultMaterial,
    condition: defaultSample.defaultCondition,
    description: defaultSample.description,
    imageUrl: defaultSample.imageUrl,
  });

  const [hypothesis, setHypothesis] = useState<StudentHypothesis>({
    material: 'Nhựa PET',
    suggestedBin: 'recycle',
    reasoning: 'Vì đây là chai nhựa trong suốt thường dùng để tái chế.',
  });

  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [ruleResult, setRuleResult] = useState<RuleEngineResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handler to select a preset sample waste item
  const handleSelectSample = (sample: SampleWasteItem) => {
    setSelectedSampleId(sample.id);
    setInputData({
      objectName: sample.name,
      materialPredicted: sample.defaultMaterial,
      condition: sample.defaultCondition,
      description: sample.description,
      imageUrl: sample.imageUrl,
    });
  };

  // Step 1 -> Step 2
  const handleConfirmStep1 = () => {
    setCurrentStep(2);
    setMaxReachedStep((prev) => Math.max(prev, 2));
  };

  // Step 2 -> Step 3: Trigger Real Gemini Analysis & Rule Engine Check
  const handleSubmitHypothesis = async () => {
    setCurrentStep(3);
    setMaxReachedStep((prev) => Math.max(prev, 3));
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-waste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objectName: inputData.objectName,
          materialPredicted: inputData.materialPredicted,
          condition: inputData.condition,
          description: inputData.description,
          imageBase64: inputData.imageBase64,
          studentGuess: hypothesis,
        }),
      });

      const resData = await response.json();

      if (resData.success && resData.data) {
        const aiData: AIAnalysisResult = resData.data;
        setAiResult(aiData);

        // Run Rule Engine layer using student input + AI insights
        const ruleData = evaluateRuleEngine(
          inputData.objectName,
          aiData.materialIdentified || inputData.materialPredicted,
          inputData.condition,
          aiData.questionsToClarify
        );
        setRuleResult(ruleData);
      } else {
        throw new Error(resData.error || 'Không nhận được kết quả từ hệ thống AI.');
      }
    } catch (err: any) {
      console.error('Error during AI waste analysis:', err);
      // Fallback deterministic analysis so the user is never stranded
      const fallbackAi: AIAnalysisResult = {
        objectIdentified: inputData.objectName || 'Vật thể quan sát',
        materialIdentified: inputData.materialPredicted || 'Nhựa / Giấy / Hỗn hợp',
        conditionAssessed:
          inputData.condition === 'has_content'
            ? 'Còn chất lỏng / chất bên trong'
            : inputData.condition === 'dirty'
            ? 'Bẩn dính tạp chất'
            : inputData.condition === 'clean'
            ? 'Sạch sẽ và rỗng'
            : 'Chưa xác định rõ tình trạng',
        questionsToClarify: [
          'Chai / hộp có sạch không?',
          'Có còn nước hay đồ ăn thừa bên trong không?',
          'Có phải loại nhựa có mã số tái chế (PET 1, HDPE 2) không?',
        ],
        regulationsToCheck: 'Bảng quy định phân loại rác của trường học / địa phương',
        preliminaryAdvice:
          inputData.condition === 'has_content'
            ? 'Chưa thể bỏ ngay vào thùng tái chế nếu còn nước. Cần làm rỗng và tráng sạch trước.'
            : 'Cần kiểm tra kỹ độ sạch và quy định áp dụng.',
        confidenceLevel: inputData.condition === 'uncertain' ? 'insufficient' : 'needs_check',
        isInsufficientData: inputData.condition === 'uncertain',
        notes: 'AI đưa ra phân tích sơ bộ để học sinh tự kiểm chứng.',
      };

      setAiResult(fallbackAi);
      const ruleData = evaluateRuleEngine(
        inputData.objectName,
        fallbackAi.materialIdentified,
        inputData.condition,
        fallbackAi.questionsToClarify
      );
      setRuleResult(ruleData);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3 -> Step 4
  const handleProceedToStep4 = () => {
    setCurrentStep(4);
    setMaxReachedStep((prev) => Math.max(prev, 4));
  };

  // Reset to initial state for next experiment
  const handleReset = () => {
    setCurrentStep(1);
    setMaxReachedStep(1);
    setSelectedSampleId(null);
    setInputData({
      objectName: '',
      materialPredicted: '',
      condition: 'uncertain',
      description: '',
      imageUrl: undefined,
      imageBase64: undefined,
    });
    setHypothesis({
      material: '',
      suggestedBin: 'recycle',
      reasoning: '',
    });
    setAiResult(null);
    setRuleResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-200">
      {/* App Header with 4-step progress and Rule modal trigger */}
      <Header
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
        onOpenRules={() => setIsRulesModalOpen(true)}
        maxReachedStep={maxReachedStep}
      />

      {/* Main Educational Workflow Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentStep === 1 && (
          <Step1Observe
            inputData={inputData}
            onUpdateInput={(updated) => setInputData((prev) => ({ ...prev, ...updated }))}
            onConfirm={handleConfirmStep1}
            selectedSampleId={selectedSampleId}
            onSelectSample={handleSelectSample}
          />
        )}

        {currentStep === 2 && (
          <Step2Hypothesis
            inputData={inputData}
            hypothesis={hypothesis}
            onUpdateHypothesis={(updated) => setHypothesis((prev) => ({ ...prev, ...updated }))}
            onBack={() => setCurrentStep(1)}
            onSubmit={handleSubmitHypothesis}
          />
        )}

        {currentStep === 3 && (
          <Step3Analysis
            isLoading={isLoading}
            error={error}
            aiResult={aiResult}
            ruleResult={ruleResult}
            inputData={inputData}
            onRetry={handleSubmitHypothesis}
            onBack={() => setCurrentStep(2)}
            onProceedToStep4={handleProceedToStep4}
            onOpenRules={() => setIsRulesModalOpen(true)}
          />
        )}

        {currentStep === 4 && aiResult && ruleResult && (
          <Step4Result
            inputData={inputData}
            hypothesis={hypothesis}
            aiResult={aiResult}
            ruleResult={ruleResult}
            onReset={handleReset}
            onBackToStep3={() => setCurrentStep(3)}
          />
        )}
      </main>

      {/* Footer with Educational Note */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Dự án giáo dục STEM: <strong>AI Phân Loại Rác – Học bằng quan sát và kiểm chứng</strong>
          </span>
          <span className="text-slate-400">
            Học sinh luôn là người kiểm tra, điều chỉnh và đưa ra quyết định cuối cùng
          </span>
        </div>
      </footer>

      {/* Teacher Confirmed School Rules Modal */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
}
