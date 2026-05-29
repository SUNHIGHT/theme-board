import type { ThemeCategory, ThemeStatus } from "../types/types";

type ThemeFormInput = {
  title: string;
  purpose: string;
  approach: string;
  category: ThemeCategory;
  status: ThemeStatus;
  focusPoint: string;
  nextAction: string;
  dueDate: string;
};

export function validateThemeForm(input: ThemeFormInput) {
  const trimmedTitle = input.title.trim();
  const trimmedPurpose = input.purpose.trim();
  const trimmedApproach = input.approach.trim();
  const trimmedFocusPoint = input.focusPoint.trim();
  const trimmedNextAction = input.nextAction.trim();
  const trimmedDueDate = input.dueDate.trim();

  if (
    trimmedTitle === "" ||
    trimmedPurpose === "" ||
    trimmedApproach === ""
  ) {
    alert("タイトル、目的、アプローチは必須です。");
    return null;
  }

  if (trimmedDueDate !== "" && isNaN(Date.parse(trimmedDueDate))) {
    alert("期限は有効な日付形式で入力してください。");
    return null;
  }

  return {
    title: trimmedTitle,
    purpose: trimmedPurpose,
    approach: trimmedApproach,
    category: input.category,
    status: input.status,
    focusPoint: trimmedFocusPoint || undefined,
    nextAction: trimmedNextAction || undefined,
    dueDate: trimmedDueDate || undefined,
  };
}