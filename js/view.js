import { controller } from "./controller.js";

export const view = {
    displayHours(hours) {
        controller.units[0].innerHTML = hours;
    },
    displayMinutes(minutes) {
        controller.units[1].innerHTML = minutes;
    },
    displaySeconds(seconds) {
        controller.units[2].innerHTML = seconds;
    },
    resetDisplay() {
        controller.units[0].innerHTML = "00";
        controller.units[1].innerHTML = "00";
        controller.units[2].innerHTML = "00";
    },
    showLogInMessage() {
        alert("To save your result you need to log in!");
    }
};