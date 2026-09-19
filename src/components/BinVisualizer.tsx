import React from 'react';
import { Trash2, Recycle, Leaf, HelpCircle, AlertOctagon } from 'lucide-react';
import { BinType } from '../types';

interface BinVisualizerProps {
  selectedBin?: BinType;
  interactive?: boolean;
  onSelectBin?: (bin: BinType) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const BIN_DEFINITIONS: Record<
  BinType,
  {
    name: string;
    english: string;
    colorBg: string;
    borderColor: string;
    textColor: string;
    icon: React.ComponentType<{ className?: string }>;
    desc: string;
    accepted: string;
  }
> = {
  recycle: {
    name: 'Rác Tái Chế',
    english: 'Recyclables',
    colorBg: 'bg-sky-50',
    borderColor: 'border-sky-400',
    textColor: 'text-sky-800',
    icon: Recycle,
    desc: 'Chai nhựa sạch, lon nhôm, giấy khô, bìa carton',
    accepted: 'Yêu cầu: Rỗng & Sạch sẽ, không còn đọng nước hay dầu mỡ',
  },
  organic: {
    name: 'Rác Hữu Cơ',
    english: 'Organic Waste',
    colorBg: 'bg-emerald-50',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-800',
    icon: Leaf,
    desc: 'Thức ăn thừa, vỏ trái cây, bã chè, lá cây',
    accepted: 'Yêu cầu: Dễ phân hủy sinh học, không lẫn túi nilon',
  },
  residual: {
    name: 'Rác Còn Lại',
    english: 'Residual / General',
    colorBg: 'bg-slate-100',
    borderColor: 'border-slate-400',
    textColor: 'text-slate-800',
    icon: Trash2,
    desc: 'Hộp xốp dính dầu, túi bóng bẩn, khăn ướt, mẩu vụn',
    accepted: 'Không thể tái chế hoặc chi phí làm sạch quá cao',
  },
  hazardous: {
    name: 'Rác Nguy Hại',
    english: 'Hazardous Waste',
    colorBg: 'bg-rose-50',
    borderColor: 'border-rose-400',
    textColor: 'text-rose-800',
    icon: AlertOctagon,
    desc: 'Pin tiểu, bóng đèn huỳnh quang, bình xịt hóa chất',
    accepted: 'Thu gom riêng biệt tại trường, tuyệt đối không vứt chung',
  },
  uncertain: {
    name: 'Chưa Chắc / Chưa Xác Định',
    english: 'Uncertain / Need Check',
    colorBg: 'bg-amber-50',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-800',
    icon: HelpCircle,
    desc: 'Vật thể lạ, chất liệu phức tạp, chưa rõ tình trạng sạch hay bẩn',
    accepted: 'Nguyên tắc STEM: Cần hỏi thầy cô hoặc làm rỗng kiểm chứng',
  },
};

export const BinVisualizer: React.FC<BinVisualizerProps> = ({
  selectedBin,
  interactive = false,
  onSelectBin,
  size = 'md',
}) => {
  const binKeys: BinType[] = ['recycle', 'organic', 'residual', 'uncertain'];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
      {binKeys.map((key) => {
        const bin = BIN_DEFINITIONS[key];
        const Icon = bin.icon;
        const isSelected = selectedBin === key;

        return (
          <button
            key={key}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onSelectBin && onSelectBin(key)}
            className={`flex flex-col text-left p-3 rounded-xl border-2 transition-all relative ${
              isSelected
                ? `${bin.borderColor} ${bin.colorBg} ring-2 ring-offset-1 ring-emerald-500 shadow-sm`
                : interactive
                ? 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
                : 'border-slate-100 bg-white opacity-90'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${bin.colorBg} ${bin.textColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              {isSelected && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white">
                  Đã chọn
                </span>
              )}
            </div>

            <div className="font-bold text-xs sm:text-sm text-slate-800 leading-tight">
              {bin.name}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              {bin.desc}
            </div>
          </button>
        );
      })}
    </div>
  );
};
