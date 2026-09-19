import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Search, ShieldCheck } from 'lucide-react';
import { TEACHER_CONFIRMED_RULES, RULE_DISCLAIMER } from '../data/rulesAndSamples';
import { SchoolRule } from '../types';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredRules = TEACHER_CONFIRMED_RULES.filter(
    (rule) =>
      rule.materialPattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.conditionPattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.sampleRegulation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.binName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                Bảng Quy Tắc Mẫu Phân Loại Rác Học Đường
              </h2>
              <p className="text-xs text-slate-500">
                Tài liệu tham khảo do tổ chuyên môn STEM / Giáo viên phụ trách biên soạn
              </p>
            </div>
          </div>
          <button
            type="button"
            id="close-rules-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Educational Disclaimer */}
        <div className="p-3.5 sm:p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold text-amber-950">LƯU Ý QUAN TRỌNG: </span>
            {RULE_DISCLAIMER}
            <span className="block mt-1 font-medium text-amber-800">
              * Nguyên tắc khoa học: Nếu vật thể không rõ ràng hoặc không có trong bảng quy định, hệ thống bắt buộc hiển thị trạng thái <strong>CHƯA XÁC ĐỊNH</strong>. Không được phán đoán tùy tiện!
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="rule-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo vật liệu (nhựa, xốp, giấy, kim loại...) hoặc tình trạng..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Rules Table Content */}
        <div className="overflow-y-auto p-3 sm:p-5 flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="p-2.5 sm:p-3 rounded-l-lg">Mã quy tắc</th>
                  <th className="p-2.5 sm:p-3">Vật liệu</th>
                  <th className="p-2.5 sm:p-3">Tình trạng vật thể</th>
                  <th className="p-2.5 sm:p-3">Quy định mẫu</th>
                  <th className="p-2.5 sm:p-3 rounded-r-lg">Gợi ý phân loại & Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRules.map((rule: SchoolRule) => {
                  const isRecycle = rule.suggestedBin === 'recycle';
                  const isOrganic = rule.suggestedBin === 'organic';
                  const isResidual = rule.suggestedBin === 'residual';
                  const isHazardous = rule.suggestedBin === 'hazardous';
                  const isUncertain = rule.suggestedBin === 'uncertain';

                  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (isRecycle) badgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
                  if (isOrganic) badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (isResidual) badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
                  if (isHazardous) badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
                  if (isUncertain) badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';

                  return (
                    <tr key={rule.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-2.5 sm:p-3 font-mono font-bold text-slate-500 whitespace-nowrap">
                        {rule.id}
                      </td>
                      <td className="p-2.5 sm:p-3 font-semibold text-slate-800">
                        {rule.materialPattern}
                      </td>
                      <td className="p-2.5 sm:p-3 text-slate-600">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {rule.conditionPattern}
                        </span>
                      </td>
                      <td className="p-2.5 sm:p-3 text-slate-700 font-medium">
                        {rule.sampleRegulation}
                      </td>
                      <td className="p-2.5 sm:p-3">
                        <div className="space-y-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold border ${badgeColor}`}
                          >
                            <CheckCircle className="w-3 h-3" />
                            {rule.binName}
                          </span>
                          {rule.requiredPreActions.length > 0 && (
                            <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-0.5">
                              {rule.requiredPreActions.map((action, idx) => (
                                <li key={idx}>{action}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Tổng số quy tắc chuẩn: {TEACHER_CONFIRMED_RULES.length}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors"
          >
            Đã hiểu, quay lại thực hành
          </button>
        </div>
      </div>
    </div>
  );
};
