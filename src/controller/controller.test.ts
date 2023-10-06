import { Controller } from ".";
import { Area, Plugin, PluginType, Team, Ticket, User, View } from "../types";
import { initialState } from "../types";

describe("Controller tests", () => {
  let controller: Controller;

  beforeEach(() => {
    controller = new Controller();
    jest.clearAllMocks();
  })
  describe("Get user data", () => {
    it("Should call getViews with userId", () => {
      const getViews = jest.spyOn(controller, "getViews")
        .mockImplementationOnce(() => []);

      controller.getUserData("test");
      expect(getViews).toHaveBeenCalledWith("test");
    });

    it("Should pass call processViewAndTickets with all tickets once for each view", () => {
      const mockViews: View[] = [
        {
          name: "test",
          plugins: [],
        },
        {
          name: "test2",
          plugins: [],
        },
      ];
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
      ];

      jest.spyOn(controller, "getViews")
        .mockReturnValueOnce(mockViews);

      const getTickets = jest.spyOn(controller.dao, "getTickets")
        .mockReturnValue(mockTickets);

      const processViewAndTickets = jest.spyOn(controller, "processViewAndTickets");

      controller.getUserData("test");

      expect(getTickets).toHaveBeenCalledTimes(1);
      expect(processViewAndTickets).toHaveBeenCalledTimes(2);

      expect(processViewAndTickets).toHaveBeenNthCalledWith(1, mockViews[0], mockTickets);
      expect(processViewAndTickets).toHaveBeenNthCalledWith(2, mockViews[1], mockTickets);
    });
  });

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

  describe("getViews", () => {
    const mockTeams: Team[] = [
      {
        name: "red",
        plugins: [{ type: PluginType.BOLD_TEXT, word: "urgent" }],
      },
      {
        name: "blue",
        plugins: [{ type: PluginType.FILTER_AREA, keptAreas: [Area.BACKEND] }],
      },
    ]

    const mockUserSettings: User[] = [
      {
        userId: "Admin Red",
        team: "red",
        flags: { admin: true },
        plugins: [{ type: PluginType.FILTER_AREA, keptAreas: [Area.INFRA] }],
      },
      {
        userId: "Senior Red",
        team: "red",
        flags: { admin: false },
        plugins: [{ type: PluginType.BOLD_TEXT, word: "easy" }],
      },
      {
        userId: "Junior Red",
        team: "red",
        flags: { admin: false },
        plugins: [{ type: PluginType.BOLD_TEXT, word: "bug" }],
      },
      {
        userId: "Admin Blue",
        team: "blue",
        flags: { admin: true },
        plugins: [{ type: PluginType.BOLD_TEXT, word: "error" }],
      },
      {
        userId: "Senior Blue",
        team: "blue",
        flags: { admin: false },
        plugins: [{ type: PluginType.BOLD_TEXT, word: "urgent" }],
      },
      {
        userId: "Junior Blue",
        team: "blue",
        flags: { admin: false },
        plugins: [{ type: PluginType.FILTER_AREA, keptAreas: [Area.INFRA] }],
      },
    ]

    beforeEach(() => {
      controller = new Controller();
    })

    it("should return 4 views for admins", () => {
      controller.dao.initializeData(mockTeams, mockUserSettings);

      const res = controller.getViews("Admin Red");

      expect(res).toHaveLength(4);
      expect(res[0].name).toEqual("Admin Red");
      expect(res[1].name).toEqual("Team");
      expect(res[2].name).toEqual("Junior Red");
      expect(res[3].name).toEqual("Senior Red");
    });

    it("should return 1 view for non-admins", () => {
      controller.dao.initializeData(mockTeams, mockUserSettings);

      const res = controller.getViews("Senior Red");

      expect(res).toHaveLength(1);
      expect(res[0].name).toEqual("Senior Red");
    });

    it("should allow admins to edit their own plugins and team plugins", () => {
      controller.dao.initializeData(mockTeams, mockUserSettings);

      const res = controller.getViews(mockUserSettings[0].userId);

      const ownViewEditablePlugins = res[0].plugins.filter(p => p.isEditable);
      const teamViewEditablePlugins = res[1].plugins.filter(p => p.isEditable);

      expect(ownViewEditablePlugins).toEqual([
        {
          ...mockUserSettings[0].plugins[0],
          isEditable: true,
        }
      ]);
      expect(teamViewEditablePlugins).toEqual([
        {
          ...mockTeams[0].plugins[0],
          isEditable: true,
        }
      ]);
    });

    it("should not allow admins to edit other team members' plugins", () => {
      controller.dao.initializeData(mockTeams, mockUserSettings);

      const res = controller.getViews(mockUserSettings[0].userId);

      const teamMemberViews = res.slice(2);

      for (const view of teamMemberViews) {
        const editablePlugins = view.plugins.filter(p => p.isEditable);
        expect(editablePlugins).toEqual([]);
      }
    });

    it("should allow non-admins to edit their own plugins", () => {
      controller.dao.initializeData(mockTeams, mockUserSettings);

      const res = controller.getViews(mockUserSettings[1].userId);

      const editablePlugins = res[0].plugins.filter(p => p.isEditable);

      expect(editablePlugins).toEqual([
        {
          ...mockUserSettings[1].plugins[0],
          isEditable: true,
        }
      ]);
    });
  })

  describe("Refresh tickets", () => {
    it("Should call save tickets with generated tickets", () => {
      const saveTickets = jest.spyOn(controller.dao, "saveTickets");

      controller.refreshTickets();

      expect(saveTickets).toHaveBeenCalledWith(expect.any(Array));
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