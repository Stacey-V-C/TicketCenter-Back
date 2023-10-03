"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAO = void 0;
const redis_1 = require("../redis");
class DAO {
    constructor(cb) {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "isConnected", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => !!this.client && this.client.isOpen
        });
        Object.defineProperty(this, "saveTickets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (tickets) => await Promise.all(tickets.map(async (ticket) => await this.client?.set(`ticket:${ticket.id}`, JSON.stringify(ticket))))
        });
        Object.defineProperty(this, "getTickets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => {
                const keys = await this.client?.keys('ticket:*');
                const res = await Promise.all(keys?.map(async (key) => {
                    const ticket = await this.client?.get(key);
                    return ticket ? JSON.parse(ticket) : null;
                }) || []);
                return res.filter(t => !!t);
            }
        });
        Object.defineProperty(this, "setUserPlugins", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (userId, plugins) => await this.client?.hSet(`user:${userId}`, `plugins`, JSON.stringify(plugins))
        });
        Object.defineProperty(this, "getUserSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (userId) => {
                const flags = await this.client?.hGet(`user:${userId}`, 'flags');
                console.log('flags', flags);
                const plugins = await this.client?.hGet(`user:${userId}`, 'plugins');
                console.log('plugins', plugins);
                const team = await this.client?.hGet(`user:${userId}`, 'team');
                console.log('team', team);
                return {
                    flags: JSON.parse(flags || '{}'),
                    plugins: JSON.parse(plugins || '[]'),
                    team: team === ('red' || 'blue')
                        ? team
                        : 'red',
                };
            }
        });
        Object.defineProperty(this, "setTeamPlugins", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (team, plugins) => await this.client?.hSet(`team:${team}`, 'plugins', JSON.stringify(plugins))
        });
        Object.defineProperty(this, "getTeamPlugins", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (team) => {
                const res = await this.client?.hGet(`team:${team}`, 'plugins');
                return JSON.parse(res || '[]');
            }
        });
        Object.defineProperty(this, "getTeamMembers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (team) => team === 'red'
                ? ['Junior Red', 'Senior Red']
                : ['Junior Blue', 'Senior Blue']
        });
        Object.defineProperty(this, "initializeData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (teams, users) => {
                for (const team of teams) {
                    await this.setTeamPlugins(team.name, team.plugins);
                }
                for (const user of users) {
                    await this.client?.hSet(`user:${user.userId}`, 'team', user.team);
                    await this.client?.hSet(`user:${user.userId}`, 'flags', JSON.stringify(user.flags));
                    await this.setUserPlugins(user.userId, user.plugins);
                }
            }
        });
        (0, redis_1.getClient)()
            .then(c => {
            this.client = c;
            this.client.connect().then(() => {
                if (cb) {
                    cb(this);
                }
            });
        });
    }
}
exports.DAO = DAO;
