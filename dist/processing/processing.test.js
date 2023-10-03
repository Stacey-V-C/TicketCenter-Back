"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const _1 = require("./");
const boldTextPlugin = {
    type: types_1.PluginType.BOLD_TEXT,
    word: 'urgent',
};
const filterAreaPlugin = {
    type: types_1.PluginType.FILTER_AREA,
    keptAreas: [types_1.Area.FRONTEND, types_1.Area.BACKEND, types_1.Area.INFRA],
};
const mockTickets = [
    {
        id: 0,
        area: types_1.Area.FRONTEND,
        content: 'An urgent bug was found on the frontend',
    },
    {
        id: 1,
        area: types_1.Area.BACKEND,
        content: 'Customer noticed some issues that may have been caused by downtime'
    }
];
describe("Processing function tests", () => {
    describe("Test applyPluginToState", () => {
        it("Should return the same state if the plugin is not recognized", () => {
            const invalidPlugin = {
                type: 'unknown',
                word: 'urgent'
            };
            const state = (0, _1.applyPluginToState)(invalidPlugin, types_1.initialState);
            expect(state).toEqual(types_1.initialState);
        });
        it("Should return the kept areas if the plugin is filterArea", () => {
            const plugin = {
                type: types_1.PluginType.FILTER_AREA,
                keptAreas: [types_1.Area.FRONTEND, types_1.Area.BACKEND]
            };
            const state = (0, _1.applyPluginToState)(plugin, types_1.initialState);
            expect(state).toEqual({
                ...types_1.initialState,
                areas: [types_1.Area.FRONTEND, types_1.Area.BACKEND]
            });
        });
        it("Should not keep areas which were already removed", () => {
            const plugin = {
                type: types_1.PluginType.FILTER_AREA,
                keptAreas: [types_1.Area.FRONTEND, types_1.Area.BACKEND]
            };
            const state = (0, _1.applyPluginToState)(plugin, {
                ...types_1.initialState,
                areas: [types_1.Area.BACKEND, types_1.Area.INFRA]
            });
            expect(state).toEqual({
                ...types_1.initialState,
                areas: [types_1.Area.BACKEND]
            });
        });
        it("Should add the bold word if plugin type is boldText", () => {
            const state = (0, _1.applyPluginToState)(boldTextPlugin, types_1.initialState);
            expect(state).toEqual({
                ...types_1.initialState,
                boldWords: [boldTextPlugin.word],
            });
        });
        it("Should not add a word which has already been added", () => {
            const state = (0, _1.applyPluginToState)(boldTextPlugin, {
                ...types_1.initialState,
                boldWords: [boldTextPlugin.word],
            });
            expect(state).toEqual({
                ...types_1.initialState,
                boldWords: [boldTextPlugin.word],
            });
        });
        it("Should not add a different casing of a word which has already been added", () => {
            const state = (0, _1.applyPluginToState)(boldTextPlugin, {
                ...types_1.initialState,
                boldWords: [boldTextPlugin.word.toUpperCase()],
            });
            expect(state).toEqual({
                ...types_1.initialState,
                boldWords: [boldTextPlugin.word.toUpperCase()],
            });
        });
    });
});
describe("Test summarizePlugins", () => {
    it("Should return all tickets, all fields, and no bold words if no plugins are provided", () => {
        const plugins = [];
        const summary = (0, _1.summarizePlugins)(plugins);
        expect(summary).toEqual({
            plugins: [],
            latestState: types_1.initialState
        });
    });
    it("Should store the initial state with the first provided plugin", () => {
        const plugins = [boldTextPlugin];
        const summary = (0, _1.summarizePlugins)(plugins);
        expect(summary).toEqual({
            plugins: [
                {
                    plugin: boldTextPlugin,
                    state: types_1.initialState,
                }
            ],
            latestState: {
                ...types_1.initialState,
                boldWords: [boldTextPlugin.word],
            }
        });
    });
    it("Should store the state after applying the nth plugin on the (n + 1)th plugin", () => {
        const plugins = [boldTextPlugin, filterAreaPlugin];
        const summary = (0, _1.summarizePlugins)(plugins);
        expect(summary).toEqual({
            plugins: [
                {
                    plugin: boldTextPlugin,
                    state: types_1.initialState,
                },
                {
                    plugin: filterAreaPlugin,
                    state: {
                        ...types_1.initialState,
                        boldWords: [boldTextPlugin.word],
                    },
                }
            ],
            latestState: {
                ...types_1.initialState,
                areas: [types_1.Area.FRONTEND, types_1.Area.BACKEND, types_1.Area.INFRA],
                boldWords: [boldTextPlugin.word],
            }
        });
    });
    describe("Test applyStateToTickets", () => {
        it("Should return all tickets unchanged if initial state is unchanged", () => {
            const tickets = (0, _1.applyStateToTickets)(types_1.initialState, mockTickets);
            expect(tickets).toEqual(mockTickets);
        });
        it("Should return only tickets with areas that are still in the state", () => {
            const state = {
                ...types_1.initialState,
                areas: [types_1.Area.FRONTEND]
            };
            const tickets = (0, _1.applyStateToTickets)(state, mockTickets);
            expect(tickets).toEqual([mockTickets[0]]);
        });
        it("Should apply bold tags and capitalization to bold words in any content field", () => {
            const state = {
                ...types_1.initialState,
                boldWords: [boldTextPlugin.word],
            };
            const tickets = (0, _1.applyStateToTickets)(state, mockTickets);
            expect(tickets).toEqual([
                {
                    ...mockTickets[0],
                    content: 'An <b>urgent</b> bug was found on the frontend'
                },
                mockTickets[1],
            ]);
        });
    });
});
