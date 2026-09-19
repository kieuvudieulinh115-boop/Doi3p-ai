import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Check,
  Edit3,
  Sparkles,
  Layers,
  FileText,
  AlertCircle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { ObservedWasteInput, WasteCondition, SampleWasteItem } from '../types';
import { SAMPLE_WASTE_ITEMS } from '../data/rulesAndSamples';

interface Step1ObserveProps {
  inputData: ObservedWasteInput;
  onUpdateInput: (data: Partial<ObservedWasteInput>) => void;
  onConfirm: () => void;
  selectedSampleId: string | null;
  onSelectSample: (sample: SampleWasteItem) => void;
}

export const Step1Observe: React.FC<Step1ObserveProps> = ({
  inputData,
  onUpdateInput,
  onConfirm,
  selectedSampleId,
  onSelectSample,
}) => {
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conditionOptions: {
    id: WasteCondition;
    label: string;
    sublabel: string;
    color: string;
    activeBorder: string;
  }[] = [
    {
      id: 'clean',
      label: 'Sạch sẽ / Rỗng khô',
      sublabel: 'Không còn chất lỏng, không dính dầu mỡ hay thức ăn',
      color: 'hover:border-emerald-300',
      activeBorder: 'border-emerald-500 bg-emerald-50/60 text-emerald-900',
    },
    {
      id: 'dirty',
      label: 'Bẩn / Dính tạp chất',
      sublabel: 'Dính nhiều dầu mỡ, thức ăn, đất cát khó rửa sạch',
      color: 'hover:border-amber-300',
      activeBorder: 'border-amber-500 bg-amber-50/60 text-amber-900',
    },
    {
      id: 'has_content',
      label: 'Còn chất bên trong',
      sublabel: 'Còn nước uống, sữa, cặn chất lỏng hoặc đồ ăn',
      color: 'hover:border-sky-300',
      activeBorder: 'border-sky-500 bg-sky-50/60 text-sky-900',
    },
    {
      id: 'uncertain',
      label: 'Chưa xác định',
      sublabel: 'Mờ nhạt, khó nhìn hoặc chưa kiểm tra bên trong',
      color: 'hover:border-slate-300',
      activeBorder: 'border-slate-500 bg-slate-100 text-slate-900',
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpdateInput({
          imageUrl: base64,
          imageBase64: base64,
          objectName: inputData.objectName || file.name.replace(/\.[^/.]+$/, ''),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const isDataFilled =
    inputData.objectName.trim().length > 0 ||
    inputData.description.trim().length > 0 ||
    Boolean(inputData.imageUrl);

  return (
    <div className="space-y-6">
      {/* Introduction Guidance */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              Bước 1: Quan Sát Vật Thể Rác Thải
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Là một nhà khoa học STEM trẻ tuổi, em hãy quan sát kỹ hình dáng, vật liệu và tình trạng của vật thể. Em có thể chọn mẫu giả lập có sẵn hoặc tự nhập mô tả/tải ảnh của mình.
            </p>
          </div>
        </div>

        {/* Preset Sample Waste Carousel */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Mẫu vật thể mô phỏng trong học đường:
            </span>
            <span className="text-[11px] text-slate-500">Bấm để nạp dữ liệu nhanh</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {SAMPLE_WASTE_ITEMS.map((sample) => {
              const isSelected = selectedSampleId === sample.id;
              return (
                <button
                  key={sample.id}
                  id={`sample-item-${sample.id}`}
                  type="button"
                  onClick={() => onSelectSample(sample)}
                  className={`p-2 rounded-xl text-left border transition-all flex flex-col items-center text-center gap-1.5 group ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-300 ring-offset-1 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="w-full h-16 rounded-lg overflow-hidden bg-slate-100 relative">
                    <img
                      src={sample.imageUrl}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-800 line-clamp-2 leading-tight">
                    {sample.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Observation Inputs Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            Nhập thông tin quan sát thực tế
          </h3>

          {/* Object Name & Predicted Material */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="object-name-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Tên vật thể quan sát được <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="object-name-input"
                value={inputData.objectName}
                onChange={(e) => onUpdateInput({ objectName: e.target.value })}
                placeholder="Ví dụ: Chai nước, Vỏ hộp sữa, Hộp cơm..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
              />
            </div>
            <div>
              <label htmlFor="material-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Vật liệu dự đoán ban đầu
              </label>
              <input
                type="text"
                id="material-input"
                value={inputData.materialPredicted}
                onChange={(e) => onUpdateInput({ materialPredicted: e.target.value })}
                placeholder="Ví dụ: Nhựa PET, Nhôm, Giấy, Xốp..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Condition Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Tình trạng của vật thể <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {conditionOptions.map((opt) => {
                const isActive = inputData.condition === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    id={`condition-opt-${opt.id}`}
                    onClick={() => onUpdateInput({ condition: opt.id })}
                    className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                      isActive
                        ? opt.activeBorder
                        : `border-slate-200 bg-white ${opt.color}`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        {opt.label}
                      </span>
                      {isActive && (
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">
                      {opt.sublabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <label htmlFor="description-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả chi tiết bằng văn bản
            </label>
            <textarea
              id="description-input"
              rows={3}
              value={inputData.description}
              onChange={(e) => onUpdateInput({ description: e.target.value })}
              placeholder="Ví dụ: Một chai nhựa trong suốt dung tích 500ml, bên trong còn khoảng một ít nước lọc dưới đáy, nắp chai còn nguyên vẹn..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Optional Image Upload or Simulated Photo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ảnh vật thể (chụp thực tế hoặc ảnh giả lập)
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="file-upload-input"
              />
              <button
                type="button"
                id="trigger-file-upload"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                <span>Tải ảnh từ máy / điện thoại</span>
              </button>
              {inputData.imageUrl && (
                <button
                  type="button"
                  onClick={() => onUpdateInput({ imageUrl: undefined, imageBase64: undefined })}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Xóa ảnh
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: "Thông tin em đã cung cấp" preview */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-md flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3 mb-4">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Thông tin em đã cung cấp
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200">
                  Dữ liệu quan sát
                </span>
              </div>

              {/* Preview Content */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                {inputData.imageUrl && (
                  <div className="w-full h-36 rounded-xl overflow-hidden bg-emerald-900 border border-emerald-700">
                    <img
                      src={inputData.imageUrl}
                      alt="Ảnh vật thể quan sát"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-emerald-300 font-medium">Vật thể:</span>
                    <span className="font-bold text-white text-right">
                      {inputData.objectName || 'Chưa nhập tên vật thể'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-emerald-300 font-medium">Vật liệu dự đoán:</span>
                    <span className="font-semibold text-emerald-100 text-right">
                      {inputData.materialPredicted || 'Chưa xác định'}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-emerald-300 font-medium">Tình trạng:</span>
                    <span className="font-semibold text-white text-right">
                      {conditionOptions.find((c) => c.id === inputData.condition)?.label}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-emerald-200/90 bg-emerald-900/40 p-3 rounded-xl border border-emerald-800/60">
                  <span className="font-semibold text-emerald-300 block mb-1">Mô tả:</span>
                  <p className="italic leading-relaxed">
                    "{inputData.description || 'Chưa có mô tả chi tiết.'}"
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmation Action Button */}
            <div className="mt-6 pt-4 border-t border-emerald-800/80 space-y-2">
              <button
                type="button"
                id="confirm-step1-btn"
                onClick={onConfirm}
                disabled={!inputData.objectName.trim()}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  inputData.objectName.trim()
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 cursor-pointer'
                    : 'bg-emerald-800/60 text-emerald-400 cursor-not-allowed'
                }`}
              >
                <span>Xác nhận thông tin & Sang Bước 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {!inputData.objectName.trim() && (
                <p className="text-[11px] text-amber-300 text-center">
                  * Em hãy nhập tên vật thể hoặc chọn mẫu trước khi xác nhận nhé!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
