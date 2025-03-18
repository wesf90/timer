let intervalId = null;

self.onmessage = (e) => {
    const { duration, intervalMode } = e.data;
    let timeLeft = duration;

    intervalId = setInterval(() => {
        timeLeft -= 10;

        if (timeLeft < 0) {
            if (intervalMode) {
                timeLeft = duration; // Reset for interval mode
                self.postMessage({ timeLeft, finished: true });
            } else {
                clearInterval(intervalId);
                self.postMessage({ timeLeft: 0, finished: true });
            }
        } else {
            self.postMessage({ timeLeft, finished: false });
        }
    }, 10);
};
