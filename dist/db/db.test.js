"use strict";
// import { getClient } from "../redis";
// import { Area, PluginType } from "../types"
// import type { Team, User } from "../types"
// let hSet: jest.SpyInstance;
// const mockTeams = [
//   {
//     name: 'red',
//     plugins: [
//       { type: PluginType.FILTER_AREA, keptAreas: [Area.BACKEND] },
//     ]
//   }
// ] as Team[];
// const mockUsers = [
//   {
//     userId: 'Ex Red',
//     team: 'red',
//     flags: { admin: false },
//     plugins: [
//       { type: PluginType.BOLD_TEXT, word: 'urgent' },
//     ]
//   },
//   {
//     userId: 'Admin Red',
//     team: 'red',
//     flags: { admin: true },
//     plugins: [
//       { type: PluginType.FILTER_AREA, keptAreas: [Area.INFRA] },
//     ]
//   }
// ] as User[];
// describe("Database tests", () => {
//   describe("Test initializeData", () => {
//     it("Should create plugins for team red and/or blue if provided", async () => {
//       await dao.initializeData(mockTeams, mockUsers);
//       expect(hSet).toHaveBeenCalledWith('team:red', 'plugins', JSON.stringify(mockTeams[0].plugins));
//       expect(hSet).toHaveBeenCalledWith('user:Ex Red', 'team', 'red');
//       expect(hSet).toHaveBeenCalledWith('user:Ex Red', 'flags', JSON.stringify({ admin: false }));
//       expect(hSet).toHaveBeenCalledWith('user:Ex Red', 'plugins', JSON.stringify(mockUsers[0].plugins));
//     })
//   });
// });
