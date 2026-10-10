import { useReducer, useState,useRef } from 'react'
import Header from './components/molecules/header'
import './App.css'
import { useTheme } from './hooks/useThemes'
import ThemeCardView from './components/molecules/ThemeCardView'
import { DailyRecordForm } from './components/molecules/DailyRecordForm'
import { DailyRecordList } from './components/molecules/DailyRecordList'
import { ThemeForm } from './components/molecules/ThemeForm'
import SelectBox from './components/atoms/SelectBox'
import { uiThemes, useUiTheme, type UiThemeId } from './hooks/useUiTheme'
import './themes/p5s.css'

const practicePages = [
  { id: "timer", label: "カウントダウンタイマー", component: "CountdownTimerPage" },
  { id: "color", label: "カラーピッカー", component: "ColorPickerPage" },
  { id: "markdown", label: "マークダウンエディタ", component: "MarkdownEditorPage" },
  { id: "reading", label: "読書記録", component: "ReadingLogPage" },
  { id: "rss", label: "RSSリーダー", component: "RssReaderPage" },
  { id: "drawing", label: "お絵かき", component: "DrawingCanvasPage" },
];

type ModalType =
  | null
  | "themeAdd"
  | "themeEdit"
  | "recordAdd"
  | "recordList"
  | "recordEdit";

type AppState = {
  modalType: ModalType;
  selectedThemeId: string | null;
  selectedRecordId: string | null;
};

type AppAction =
  | { type: "openThemeAdd" }
  | { type: "openThemeEdit"; payload: { themeId: string } }
  | { type: "openRecordAdd"; payload: { themeId: string } }
  | { type: "openRecordList"; payload: { themeId: string } }
  | { type: "openRecordEdit"; payload: { themeId: string; recordId: string } }
  | { type: "closeModal" }


const initialAppState: AppState = {
  modalType: null,
  selectedThemeId: null,
  selectedRecordId: null,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "openThemeAdd":
      return {
        modalType: "themeAdd",
        selectedThemeId: null,
        selectedRecordId: null
      }
    case "openThemeEdit":
      return {
        modalType: "themeEdit",
        selectedThemeId: action.payload.themeId,
        selectedRecordId: null,
      };

    case "openRecordAdd":
      return {
        modalType: "recordAdd",
        selectedThemeId: action.payload.themeId,
        selectedRecordId: null,
      };

    case "openRecordList":
      return {
        modalType: "recordList",
        selectedThemeId: action.payload.themeId,
        selectedRecordId: null,
      };

    case "openRecordEdit":
      return {
        modalType: "recordEdit",
        selectedThemeId: action.payload.themeId,
        selectedRecordId: action.payload.recordId,
      };

    case "closeModal":
      return {
        modalType: null,
        selectedThemeId: null,
        selectedRecordId: null,
      };

    default:
      return state;
  }
}


export function App() {

  const {
    items,
    actions
  } = useTheme();

  const [state, dispatch] = useReducer(appReducer, initialAppState);

  //見た目（UIテーマ）の切り替え
  const { uiTheme, setUiTheme } = useUiTheme();

  //検索用state
  const [searchText, setSearchText] = useState("");
  //入力された検索文字を使って、表示するテーマ一覧を絞り込む
  const filteredItems = items.filter((item) => {
    //検索文字の前後の空白を消して、小文字に統一する
    const keyword = searchText.trim().toLowerCase();
    //検索文字が空なら全部表示する
    if (keyword === "") {
      return true;
    }
    //当該itemに各項目に検索文字が含まれるか見る
    return (
      item.title.toLowerCase().includes(keyword) ||
      item.purpose.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword) ||
      item.status.toLowerCase().includes(keyword)
    )
  })

  const searchInputRef = useRef<HTMLInputElement>(null);

  // const [modalType, setModalType] = useState<ModalType>(null);
  // const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  // const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const selectedTheme =
    items.find((item) => item.id === state.selectedThemeId) ?? null;

  const selectedRecord =
    selectedTheme?.dailyRecords.find((record) => record.id === state.selectedRecordId) ?? null;

  return (
    <>
      <Header>
        アイコン、検索バー、別タブ、お知らせボタン、アカウント情報、ゴール追加ボタン
        ※Qiitaを参考にしてる
        <label>
          UIテーマ：
          <SelectBox
            value={uiTheme}
            onChange={(e) => setUiTheme(e.target.value as UiThemeId)}
            style={{ width: "auto" }}
          >
            {uiThemes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.label}
              </option>
            ))}
          </SelectBox>
        </label>
        <button onClick={() => dispatch({ type: "openThemeAdd" })}>
          テーマを追加
        </button>
        <section>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="テーマを検索"
          />

          {searchText !== "" && (
            <button onClick={() => {
              setSearchText("");
              searchInputRef.current?.focus();
              }}>
              クリア
            </button>
          )}
        </section>
      </Header>
      <main>
        {filteredItems.map((item) => (
          <ThemeCardView
            key={item.id}
            item={item}
            isModalOpen={state.modalType !== null}
            onEdit={() => dispatch({ type: "openThemeEdit", payload: { themeId: item.id } })}
            onAddRecord={() => dispatch({ type: "openRecordAdd", payload: { themeId: item.id } })}
            onShowRecords={() => dispatch({ type: "openRecordList", payload: { themeId: item.id } })}
            onDelete={() => {
              const ok = window.confirm(`本当に「${item.title}」を削除しますか？`);

              if (!ok) {
                return;
              }
              actions.handleDeleteTheme(item.id);
            }}
          />
        ))}
        {state.modalType === "themeAdd" && (
          <ThemeForm
            onSave={(input) => {
              actions.handleAddTheme(input);
              dispatch({ type: "closeModal" });
            }}
            onCancel={() => dispatch({ type: "closeModal" })}
          />
        )}
        {state.modalType === "themeEdit" && selectedTheme && (
          <ThemeForm
            initialTheme={selectedTheme}
            onSave={(input) => {
              actions.handleUpdateTheme({
                ...selectedTheme,
                ...input,
                updatedAt: new Date().toISOString(),
              });
              dispatch({ type: "closeModal" });
            }}
            onCancel={() => dispatch({ type: "closeModal" })}
          />
        )}

        {state.modalType === "recordAdd" && selectedTheme && (
          <DailyRecordForm
            onSave={(input) => {
              actions.handleAddDailyRecord(selectedTheme.id, input);
              dispatch({ type: "closeModal" });
            }}
            onCancel={() => dispatch({ type: "closeModal" })}
          />
        )}

        {state.modalType === "recordList" && selectedTheme && (
          <DailyRecordList
            recordList={selectedTheme.dailyRecords}
            onEditRecord={(recordId) => {
              dispatch({
                type: "openRecordEdit",
                payload: {
                  themeId: selectedTheme.id,
                  recordId,
                }
              });
            }}
            onDeleteRecord={(recordId) => {
              const ok = window.confirm("この記録を削除しますか？");
              if (!ok) return;

              actions.handleDeleteDailyRecord(selectedTheme.id, recordId);
            }}
            onCancel={() => dispatch({ type: "closeModal" })}
          />
        )}
        {state.modalType === "recordEdit" && selectedTheme && selectedRecord && (
          <DailyRecordForm
            initialRecord={selectedRecord}
            onSave={(input) => {
              actions.handleUpdateDailyRecord(
                selectedTheme.id,
                selectedRecord.id,
                input
              );
              dispatch({ type: "closeModal" });
            }}
            onCancel={() => dispatch({ type: "closeModal" })}
          />
        )}
        <aside>
        </aside>
      </main>
    </>
  )
}

export default App
