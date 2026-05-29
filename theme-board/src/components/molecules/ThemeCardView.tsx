import type { ThemeItem } from "../../types/types";
import Panel from "../atoms/Panel";
import Button from "../atoms/Button";
import "./ThemeCardView.css"

type ThemeCardViewProps = {
    item: ThemeItem;
    isModalOpen: boolean;
    onEdit: () => void;
    onAddRecord: () => void;
    onShowRecords: () => void;
    onDelete: () => void;
};

export default function ThemeCardView({
    item,
    isModalOpen,
    onEdit,
    onAddRecord,
    onShowRecords,
    onDelete,
}: ThemeCardViewProps) {
    return (
        <Panel>
            <article className="theme-card">
                <header className="theme-card__header">
                    <div>
                        <h2 className="theme-card__title">{item.title}</h2>
                        <p className="theme-card__purpose">{item.purpose}</p>
                    </div>

                    <span className="theme-card__status">
                        {item.status}
                    </span>
                </header>

                <dl className="theme-card__details">
                    <div className="theme-card__detail">
                        <dt>カテゴリ</dt>
                        <dd>{item.category}</dd>
                    </div>

                    <div className="theme-card__detail">
                        <dt>アプローチ</dt>
                        <dd>{item.approach || "未設定"}</dd>
                    </div>

                    <div className="theme-card__detail">
                        <dt>今の焦点</dt>
                        <dd>{item.focusPoint || "未設定"}</dd>
                    </div>

                    <div className="theme-card__detail">
                        <dt>次の一手</dt>
                        <dd>{item.nextAction || "未設定"}</dd>
                    </div>

                    <div className="theme-card__detail">
                        <dt>期限</dt>
                        <dd>{item.dueDate || "未設定"}</dd>
                    </div>
                </dl>

                <div className="theme-card__actions">
                    <Button onClick={onAddRecord} disabled={isModalOpen}>
                        今日の記録を書く
                    </Button>

                    <Button onClick={onShowRecords} disabled={isModalOpen}>
                        記録を見る
                    </Button>

                    <Button onClick={onEdit} disabled={isModalOpen}>
                        テーマを編集
                    </Button>

                    <Button onClick={onDelete} disabled={isModalOpen}>
                        削除
                    </Button>
                </div>
            </article>
        </Panel>
    )
}