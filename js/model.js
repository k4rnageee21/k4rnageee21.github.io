import { controller } from "./controller.js";
import { view } from "./view.js";

export const model = {
    hours: 0, 
    displayHours: "00",
    minutes: 0, 
    displayMinutes: "00",
    seconds: 0, 
    displaySeconds: "00",
    startData: [0, 0, 0],
    secondsCount: 0,
    tick: undefined,
    isTick: false,

    secondsTick(timer) {
        timer.secondsCount++;
        if (timer.seconds == 0) {
            if (timer.minutes > 0) {
                timer.minutes--;
                timer.displayMinutes = timer.minutes < 10 ? "0" + timer.minutes : timer.minutes;
                view.displayMinutes(timer.displayMinutes);
                timer.seconds = 59;
                view.displaySeconds(timer.seconds);
            } else {
                if (timer.hours > 0) {
                    timer.hours--;
                    timer.displayHours = timer.hours < 10 ? "0" + timer.hours : timer.hours;
                    view.displayHours(timer.displayHours);
                    timer.minutes = 59;
                    view.displayMinutes(timer.minutes);
                    timer.seconds = 59;
                    view.displaySeconds(timer.seconds);
                }
                else {
                    clearInterval(timer.tick);
                    timer.isTick = false;
                    let choice = controller.choiceConfirm("Timer is up! You have worked all the scheduled time. Save result to your profile?");
                    if (choice) {
                        view.showLogInMessage();
                    }
                }
            }
        } else {
            timer.seconds--;
            timer.displaySeconds = timer.seconds < 10 ? "0" + timer.seconds : timer.seconds;
            view.displaySeconds(timer.displaySeconds);
        }
    },

    startTimer() {
        if (!this.isTick && (this.hours || this.minutes || this.seconds)) {
            this.isTick = true;
            this.tick = setInterval(this.secondsTick, 1000, this);
        }
    },

    resetTimer() {
        this.isTick = false;
        clearInterval(this.tick);
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        view.resetDisplay();
        this.startData = [0, 0, 0];
        this.secondsCount = 0;
    },

    pauseTimer() {
        if (this.isTick) {
            this.isTick = false;
            clearInterval(this.tick);
        }
    },

    saveTimer() {
        this.pauseTimer();
        let hoursWorked = Math.floor(this.secondsCount / 3600);
        let minutesWorked = Math.floor((this.secondsCount - hoursWorked * 3600) / 60);
        let secondsWorked = this.secondsCount - minutesWorked * 60 - hoursWorked * 3600;
        let str = `You worked ${hoursWorked} hours, ${minutesWorked} minutes and ${secondsWorked} seconds out of the planned ${this.startData[0]} hours, ${this.startData[1]} minutes and ${this.startData[2]} seconds. Save result to your profile?`;
        let choice = controller.choiceConfirm(str);
        if (choice) {
            view.showLogInMessage();
        }
        choice = confirm("Reset timer?", false);
        if (choice) {
            this.resetTimer();
        }
    }
};