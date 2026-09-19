import React from 'react';
import {
  Sparkles,
  Cpu,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
  BookOpen,
  Info,
} from 'lucide-react';
import {
  AIAnalysisResult,
  RuleEngineResult,
  ConfidenceLevel,
  ObservedWasteInput,
} from '../types';

interface Step3AnalysisProps {
  isLoading: boolean;
  error: string | null;
  aiResult: AIAnalysisResult | null;
  ruleResult: RuleEngineResult | null;
  inputData: ObservedWasteInput;
  onRetry: () => void;
  onBack: () => void;
  onProceedToStep4: () => void;
  onOpenRules: () => void;
}

export const Step3Analysis: React.FC<Step3AnalysisProps> = ({
  isLoading,
  error,
  aiResult,
  ruleResult,
  inputData,
  onRetry,
  onBack,
  onProceedToStep4,
  onOpenRules,
}) => {
  // Confidence helper
  const renderConfidenceBadge = (level: ConfidenceLevel) => {
    switch (level) {
      case 'sufficient':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            🟢 Đủ căn cứ
          </span>
        );
      case 'needs_check':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            🟡 Cần kiểm tra thêm
          </span>
        );
      case 'insufficient':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            🔴 Chưa đủ dữ liệu
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-6">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-emerald-50 flex items-center justify-center">
            <Cpu className="w-8 h-8 text-emerald-600 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-800">
            Mô hình Gemini AI đang phân tích dữ liệu quan sát...
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            AI đang thẩm định 5 góc độ: Vật thể, Vật liệu, Tình trạng thực tế, Điều cần hỏi thêm và Quy định cần đối chiếu.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Nguyên tắc STEM:
          </div>
          <p className="italic">
            "AI chỉ hỗ trợ gợi ý logic dựa trên đặc điểm nhận diện. Sau bước này, hệ thống sẽ đối chiếu với Bảng quy tắc mẫu của nhà trường trước khi kết luận."
          </p>
        </div>
      </div>
    );
  }

  if (error || !aiResult || !ruleResult) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-rose-200 shadow-sm text-center max-w-lg mx-auto space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Chưa thể hoàn tất phân tích
        </h3>
        <p className="text-xs text-slate-600">{error || 'Không nhận được phản hồi từ mô hình AI.'}</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Quay lại sửa dữ liệu
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
          >
            Thử phân tích lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                Bước 3: AI Phân Tích & Kiểm Tra Bằng Mã Quy Tắc
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Kết hợp gợi ý đa chiều từ mô hình Gemini với lớp kiểm tra quy tắc độc lập
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Mức độ tin cậy khoa học:
          </span>
          {renderConfidenceBadge(aiResult.confidenceLevel)}
        </div>
      </div>

      {/* 2 Main Analysis Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pillar 1: AI 5-Lens Breakdown (7 columns) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800">
                AI Phân Tích Theo 5 Góc Độ
              </h3>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Gemini 3.8 Flash
            </span>
          </div>

          {/* 5 Lens Visual Cards */}
          <div className="space-y-3">
            {/* Lens 1: Vật thể */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                Góc 1 • Vật thể nhận diện
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                {aiResult.objectIdentified}
              </p>
            </div>

            {/* Lens 2: Vật liệu */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                Góc 2 • Vật liệu có khả năng
              </span>
              <p className="text-xs sm:text-sm font-bold text-sky-900">
                {aiResult.materialIdentified}
              </p>
            </div>

            {/* Lens 3: Tình trạng */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                Góc 3 • Tình trạng vật thể
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                {aiResult.conditionAssessed}
              </p>
            </div>

            {/* Lens 4: Cần hỏi thêm / Điểm cần kiểm chứng */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1 mb-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                Góc 4 • Cần hỏi thêm / Điểm học sinh cần kiểm chứng:
              </span>
              <ul className="text-xs text-amber-950 space-y-1.5 pl-1">
                {aiResult.questionsToClarify?.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lens 5: Quy định & Gợi ý sơ bộ */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Góc 5 • Quy định cần kiểm tra & Gợi ý sơ bộ của AI
              </span>
              <div className="text-xs text-emerald-950 leading-relaxed">
                <strong>Quy định cần đối chiếu: </strong>
                {aiResult.regulationsToCheck}
              </div>
              <div className="text-xs text-emerald-900 leading-relaxed pt-1 border-t border-emerald-200/60">
                <strong>Gợi ý sơ bộ: </strong>
                {aiResult.preliminaryAdvice}
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Transparent Rule Checker Layer (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Lớp Kiểm Tra Quy Tắc (Rule Engine)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onOpenRules}
                  className="text-[11px] text-emerald-700 hover:underline font-semibold flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3" />
                  Xem bảng quy tắc
                </button>
              </div>

              {/* Matched Rule Box */}
              {ruleResult.matchedRule ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Mã: {ruleResult.matchedRule.id}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Đã khớp quy tắc mẫu
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {ruleResult.matchedRule.materialPattern}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Tình trạng chuẩn: {ruleResult.matchedRule.conditionPattern}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-xs">
                    <span className="font-semibold text-slate-700 block mb-1">
                      Định hướng theo quy định:
                    </span>
                    <span className="font-bold text-slate-900 block">
                      {ruleResult.matchedRule.binName}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                  <span className="text-xs font-bold text-amber-900 block">
                    CHƯA XÁC ĐỊNH TRONG BẢNG QUY TẮC MẪU
                  </span>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Vật thể này không khớp trọn vẹn với các quy tắc định sẵn. Tuân thủ nguyên tắc khoa học: Không được cố đoán!
                  </p>
                </div>
              )}

              {/* Action guidance from Rule Engine */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Chỉ dẫn thực hiện từ hệ thống quy tắc:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ruleResult.guidance}
                </p>
              </div>

              {/* Mandatory Disclaimer Box */}
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                <div className="flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Quy định minh họa: </strong>
                    Cần được giáo viên hoặc địa phương xác nhận trước khi sử dụng thực tế. Quy định này không đồng nhất ở mọi nơi.
                  </div>
                </div>
              </div>

              {/* Pedagogical Note on Confidence */}
              <div className="text-[11px] text-slate-500 italic text-center px-2">
                * Lưu ý sư phạm: Mức độ tin cậy không dùng để tạo cảm giác AI luôn đúng, mà phản ánh mức độ đầy đủ của dữ liệu em cung cấp.
              </div>
            </div>

            {/* Navigation to Step 4 */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                id="back-to-step2-btn"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Xem lại Bước 2</span>
              </button>

              <button
                type="button"
                id="proceed-to-step4-btn"
                onClick={onProceedToStep4}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <span>Xem Kết Quả & Em Ra Quyết Định</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
