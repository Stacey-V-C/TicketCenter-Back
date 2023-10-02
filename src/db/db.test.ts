import redis from "redis"; // mock this?

import { Area } from "../types"
import { initializeData } from "./index"

const client = redis.createClient();

const mockTeams = [
  {
    name: 'red',
    plugins: [
      { type: 'filterArea', keptAreas: [Area.BACKEND] },
    ]
  }
]

const mockUsers = [
  {
    userId: 'Ex Red',
    team: 'red',
    flags: { admin: false },
    plugins: [
      { type: 'boldText', word: 'urgent' },
    ]
  },
  {
    userId: 'Admin Red',
    team: 'red',
    flags: { admin: true },
    plugins: [
      { type: 'filterArea', keptAreas: [Area.INFRA] },
    ]
  }
]

describe("Database tests", () => {
  describe("Test initializeData", () => {
    it("Should create plugins for team red and/or blue if provided", async () => {
      await initializeData(mockTeams, []);

      const res = await client.hGet(`team:red`, 'plugins');

      expect(res).toEqual(JSON.stringify(mockTeams[0].plugins));
    })

    it("Should create users if provided", async () => {
      await initializeData([], mockUsers);

      const team = await client.hGet(`user:${mockUsers[0].userId}`, 'team');
      const flags = await client.hGet(`user:${mockUsers[0].userId}`, 'flags');
      const plugins = await client.hGet(`user:${mockUsers[0].userId}`, 'plugins');

      expect(team).toEqual(mockUsers[0].team);
      expect(flags).toEqual(JSON.stringify(mockUsers[0].flags));
      expect(plugins).toEqual(JSON.stringify(mockUsers[0].plugins));
    });
  });
});