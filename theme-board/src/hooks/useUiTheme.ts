//役割
// 画面の見た目（UIテーマ）を切り替える
// 選んだUIテーマを<html data-ui-theme="...">に反映し、localStorageに保存する
// ※ThemeItem（学習テーマ）とは別物なので「UiTheme」と呼ぶ

import { useEffect, useState } from "react";

export const uiThemes = [
  { id: "default", label: "デフォルト" },
  { id: "p5s", label: "ペルソナ5 スクランブル" },
] as const;

export type UiThemeId = (typeof uiThemes)[number]["id"];

const STORAGE_KEY = "ui-theme";

function isUiThemeId(value: string | null): value is UiThemeId {
  return uiThemes.some((theme) => theme.id === value);
}

function loadUiTheme(): UiThemeId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isUiThemeId(saved)) {
      return saved;
    }
  } catch {
    // localStorageが使えない環境ではデフォルトにする
  }
  return "default";
}

export function useUiTheme() {
  const [uiTheme, setUiTheme] = useState<UiThemeId>(loadUiTheme);

  useEffect(() => {
    document.documentElement.dataset.uiTheme = uiTheme;
    try {
      localStorage.setItem(STORAGE_KEY, uiTheme);
    } catch {
      // 保存できなくても表示の切り替えはできる
    }
  }, [uiTheme]);

  return { uiTheme, setUiTheme };
}
