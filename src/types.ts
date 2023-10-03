export enum Area {
  BACKEND,
  FRONTEND,
  DATABASE,
  INFRA,
}

export type Ticket = {
  id: number,
  area: Area,
  content: string,
}

export enum PluginType {
  FILTER_AREA,
  BOLD_TEXT,
}

export type Plugin =
  | {
    readonly type: PluginType.FILTER_AREA,
    keptAreas: Area[],
    isEditable?: boolean,
  }
  | {
    readonly type: PluginType.BOLD_TEXT,
    word: string,
    isEditable?: boolean,
  }

export type PluginState = {
  areas: Area[],
  boldWords: string[],
}

export type PluginSummary = { plugin: Plugin, state: PluginState }

export type Summary =
  {
    plugins: PluginSummary[],
    latestState: PluginState,
  }

export const initialState: PluginState = {
  areas: [
    Area.BACKEND,
    Area.FRONTEND,
    Area.DATABASE,
    Area.INFRA,
  ],
  boldWords: [],
};

export type View = { name: string, plugins: Plugin[] }

export type ProcessedView = {
  name: string,
  plugins: PluginSummary[],
  tickets: Ticket[],
  latestState: PluginState,
}

export type User = {
  userId: string,
  team: 'red' | 'blue',
  flags: { admin: boolean },
  plugins: Plugin[],
}

export type UserSettings = Omit<User, 'userId'>;

export type Team = {
  name: 'red' | 'blue',
  plugins: Plugin[],
}