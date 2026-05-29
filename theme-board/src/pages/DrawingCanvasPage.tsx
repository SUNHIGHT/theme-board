import React, { useState } from "react";
type Points = [number, number];//x,y
type Lines = {
    points: Points[];//線
    color: string;//色
    strokeWidth: number;//太さ
};

export function DrawingCanvas() {
    //描いた「点」のデータの総量→線になる→色と太さの情報も追加
    const [points, setPoints] = useState<Points[]>([]);
    //線のデータの総量→図になる
    const [lines, setLines] = useState<Lines[]>([]);
    //ドラッグ中か否か
    const [isDragging, setIsDragging] = useState(false)

    //カラーピッカー
    const [red, setRed] = useState(0);
    const [green, setGreen] = useState(0);
    const [blue, setBlue] = useState(0);
    //線の太さ
    const [strokeWidth, setStrokeWidth] = useState(3)

    //消しゴム状態
    const [isDeleting, setIsDeleting] = useState(false)

    const rgbcolor = `rgb(${red},${green},${blue})`;

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {

        if (!isDragging) return;

        if (isDeleting) {
            handleDeletingMove(e);
            return;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPoints((prev) => [...prev, [x, y]])
        return points
    }

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        // 左クリックだけ反応させる
        // 0 = 左クリック
        // 1 = ホイールクリック
        // 2 = 右クリック
        // const rect = e.currentTarget.getBoundingClientRect();
        // const x = e.clientX - rect.left;
        // const y = e.clientY - rect.top;
        if (e.button !== 0) return;
        setIsDragging(true);
        //書き始めなので、保存していた前までのpointsの中をリセット→色が状態を持たないようにするため、書き終わった時点でリセットすることにした。
        // setPoints([])
    }

    function handleMouseUp() {
        setIsDragging(false);
        //線が書き終わったのでlinesに追加
        setLines((prev) => [
            ...prev,
            {
                points: points,
                color: rgbcolor,
                strokeWidth: strokeWidth
            }
        ])
        //書き終わったら
        setPoints([])
    }

    //触れた線（実際には近い距離の線）を消す
    function handleDeletingMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!isDragging) return;

        // マウスの位置 = [mouseX, mouseY]
        // 線の中の点 = [pointX, pointY]
        // この2点の距離が一定以下なら、消す
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // { 例：line
        //     points: [
        //         [10, 20],
        //         [15, 25],
        //         [20, 30],
        //     ],
        //     color: "rgb(0,0,0)",
        //     strokeWidth: 3}

        setLines((prev) =>
            prev.filter((line) => {
                //filterは、trueは残る、falseは消える
                const isTouched = line.points.some(([pointX, pointY]) => {
                    //someとは配列の中に1つでも条件を満たすものがあれば true
                    return (
                        Math.abs(mouseX - pointX) < 10 &&
                        Math.abs(mouseY - pointY) < 10
                    );
                });
                //isTouched（触っている）がtrue＝残したくない→falseをfilterに返す必要あり
                return !isTouched
            })
        );

    }

    // div 自体に「マウス操作を受け取る仕組み」があります。Reactではそれをこういうイベント属性で書く
    // マウスを押した
    // → onMouseDown が1回発火
    // マウスを動かした
    // → onMouseMove が何度も発火
    // マウスを離した
    // → onMouseUp が1回発火

    //svgタグはブラウザ上で図形を描くためのタグ≠canvas
    // polyline は、点を順番につないで線を描くタグ
    // points="10,20 50,80 120,40"で点を結ぶ＝線いっぽんのみ
    //fillは中を塗りつぶすか、strokeは線の色、strokeWidthは線の太さ
    //これを線の本数分mapでまわして図を表現する。

    //　↑　致命的な欠陥あり！！　確定したlinesじゃないと表示されないため、書いている途中の線は表示されない！
    return (
        <>
            <h2>お絵かきアプリ</h2>
            <div
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                    width: "500px",
                    height: "300px",
                    border: "1px solid black",
                }}
            >
                <svg width="500" height="300">
                    {/* 確定済みの線 */}
                    {lines.map((line, index) => (
                        <polyline
                            key={index}
                            points={line.points.map(([x, y]) => `${x},${y}`).join(" ")}
                            // points="10,20 50,80 120,40"
                            fill="none"
                            stroke={line.color}
                            strokeWidth={line.strokeWidth}
                        />
                    ))}
                    {/* 今描いている途中の線 */}
                    <polyline
                        points={points.map(([x, y]) => `${x},${y}`).join(" ")}
                        fill="none"
                        stroke={rgbcolor}
                        strokeWidth={strokeWidth}
                    />
                </svg>
            </div>
            <p>消しゴム</p>
            {isDeleting ?
                <button
                    type="button"
                    onClick={() => setIsDeleting(false)}>
                    消しゴムをやめる
                </button> :
                <button
                    type="button"
                    onClick={() => setIsDeleting(true)}>
                    消しゴムを使う
                </button>}
            {/* <button
                type="button"
                onClick={() => setIsDeleting((prev) => !prev)}
            >
                {isDeleting ? "消しゴムをやめる" : "消しゴムを使う"}
            </button> */}
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
            <p>線の太さ</p>
            <input
                type="range"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
            />
        </>
    );
}

// 機能要件
// 描画機能
// ペンツールでの自由描画

// 色の選択・変更（カラーピッカー）
// 線の太さの調整（1px～50px）
// 消しゴムツールでの部分消去
// 全消去機能（確認ダイアログ付き）
// 保存機能
// PNG形式での画像保存
// プログラマティックなダウンロード
// 操作対応
// マウス操作（デスクトップ）
// タッチ操作（タブレット・スマートフォン）
// レスポンシブなキャンバスサイズ調整
// 実装ポイント
// ペンツールでの自由描画
// ペンツールでの自由描画は、マウス/タッチイベントと Canvas 2D API を組み合わせて実現しています。描画処理は3つのフェーズで構成されます。

// 描画開始（startDrawing）: マウスダウン/タッチスタート時に、開始点の座標を記録し、isDrawingフラグをtrueに設定します。開始点に小さな円を描画することで、クリックだけでも点が描けるようにしています(arcメソッドで線幅の半径の円を描画)。
// 描画中（draw）: マウスムーブ/タッチムーブ時に、前回の座標から現在の座標への線分を描画します。moveToで前回の位置に移動し、lineToで現在の位置まで線を引き、strokeでレンダリングします。座標を更新することで、連続した線を滑らかに描けます。
// 描画終了（stopDrawing）: マウスアップ/タッチエンド/マウスアウト時に、isDrawingフラグをfalseにして描画を停止します。
// Canvas コンテキストの設定として、lineCap: 'round'とlineJoin: 'round'を指定することで、線の端と接続部を丸くし、自然な手描き感を実現しています。また、マウスとタッチの両方のイベントに対応することで、デスクトップとモバイル端末の両方で快適な描画体験を提供しています。座標の取得処理では、マウスイベントはoffsetX/Y、タッチイベントはgetBoundingClientRectとタッチ座標から相対位置を計算することで、統一的に扱えるようにしています。

// 消しゴム機能
// Canvas APIのglobalCompositeOperationプロパティを使用して、消しゴム機能を実装しています。destination-outモードでは、描画した部分の既存のピクセルを透明にすることで消しゴム効果を実現します。通常のペンモードではsource-overを使用し、既存の描画の上に新しい描画を重ねます。この設計により、同じ描画ロジックを使いながら、モードの切り替えだけで異なる動作を実現できます。

// 画像保存機能
// Canvas要素のtoDataURL()メソッドを使用して、描画内容をData URL形式（Base64エンコード）に変換しています。一時的なアンカー要素を作成してプログラマティックにクリックすることで、ユーザーにファイルをダウンロードさせています。

// 拡張アイディア
// レイヤー機能
// 複数レイヤーの管理
// レイヤーの表示/非表示切り替え
// レイヤーの順序変更
// レイヤーごとの不透明度調整
// 図形描画ツール
// 直線、矩形、円、多角形の描画
// 塗りつぶし/輪郭のみの切り替え
// シフトキーで正円・正方形
// テキスト挿入
// キャンバス上へのテキスト入力
// フォントサイズ・ファミリーの選択
// テキスト色の設定
// Undo/Redo機能
// 描画履歴の保存
// 前の状態への復元
// やり直し機能
// 履歴のスタック管理
// 画像インポート
// 背景画像の読み込み
// 画像の上に描画
// 画像のリサイズと配置
// ブラシバリエーション
// スプレー、エアブラシ効果
// パターンブラシ
// テクスチャブラシ
// ブラシの透明度設定
// キャンバスサイズ調整
// カスタムサイズの指定
// プリセットサイズ（A4、正方形など）
// リサイズ時の描画内容保持
// カラーパレット
// よく使う色の保存
// パレットのカスタマイズ
// 最近使った色の履歴
// 学べること
// Canvas API基礎
// 2D描画コンテキストの取得と設定
// 線の描画（moveTo、lineTo、stroke）
// 円の描画（arc）
// 合成操作（globalCompositeOperation）
// Canvas座標系の理解
// イベント処理
// マウスイベントとタッチイベントの統合
// イベント座標の取得と変換
// イベントリスナーの登録と解除
// preventDefaultによるデフォルト動作の制御
// ファイル操作
// toDataURLによるCanvas内容の出力
// Data URLとBlob/Fileの理解
// プログラマティックなファイルダウンロード