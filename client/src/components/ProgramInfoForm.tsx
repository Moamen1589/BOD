import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PROGRAM_STATUS_OPTIONS,
  type ValidationErrors,
} from "@/lib/programValidation";

interface ProgramFormData {
  programName: string;
  actualCost: string;
  resourceEfficiency: string;
  costPerBeneficiary: string;
  startDate: string;
  endDate: string;
  status: string;
  duration: string;
}

interface ProgramInfoFormProps {
  form: ProgramFormData;
  validationErrors: ValidationErrors;
  isSubmitting?: boolean;
  onFieldChange: (field: keyof ProgramFormData, value: string) => void;
  onSaveProgram?: () => void;
  showSaveButton?: boolean;
  savedMessage?: string;
  colorClass?: "brand-gold" | "purple-500";
}

export function ProgramInfoForm({
  form,
  validationErrors,
  isSubmitting = false,
  onFieldChange,
  onSaveProgram,
  showSaveButton = false,
  savedMessage = "",
  colorClass = "brand-gold",
}: ProgramInfoFormProps) {
  const borderColor =
    colorClass === "purple-500"
      ? "focus:border-purple-500"
      : "focus:border-brand-gold";
  const iconColor =
    colorClass === "purple-500" ? "text-purple-500" : "text-brand-gold";

  return (
    <div className="bg-white rounded-3xl shadow-md p-8">
      <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-2">
        <Target className={`w-5 h-5 ${iconColor}`} /> معلومات البرنامج / المشروع
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-xs font-black text-brand-dark mb-2">
            اسم البرنامج / المشروع *
          </label>
          <input
            required
            value={form.programName}
            onChange={(e) => onFieldChange("programName", e.target.value)}
            placeholder="مثال: برنامج تدريب الشباب 2025"
            className={`w-full px-4 py-3 border-2 border-gray-100 rounded-xl ${borderColor} focus:outline-none text-brand-dark text-sm`}
          />
          {validationErrors.programName && (
            <p className="text-red-600 text-xs mt-1 font-bold">
              {validationErrors.programName}
            </p>
          )}
        </div>

        {[
          {
            label: "تكلفة البرنامج الفعلية (ريال)",
            field: "actualCost",
            placeholder: "0.00",
            type: "number",
          },
          {
            label: "كفاءة استخدام الموارد (%)",
            field: "resourceEfficiency",
            placeholder: "0 - 100",
            type: "number",
          },
          {
            label: "تكلفة المستفيد الفعلية (ريال)",
            field: "costPerBeneficiary",
            placeholder: "0.00",
            type: "number",
          },
          {
            label: "مدة التنفيذ (بالأيام)",
            field: "duration",
            placeholder: "0",
            type: "number",
          },
        ].map(({ label, field, placeholder, type }) => (
          <div key={field}>
            <label className="block text-xs font-black text-brand-dark mb-2">
              {label}
            </label>
            <input
              type={type}
              value={(form as any)[field]}
              onChange={(e) =>
                onFieldChange(field as keyof ProgramFormData, e.target.value)
              }
              placeholder={placeholder}
              className={`w-full px-4 py-3 border-2 border-gray-100 rounded-xl ${borderColor} focus:outline-none text-brand-dark text-sm`}
            />
            {validationErrors[field] && (
              <p className="text-red-600 text-xs mt-1 font-bold">
                {validationErrors[field]}
              </p>
            )}
          </div>
        ))}

        <div>
          <label className="block text-xs font-black text-brand-dark mb-2">
            تاريخ البدء
          </label>
          <input
            required
            type="date"
            value={form.startDate}
            onChange={(e) => onFieldChange("startDate", e.target.value)}
            className={`w-full px-4 py-3 border-2 border-gray-100 rounded-xl ${borderColor} focus:outline-none text-brand-dark text-sm`}
          />
          {validationErrors.startDate && (
            <p className="text-red-600 text-xs mt-1 font-bold">
              {validationErrors.startDate}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-black text-brand-dark mb-2">
            تاريخ الانتهاء
          </label>
          <input
            required
            type="date"
            value={form.endDate}
            onChange={(e) => onFieldChange("endDate", e.target.value)}
            className={`w-full px-4 py-3 border-2 border-gray-100 rounded-xl ${borderColor} focus:outline-none text-brand-dark text-sm`}
          />
          {validationErrors.endDate && (
            <p className="text-red-600 text-xs mt-1 font-bold">
              {validationErrors.endDate}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-black text-brand-dark mb-2">
            حالة المشروع
          </label>
          <select
            value={form.status}
            onChange={(e) => onFieldChange("status", e.target.value)}
            className={`w-full px-4 py-3 border-2 border-gray-100 rounded-xl ${borderColor} focus:outline-none text-brand-dark text-sm bg-white`}
          >
            {PROGRAM_STATUS_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {validationErrors.status && (
            <p className="text-red-600 text-xs mt-1 font-bold">
              {validationErrors.status}
            </p>
          )}
        </div>

        {showSaveButton && onSaveProgram && (
          <div className="md:col-span-2">
            <Button
              type="button"
              onClick={onSaveProgram}
              disabled={isSubmitting}
              className="w-full bg-brand-dark hover:bg-brand-dark/90 text-white py-4 rounded-2xl font-black text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "جارٍ حفظ البرنامج..." : "حفظ البرنامج / المشروع"}
            </Button>
          </div>
        )}

        {savedMessage && (
          <div className="md:col-span-2 rounded-xl border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm font-bold">
            {savedMessage}
          </div>
        )}
      </div>
    </div>
  );
}
