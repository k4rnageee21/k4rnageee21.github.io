"use strict";

window.addEventListener("DOMContentLoaded", () => {
    const units = document.getElementsByClassName("units");
    const startBtn = document.getElementsByClassName("buttons__start")[0];
    const pauseBtn = document.getElementsByClassName("buttons__pause")[0];
    const resetBtn = document.getElementsByClassName("buttons__reset")[0];
    const saveBtn = document.getElementsByClassName("buttons__save")[0];
    let hours = 0, displayHours = "00";
    let minutes = 0, displayMinutes = "00";
    let seconds = 0, displaySeconds = "00";
    let tick;
    let isTick = false;

    units[0].addEventListener("click", (event) => {
        hours = +prompt("Enter hours:", 0);
        while (hours < 0) {
            hours = +prompt("Enter hours correctly (>= 0):", 0);
        }
        displayHours = hours < 10 ? "0" + hours : hours;
        units[0].innerHTML = displayHours;
    });
    units[1].addEventListener("click", (event) => {
        minutes = +prompt("Enter minutes:", 0);
        while (minutes < 0 || minutes > 59) {
            minutes = +prompt("Enter minutes correctly (0-59 range):", 0);
        }
        displayMinutes = minutes < 10 ? "0" + minutes : minutes;
        units[1].innerHTML = displayMinutes;
    });
    units[2].addEventListener("click", (event) => {
        seconds = +prompt("Enter seconds:", 0);
        while (seconds < 0 || seconds > 59) {
            seconds = +prompt("Enter seconds correctly (0-59 range):", 0);
        }
        displaySeconds = seconds < 10 ? "0" + seconds : seconds;
        units[2].innerHTML = displaySeconds;
    });

    startBtn.addEventListener("click", (event) => {
        if (!isTick && hours || minutes || seconds) {
            isTick = true;
            tick = setInterval(() => {
                if (seconds == 0) {
                    if (minutes > 0) {
                        minutes--;
                        displayMinutes = minutes < 10 ? "0" + minutes : minutes;
                        units[1].innerHTML = displayMinutes;
                        seconds = 59;
                        units[2].innerHTML = seconds;
                    } else {
                        if (hours > 0) {
                            hours--;
                            displayHours = hours < 10 ? "0" + hours : hours;
                            units[0].innerHTML = displayHours;
                            minutes = 59;
                            units[1].innerHTML = minutes;
                            seconds = 59;
                            units[2].innerHTML = seconds;
                        }
                        else {
                            clearInterval(tick);
                            isTick = false;
                            alert("Timer is done");
                        }
                    }
                } else {
                    seconds--;
                    displaySeconds = seconds < 10 ? "0" + seconds : seconds;
                    units[2].innerHTML = displaySeconds;
                }
            }, 1000);
        }
    });

    pauseBtn.addEventListener("click", () => {
        if (isTick) {
            isTick = false;
            clearInterval(tick);
        }
    });

    resetBtn.addEventListener("click", () => {
        isTick = false;
        clearInterval(tick);
        hours = 0;
        minutes = 0;
        seconds = 0;
        units[0].innerHTML = "00";
        units[1].innerHTML = "00";
        units[2].innerHTML = "00";
    });

    saveBtn.addEventListener("click", () => {

    });
});