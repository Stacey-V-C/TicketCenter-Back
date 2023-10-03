import { PluginType, initialState } from "../types";
import type { Plugin, PluginState, Summary, Ticket } from "../types";

export const applyPluginToState = (plugin: Plugin, state: PluginState) => {
  switch (plugin.type) {
    case PluginType.FILTER_AREA:
      const areas = state.areas
        .filter(a => plugin.keptAreas.includes(a) || false);

      return { ...state, areas };
    case PluginType.BOLD_TEXT:
      const redundant = state.boldWords
        .map(w => w.toLowerCase())
        .includes(plugin.word.toLowerCase());

      const boldWords = redundant ? state.boldWords : [...state.boldWords, plugin.word];

      return { ...state, boldWords };
    default:
      return state;
  }
}

export const summarizePlugins = (plugins: Plugin[]) => {
  const initial: Summary = { plugins: [], latestState: initialState }

  return plugins.reduce((acc, plugin) => {
    const newPlugin = { plugin, state: acc.latestState };

    return {
      plugins: [...acc.plugins, newPlugin],
      latestState: applyPluginToState(plugin, acc.latestState),
    };
  }, initial);
}

export const applyStateToTickets = (state: PluginState, tickets: Ticket[]): Ticket[] =>
  tickets
    .filter(t => state.areas.includes(t.area))
    .map(t => {
      for (const word of state.boldWords) {
        t.content = t.content.replace(word, `<b>${word}</b>`);
      }

      return t;
    });
