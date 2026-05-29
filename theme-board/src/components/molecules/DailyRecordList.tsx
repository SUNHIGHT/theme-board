import type { DailyRecord } from "../../types/types";
import { Modal } from '../atoms/Modal';
import Panel from "../atoms/Panel";
import Button from "../atoms/Button";
import "./DailyRecordList.css"

type DailyRecordListProps = {
  recordList: DailyRecord[];
  onEditRecord: (recordId: string) => void;
  onDeleteRecord: (recordId: string) => void;
  onCancel: () => void;
};

function formatResult(result: DailyRecord["result"]) {
  switch (result) {
    case "done":
      return "できた";
    case "partial":
      return "一部できた";
    case "not_done":
      return "できなかった";
    default:
      return result;
  }
}
export function DailyRecordList({
    recordList,
    onEditRecord,
    onDeleteRecord,
    onCancel,
}: DailyRecordListProps) {
   return (
    <Modal title="記録一覧" onClose={onCancel}>
      <div className="daily-record-list">
        {recordList.length === 0 ? (
          <p className="daily-record-list__empty">
            まだ記録はありません。
          </p>
        ) : (
          recordList.map((record) => (
            <Panel key={record.id}>
              <article className="daily-record-card">
                <header className="daily-record-card__header">
                  <div>
                    <h3 className="daily-record-card__date">
                      {record.date}
                    </h3>
                    <p className="daily-record-card__minutes">
                      作業時間：
                      {record.minutes !== undefined
                        ? `${record.minutes}分`
                        : "未入力"}
                    </p>
                  </div>

                  <span className="daily-record-card__result">
                    {formatResult(record.result)}
                  </span>
                </header>

                <dl className="daily-record-card__details">
                  <div className="daily-record-card__detail">
                    <dt>今日やったこと</dt>
                    <dd>{record.did || "未入力"}</dd>
                  </div>

                  <div className="daily-record-card__detail">
                    <dt>詰まったこと</dt>
                    <dd>{record.stuck || "未入力"}</dd>
                  </div>

                  <div className="daily-record-card__detail">
                    <dt>分かったこと</dt>
                    <dd>{record.learned || "未入力"}</dd>
                  </div>

                  <div className="daily-record-card__detail">
                    <dt>次にやること</dt>
                    <dd>{record.next || "未入力"}</dd>
                  </div>
                </dl>

                <div className="daily-record-card__actions">
                  <Button onClick={() => onEditRecord(record.id)}>
                    編集
                  </Button>
                  <Button onClick={() => onDeleteRecord(record.id)}>
                    削除
                  </Button>
                </div>
              </article>
            </Panel>
          ))
        )}

        <div className="daily-record-list__footer">
          <Button onClick={onCancel}>閉じる</Button>
        </div>
      </div>
    </Modal>
  );
}