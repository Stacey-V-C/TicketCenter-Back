export enum Area {
  BACKEND,
  FRONTEND,
  DATABASE,
  INFRA,
}

export enum ContentFields {
  'title',
  'description',
  'history',
  'adminNotes',
  'customerCommunication',
}

export type Ticket = {
  id: number,
  area: Area,
  content: {
    title: string,
    description: string,
    history: string[],
    adminNotes: string[],
    customerCommunication: string[],
  }
}

export enum PluginType {
  FILTER_AREA,
  REMOVE_CONTENT_FIELD,
  BOLD_TEXT,
}

export type Plugin =
  | {
    readonly type: PluginType.FILTER_AREA,
    keptAreas: Area[],
    editable?: boolean,
  }
  | {
    readonly type: PluginType.REMOVE_CONTENT_FIELD,
    removedContentField: ContentFields,
    editable?: boolean,
  }
  | {
    readonly type: PluginType.BOLD_TEXT,
    word: string,
    editable?: boolean,
  }

export type PluginState = {
  areas: Area[],
  contentFields: ContentFields[],
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
    Area.FRONTEND,
    Area.BACKEND,
    Area.INFRA,
    Area.DATABASE
  ],
  contentFields: [
    ContentFields.title,
    ContentFields.description,
    ContentFields.history,
    ContentFields.adminNotes,
    ContentFields.customerCommunication,
  ],
  boldWords: [],
};

export type View = { name: string, plugins: Plugin[] }

export type ProcessedView = {
  name: string,
  plugins: PluginSummary[],
  tickets: Ticket[],
}