import Button from "../components/atoms/Button";
import { useState } from "react";


export function PasswordGenerator() {

    const [useUpperCase, setUseUpperCase] = useState(false);
    const [useLowerCase, setUseLowerCase] = useState(false);
    const [useNumber, setUseNumber] = useState(false);
    const [useSymbol, setUseSymbol] = useState(false);


    const [passwordLength, setPasswordLength] = useState(8);
    const [generatedPassword, setGeneratedPassword] = useState("");


    function handleGenerate() {
        const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
        const numberChars = "0123456789";
        const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

        let chars = "";

        if (useUpperCase) {
            chars += upperCaseChars;
        }

        if (useLowerCase) {
            chars += lowerCaseChars;
        }

        if (useNumber) {
            chars += numberChars;
        }

        if (useSymbol) {
            chars += symbolChars;
        }

        if (chars === "") {
            setGeneratedPassword("文字種を1つ以上選択してください");
            return;
        }
        let password = "";

        //指定文字列の中からランダムに一文字ずつ取り出して指定文字数連結する
        //指定した文字長まわす
        //問題点・・・指定した文字種が入らない可能性がある
        for (let i = 0; i < passwordLength; i++) {
            //0<1の少数　×　指定文字列の個数　= ランダムな指定文字列の番号（小数点を切り下げると）
            //Math.randomは0以上1未満のランダムな少数 chars.lengthは指定文字列数の個数
            //Math.floorは小数点切り下げ
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }

        setGeneratedPassword(password);
    }


    //checkedは単体で最初からチェック済みになるが、JSX特有でchecked={条件}で属性に値を渡せる
    //e.target.valueは入力値、e.target.checkedはチェック確認
    //Buttonは、指定しなければtype=submitになり、勝手にリロードする
    return (
        <>
            <h2>パスワードジェネレータ</h2>
            <h3>文字種</h3>
            <form>
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
            </form>
        </>
    );
}

// 機能要件
// パスワード生成→〇
// パスワード長設定（4-32文字、スライダー）→〇
// 文字種選択（大文字・小文字・数字・記号のチェックボックス）→〇
// 各文字種から最低1文字を確保
// ランダム生成とシャッフル→〇
// 強度表示
// パスワード強度の視覚的表示（プログレスバー）
// 強度評価（弱い・普通・強い・非常に強い）
// 色分けによる直感的なフィードバック
// コピー機能
// クリップボードへのワンクリックコピー
// Clipboard API使用（フォールバック実装付き）
// コピー成功のフィードバック
// 自動生成
// アプリ起動時に自動でパスワード生成
// 設定変更時にも生成可能

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