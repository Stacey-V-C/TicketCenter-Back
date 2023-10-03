import { DAO } from ".";
import { Area, PluginType } from "../types"
import type { Team, User } from "../types"

let dao: DAO;

const mockTeams = [
  {
    name: 'red',
    plugins: [
      { type: PluginType.FILTER_AREA, keptAreas: [Area.BACKEND] },
    ]
  }
] as Team[];

const mockUsers = [
  {
    userId: 'Ex Red',
    team: 'red',
    flags: { admin: false },
    plugins: [
      { type: PluginType.BOLD_TEXT, word: 'urgent' },
    ]
  },
  {
    userId: 'Admin Red',
    team: 'red',
    flags: { admin: true },
    plugins: [
      { type: PluginType.FILTER_AREA, keptAreas: [Area.INFRA] },
    ]
  }
] as User[];

describe("Database tests", () => {
  describe("Test initializeData", () => {
    beforeEach(() => {
      dao = new DAO();
    })
    it("Should create plugins for team red and/or blue if provided", () => {
      dao.initializeData(mockTeams, []);

      expect(dao.data.teams.red.plugins).toEqual(mockTeams[0].plugins);
      expect(dao.data.teams.blue).toBeUndefined();
      expect(dao.data.users).toEqual({});
    });

    it("Should create settings for users if provided", () => {
        dao.initializeData([], mockUsers);
    
        expect(dao.data.teams).toEqual({});
        expect(dao.data.users).toEqual({
            'Ex Red': mockUsers[0],
            'Admin Red': mockUsers[1],
        });
    })
  });
});