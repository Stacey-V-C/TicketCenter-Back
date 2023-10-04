import { Controller } from ".";
import { Area, Plugin, PluginType, Ticket, View } from "../types";
import { initialState } from "../types";

const controller = new Controller();

const saveTickets = jest.spyOn(controller.dao, "saveTickets")

describe("Controller tests", () => {
  describe("Refresh tickets", () => {
    it("Should call save tickets with generated tickets", () => {
      controller.refreshTickets();

      expect(saveTickets).toHaveBeenCalledWith(expect.any(Array));
    })
  })

  describe("processViewAndTickets", () => {
    const mockTickets: Ticket[] = [
      {
        id: 1,
        area: Area.BACKEND,
        content: "test customer",
      },
      {
        id: 2,
        area: Area.DATABASE,
        content: "test urgent",
      },
      {
        id: 3,
        area: Area.FRONTEND,
        content: "test bug",
      },
      {
        id: 4,
        area: Area.INFRA,
        content: "test down",
      },
    ]

    const mockBoldTextPlugin: Plugin = {
      type: PluginType.BOLD_TEXT,
      word: "urgent",
      isEditable: true,
    }

    const mockFilterAreaPlugin: Plugin = {
      type: PluginType.FILTER_AREA,
      keptAreas: [Area.BACKEND],
      isEditable: true,
    }

    it("Should properly filter tickets", () => {
      const mockView: View = {
        name: "test",
        plugins: [mockFilterAreaPlugin],
      }

      const res = controller.processViewAndTickets(mockView, mockTickets);

      expect(res.tickets).toEqual([mockTickets[0]]);
      expect(res.plugins).toEqual([
        {
          plugin: mockView.plugins[0],
          state: {
            areas: initialState.areas,
            boldWords: [],
          }
        }
      ])
      expect(res.latestState).toEqual({
        areas: [Area.BACKEND],
        boldWords: [],
      })
      expect(res.name).toEqual("test");
    })

    it("Should properly bold text", () => {
      const mockView: View = {
        name: "test",
        plugins: [mockBoldTextPlugin],
      }

      const res = controller.processViewAndTickets(mockView, mockTickets);

      expect(res.tickets).toEqual([
        mockTickets[0],
        {
          ...mockTickets[1],
          content: "test <b>urgent</b>",
        },
        mockTickets[2],
        mockTickets[3],
      ]);

      expect(res.plugins).toEqual([
        {
          plugin: mockView.plugins[0],
          state: {
            areas: initialState.areas,
            boldWords: [],
          }
        }
      ])

      expect(res.latestState).toEqual({
        areas: initialState.areas,
        boldWords: ["urgent"],
      })

      expect(res.name).toEqual("test");
    });

    it("Should not return plugins that are not editable", () => {
      const mockView: View = {
        name: "test",
        plugins: [
          mockBoldTextPlugin,
          {
            ...mockFilterAreaPlugin,
            isEditable: false,
          }
        ],
      }

      const res = controller.processViewAndTickets(mockView, mockTickets);

      expect(res.plugins).toEqual([{
        plugin: mockView.plugins[0],
        state: {
          areas: initialState.areas,
          boldWords: [],
        }
      }]);
    })
  })

  describe("setTeamPlugins", () => {
    const mockTeam = "red";
    const mockPlugins: Plugin[] = [
      {
        type: PluginType.BOLD_TEXT,
        word: "urgent",
        isEditable: true,
      },
      {
        type: PluginType.FILTER_AREA,
        keptAreas: [Area.BACKEND],
        isEditable: true,
      }
    ]

    it("Should call dao with proper arguments", () => {
      const setTeamPlugins = jest.spyOn(controller.dao, "setTeamPlugins");

      controller.dao.initializeData([
        {
          name: "red",
          plugins: [],
        }
      ], [])

      controller.setTeamPlugins(mockTeam, mockPlugins);

      expect(setTeamPlugins).toHaveBeenCalledWith(mockTeam, mockPlugins);
      expect(controller.dao.data.teams.red.plugins)
        .toEqual(mockPlugins.map(p => ({ ...p, isEditable: undefined })));
    })
  })
})