import { useState, useEffect } from "react";
import Button from "../components/atoms/Button";

export function ColorPicker() {
    const STORAGE_KEY = "savecolor"

    const [red, setRed] = useState(0);
    const [green, setGreen] = useState(0);
    const [blue, setBlue] = useState(0);

    const [copyMassage, setCopyMassage] = useState("コピーする")
    const [saveColors, setSaveColors] = useState<string[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (!saved){
            return [];
        }

        return JSON.parse(saved);
    })


    useEffect(() => {
        localStorage.setItem(STORAGE_KEY,JSON.stringify(saveColors))
    },[saveColors])

    //こういう発想をパットできるようになりたい
    const presets = [
        { name: "黒", red: 0, green: 0, blue: 0 },
        { name: "白", red: 255, green: 255, blue: 255 },
        { name: "赤", red: 255, green: 0, blue: 0 },
        { name: "緑", red: 0, green: 255, blue: 0 },
        { name: "青", red: 0, green: 0, blue: 255 },
        { name: "黄", red: 255, green: 255, blue: 0 },
        { name: "水色", red: 0, green: 255, blue: 255 },
        { name: "紫", red: 128, green: 0, blue: 128 },
    ]


    const rgbcolor = `rgb(${red},${green},${blue})`;

    function presetColor(red: number, green: number, blue: number) {
        setRed(red)
        setBlue(blue)
        setGreen(green)
    }


    function toHex(value: number) {
        return value.toString(16).padStart(2, "0");
    }

    const hexColor = `#${toHex(red)}${toHex(green)}${toHex(blue)}`;

    async function handleCopy() {
        if (!hexColor) {
            return;
        }
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(hexColor);
            } else {
                fallbackCopyText(hexColor);
            }
            setCopyMassage("コピーしました")
            setTimeout(() => {
                setCopyMassage("コピーする")
            }, 2000)
        } catch (error) {
            setCopyMassage("コピーに失敗しました")
        }
    }

    function fallbackCopyText(text: string) {
        const textarea = document.createElement("textarea");

        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        document.execCommand("copy");

        document.body.removeChild(textarea);
    }


    function onSave() {
        if (saveColors.length < 10) {
            setSaveColors([
                ...saveColors,
                rgbcolor
            ])
        }

    }

    // indexで消さなければ、色とかで消してしまうと同色も消えてしまう
    function deleteSaveColor(targetIndex: number) {
        setSaveColors(saveColors.filter((_, index) => index !== targetIndex))
    }
    //「_」の意味は源流から追うと
    //filter((要素, index) => 条件)という使い方が主流であり、_とは飛ばしていること。

    return (
        <>
            <h2>カラーピッカー</h2>
            <p>選択した色</p>
            <div
                style={{
                    width: "120px",
                    height: "120px",
                    backgroundColor: rgbcolor,
                    border: "1px solid #333",
                }}
            />
            <p>16進数カラーコード</p>
            <p>{hexColor}</p>
            <Button
                type="button"
                onClick={handleCopy}
            >
                {copyMassage}
            </Button>

            <p>プリセット</p>
            {presets.map((preset) => {
                return (
                    <Button
                        type="button"
                        onClick={() => presetColor(preset.red, preset.green, preset.blue)}
                    >
                        {preset.name}
                    </Button>
                );
            })}
            <input
                type="range"
                min={0}
                max={255}
                value={red}
                onChange={(e) => setRed(Number(e.target.value))}
            />
            <input
                type="range"
                min={0}
                max={255}
                value={blue}
                onChange={(e) => setBlue(Number(e.target.value))}
            />
            <input
                type="range"
                min={0}
                max={255}
                value={green}
                onChange={(e) => setGreen(Number(e.target.value))}
            />
            <Button
                type="button"
                onClick={onSave}
            >
                保存する
            </Button>
            <p>保存した色</p>
            {saveColors.map((saveColor, index) => {
                return (
                    <>
                        <Button
                            onContextMenu={(e) => {
                                e.preventDefault();
                                deleteSaveColor(index)
                                console.log("右クリックされました")
                            }}
                        >
                            <div
                                key={`${saveColor}-${index}`}
                                style={{
                                    width: "120px",
                                    height: "120px",
                                    backgroundColor: saveColor,
                                    border: "1px solid #333",
                                }}
                            />
                        </Button>
                    </>
                );
            })}
        </>
    );
}

// 機能要件
// カラー選択→〇
// RGBスライダーによる色調整（各色0-255）→〇
// プリセットカラーからの選択（基本8色）→〇
// リアルタイムカラープレビュー→〇
// 16進数カラーコードの表示→〇
// カラーコードのクリップボードコピー→〇
// カラーの保存（最大10色）→〇
// 保存済みカラーの削除（右クリック）→〇
// LocalStorageでの永続化→〇
// 実装ポイント
// 色変換
// 1桁の16進数に必ずゼロパディングを行うことにより、常に正しい6桁のカラーコードを生成できます。RGBとHEXの相互変換を実装することで、異なる色表現形式をシームレスに扱えます。

// 保存カラー管理
// 最大10色の制限を設け、新しい色が追加されると最も古い色が自動的に削除されるFIFOキューの実装により、メモリ使用量を抑えています。重複チェックを行うことで、同じ色が複数保存されることを防ぎ、データの整合性を保っています。

// 拡張アイディア
// カラーパレット機能
// 複数色を組み合わせたパレット作成
// パレットのエクスポート/インポート
// カラースキーム（補色、類似色など）の自動生成
// 配色提案機能
// 選択色に基づいた配色の自動提案
// アクセシビリティチェック（コントラスト比）
// カラーハーモニー理論に基づく提案
// エクスポート/インポート
// 保存カラーのJSON形式エクスポート
// 他のツールからのカラーパレットインポート
// CSS変数形式での出力