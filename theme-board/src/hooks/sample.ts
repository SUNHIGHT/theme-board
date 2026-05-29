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

  const newRecord: DailyRecord = {
    id: crypto.randomUUID(),
    ...input,
  };

  let updatedTheme: ThemeItem | null = null;

// map      = 各要素を変換して、新しいリストを作る
// filter   = 条件に合う要素だけ残して、新しいリストを作る
// produce  = draftに変更を書いて、新しいリストを作る

//itemsはコピー元のリスト、draftは新しく作るコピー先のリスト
//つまりこのproduceの時点ですでに新しくコピペしたリストを作っているので、.pushとか=(代入)とかを遠慮なく使えるということ。
// draft内ではpushや代入で変更を書ける
// produceは、その変更を反映した新しいリスト nextItems を返す
  const nextItems = produce(items, (draft) => {
    //更新後一件のテーマ
    const targetTheme = draft.find((item) => item.id === themeId);

    if (!targetTheme) {
      return;
    }

    //既存の一件に上書き
    targetTheme.dailyRecords.push(newRecord);
    targetTheme.nextAction = input.next || targetTheme.nextAction;
    targetTheme.updatedAt = now;

    // saveTheme用にコピーしておく
    updatedTheme = structuredClone(targetTheme);
  });

  if (!updatedTheme) {
    return;
  }

  setItems(nextItems);
  saveTheme(updatedTheme);
}