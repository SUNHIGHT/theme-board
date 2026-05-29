import { useState } from "react";
import Button from "../components/atoms/Button";
import "./UnitConverter.css"

//LengthUnitにはこの8種類の文字列しか入らない
type LengthUnit = "mm" | "cm" | "m" | "km" | "inch" | "feet" | "yard" | "mile";
type WeightUnit = "mg" | "g" | "kg" | "t" | "oz" | "lb";
type TemperatureUnit = "celsius" | "fahrenheit" | "kelvin";

type ConvertCategory = "length" | "weight" | "temperature";
type ConvertHistory = {
    id: string;
    category: ConvertCategory;
    input: number;
    fromUnit: string;
    toUnit: string;
    result: number;
    formula: string;
    createdAt: string;
};


export function UnitConverter() {
    const [input, setInput] = useState(0);
    const [fromLengthUnit, setfromLengthUnit] = useState<LengthUnit>('cm');
    const [toLengthUnit, settoLengthUnit] = useState<LengthUnit>('cm');
    const [fromWeightUnit, setfromWeightUnit] = useState<WeightUnit>('g');
    const [toWeightUnit, settoWeightUnit] = useState<WeightUnit>('g');
    const [fromTemperatureUnit, setfromTemperatureUnit] = useState<TemperatureUnit>('celsius');
    const [toTemperatureUnit, settoTemperatureUnit] = useState<TemperatureUnit>('celsius');

    const [histories, setHistories] = useState<ConvertHistory[]>([]);


    //Record<A,B>はAをキーにして、値はBの箱
    const lengthRates: Record<LengthUnit, number> = {
        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000,
        inch: 0.0254,
        feet: 0.3048,
        yard: 0.9144,
        mile: 1609.344,
    };

    const weightRates: Record<WeightUnit, number> = {
        mg: 0.001,
        g: 1,
        kg: 1000,
        t: 1000000,
        oz: 28.349523125,
        lb: 453.59237,
    };

    //摂氏に変換（温度は倍率変換ではない）
    function toCelsius(value: number, unit: TemperatureUnit) {
        if (unit === "celsius") return value;
        if (unit === "fahrenheit") return (value - 32) * 5 / 9;
        if (unit === "kelvin") return value - 273.15;
        return value;
    }
    //摂氏から目標単位
    function fromCelsius(value: number, unit: TemperatureUnit) {
        if (unit === "celsius") return value;
        if (unit === "fahrenheit") return value * 9 / 5 + 32;
        if (unit === "kelvin") return value + 273.15;
        return value;
    }



    const lengthUnits = [
        { value: "mm", label: "ミリメートル" },
        { value: "cm", label: "センチメートル" },
        { value: "m", label: "メートル" },
        { value: "km", label: "キロメートル" },
        { value: "inch", label: "インチ" },
        { value: "feet", label: "フィート" },
        { value: "yard", label: "ヤード" },
        { value: "mile", label: "マイル" },
    ] as const;

    const weightUnits = [
        { value: "mg", label: "ミリグラム" },
        { value: "g", label: "グラム" },
        { value: "kg", label: "キログラム" },
        { value: "t", label: "トン" },
        { value: "oz", label: "オンス" },
        { value: "lb", label: "ポンド" },
    ] as const;

    const temperatureUnits = [
        { value: "celsius", label: "摂氏" },
        { value: "fahrenheit", label: "華氏" },
        { value: "kelvin", label: "ケルビン" },
    ] as const;

    function convertLength() {
        //m基準にする
        const meterValue = input * lengthRates[fromLengthUnit];
        return meterValue / lengthRates[toLengthUnit];
    }

    function convertWeight() {
        // g基準にする
        const gramValue = input * weightRates[fromWeightUnit];
        return gramValue / weightRates[toWeightUnit];
    }

    function convertTemperature(
        value: number,
        fromUnit: TemperatureUnit,
        toUnit: TemperatureUnit
    ) {
        //摂氏基準にする
        const celsiusValue = toCelsius(value, fromUnit);
        return fromCelsius(celsiusValue, toUnit);
    }


    const lengthResult = convertLength();
    const lengthFormattedResult = Number(lengthResult.toFixed(6));

    const weightResult = convertWeight();
    const weightFormattedResult = Number(weightResult.toFixed(6));

    const temperatureResult = convertTemperature(
        input,
        fromTemperatureUnit,
        toTemperatureUnit
    );
    const temperatureFormattedResult = Number(temperatureResult.toFixed(6));

    const celsiusValue = toCelsius(input, fromTemperatureUnit);
    const celsiusFormattedValue = Number(celsiusValue.toFixed(6));

    const lengthFormula = `${input} ${fromLengthUnit} × ${lengthRates[fromLengthUnit]} ÷ ${lengthRates[toLengthUnit]} = ${lengthFormattedResult} ${toLengthUnit}`;

    const weightFormula = `${input} ${fromWeightUnit} × ${weightRates[fromWeightUnit]} ÷ ${weightRates[toWeightUnit]} = ${weightFormattedResult} ${toWeightUnit}`;

    const temperatureFormula = `${input} ${fromTemperatureUnit} → ${celsiusFormattedValue} celsius → ${temperatureFormattedResult} ${toTemperatureUnit}`;


    function addLengthHistory() {
        const newHistory: ConvertHistory = {
            id: crypto.randomUUID(),
            category: "length",
            input,
            fromUnit: fromLengthUnit,
            toUnit: toLengthUnit,
            result: lengthFormattedResult,
            formula: lengthFormula,
            createdAt: new Date().toLocaleString(),
        }
        setHistories((prev) => [newHistory, ...prev])
    }
    function addWeightHistory() {
        const newHistory: ConvertHistory = {
            id: crypto.randomUUID(),
            category: "weight",
            input,
            fromUnit: fromWeightUnit,
            toUnit: toWeightUnit,
            result: weightFormattedResult,
            formula: weightFormula,
            createdAt: new Date().toLocaleString(),
        };
        setHistories((prev) => [newHistory, ...prev]);
    }
    function addTemperatureHistory() {
        const newHistory: ConvertHistory = {
            id: crypto.randomUUID(),
            category: "temperature",
            input,
            fromUnit: fromTemperatureUnit,
            toUnit: toTemperatureUnit,
            result: temperatureFormattedResult,
            formula: temperatureFormula,
            createdAt: new Date().toLocaleString(),
        };

        setHistories((prev) => [newHistory, ...prev]);
    }
    return (
        <>
            <h2>単位変換アプリ</h2>
            <h3>長さ</h3>
            <input
                type="number"
                value={input}
                onChange={(e) => setInput(Number(e.target.value))}
            />
            <p>変換元</p>
            <div className="unit-radio-group">
                {lengthUnits.map((unit) => (
                    <label key={`from-${unit.value}`} className="unit-radio-label">
                        <input
                            type="radio"
                            name="fromLengthUnit"
                            value={unit.value}
                            checked={fromLengthUnit === unit.value}
                            onChange={(e) => setfromLengthUnit(e.target.value as LengthUnit)}
                        />
                        {unit.label}
                    </label>
                ))}
            </div>
            <p>変換先</p>
            <div className="unit-radio-group">
                {lengthUnits.map((unit) => (
                    <label key={`to-${unit.value}`} className="unit-radio-label">
                        <input
                            type="radio"
                            name="toLengthUnit"
                            value={unit.value}
                            checked={toLengthUnit === unit.value}
                            onChange={(e) => settoLengthUnit(e.target.value as LengthUnit)}
                        />
                        {unit.label}
                    </label>
                ))}
            </div>
            <p>計算式</p>
            {lengthFormula}
            <p>結果</p>
            {lengthResult}
            <Button type="button" onClick={addLengthHistory}>
                履歴に保存
            </Button>

            <h3>重さ</h3>
            <input
                type="number"
                value={input}
                onChange={(e) => setInput(Number(e.target.value))}
            />
            <p>変換元</p>
            <div className="unit-radio-group">
                {weightUnits.map((unit) => (
                    <label key={`from-${unit.value}`} className="unit-radio-label">
                        <input
                            type="radio"
                            name="fromWeightUnit"
                            value={unit.value}
                            checked={fromWeightUnit === unit.value}
                            onChange={(e) => setfromWeightUnit(e.target.value as WeightUnit)}
                        />
                        {unit.label}
                    </label>
                ))}
            </div>

            <p>変換先</p>
            <div className="unit-radio-group">
                {weightUnits.map((unit) => (
                    <label key={`to-${unit.value}`} className="unit-radio-label">
                        <input
                            type="radio"
                            name="toWeightUnit"
                            value={unit.value}
                            checked={toWeightUnit === unit.value}
                            onChange={(e) => settoWeightUnit(e.target.value as WeightUnit)}
                        />
                        {unit.label}
                    </label>
                ))}
            </div>
            <p>計算式</p>
            {weightFormula}
            <p>結果</p>
            {weightResult}
            <Button type="button" onClick={addWeightHistory}>
                履歴に保存
            </Button>

            <h3>温度</h3>
            <input
                type="number"
                value={input}
                onChange={(e) => setInput(Number(e.target.value))}
            />
            <p>変換元</p>
            <div className="unit-radio-group">
                {temperatureUnits.map((unit) => (
                    <label key={`from-${unit.value}`} className="unit-radio-label">
                        <input
                            type="radio"
                            name="fromTemperatureUnit"
                            value={unit.value}
                            checked={fromTemperatureUnit === unit.value}
                            onChange={(e) => setfromTemperatureUnit(e.target.value as TemperatureUnit)}
                        />
                        {unit.label}
                    </label>
                ))}
            </div>

            <p>変換先</p>
            <div className="unit-radio-group">
                {temperatureUnits.map((unit) => (
                    <label key={`to-${unit.value}`} className="unit-radio-label">
                        <input
                            type="radio"
                            name="toTemperatureUnit"
                            value={unit.value}
                            checked={toTemperatureUnit === unit.value}
                            onChange={(e) => settoTemperatureUnit(e.target.value as TemperatureUnit)}
                        />
                        {unit.label}
                    </label>
                ))}
            </div>
            <p>計算式</p>
            {temperatureFormula}
            <p>結果</p>
            {temperatureFormattedResult}
            <Button type="button" onClick={addTemperatureHistory}>
                履歴に保存
            </Button>
            <p>履歴</p>
            {histories.length === 0 ? (
                <p>まだ履歴はありません</p>
            ) : (
                histories.map((history) => (
                    <div key={history.id} className="history-item">
                        <p>
                            <strong>{history.category}</strong> / {history.createdAt}
                        </p>

                        <p>
                            {history.input} {history.fromUnit} → {history.result} {history.toUnit}
                        </p>

                        <p>計算式: {history.formula}</p>
                    </div>
                ))
            )}
        </>
    );
}



// 機能要件
// 長さの変換
// ミリメートル、センチメートル、メートル、キロメートル
// インチ、フィート、ヤード、マイル
// リアルタイム変換
// 計算式の表示
// 重さの変換
// ミリグラム、グラム、キログラム、トン
// オンス、ポンド
// リアルタイム変換
// 計算式の表示
// 温度の変換
// 摂氏、華氏、ケルビン
// 非線形変換の正確な処理
// 計算式の表示
// 変換履歴
// 変換結果の履歴保存（タイムスタンプ付き）
// LocalStorageでの永続化
// 履歴のクリア機能
// 実装ポイント
// 基準単位を介した変換
// 任意の単位間の変換を効率的に実装するため、「基準単位を介した2段階変換」のパターンを採用しています。まず入力値を基準単位（長さならメートル、重さならキログラム）に変換し、次に基準単位から目的の単位に変換します。この設計により、N個の単位間の変換を実装する際に、N²個の変換関数を用意する必要がなく、N個の変換係数だけで済みます。係数を設定ファイルで一元管理することで、新しい単位の追加が容易になります。

// 温度変換の特殊処理
// 温度変換は長さや重さと異なり、単純な比例関係ではないため、専用の変換ロジックが必要です。華氏から摂氏への変換には(°F - 32) × 5/9、摂氏から華氏への変換には°C × 9/5 + 32という異なる式が必要です。摂氏を基準単位とすることで、2段階変換のパターンを維持しながら、各温度スケールの特性に応じた正確な計算を実現しています。この設計により、コードの一貫性を保ちつつ、温度変換の複雑さを適切に処理できます。

// 浮動小数点演算の精度処理
// JavaScriptの浮動小数点演算では丸め誤差が発生するため、単位変換の結果表示には適切な精度制御が必要です。このアプリではtoFixed()メソッドを使用して、用途に応じた精度で結果を表示しています。長さと重さの変換ではtoFixed(6)により小数点以下6桁まで表示し、ミリメートルやミリグラムのような小さな単位への変換でも十分な精度を確保しています。温度変換ではtoFixed(2)により小数点以下2桁に制限し、実用的な精度と可読性のバランスを保っています。この設計により、0.1 + 0.2が0.30000000000000004となるような浮動小数点の問題をユーザーに見せることなく、見やすい形式で結果を提示できます。

// 拡張アイディア
// 追加の単位カテゴリー
// 面積の変換（平方メートル、坪、エーカーなど）
// 体積の変換（リットル、ガロン、立方メートルなど）
// 速度の変換（km/h、m/s、mph、ノットなど）
// データ容量の変換（バイト、KB、MB、GBなど）
// 双方向リアルタイム変換
// 入力フィールドに入力すると即座に出力を更新
// 出力フィールドを編集すると逆変換
// デバウンス処理による最適化
// 学べること
// 数学的アルゴリズム
// 基準単位を介した効率的な変換パターン
// 線形変換と非線形変換の違い
// 精度を保つ浮動小数点演算（toFixedによる丸め処理）
// 用途に応じた適切な精度の選択