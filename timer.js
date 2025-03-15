document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const simpleTimeInput = document.getElementById('simpleTimeInput');
    const startSimpleBtn = document.getElementById('startSimpleBtn');
    const simpleDisplay = document.getElementById('simpleDisplay');
    
    const intervalTimeInput = document.getElementById('intervalTimeInput');
    const startIntervalBtn = document.getElementById('startIntervalBtn');
    const stopIntervalBtn = document.getElementById('stopIntervalBtn');
    const intervalDisplay = document.getElementById('intervalDisplay');

    let simpleIntervalId = null;
    let intervalId = null;
    const beep = new Audio('beep.mp3'); // You'll need to provide this file

    // Simple Timer
    startSimpleBtn.addEventListener('click', () => {
        if (simpleIntervalId) clearInterval(simpleIntervalId);
        
        let time = parseInt(simpleTimeInput.value);
        if (isNaN(time) || time <= 0) return;

        simpleIntervalId = setInterval(() => {
            if (time > 0) {
                simpleDisplay.textContent = `Time: ${time}s`;
                time--;
            } else {
                clearInterval(simpleIntervalId);
                simpleDisplay.textContent = 'Time: 0s';
                beep.play();
            }
        }, 1000);
    });

    // Interval Timer
    let isIntervalRunning = false;

    startIntervalBtn.addEventListener('click', () => {
        if (isIntervalRunning) return;
        
        let baseTime = parseInt(intervalTimeInput.value);
        if (isNaN(baseTime) || baseTime <= 0) return;

        isIntervalRunning = true;
        startIntervalBtn.disabled = true;
        stopIntervalBtn.disabled = false;

        let time = baseTime;
        
        intervalId = setInterval(() => {
            if (time > 0) {
                intervalDisplay.textContent = `Interval: ${time}s`;
                time--;
            } else {
                beep.play();
                time = baseTime;
            }
        }, 1000);
    });

    stopIntervalBtn.addEventListener('click', () => {
        if (!isIntervalRunning) return;
        
        clearInterval(intervalId);
        isIntervalRunning = false;
        startIntervalBtn.disabled = false;
        stopIntervalBtn.disabled = true;
        intervalDisplay.textContent = 'Interval: Stopped';
    });
});
