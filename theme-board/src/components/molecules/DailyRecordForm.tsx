import { useState } from "react";
import type { DailyRecord } from "../../types/types";
import { Modal } from "../atoms/Modal";
import SelectBox from "../atoms/SelectBox";
import TextArea from "../atoms/TextArea";
import { Input } from "../atoms/Input";
import Button from "../atoms/Button";
import "./DailyRecordForm.css"

type DailyRecordInput = Omit<DailyRecord, "id">;

type DailyRecordFormProps = {
  initialRecord?: DailyRecord;
  onSave: (input: DailyRecordInput) => void;
  onCancel: () => void;
};

export function DailyRecordForm({
  initialRecord,
  onSave,
  onCancel,
}: DailyRecordFormProps) {
  const isEditMode = initialRecord !== undefined;

  const [date, setDate] = useState(
    initialRecord?.date ?? new Date().toISOString().slice(0, 10)
  );

  const [result, setResult] = useState<"done" | "partial" | "not_done">(
    initialRecord?.result ?? "partial"
  );

  const [did, setDid] = useState(initialRecord?.did ?? "");
  const [stuck, setStuck] = useState(initialRecord?.stuck ?? "");
  const [learned, setLearned] = useState(initialRecord?.learned ?? "");
  const [next, setNext] = useState(initialRecord?.next ?? "");

  const [minutes, setMinutes] = useState(
    initialRecord?.minutes !== undefined ? String(initialRecord.minutes) : ""
  );

  const handleSave = () => {
    const input: DailyRecordInput = {
      date,
      result,
      did: did.trim() || undefined,
      stuck: stuck.trim() || undefined,
      learned: learned.trim() || undefined,
      next: next.trim() || undefined,
      minutes: minutes.trim() === "" ? undefined : Number(minutes),
    };

    onSave(input);
  };

  return (
    <Modal
      title={isEditMode ? "記録を編集" : "今日の記録を書く"}
      onClose={onCancel}
    >
      <form
        className="daily-record-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="daily-record-form__grid">
          <label className="daily-record-form__field">
            <span className="daily-record-form__label">日付</span>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <label className="daily-record-form__field">
            <span className="daily-record-form__label">結果</span>
            <SelectBox
              value={result}
              onChange={(e) =>
                setResult(e.target.value as "done" | "partial" | "not_done")
              }
            >
              <option value="done">できた</option>
              <option value="partial">一部できた</option>
              <option value="not_done">できなかった</option>
            </SelectBox>
          </label>

          <label className="daily-record-form__field">
            <span className="daily-record-form__label">作業時間（分）</span>
            <Input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </label>
        </div>

        <label className="daily-record-form__field">
          <span className="daily-record-form__label">今日やったこと</span>
          <TextArea
            value={did}
            onChange={(e) => setDid(e.target.value)}
          />
        </label>

        <label className="daily-record-form__field">
          <span className="daily-record-form__label">詰まったこと</span>
          <TextArea
            value={stuck}
            onChange={(e) => setStuck(e.target.value)}
          />
        </label>

        <label className="daily-record-form__field">
          <span className="daily-record-form__label">分かったこと</span>
          <TextArea
            value={learned}
            onChange={(e) => setLearned(e.target.value)}
          />
        </label>

        <label className="daily-record-form__field">
          <span className="daily-record-form__label">次にやること</span>
          <TextArea
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
        </label>

        <div className="daily-record-form__actions">
          <Button onClick={onCancel}>キャンセル</Button>
          <Button type="submit">
            {isEditMode ? "更新" : "追加"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}