import type { ThemeItem } from "../types/types";

const API_URL = "https://d2mqp4fwcyp75v2ehlut65sacq0rgfzy.lambda-url.ap-northeast-1.on.aws/";
// const STORAGE_KEY = "theme-items";

// const sampleThemes: ThemeItem[] = [
//   {
//     id: "sample-1",
//     title: "React案件準備",
//     purpose: "既存Reactコードを読んで、安全に修正できる状態になる",
//     approach: "公式ドキュメントの復習と、テーマ管理アプリの改修を並行して進める",
//     category: "仕事",
//     status: "継続中",
//     focusPoint: "useEffect、props、カスタムフック、localStorage周りの整理",
//     nextAction: "DailyRecord追加モーダルの動作確認をする",
//     dailyRecords: [
//       {
//         id: "record-sample-1",
//         date: "2026-05-18",
//         result: "partial",
//         did: "ThemeItemとDailyRecordの型を整理した",
//         stuck: "親から子へ渡すonSaveの引数の流れが少し混乱した",
//         learned: "子コンポーネントでonSave(input)を呼ぶと、親側の関数に値を渡せる",
//         next: "DailyRecordFormから記録を追加できるか確認する",
//         minutes: 90,
//       },
//     ],
//     dueDate: "2026-05-31",
//     createdAt: "2026-05-18T00:00:00.000Z",
//     updatedAt: "2026-05-18T00:00:00.000Z",
//   },
//   {
//     id: "sample-2",
//     title: "AWS SAA対策",
//     purpose: "AWSの設計基礎を理解し、資格取得と実務理解につなげる",
//     approach: "問題演習と小規模なAWS構築を組み合わせて進める",
//     category: "資格",
//     status: "未着手",
//     focusPoint: "VPC、EC2、S3、CloudFrontの基本構成",
//     nextAction: "VPCとサブネットの役割を復習する",
//     dailyRecords: [],
//     dueDate: "2026-06-30",
//     createdAt: "2026-05-18T00:00:00.000Z",
//     updatedAt: "2026-05-18T00:00:00.000Z",
//   },
//   {
//     id: "sample-3",
//     title: "読書ログ",
//     purpose: "読んだ本の感想や知識を記録し、自分の考えの資産にする",
//     approach: "読了後に感想、印象に残った点、次に読みたい本を記録する",
//     category: "読書",
//     status: "継続中",
//     focusPoint: "幻想文学、ミステリ、フランス文学周辺の理解を深める",
//     nextAction: "最近読んだ本の所感を1件記録する",
//     dailyRecords: [
//       {
//         id: "record-sample-2",
//         date: "2026-05-17",
//         result: "done",
//         did: "サド、澁澤龍彦、ゴシック文学周辺について整理した",
//         learned: "文学作品は背景となる歴史や思想とセットで読むと理解しやすい",
//         next: "庭園や隠秘学に関する入門書を探す",
//         minutes: 45,
//       },
//     ],
//     createdAt: "2026-05-18T00:00:00.000Z",
//     updatedAt: "2026-05-18T00:00:00.000Z",
//   },
// ];

// 将来AWS接続用
// export async function getThemes(): Promise<ThemeItem[]> {
//   try {
//     const res = await fetch(API_URL);
//     if (!res.ok) {
//       throw new Error("取得失敗");
//     }
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error("データ取得失敗", error);
//     throw error;
//   }
// }

// export async function saveTheme(item: ThemeItem): Promise<void> {
//   try {
//     const res = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(item),
//     });
//
//     if (!res.ok) {
//       throw new Error("保存失敗");
//     }
//   } catch (error) {
//     console.error("データ保存失敗:", error);
//     throw error;
//   }
// }

// export async function getThemes(): Promise<ThemeItem[]> {
//   const data = localStorage.getItem(STORAGE_KEY);

//   if (!data) {
//     return sampleThemes;
//   }

//   try {
//     const parsed = JSON.parse(data);

//     if (!Array.isArray(parsed)) {
//       return sampleThemes;
//     }

//     return parsed as ThemeItem[];
//   } catch (error) {
//     console.error("localStorageの読み込みに失敗しました:", error);
//     return sampleThemes;
//   }
// }

// export async function saveTheme(item: ThemeItem): Promise<void> {
//   const themes = await getThemes();

//   const exists = themes.some((theme) => theme.id === item.id);

//   const nextThemes = exists
//     ? themes.map((theme) => (theme.id === item.id ? item : theme))
//     : [...themes, item];

//   localStorage.setItem(STORAGE_KEY, JSON.stringify(nextThemes));
// }

// export async function deleteTheme(id: string): Promise<void> {
//   const themes = await getThemes();

//   const nextThemes = themes.filter((theme) => theme.id !== id);

//   localStorage.setItem(STORAGE_KEY, JSON.stringify(nextThemes));
// }
export async function getThemes(): Promise<ThemeItem[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("テーマ取得に失敗しました");
  }

  return await res.json();
}

export async function saveTheme(item: ThemeItem): Promise<void> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!res.ok) {
    throw new Error("テーマ保存に失敗しました");
  }
}

export async function deleteTheme(id: string): Promise<void> {
  const res = await fetch(`${API_URL}?id=${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("テーマ削除に失敗しました");
  }
}