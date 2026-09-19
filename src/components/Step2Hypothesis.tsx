import React from 'react';
import {
  Brain,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { ObservedWasteInput, StudentHypothesis, BinType } from '../types';
import { BinVisualizer, BIN_DEFINITIONS } from './BinVisualizer';

interface Step2HypothesisProps {
  inputData: ObservedWasteInput;
  hypothesis: StudentHypothesis;
  onUpdateHypothesis: (data: Partial<StudentHypothesis>) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export const Step2Hypothesis: React.FC<Step2HypothesisProps> = ({
  inputData,
  hypothesis,
  onUpdateHypothesis,
  onBack,
  onSubmit,
}) => {
  const isFormValid =
    hypothesis.material.trim().length > 0 &&
    Boolean(hypothesis.suggestedBin) &&
    hypothesis.reasoning.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Educational Hypothesis Guidance Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
              Tư duy khoa học STEM
            </span>
            <h2 className="text-base sm:text-lg font-bold text-amber-950">
              Hãy đưa ra dự đoán trước khi xem gợi ý của AI!
            </h2>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              Nhà khoa học luôn đặt giả thuyết trước khi kiểm nghiệm. AI chỉ là công cụ hỗ trợ tư duy, chính suy nghĩ và lập luận của em mới là điều quan trọng nhất.
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hypothesis Input Form */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-600" />
              Theo em, vật này nên được xử lý như thế nào?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hãy trả lời 3 câu hỏi dưới đây dựa trên quan sát thực tế của em.
            </p>
          </div>

          {/* Question 1: Material */}
          <div>
            <label htmlFor="hypo-material-input" className="block text-xs font-bold text-slate-800 mb-1.5">
              1. Em nghĩ đây là vật liệu gì? <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="hypo-material-input"
              value={hypothesis.material}
              onChange={(e) => onUpdateHypothesis({ material: e.target.value })}
              placeholder="Ví dụ: Nhựa PET dùng một lần, Nhôm, Giấy bìa, Cao su..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Question 2: Bin Choice */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              2. Em nghĩ nên bỏ vào thùng rác nào? <span className="text-rose-500">*</span>
            </label>
            <BinVisualizer
              selectedBin={hypothesis.suggestedBin}
              interactive={true}
              onSelectBin={(bin: BinType) => onUpdateHypothesis({ suggestedBin: bin })}
            />
            <p className="text-[11px] text-slate-500 mt-2">
              * Nếu không chắc chắn, em hãy mạnh dạn chọn ô <strong>"Chưa chắc"</strong>. Biết thừa nhận điểm chưa rõ là một phẩm chất khoa học!
            </p>
          </div>

          {/* Question 3: Reasoning */}
          <div>
            <label htmlFor="hypo-reason-input" className="block text-xs font-bold text-slate-800 mb-1.5">
              3. Vì sao em nghĩ như vậy? (Giải thích lập luận của em) <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="hypo-reason-input"
              rows={3}
              value={hypothesis.reasoning}
              onChange={(e) => onUpdateHypothesis({ reasoning: e.target.value })}
              placeholder="Ví dụ: Em thấy chai còn nước nên chưa thể bỏ ngay vào thùng tái chế, cần phải đổ nước trước để tránh làm ướt giấy..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all leading-relaxed"
            />
          </div>

          {/* Action Navigation */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              id="back-to-step1-btn"
              onClick={onBack}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Bước 1 (Sửa thông tin quan sát)</span>
            </button>

            <button
              type="button"
              id="submit-to-step3-btn"
              onClick={onSubmit}
              disabled={!isFormValid}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm ${
                isFormValid
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Gửi thông tin cho AI phân tích & Đối chiếu quy tắc</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Observation Reference Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Vật thể em đang phân tích:
            </span>

            {inputData.imageUrl && (
              <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-white border border-slate-200">
                <img
                  src={inputData.imageUrl}
                  alt={inputData.objectName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="space-y-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Vật thể</span>
                <span className="font-bold text-slate-800 text-sm">{inputData.objectName}</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Tình trạng thực tế</span>
                <span className="font-semibold text-emerald-800">
                  {inputData.condition === 'clean' && 'Sạch sẽ / Rỗng khô'}
                  {inputData.condition === 'dirty' && 'Bẩn / Dính tạp chất'}
                  {inputData.condition === 'has_content' && 'Còn chất bên trong (nước/sữa...)'}
                  {inputData.condition === 'uncertain' && 'Chưa xác định rõ'}
                </span>
              </div>

              {inputData.description && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Mô tả</span>
                  <p className="text-slate-600 italic text-[11px] leading-relaxed mt-0.5">
                    "{inputData.description}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
