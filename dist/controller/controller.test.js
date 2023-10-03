"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const controller = new _1.Controller();
const saveTickets = jest.spyOn(controller.dao, 'saveTickets').mockImplementation((d) => {
    return Promise.resolve([null]);
});
describe("Controller tests", () => {
    describe("Refresh tickets", () => {
        it("Should call save tickets with generated tickets", () => {
            controller.refreshTickets();
            expect(saveTickets).toHaveBeenCalledWith(expect.any(Array));
        });
    });
});
