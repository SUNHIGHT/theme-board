type AlarmOptions = {
    frequency?: number;
    volume?: number;
    duration?: number;
};

export function playAlarm({ frequency = 880, volume = 0.2, duration = 500 }: AlarmOptions) {
    //土台
    const audioContext = new AudioContext();
    //音の波を作るもの
    const oscillator = audioContext.createOscillator();
    //音量調整用
    const gainNode = audioContext.createGain();

    //周波数の設定(Hz)
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    //音を発生させる装置を入れた

    //音量の調整
    gainNode.gain.value = volume;

    //音の流れをつなぐ
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    //setIntervalは何秒間ごとに何度も実行する
    //setTimeOutは何秒たったら一回だけ実行する
    setTimeout(() => {
        oscillator.stop();
        audioContext.close();
    }, duration)
}