export const controller = {
    units: [],
    startBtn: undefined,
    pauseBtn: undefined,
    resetBtn: undefined,
    saveBtn: undefined,

    getAllUnits() {
        this.units = document.getElementsByClassName("units");
        this.startBtn = document.getElementsByClassName("buttons__start")[0];
        this.pauseBtn = document.getElementsByClassName("buttons__pause")[0];
        this.resetBtn = document.getElementsByClassName("buttons__reset")[0];
        this.saveBtn = document.getElementsByClassName("buttons__save")[0];
    },

    choiceConfirm(str) {
        return confirm(str, false);
    }
};