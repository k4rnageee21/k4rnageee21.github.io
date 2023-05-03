import { controller } from "./controller.js";
import { view } from "./view.js";
import { model } from "./model.js";

window.addEventListener("DOMContentLoaded", () => {
    controller.getAllUnits();

    controller.units[0].addEventListener("click", () => {
        if (!model.isTick) {
            model.hours = +prompt("Enter hours:", 0);
            while (model.hours < 0 || !isFinite(model.hours)) {
                model.hours = +prompt("Enter hours correctly (>= 0):", 0);
            }
            model.startData[0] = model.hours;
            model.displayHours = model.hours < 10 ? "0" + model.hours : model.hours;
            view.displayHours(model.displayHours);
        }
    });
    
    controller.units[1].addEventListener("click", (event) => {
        if (!model.isTick) {
            model.minutes = +prompt("Enter minutes:", 0);
            while (model.minutes < 0 || model.minutes > 59 || !isFinite(model.minutes)) {
                model.minutes = +prompt("Enter minutes correctly (0-59 range):", 0);
            }
            model.startData[1] = model.minutes;
            model.displayMinutes = model.minutes < 10 ? "0" + model.minutes : model.minutes;
            view.displayMinutes(model.displayMinutes);
        }      
    });
    
    controller.units[2].addEventListener("click", (event) => {
        if (!model.isTick) {
            model.seconds = +prompt("Enter seconds:", 0);
            while (model.seconds < 0 || model.seconds > 59 || !isFinite(model.seconds)) {
                model.seconds = +prompt("Enter seconds correctly (0-59 range):", 0);
            }
            model.startData[2] = model.seconds;
            model.displaySeconds = model.seconds < 10 ? "0" + model.seconds : model.seconds;
            view.displaySeconds(model.displaySeconds);
        }
    });
    
    controller.startBtn.addEventListener("click", (event) => {
        model.startTimer();
    });
    
    controller.pauseBtn.addEventListener("click", () => {
        model.pauseTimer();
    });
    
    controller.resetBtn.addEventListener("click", () => {
        model.resetTimer();
    });
    
    controller.saveBtn.addEventListener("click", () => {
        model.saveTimer();
    });
});