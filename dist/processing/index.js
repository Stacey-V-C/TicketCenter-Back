"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyStateToTickets = exports.summarizePlugins = exports.applyPluginToState = void 0;
const types_1 = require("../types");
const applyPluginToState = (plugin, state) => {
    switch (plugin.type) {
        case types_1.PluginType.FILTER_AREA:
            const areas = state.areas
                .filter(a => plugin.keptAreas.includes(a));
            return { ...state, areas };
        case types_1.PluginType.BOLD_TEXT:
            const redundant = state.boldWords
                .map(w => w.toLowerCase())
                .includes(plugin.word.toLowerCase());
            const boldWords = redundant ? state.boldWords : [...state.boldWords, plugin.word];
            return { ...state, boldWords };
        default:
            return state;
    }
};
exports.applyPluginToState = applyPluginToState;
const summarizePlugins = (plugins) => {
    const initial = { plugins: [], latestState: types_1.initialState };
    return plugins.reduce((acc, plugin) => {
        const newPlugin = { plugin, state: acc.latestState };
        return {
            plugins: [...acc.plugins, newPlugin],
            latestState: (0, exports.applyPluginToState)(plugin, acc.latestState),
        };
    }, initial);
};
exports.summarizePlugins = summarizePlugins;
const applyStateToTickets = (state, tickets) => tickets
    .filter(t => state.areas.includes(t.area))
    .map(t => {
    for (const word of state.boldWords) {
        t.content = t.content.replace(word, `<b>${word}</b>`);
    }
    return t;
});
exports.applyStateToTickets = applyStateToTickets;
