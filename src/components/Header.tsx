import React from 'react';
import { Sparkles, BookOpen, CheckCircle2, Eye, Brain, Cpu, Award } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  onOpenRules: () => void;
  maxReachedStep: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onStepClick,
  onOpenRules,
  maxReachedStep,
}) => {
  const steps = [
    { id: 1, title: 'Bước 1', label: 'Quan sát vật thể', icon: Eye },
    { id: 2, title: 'Bước 2', label: 'Em đoán trước', icon: Brain },
    { id: 3, title: 'Bước 3', label: 'AI & Quy tắc', icon: Cpu },
    { id: 4, title: 'Bước 4', label: 'Kết quả & Quyết định', icon: Award },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                  AI Phân Loại Rác
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  THCS STEM
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Học bằng quan sát và kiểm chứng khoa học
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenRules}
              id="view-rules-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              title="Xem bảng quy tắc do giáo viên xác nhận"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>Bảng quy tắc mẫu của trường</span>
            </button>
          </div>
        </div>

        {/* 4-Step Progress Indicator */}
        <nav aria-label="Tiến trình học tập" className="pt-3">
          <div className="grid grid-cols-4 gap-2">
            {steps.map((step) => {
              const isCurrent = currentStep === step.id;
              const isDone = currentStep > step.id;
              const isAccessible = step.id <= maxReachedStep;
              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  id={`step-nav-btn-${step.id}`}
                  onClick={() => isAccessible && onStepClick(step.id)}
                  disabled={!isAccessible}
                  className={`flex flex-col sm:flex-row items-center sm:items-start text-left gap-1.5 sm:gap-2.5 p-2 rounded-lg transition-all text-xs ${
                    isCurrent
                      ? 'bg-emerald-50/80 border border-emerald-300 text-emerald-950 font-semibold'
                      : isDone
                      ? 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer'
                      : 'border border-transparent text-slate-400 cursor-not-allowed opacity-70'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-emerald-700 text-white ring-2 ring-emerald-200'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                  </div>
                  <div className="text-center sm:text-left min-w-0">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      {step.title}
                    </span>
                    <span className="truncate block font-medium">
                      {step.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};
