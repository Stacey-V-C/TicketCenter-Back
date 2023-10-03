"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const db_1 = require("../db");
const processing_1 = require("../processing");
const data_1 = require("../data");
class Controller {
    constructor(cb) {
        Object.defineProperty(this, "dao", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new db_1.DAO()
        });
        Object.defineProperty(this, "getUserData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (userId) => {
                const views = await this.getViews(userId);
                const tickets = await this.dao.getTickets();
                return views.map(v => this.processViewAndTickets(v, tickets));
            }
        });
        Object.defineProperty(this, "processViewAndTickets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (view, allTickets) => {
                const summary = (0, processing_1.summarizePlugins)(view.plugins);
                const plugins = summary.plugins
                    .filter(({ plugin }) => plugin.isEditable);
                const tickets = (0, processing_1.applyStateToTickets)(summary.latestState, allTickets);
                return { name: view.name, plugins, tickets };
            }
        });
        Object.defineProperty(this, "getViews", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (userId) => {
                const allowEditing = (plugins) => plugins.map(p => ({ ...p, isEditable: true }));
                const { flags, team, plugins: userPlugins } = await this.dao.getUserSettings(userId);
                const teamPlugins = await this.dao.getTeamPlugins(team);
                if (flags.admin) {
                    const teamMemberViews = await this.getTeamMemberViews(team, teamPlugins);
                    const ownPlugins = [...teamPlugins, ...(allowEditing(userPlugins))];
                    return [
                        { name: userId, plugins: ownPlugins },
                        { name: 'Team', plugins: allowEditing(teamPlugins) },
                        ...teamMemberViews,
                    ];
                }
                else {
                    const plugins = [...teamPlugins, ...(allowEditing(userPlugins))];
                    return [{ name: userId, plugins }];
                }
            }
        });
        Object.defineProperty(this, "getTeamMemberViews", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (team, teamPlugins) => {
                const teamMembers = await this.dao.getTeamMembers(team);
                return await Promise.all(teamMembers.map(async (user) => {
                    const { plugins: teamMemberPlugins } = await this.dao.getUserSettings(user);
                    const groupedPlugins = [...teamPlugins, ...teamMemberPlugins];
                    return { name: user, plugins: groupedPlugins };
                }));
            }
        });
        Object.defineProperty(this, "refreshTickets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => {
                await this.dao.saveTickets((0, data_1.generateTickets)());
            }
        });
        Object.defineProperty(this, "setUserPlugins", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (userId, plugins) => await this.dao.setUserPlugins(userId, plugins)
        });
        Object.defineProperty(this, "setTeamPlugins", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (team, plugins) => await this.dao.setTeamPlugins(team, plugins)
        });
        Object.defineProperty(this, "getUserSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (userId) => await this.dao.getUserSettings(userId)
        });
        this.dao = new db_1.DAO(cb);
    }
}
exports.Controller = Controller;
