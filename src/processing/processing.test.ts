import { Area, ContentFields, Plugin, PluginType, initialState } from "../types";
import {
  applyPluginToState,
  applyStateToTickets,
  summarizePlugins,
} from "./";

const boldTextPlugin: Plugin = {
  type: PluginType.BOLD_TEXT,
  word: 'urgent',
};

const filterAreaPlugin: Plugin = {
  type: PluginType.FILTER_AREA,
  keptAreas: [Area.FRONTEND, Area.BACKEND, Area.INFRA],
};

const removeContentFieldPlugin: Plugin = {
  type: PluginType.REMOVE_CONTENT_FIELD,
  removedContentField: ContentFields.customerCommunication,
};

const mockTickets = [
  {
    id: 0,
    area: Area.FRONTEND,
    content: {
      title: 'Frontend ticket',
      description: 'This is a frontend ticket',
      history: ['Frontend ticket was created'],
      adminNotes: ['Frontend ticket admin notes'],
      customerCommunication: ['Urgent communication'],
    }
  },
  {
    id: 1,
    area: Area.BACKEND,
    content: {
      title: 'Backend ticket',
      description: 'This is a backend ticket',
      history: ['Ticket declared urgent'],
      adminNotes: ['Backend ticket admin notes'],
      customerCommunication: ['Backend ticket customer communication'],
    }
  }
]

describe("Processing function tests", () => {
  describe("Test applyPluginToState", () => {
    it("Should return the same state if the plugin is not recognized", () => {
      const invalidPlugin = {
        type: 'unknown',
        word: 'urgent'
      } as any as Plugin;

      const state = applyPluginToState(invalidPlugin, initialState);

      expect(state).toEqual(initialState);
    });

    it("Should return the kept areas if the plugin is filterArea", () => {
      const plugin = {
        type: PluginType.FILTER_AREA,
        keptAreas: [Area.FRONTEND, Area.BACKEND]
      } as any as Plugin;

      const state = applyPluginToState(plugin, initialState);

      expect(state).toEqual({
        ...initialState,
        areas: [Area.FRONTEND, Area.BACKEND]
      });
    });

    it("Should not keep areas which were already removed", () => {
      const plugin = {
        type: PluginType.FILTER_AREA,
        keptAreas: [Area.FRONTEND, Area.BACKEND]
      } as any as Plugin;

      const state = applyPluginToState(plugin, {
        ...initialState,
        areas: [Area.BACKEND, Area.INFRA]
      });

      expect(state).toEqual({
        ...initialState,
        areas: [Area.BACKEND]
      });
    });

    it("Should remove the listed field if plugin type is removeContentField", () => {
      const state = applyPluginToState(removeContentFieldPlugin, initialState);

      expect(state).toEqual({
        ...initialState,
        contentFields: [
          ContentFields.title,
          ContentFields.description,
          ContentFields.history,
          ContentFields.adminNotes,
        ],
      });
    });

    it("Should not change state when applying a removeContentField plugin for a field that was already removed", () => {
      const initialStateWithoutCustomerCommunication = {
        ...initialState,
        contentFields: [
          ContentFields.title,
          ContentFields.description,
          ContentFields.history,
          ContentFields.adminNotes,
        ],
      };

      const state = applyPluginToState(removeContentFieldPlugin, initialStateWithoutCustomerCommunication);

      expect(state).toEqual(initialStateWithoutCustomerCommunication);
    });

    it("Should add the bold word if plugin type is boldText", () => {
      const state = applyPluginToState(boldTextPlugin, initialState);

      expect(state).toEqual({
        ...initialState,
        boldWords: [boldTextPlugin.word],
      });
    });

    it("Should not add a word which has already been added", () => {
      const state = applyPluginToState(boldTextPlugin, {
        ...initialState,
        boldWords: [boldTextPlugin.word],
      });

      expect(state).toEqual({
        ...initialState,
        boldWords: [boldTextPlugin.word],
      });
    });

    it("Should not add a different casing of a word which has already been added", () => {
      const state = applyPluginToState(boldTextPlugin, {
        ...initialState,
        boldWords: [boldTextPlugin.word.toUpperCase()],
      });

      expect(state).toEqual({
        ...initialState,
        boldWords: [boldTextPlugin.word.toUpperCase()],
      });
    });
  });
});

describe("Test summarizePlugins", () => {
  it("Should return all tickets, all fields, and no bold words if no plugins are provided", () => {
    const plugins = [];

    const summary = summarizePlugins(plugins);

    expect(summary).toEqual({
      plugins: [],
      finalState: initialState
    });
  });

  it("Should store the initial state with the first provided plugin", () => {
    const plugins = [boldTextPlugin];

    const summary = summarizePlugins(plugins);

    expect(summary).toEqual({
      plugins: [
        {
          plugin: boldTextPlugin,
          state: initialState,
        }
      ],
      finalState: {
        ...initialState,
        boldWords: [boldTextPlugin.word],
      }
    });
  });

  it("Should store the state after applying the nth plugin on the (n + 1)th plugin", () => {
    const plugins = [boldTextPlugin, filterAreaPlugin];

    const summary = summarizePlugins(plugins);

    expect(summary).toEqual({
      plugins: [
        {
          plugin: boldTextPlugin,
          state: initialState,
        },
        {
          plugin: filterAreaPlugin,
          state: {
            ...initialState,
            boldWords: [boldTextPlugin.word],
          },
        }
      ],
      finalState: {
        ...initialState,
        areas: [Area.FRONTEND, Area.BACKEND, Area.INFRA],
        boldWords: [boldTextPlugin.word],
      }
    });
  });

  describe("Test applyStateToTickets", () => {
    it("Should return all tickets unchanged if initial state is unchanged", () => {
      const tickets = applyStateToTickets(initialState, mockTickets);

      expect(tickets).toEqual(mockTickets);
    });

    it("Should return only tickets with areas that are still in the state", () => {
      const state = {
        ...initialState,
        areas: [Area.FRONTEND]
      };

      const tickets = applyStateToTickets(state, mockTickets);

      expect(tickets).toEqual([mockTickets[0]]);
    });

    it("Should return tickets without content fields that are no longer in the state", () => {
      const state = {
        ...initialState,
        contentFields: [ContentFields.title],
      };

      const tickets = applyStateToTickets(state, mockTickets);

      expect(tickets).toEqual([
        {
          ...mockTickets[0],
          content: {
            title: mockTickets[0].content.title,
          }
        },
        {
          ...mockTickets[1],
          content: {
            title: mockTickets[1].content.title,
          }
        }
      ]);
    });

    it("Should apply bold tags and capitalization to bold words in any content field", () => {
      const state = {
        ...initialState,
        boldWords: [boldTextPlugin.word],
      };

      const tickets = applyStateToTickets(state, mockTickets);

      expect(tickets).toEqual([
        {
          ...mockTickets[0],
          content: {
            ...mockTickets[0].content,
            customerCommunication: ['<b>URGENT</b> communication'],
          }
        },
        {
          ...mockTickets[1],
          content: {
            ...mockTickets[1].content,
            history: ['Ticket declared <b>URGENT</b>'],
          }
        }
      ]);
    });
  });
});