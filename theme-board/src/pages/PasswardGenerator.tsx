import Button from "../components/atoms/Button";
import { useState, useEffect } from "react";


export function PasswordGenerator() {

    const [useUpperCase, setUseUpperCase] = useState(true);
    const [useLowerCase, setUseLowerCase] = useState(true);
    const [useNumber, setUseNumber] = useState(true);
    const [useSymbol, setUseSymbol] = useState(true);


    const [passwordLength, setPasswordLength] = useState(8);
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [copyMassage, setCopyMessage] = useState("");

    useEffect(() => {
        handleGenerate();
    }, [])

    function handleGenerate() {
        const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
        const numberChars = "0123456789";
        const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

        const selectedCharGroups: string[] = [];

        if (useUpperCase) {
            selectedCharGroups.push(upperCaseChars);
        }

        if (useLowerCase) {
            selectedCharGroups.push(lowerCaseChars);
        }

        if (useNumber) {
            selectedCharGroups.push(numberChars);
        }

        if (useSymbol) {
            selectedCharGroups.push(symbolChars);
        }
        if (selectedCharGroups.length === 0) {
            setGeneratedPassword("文字種を1つ以上選択してください");
            return;
        }

        if (passwordLength < selectedCharGroups.length) {
            setGeneratedPassword("文字数が短すぎます");
            return;
        }
        const allChars = selectedCharGroups.join("");
        //[
        //   "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        //   "0123456789",
        //   "!@#$%^&*()_+-=[]{}|;:,.<>?"
        // ]
        //→これが"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"こうなる
        const passwordChars: string[] = [];

        // 選択された各文字種から最低1文字ずつ入れる
        for (const group of selectedCharGroups) {
            //ここのgroupは、各文字種ごとの文字列。これをランダムに選抜
            const randomIndex = Math.floor(Math.random() * group.length);
            passwordChars.push(group[randomIndex]);
        }
        //文字種の並び順が固定されるが、後でシャッフルするので問題無し

        // 残りの文字数ぶん、全候補からランダムに入れる
        while (passwordChars.length < passwordLength) {
            const randomIndex = Math.floor(Math.random() * allChars.length);
            passwordChars.push(allChars[randomIndex]);
        }

        // 並び順をシャッフルする
        for (let i = passwordChars.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));

            const temp = passwordChars[i];
            passwordChars[i] = passwordChars[randomIndex];
            passwordChars[randomIndex] = temp;
        }

        //Math.floor(Math.random() *～が肝である
        setGeneratedPassword(passwordChars.join(""));
    }


    function evaluatePasswordStrength(password: string) {
        let score = 0;
        const maxScore = 6;

        if (password.length >= 8) {
            score += 1;
        }

        if (password.length >= 12) {
            score += 1;
        }

        if (/[A-Z]/.test(password)) {
            score += 1;
        }

        if (/[a-z]/.test(password)) {
            score += 1;
        }

        if (/[0-9]/.test(password)) {
            score += 1;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score += 1;
        }

        const percent = Math.round((score / maxScore) * 100);

        if (percent < 40) {
            return {
                label: "弱い",
                percent,
                color: "red",
            };
        }

        if (percent < 70) {
            return {
                label: "普通",
                percent,
                color: "orange",
            };
        }

        if (percent < 90) {
            return {
                label: "強い",
                percent,
                color: "blue",
            };
        }

        return {
            label: "非常に強い",
            percent,
            color: "green",
        };
    }

    const strength = evaluatePasswordStrength(generatedPassword);

    async function handleCopy() {
        if (!generatedPassword) {
            setCopyMessage("コピーするパスワードがありません");
            return;
        }

        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(generatedPassword);
            } else {
                fallbackCopyText(generatedPassword);
            }

            setCopyMessage("コピーしました");

            setTimeout(() => {
                setCopyMessage("");
            }, 2000);
        } catch (error) {
            console.error(error);
            setCopyMessage("コピーに失敗しました");
        }
    }


    //？
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

    //checkedは単体で最初からチェック済みになるが、JSX特有でchecked={条件}で属性に値を渡せる
    //e.target.valueは入力値、e.target.checkedはチェック確認
    //Buttonは、指定しなければtype=submitになり、勝手にリロードする
    return (
        <>
            <h2>パスワードジェネレータ</h2>
            <h3>文字種</h3>
            <label>
                <input
                    type="checkbox"
                    checked={useUpperCase}
                    onChange={(e) => setUseUpperCase(e.target.checked)}
                />
                大文字アルファベット
            </label>

            <br />

            <label>
                <input
                    type="checkbox"
                    checked={useLowerCase}
                    onChange={(e) => setUseLowerCase(e.target.checked)}
                />
                小文字アルファベット
            </label>

            <br />

            <label>
                <input
                    type="checkbox"
                    checked={useNumber}
                    onChange={(e) => setUseNumber(e.target.checked)}
                />
                数字
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={useSymbol}
                    onChange={(e) => setUseSymbol(e.target.checked)}
                />
                記号
            </label>
            <h3>パスワード長</h3>
            <input
                type="range"
                min={4}
                max={32}
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
            >
            </input>

            <p>{passwordLength}文字</p>

            <Button type="button" onClick={handleGenerate}>
                パスワード生成
            </Button>

            <h3>生成結果</h3>
            <p>{generatedPassword}</p>
            {generatedPassword && (
                <>
                    <h3>強度</h3>
                    <div
                        style={{
                            width: "100%",
                            height: "12px",
                            backgroundColor: "#ddd",
                            borderRadius: "8px",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${strength.percent}%`,
                                height: "100%",
                                backgroundColor: strength.color,
                            }}
                        />
                    </div>

                    <p>   {strength.label}：{strength.percent}%</p>
                    <Button type="button" onClick={handleCopy}>
                        コピー
                    </Button>
                    {copyMassage && <p>{copyMassage}</p>}
                </>
            )}
        </>
    );
}

// 機能要件
// パスワード生成→〇
// パスワード長設定（4-32文字、スライダー）→〇
// 文字種選択（大文字・小文字・数字・記号のチェックボックス）→〇
// 各文字種から最低1文字を確保→〇
// ランダム生成とシャッフル→〇
// 強度表示
// パスワード強度の視覚的表示（プログレスバー）→〇
// 強度評価（弱い・普通・強い・非常に強い）→〇
// 色分けによる直感的なフィードバック→〇
// クリップボードへのワンクリックコピー→〇
// Clipboard API使用（フォールバック実装付き）→〇
// コピー成功のフィードバック→〇
// アプリ起動時に自動でパスワード生成→〇
// 設定変更時にも生成可能→よくわからないのでスルー

// 実装ポイント
// パスワード生成
// パスワード生成ロジックでは、選択された各文字種から最低1文字を確保することで、生成されたパスワードが確実に選択された文字種を含むようにしています。まず各文字種から1文字ずつ追加し、残りの長さをランダムに埋めた後、シャッフルすることで、パターンが予測しにくいパスワードを生成します。文字種が1つも選択されていない場合はエラーをスローし、不正な操作を防いでいます。

// 強度計算
// パスワード強度は、長さと文字種の数に基づいて計算されます。記号の使用にはスコアを与え、他の文字種より重視することで、より安全なパスワード生成を促進しています。スコアをパーセンテージに変換し、視覚的なプログレスバーで表示することで、ユーザーに直感的なフィードバックを提供します。

// クリップボードコピー機能
// モダンなClipboard APIを優先的に使用し、失敗した場合は古いブラウザ向けのフォールバック実装に切り替えます。フォールバックでは、一時的なtextarea要素を作成してコピー操作を行い、操作後は要素を削除してDOMを汚染しないようにしています。両方の方法が失敗した場合でも、アプリがクラッシュせずにfalseを返すことで、エラーハンドリングが適切に行われています。このパターンは、クロスブラウザ互換性を保つ実践的な手法です。

// 拡張アイディア
// パスワード履歴
// 生成したパスワードの履歴保存
// LocalStorageでの永続化
// 履歴からの再選択機能
// 履歴のクリア機能
// 複数パスワード生成
// 一度に複数のパスワードを生成
// バッチ生成機能
// 生成結果の一覧表示
// QRコード生成
// パスワードのQRコード化
// スマートフォンへの転送機能