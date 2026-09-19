import React, { useState } from 'react';
import {
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ClipboardList,
  UserCheck,
  HelpCircle,
  CheckSquare,
  Square,
  Award,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import {
  ObservedWasteInput,
  StudentHypothesis,
  AIAnalysisResult,
  RuleEngineResult,
  ConfidenceLevel,
  BinType,
} from '../types';
import { BIN_DEFINITIONS } from './BinVisualizer';

interface Step4ResultProps {
  inputData: ObservedWasteInput;
  hypothesis: StudentHypothesis;
  aiResult: AIAnalysisResult;
  ruleResult: RuleEngineResult;
  onReset: () => void;
  onBackToStep3: () => void;
}

export const Step4Result: React.FC<Step4ResultProps> = ({
  inputData,
  hypothesis,
  aiResult,
  ruleResult,
  onReset,
  onBackToStep3,
}) => {
  // Pre-action checklists
  const initialActions = [
    ...(ruleResult?.requiredActions || []),
    'Đối chiếu với bảng quy định phân loại rác cụ thể của trường em.',
  ];
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});
  const [studentFinalChoice, setStudentFinalChoice] = useState<string>('');
  const [isDecisionConfirmed, setIsDecisionConfirmed] = useState(false);

  const toggleAction = (index: number) => {
    setCompletedActions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Determine final bin title
  let finalBinDisplayTitle = 'Chưa xác định thùng phù hợp';
  let isDelayedRecycle = false;

  if (ruleResult.binRecommendation === 'uncertain' || ruleResult.status === 'uncertain') {
    if (inputData.condition === 'has_content') {
      finalBinDisplayTitle = 'CHƯA BỎ NGAY VÀO THÙNG TÁI CHẾ';
      isDelayedRecycle = true;
    } else {
      finalBinDisplayTitle = 'CHƯA XÁC ĐỊNH – Cần kiểm tra thêm';
    }
  } else {
    finalBinDisplayTitle = BIN_DEFINITIONS[ruleResult.binRecommendation]?.name || 'Thùng rác phù hợp';
  }

  // Confidence details
  const getConfidenceInfo = (level: ConfidenceLevel) => {
    switch (level) {
      case 'sufficient':
        return {
          icon: '🟢',
          title: 'Đủ căn cứ',
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
          desc: 'Vật thể và tình trạng đã rõ ràng, hoàn toàn phù hợp với quy tắc mẫu.',
        };
      case 'needs_check':
        return {
          icon: '🟡',
          title: 'Cần kiểm tra thêm',
          bg: 'bg-amber-50 text-amber-950 border-amber-300',
          desc: 'Có điều kiện ràng buộc (cần đổ nước, tráng sạch hoặc xem xét bảng quy chế trường).',
        };
      case 'insufficient':
      default:
        return {
          icon: '🔴',
          title: 'Chưa đủ dữ liệu',
          bg: 'bg-rose-50 text-rose-950 border-rose-300',
          desc: 'Không thể xác định chắc chắn vật liệu hoặc tình trạng. Không được đoán mò!',
        };
    }
  };

  const confidenceInfo = getConfidenceInfo(aiResult.confidenceLevel);

  // Student hypothesis comparison
  const studentGuessedBinName =
    BIN_DEFINITIONS[hypothesis.suggestedBin]?.name || 'Chưa chắc';

  const isGuessedImmediateRecycleWhenHasContent =
    hypothesis.suggestedBin === 'recycle' && inputData.condition === 'has_content';

  return (
    <div className="space-y-6">
      {/* Top Banner: Core Result */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block mb-1.5">
              Kết Quả Tổng Hợp STEM
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              KẾT QUẢ PHÂN TÍCH & ĐỐI CHIẾU
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${confidenceInfo.bg}`}
            >
              <span>{confidenceInfo.icon}</span>
              <span>Mức độ tin cậy: {confidenceInfo.title}</span>
            </div>
          </div>
        </div>

        {/* 4 Essential Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-5">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Vật thể
            </span>
            <span className="font-bold text-slate-900 text-sm sm:text-base block">
              {aiResult.objectIdentified || inputData.objectName}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Vật liệu
            </span>
            <span className="font-bold text-sky-900 text-sm sm:text-base block">
              {aiResult.materialIdentified}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Tình trạng
            </span>
            <span className="font-bold text-slate-900 text-sm sm:text-base block">
              {aiResult.conditionAssessed}
            </span>
          </div>

          <div
            className={`p-3.5 rounded-xl border ${
              isDelayedRecycle
                ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Thùng phù hợp
            </span>
            <span className="font-black text-xs sm:text-sm block leading-tight">
              {finalBinDisplayTitle}
            </span>
          </div>
        </div>
      </div>

      {/* Action Items Before Disposal (Cần làm trước) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Cần làm trước khi bỏ rác (Thực hành kiểm chứng)
            </h3>
            <p className="text-xs text-slate-500">
              Hãy đánh dấu vào các bước em cần thực hiện trước khi quyết định bỏ vào thùng:
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {initialActions.map((action, idx) => {
            const isDone = completedActions[idx] || false;
            return (
              <button
                key={idx}
                type="button"
                id={`checklist-action-${idx}`}
                onClick={() => toggleAction(idx)}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  isDone
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50/60 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="text-xs sm:text-sm font-medium leading-relaxed">
                  <span className="font-bold mr-1.5">Bước {idx + 1}:</span>
                  <span className={isDone ? 'line-through text-slate-500' : ''}>
                    {action}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison with Student's Hypothesis (Bước 2 vs Bước 4) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Đối chiếu với dự đoán ban đầu của em (Bước 2)
            </h3>
            <p className="text-xs text-slate-500">
              Học hỏi từ sự khác biệt giữa giả thuyết và thực nghiệm
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-500 uppercase text-[11px] block">
              Dự đoán của em:
            </span>
            <p>
              <strong>Vật liệu: </strong> {hypothesis.material}
            </p>
            <p>
              <strong>Thùng em chọn: </strong> {studentGuessedBinName}
            </p>
            <p className="text-slate-600 italic">
              <strong>Lý do của em: </strong> "{hypothesis.reasoning}"
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2 text-emerald-950">
            <span className="font-bold text-emerald-800 uppercase text-[11px] block">
              Bài học khoa học rút ra:
            </span>
            {isGuessedImmediateRecycleWhenHasContent ? (
              <p className="leading-relaxed">
                Em đã nhận diện rất đúng vật liệu tái chế! Tuy nhiên, điểm mấu chốt là <strong>chất lỏng còn sót lại</strong>. Nếu bỏ ngay vào thùng, nước sẽ rỉ ra làm hỏng giấy vụn xung quanh. Vì vậy, bước <strong>đổ cạn và làm rỗng</strong> là điều kiện bắt buộc!
              </p>
            ) : (
              <p className="leading-relaxed">
                Tư duy của em rất đáng khen ngợi! Bằng cách đối chiếu tình trạng thực tế và quy tắc trường học, em đã thấy phân loại rác cần xem xét cả vật liệu lẫn độ sạch và các bước tiền xử lý.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Final Student Decision: Student Has the Final Say! */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-emerald-950 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
              Quyền quyết định thuộc về em
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Sau khi xem gợi ý của AI và Quy tắc, em quyết định làm gì?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1">
              AI chỉ đưa ra phân tích khách quan; chính em là người trực tiếp hành động có trách nhiệm với môi trường.
            </p>
          </div>
        </div>

        {!isDecisionConfirmed ? (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'clean_and_recycle',
                  title: 'Làm rỗng & Bỏ Thùng Tái Chế',
                  desc: 'Em sẽ đổ hết nước/chất bên trong, tráng sạch rồi mới bỏ vào thùng tái chế.',
                },
                {
                  id: 'put_residual',
                  title: 'Bỏ Thùng Rác Còn Lại',
                  desc: 'Vật thể quá bẩn hoặc dính dầu mỡ không thể rửa sạch tại trường, em bỏ vào rác còn lại.',
                },
                {
                  id: 'ask_teacher',
                  title: 'Mang Hỏi Thầy Cô / Kiểm Tra Lại',
                  desc: 'Vật thể chưa xác định rõ hoặc quy định trường chưa rõ ràng, em sẽ hỏi thầy cô phụ trách.',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  id={`decision-opt-${opt.id}`}
                  onClick={() => setStudentFinalChoice(opt.id)}
                  className={`p-3.5 rounded-xl text-left border-2 transition-all flex flex-col justify-between ${
                    studentFinalChoice === opt.id
                      ? 'border-emerald-400 bg-emerald-900/80 ring-2 ring-emerald-300'
                      : 'border-emerald-800/80 bg-emerald-900/30 hover:bg-emerald-900/50'
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm text-white block mb-1">
                    {opt.title}
                  </span>
                  <span className="text-[11px] text-emerald-200/80 leading-relaxed">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                id="confirm-student-decision-btn"
                disabled={!studentFinalChoice}
                onClick={() => setIsDecisionConfirmed(true)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                  studentFinalChoice
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950 cursor-pointer shadow-md'
                    : 'bg-emerald-900 text-emerald-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Xác nhận quyết định của em</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-900/70 border border-emerald-700 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Quyết định của em đã được ghi nhận thành công!</span>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Cảm ơn em đã rèn luyện tư duy khoa học quan sát và kiểm chứng trước khi hành động. Hành động đúng đắn của em giúp việc tái chế đạt hiệu quả cao nhất và bảo vệ môi trường học đường xanh sạch đẹp!
            </p>
          </div>
        )}
      </div>

      {/* Footer Navigation: Try Another Item or Back */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBackToStep3}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Xem lại phân tích Bước 3</span>
        </button>

        <button
          type="button"
          id="reset-new-waste-btn"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Thực hành với vật thể rác mới</span>
        </button>
      </div>
    </div>
  );
};
