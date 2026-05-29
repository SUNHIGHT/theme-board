//カウントダウンタイマー
//時間が経過するだけでは、レンダリングは実行されない。→setIntervalが必要
//setIntervalはjavascriptの機能でブラウザに「定期実行の予約」を渡している

//useRefに保存する理由は
// 画面表示に使う値ではない
// でも後で使いたい
// 再レンダーしても保持しておきたいから

// 他のstateから計算できる値
// → stateにしない方がよい

// ユーザー操作や外部要因で独立して変わる値
// → stateにしてよい

import { useState, useRef } from "react"
import { playAlarm } from "../utils/audio";

export default function CountdownTimePage() {

    const [inputMinutes, setInputMinutes] = useState(0);
    const [remainSeconds, setRemainSeconds] = useState(0);//実際に画面に出す残り秒数

    type TimerStatus = "idle" | "running" | "paused" | "completed"
    const [timerStatus, setTimerStatus] = useState<TimerStatus>("idle");//今タイマーが動いているかどうか

    function getStatusMessage(status: TimerStatus) {
        switch (status) {
            case "idle":
                return "待機中";
            case "running":
                return "実行中";
            case "paused":
                return "一時停止中";
            case "completed":
                return "完了";
        }
    }


    const [alarmFrequency, setAlarmFrequency] = useState(880);
    const [alarmVolume, setAlarmVolume] = useState(0.2);
    const [alarmDuration, setAlarmDuration] = useState(500);

    const intervalRef = useRef<number | null>(null);

    function handleEdit(input: number) {
        const fixedInput = Math.min(Math.max(input,1),60)
        setInputMinutes(fixedInput)
        setRemainSeconds(fixedInput * 60);
    }

    function handleStart() {
        if (intervalRef.current !== null) {
            return;
        }

        intervalRef.current = window.setInterval(() => {
            setRemainSeconds((prev) => {
                if (prev <= 1) {
                    handleStop();
                    // 「渡すオブジェクトのプロパティ名」と「手元の変数名」が違うとき関数側のプロパティ名を明記しないといけない
                    playAlarm({
                        frequency: alarmFrequency,
                        volume: alarmVolume,
                        duration: alarmDuration,
                    });
                    setTimerStatus("completed");
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        setTimerStatus("running");
    }

    function handleStop() {
        if (intervalRef.current === null) {
            return;
        }

        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTimerStatus("paused");
    }

    function handleReset() {
        handleStop();
        setRemainSeconds(inputMinutes * 60);
        setTimerStatus("idle");
    }

    return (
        <>
            <h2>カウントダウンタイマー</h2>
            <p>ステータス：{getStatusMessage(timerStatus)}</p>
            <p>{Math.floor(remainSeconds / 60)} 分{String(remainSeconds % 60).padStart(2, "0")}秒</p>

            <input
                min={1}
                max={60}
                type="number"
                value={inputMinutes}
                onChange={(e) => handleEdit(Number(e.target.value))}
            />

            <button onClick={() => handleEdit(1)}>
                1分
            </button>
            <button onClick={() => handleEdit(3)}>
                3分
            </button>
            <button onClick={() => handleEdit(5)}>
                5分
            </button>

            <button onClick={handleStart} disabled={timerStatus === "running"}>
                スタート
            </button>

            <button onClick={handleStop} disabled={timerStatus !== "running"}>
                ストップ
            </button>

            <button onClick={handleReset}>
                リセット
            </button>
            <p>アラーム音調整</p>

            <p>音量：{alarmVolume}</p>
            <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={alarmVolume}
                onChange={(e) => setAlarmVolume(Number(e.target.value))}
            />

            <p>周波数：{alarmFrequency}Hz</p>
            <input
                type="range"
                min={200}
                max={2000}
                step={50}
                value={alarmFrequency}
                onChange={(e) => setAlarmFrequency(Number(e.target.value))}
            />

            <p>再生時間：{alarmDuration}ms</p>
            <input
                type="range"
                min={100}
                max={3000}
                step={100}
                value={alarmDuration}
                onChange={(e) => setAlarmDuration(Number(e.target.value))}
            />
        </>
    );
}

// 機能要件
// タイマー設定→〇
// 1〜60分の範囲で時間設定→〇
// 数値入力による任意の時間設定→〇
// 入力値の自動バリデーション（範囲外の値を自動補正）→〇
// プリセットボタン（1分、3分、5分、10分）→〇
// タイマー操作→〇
// 開始ボタン（設定時間からカウントダウン開始）→〇
// 一時停止ボタン（カウントダウンを一時停止）→〇
// リセットボタン（タイマーを初期状態に戻す）→〇
// タイマー実行中はプリセット選択を無効化→〇
// MM:SS形式での残り時間表示→〇
// ステータスメッセージ表示（待機中、実行中、一時停止中、完了）→〇
// 2桁ゼロパディング表示→〇
// タイマー完了時にアラーム音を再生→〇
// Web Audio APIによる音声生成→〇
// 周波数・音量・再生時間のカスタマイズ可能→〇

// 拡張アイディア
// 複数タイマー機能
// 複数のタイマーを同時に管理
// タブUIでタイマーを切り替え
// 各タイマーに名前を付ける機能
// カスタムアラーム音
// アラーム音の種類を選択（ビープ音、チャイム音など）
// 音声ファイルのアップロード機能
// 音量・音色の調整UI
// タイマー履歴
// 過去に使用した時間設定を記録
// よく使う時間をお気に入り登録
// 履歴から素早く再設定
// バックグラウンド通知
// ブラウザタブが非アクティブでも通知
// Notification APIの活用
// タイトルバーに残り時間を表示