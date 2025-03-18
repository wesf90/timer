document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const timeInput = document.getElementById('timeInput');
    const clearInput = document.getElementById('clearInput');
    const startTimerBtn = document.getElementById('startTimerBtn');
    const startIntervalBtn = document.getElementById('startIntervalBtn');
    const stopBtn = document.getElementById('stopBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const helpToggle = document.getElementById('helpToggle');
    const helpContent = document.getElementById('helpContent');

    let worker = null;
    let isIntervalMode = false;
    let intervalCount = 0;
    const beep = new Audio('beep.mp3');

    // Clear input
    clearInput.addEventListener('click', () => {
        timeInput.value = '';
    });

    // Toggle help section
    helpToggle.addEventListener('click', () => {
        helpContent.classList.toggle('hidden');
    });

    // Format time to MM:SS.ss with optional interval count
    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        const hundredths = Math.floor((milliseconds % 1000) / 10).toString().padStart(2, '0');
        let display = `${minutes}:${seconds}.${hundredths}`;
        if (isIntervalMode) {
            display += ` <span class="interval-counter">(${intervalCount})</span>`;
        }
        return display;
    };

    // Trigger feedback
    const triggerFeedback = () => {
        beep.play();
        if ('vibrate' in navigator) {
            navigator.vibrate(200);
        }
    };

    // Preset buttons
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const secondsToAdd = parseInt(button.dataset.seconds);
            let currentValue = parseInt(timeInput.value) || 0;
            timeInput.value = currentValue + secondsToAdd;
        });
    });

    // Start timer or interval
    const startTimer = (seconds, intervalMode) => {
        if (worker) stopTimer();
        worker = new Worker('timer-worker.js');
        isIntervalMode = intervalMode;
        intervalCount = 0;

        worker.postMessage({ duration: seconds * 1000, intervalMode });
        stopBtn.disabled = false;

        worker.onmessage = (e) => {
            const { timeLeft, finished } = e.data;
            timerDisplay.innerHTML = formatTime(timeLeft);

            if (finished) {
                triggerFeedback();
                if (isIntervalMode) {
                    intervalCount++;
                } else {
                    stopTimer();
                }
            }
        };
    };

    // Stop timer
    const stopTimer = () => {
        if (worker) {
            worker.terminate();
            worker = null;
        }
        isIntervalMode = false;
        intervalCount = 0;
        timerDisplay.innerHTML = '00:00.00';
        stopBtn.disabled = true;
    };

    // Start Timer (one-shot)
    startTimerBtn.addEventListener('click', () => {
        const seconds = parseInt(timeInput.value);
        if (isNaN(seconds) || seconds <= 0) return;
        startTimer(seconds, false);
    });

    // Start Interval (repeating)
    startIntervalBtn.addEventListener('click', () => {
        const seconds = parseInt(timeInput.value);
        if (isNaN(seconds) || seconds <= 0) return;
        startTimer(seconds, true);
    });

    // Stop
    stopBtn.addEventListener('click', stopTimer);
});
