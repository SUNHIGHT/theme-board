export type ThemeStatus =
  | "未着手"
  | "継続中"
  | "停滞中"
  | "完了"
  | "保留";

export type ThemeCategory =
  | "仕事"
  | "学習"
  | "開発"
  | "資格"
  | "運動"
  | "読書"
  | "生活"
  | "創作";

export type DailyRecord = {
  id: string;
  date: string;

  result: "done" | "partial" | "not_done";

  did?: string;      // 今日やったこと
  stuck?: string;    // 詰まったこと
  learned?: string;  // わかったこと
  next?: string;     // 次にやること

  minutes?: number;
};

export type ThemeItem = {
  id: string;

  title: string;        // テーマ名
  purpose: string;      // なぜやるか
  approach?: string;    // どう進めるか

  category: ThemeCategory;
  status: ThemeStatus;

  focusPoint?: string;  // 今の注目点・今意識していること
  nextAction?: string;  // 次の一手

  dailyRecords: DailyRecord[];

  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};