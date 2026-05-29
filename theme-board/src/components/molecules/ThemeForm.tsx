//Reducerの利点
//状態を中心に設計するための道具
//stateも細かく考えると状態変化を中心にしているものだが
//「stateは値の更新」「Reducerは出来事・イベントの更新」に分けられる
//決定的な意味では状態変更の意味を、Reducerは名前にすることが出来る。
//設計視点においてReducerを使う事でだいぶ明確になる。
// useState は、
// 状態を持つための道具
// です。
// useReducer は、
// 状態がどう遷移するかを設計するための道具


//5/25追記
//リデューサの使い方は二種類に分けられ、
//1. データの状態
//2. 画面・操作の状態
//１がThemeForm（フォームの入力値の制御）,２がApp.tsx（画面のモーダルの状態）になる

import { useReducer } from "react";
import type { ThemeItem, ThemeCategory, ThemeStatus } from "../../types/types";
import { Modal } from "../atoms/Modal";
import { validateThemeForm } from "../../utils/validatethemeForm";
import { Input } from "../atoms/Input";
import SelectBox from "../atoms/SelectBox";
import Button from "../atoms/Button";
import TextArea from "../atoms/TextArea";
import "./ThemeEditForm.css"

//保存時に親へ渡すデータの型
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

//フォーム内部で持つ入力中データの型
export type ThemeFormState = {
  title: string;
  purpose: string;
  approach: string;
  category: ThemeCategory;
  status: ThemeStatus;
  focusPoint: string;
  nextAction: string;
  dueDate: string;

  // isSaving:boolean;
  // errorMessage:string | null;
}

type ThemeFormAction =
  | { type: "changeField"; field: keyof ThemeFormState; value: string }
  // | { type: "validateFailure"; payload: string }
  // | { type: "saveStart" }
  // | { type: "saveSuccess" }
  // | { type: "saveFailure"; payload: string }
  | { type: "reset"; payload: ThemeFormState };

//編集モードのときに「既存のThemeデータ」をフォームの初期入力値に変換する
function createInitialForm(initialTheme?: ThemeItem): ThemeFormState {
  return {
    title: initialTheme?.title ?? "",
    purpose: initialTheme?.purpose ?? "",
    approach: initialTheme?.approach ?? "",
    category: initialTheme?.category ?? "仕事",
    status: initialTheme?.status ?? "未着手",
    focusPoint: initialTheme?.focusPoint ?? "",
    nextAction: initialTheme?.nextAction ?? "",
    dueDate: initialTheme?.dueDate ?? "",
  };
}

//「現在のフォーム状態」と「送られてきた命令」を受け取って、次のフォーム状態を返す関数
// function reducer(現在のstate, action): 次のstate {
//   actionの種類によって
//   次のstateを返す
// }
function themeFormReducer(
  state: ThemeFormState,
  action: ThemeFormAction
): ThemeFormState {
  switch (action.type) {
    case "changeField":
      return {
        ...state,
        [action.field]: action.value
      }
    case "reset":
      return action.payload

    default:
      return state;
  }
}


type ThemeFormProps = {
  initialTheme?: ThemeItem;
  onSave: (input: ThemeFormInput) => void;
  onCancel: () => void;
};


export function ThemeForm({
  initialTheme,
  onSave,
  onCancel,
}: ThemeFormProps) {
  const isEditMode = initialTheme !== undefined;

  // const [title, setTitle] = useState(initialTheme?.title ?? "");
  // const [purpose, setPurpose] = useState(initialTheme?.purpose ?? "");
  // const [approach, setApproach] = useState(initialTheme?.approach ?? "");
  // const [category, setCategory] = useState<ThemeCategory>(
  //   initialTheme?.category ?? "仕事"
  // );
  // const [status, setStatus] = useState<ThemeStatus>(
  //   initialTheme?.status ?? "未着手"
  // );
  // const [focusPoint, setFocusPoint] = useState(initialTheme?.focusPoint ?? "");
  // const [nextAction, setNextAction] = useState(initialTheme?.nextAction ?? "");
  // const [dueDate, setDueDate] = useState(initialTheme?.dueDate ?? "");

  const [form, dispatch] = useReducer(
    themeFormReducer,
    initialTheme,
    createInitialForm
  );
  //const [form(現在のフォーム入力状態), dispatch(reducerに命令を送る関数)] = useReducer(
  //   themeFormReducer, // reducer（state更新のルール）
  //   initialTheme,     // initialArg（初期値を作る材料）
  //   createInitialForm // initFunction（初期値を作るための関数）
  // );

  const handleSave = () => {
    const validatedInput = validateThemeForm({
      title: form.title,
      purpose: form.purpose,
      approach: form.approach,
      category: form.category,
      status: form.status,
      focusPoint: form.focusPoint,
      nextAction: form.nextAction,
      dueDate: form.dueDate,
    });

    if (!validatedInput) {
      return;
    }

    onSave(validatedInput);
  };

 return (
  <Modal
    title={isEditMode ? "テーマを編集" : "テーマを追加"}
    onClose={onCancel}
  >
    <form
      className="theme-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <label className="theme-form__field">
        <span className="theme-form__label">タイトル</span>
        <Input
          value={form.title}
          onChange={(e) =>
            dispatch({
              type: "changeField",
              field: "title",
              value: e.target.value,
            })
          }
        />
      </label>

      <label className="theme-form__field">
        <span className="theme-form__label">目的</span>
        <TextArea
          value={form.purpose}
          onChange={(e) =>
            dispatch({
              type: "changeField",
              field: "purpose",
              value: e.target.value,
            })
          }
        />
      </label>

      <label className="theme-form__field">
        <span className="theme-form__label">アプローチ</span>
        <TextArea
          value={form.approach}
          onChange={(e) =>
            dispatch({
              type: "changeField",
              field: "approach",
              value: e.target.value,
            })
          }
        />
      </label>

      <div className="theme-form__grid">
        <label className="theme-form__field">
          <span className="theme-form__label">カテゴリ</span>
          <SelectBox
            value={form.category}
            onChange={(e) =>
              dispatch({
                type: "changeField",
                field: "category",
                value: e.target.value as ThemeCategory,
              })
            }
          >
            <option value="仕事">仕事</option>
            <option value="学習">学習</option>
            <option value="開発">開発</option>
            <option value="資格">資格</option>
            <option value="運動">運動</option>
            <option value="読書">読書</option>
            <option value="生活">生活</option>
            <option value="創作">創作</option>
          </SelectBox>
        </label>

        <label className="theme-form__field">
          <span className="theme-form__label">状態</span>
          <SelectBox
            value={form.status}
            onChange={(e) =>
              dispatch({
                type: "changeField",
                field: "status",
                value: e.target.value as ThemeStatus,
              })
            }
          >
            <option value="未着手">未着手</option>
            <option value="継続中">継続中</option>
            <option value="停滞中">停滞中</option>
            <option value="完了">完了</option>
            <option value="保留">保留</option>
          </SelectBox>
        </label>
      </div>

      <div className="theme-form__grid">
        <label className="theme-form__field">
          <span className="theme-form__label">今の焦点</span>
          <Input
            value={form.focusPoint}
            onChange={(e) =>
              dispatch({
                type: "changeField",
                field: "focusPoint",
                value: e.target.value,
              })
            }
          />
        </label>

        <label className="theme-form__field">
          <span className="theme-form__label">次の一手</span>
          <Input
            value={form.nextAction}
            onChange={(e) =>
              dispatch({
                type: "changeField",
                field: "nextAction",
                value: e.target.value,
              })
            }
          />
        </label>
      </div>

      <label className="theme-form__field theme-form__field--date">
        <span className="theme-form__label">期限</span>
        <Input
          type="date"
          value={form.dueDate}
          onChange={(e) =>
            dispatch({
              type: "changeField",
              field: "dueDate",
              value: e.target.value,
            })
          }
        />
      </label>

      <div className="theme-form__actions">
        <Button onClick={onCancel}>キャンセル</Button>
        <Button type="submit">{isEditMode ? "更新" : "追加"}</Button>
      </div>
    </form>
  </Modal>
);
}