//役割
// itemsを持つ
// getThemesで取得する
// add/update/deleteする
// DailyRecordをadd/update/deleteする

// import { produce } from 'immer'
import { useEffect, useState } from "react";
import type { ThemeItem, ThemeCategory, ThemeStatus, DailyRecord } from "../types/types";
import { getThemes, saveTheme, deleteTheme } from './../apis/themesApi'

export type ThemeFormInput = {
  title: string;
  purpose: string;
  approach?: string;
  category: ThemeCategory;
  status: ThemeStatus;
  focusPoint?: string;
  nextAction?: string;
  dueDate?: string;
};

export function useTheme() {
  const [items, setItems] = useState<ThemeItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchItems = await getThemes();
      setItems(fetchItems);
    }
    fetchData();
  }, [])

  const handleAddTheme = async (input: ThemeFormInput) => {
    const now = new Date().toISOString();

    const newItem: ThemeItem = {
      id: crypto.randomUUID(),
      ...input,
      dailyRecords: [],
      createdAt: now,
      updatedAt: now,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    await saveTheme(newItem);
  };

  const handleUpdateTheme = async (updatedItem: ThemeItem) => {
    setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    await saveTheme(updatedItem)
  }

  const handleDeleteTheme = async (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    await deleteTheme(id)
  }

  //ここからが弱い→二重構造にはimmerを使えるの！！
  //指定したThemeに、DailyRecordを一件追加する
  function handleAddDailyRecord(
    themeId: string,
    input: {
      date: string;
      result: "done" | "partial" | "not_done";
      did?: string;
      stuck?: string;
      learned?: string;
      next?: string;
      minutes?: number;
    }
  ) {
    const now = new Date().toISOString();

    //入れる予定の
    const newRecord: DailyRecord = {
      id: crypto.randomUUID(),
      ...input,
    };

    let updatedTheme: ThemeItem | null = null;

// mapは、元のitemsを1件ずつ見て、新しいリストを作る
// 対象外のitemはそのまま新しいリストに入れる
// 対象のitemだけ、新しいオブジェクト updatedTheme として作り直す
// dailyRecordsも、元の配列をコピーしてnewRecordを追加した新しい配列にする
    const nextItems = items.map((item) => {
      if (item.id !== themeId) {
        return item;
      }

      //更新後一件のテーマ
      updatedTheme = {
        ...item,
        dailyRecords: [...item.dailyRecords, newRecord],
        nextAction: input.next || item.nextAction,
        updatedAt: now,
      };
      //returnしているが、map内なので、themeごとにこのreturnが発生する。
      return updatedTheme;
    });
    if (!updatedTheme) {
      return;
    }
    setItems(nextItems);
    saveTheme(updatedTheme);
  }

  const handleUpdateDailyRecord = async (
    themeId: string,
    recordId: string,
    input: {
      date: string;
      result: "done" | "partial" | "not_done";
      did?: string;
      stuck?: string;
      learned?: string;
      next?: string;
      minutes?: number;
    }
  ) => {
    const now = new Date().toISOString();

    let updatedTheme: ThemeItem | null = null;

    const nextItems = items.map((item) => {
      if (item.id !== themeId) {
        return item;
      }

      updatedTheme = {
        ...item,
        dailyRecords: item.dailyRecords.map((record) => {
          if (record.id !== recordId) {
            return record;
          }

          return {
            ...record,
            ...input,
          };
        }),
        nextAction: input.next || item.nextAction,
        updatedAt: now,
      };

      return updatedTheme;
    });

    if (!updatedTheme) {
      return;
    }

    setItems(nextItems);
    await saveTheme(updatedTheme);
  };

  const handleDeleteDailyRecord = async (
    themeId: string,
    recordId: string
  ) => {
    const now = new Date().toISOString();

    const targetTheme = items.find((item) => item.id === themeId);

    if (!targetTheme) {
      return;
    }

    const updatedTheme: ThemeItem = {
      ...targetTheme,
      dailyRecords: targetTheme.dailyRecords.filter(
        (record) => record.id !== recordId
      ),
      updatedAt: now,
    };

    const nextItems = items.map((item) =>
      item.id === themeId ? updatedTheme : item
    );

    setItems(nextItems);
    await saveTheme(updatedTheme);
  };

  return {
    items,
    actions: {
      handleAddDailyRecord,
      handleAddTheme,
      handleDeleteDailyRecord,
      handleDeleteTheme,
      handleUpdateDailyRecord,
      handleUpdateTheme
    }
  };
}