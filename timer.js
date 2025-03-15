document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const timeInput = document.getElementById('timeInput');
    const startTimerBtn = document.getElementById('startTimerBtn');
    const startIntervalBtn = document.getElementById('startIntervalBtn');
    const stopBtn = document.getElementById('stopBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const presetButtons = document.querySelectorAll('.preset-btn');

    let intervalId = null;
    let isIntervalMode = false;
    let baseTime = 0;
    let intervalCount = 0; // New interval counter
    const beep = new Audio('beep.mp3');

    // Format time to MM:SS.ss with optional interval count
    const formatTime = (milliseconds, showCounter = false) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        const hundredths = Math.floor((milliseconds % 1000) / 10).toString().padStart(2, '0');
        const baseTimeStr = `${minutes}:${seconds}.${hundredths}`;
        return showCounter ? `${baseTimeStr} <span class="interval-counter">(${intervalCount})</span>` : baseTimeStr;
    };

    // Trigger beep and vibration
    const triggerFeedback = () => {
        beep.play();
        if ('vibrate' in navigator) {
            navigator.vibrate(200);
        }
    };

    // Update display during countdown
    const startCountdown = (durationMs) => {
        let timeLeft = durationMs;
        clearInterval(intervalId);

        intervalId = setInterval(() => {
            if (timeLeft >= 0) {
                timerDisplay.innerHTML = formatTime(timeLeft, isIntervalMode);
                timeLeft -= 10;
            } else {
                triggerFeedback();
                if (isIntervalMode) {
                    intervalCount++; // Increment counter
                    timeLeft = baseTime;
                } else {
                    clearInterval(intervalId);
                    intervalId = null;
                    stopBtn.disabled = true;
                }
            }
        }, 10);
    };

    // Preset buttons
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const seconds = parseInt(button.dataset.seconds);
            timeInput.value = seconds;
        });
    });

    // Start Timer (one-shot)
    startTimerBtn.addEventListener('click', () => {
        if (intervalId) return;
        const seconds = parseInt(timeInput.value);
        if (isNaN(seconds) || seconds <= 0) return;

        baseTime = seconds * 1000;
        isIntervalMode = false;
        intervalCount = 0; // Reset counter
        stopBtn.disabled = false;
        startCountdown(baseTime);
    });

    // Start Interval (repeating)
    startIntervalBtn.addEventListener('click', () => {
        if (intervalId) return;
        const seconds = parseInt(timeInput.value);
        if (isNaN(seconds) || seconds <= 0) return;

        baseTime = seconds * 1000;
        isIntervalMode = true;
        intervalCount = 0; // Start at 0
        stopBtn.disabled = false;
        startCountdown(baseTime);
    });

    // Stop
    stopBtn.addEventListener('click', () => {
        clearInterval(intervalId);
        intervalId = null;
        isIntervalMode = false;
        intervalCount = 0; // Reset counter
        timerDisplay.innerHTML = '00:00.00';
        stopBtn.disabled = true;
    });
});
