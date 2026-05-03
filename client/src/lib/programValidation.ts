export const MIN_GOVERNANCE_YEAR = 2020;

export const GOVERNANCE_STATUS_MAP: Record<
  string,
  "planning" | "in_progress" | "completed" | "suspended"
> = {
  "في المرحلة التخطيطية": "planning",
  "جارٍ التنفيذ": "in_progress",
  مكتمل: "completed",
  متوقف: "suspended",
};

export const PROGRAM_STATUS_OPTIONS = [
  "مكتمل",
  "جارٍ التنفيذ",
  "في المرحلة التخطيطية",
  "متوقف",
];

export const GOVERNANCE_PROGRAMS_ENDPOINT =
  "https://gold-weasel-489740.hostingersite.com/api/governance/programs";

export type ValidationErrors = Record<string, string>;

export const isValidNumber = (value: string, min = 0) => {
  if (value.trim() === "") return false;
  const num = Number(value);
  return !Number.isNaN(num) && num >= min;
};

export const validateProgramFields = (form: {
  programName: string;
  actualCost: string;
  resourceEfficiency: string;
  duration: string;
  startDate: string;
  endDate: string;
  status: string;
}) => {
  const errors: ValidationErrors = {};

  if (!form.programName.trim()) {
    errors.programName = "اسم البرنامج مطلوب";
  }

  if (!isValidNumber(form.actualCost, 0)) {
    errors.actualCost = "أدخل تكلفة فعلية صحيحة (0 أو أكبر)";
  }

  if (
    !isValidNumber(form.resourceEfficiency, 0) ||
    Number(form.resourceEfficiency) > 100
  ) {
    errors.resourceEfficiency = "كفاءة الموارد يجب أن تكون بين 0 و 100";
  }

  if (!isValidNumber(form.duration, 1)) {
    errors.duration = "مدة التنفيذ يجب أن تكون رقمًا أكبر من 0";
  }

  if (!form.startDate) {
    errors.startDate = "تاريخ البدء مطلوب";
  }

  if (!form.endDate) {
    errors.endDate = "تاريخ الانتهاء مطلوب";
  }

  if (form.startDate && form.endDate && form.endDate < form.startDate) {
    errors.endDate = "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء";
  }

  const startYear = Number(form.startDate?.split("-")[0]);
  if (Number.isFinite(startYear) && startYear < MIN_GOVERNANCE_YEAR) {
    errors.startDate = "سنة البدء يجب أن تكون 2020 أو أكبر";
  }

  if (!GOVERNANCE_STATUS_MAP[form.status]) {
    errors.status = "حالة المشروع غير صحيحة";
  }

  return errors;
};
