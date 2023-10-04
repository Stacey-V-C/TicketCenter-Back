import { PluginType, initialState } from "../types";
import type { Plugin, PluginState, Summary, Ticket } from "../types";

export const applyPluginToState = (plugin: Plugin, state: PluginState) => {
  switch (plugin.type) {
    case PluginType.FILTER_AREA:
      const areas = state.areas
        .filter(a => plugin.keptAreas.includes(a));

      return { ...state, areas };
    case PluginType.BOLD_TEXT:
      const boldWords = state.boldWords.includes(plugin.word) 
        ? state.boldWords 
        : [...state.boldWords, plugin.word];

      return { ...state, boldWords };
    default:
      return state;
  }
}

export const summarizePlugins = (plugins: Plugin[]) =>
  plugins.reduce((acc: Summary, plugin) => {
    const newPlugin = { plugin, state: acc.latestState };

    return {
      plugins: [...acc.plugins, newPlugin],
      latestState: applyPluginToState(plugin, acc.latestState),
    };
  }, { plugins: [], latestState: initialState });

export const applyStateToTickets = (state: PluginState, tickets: Ticket[]): Ticket[] =>
  tickets
    .filter(t => state.areas.includes(t.area))
    .map(t => {
      const newContext = state.boldWords.reduce((text: string, word: string) => {
        return text.replace(word, `<b>${word}</b>`);
      }, t.content)

      return { ...t, content: newContext };
    });
