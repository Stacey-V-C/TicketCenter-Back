import type { Plugin, Team, Ticket, User } from '../types';
import { getClient } from '../redis';
import { RedisClientType } from 'redis';

type Database = {
  users: User[],
  teams: Team[],
  tickets: Ticket[],
}

export class DAO {
  data: Database = {
    teams: [],
    users: [],
    tickets: [],
  }

  isConnected = () => !!this.client && this.client.isOpen;

  saveTickets = async (tickets: Ticket[],) =>
    await Promise.all(
      tickets.map(async (ticket: Ticket) =>
        await this.client?.set(`ticket:${ticket.id}`, JSON.stringify(ticket))
      )
    )

  getTickets = async (): Promise<Ticket[]> => {
    const keys = await this.client?.keys('ticket:*');
    const res = await Promise.all(
      keys?.map(async (key: string) => {
        const ticket = await this.client?.get(key);
        return ticket ? JSON.parse(ticket) : null;
      }) || []
    );

    return res.filter(t => !!t);
  }

  setUserPlugins = async (userId: string, plugins: Plugin[],) =>
    await this.client?.hSet(`user:${userId}`, `plugins`, JSON.stringify(plugins));

  getUserSettings = async (userId: string,): Promise<{
    flags: { admin: boolean },
    team: 'red' | 'blue',
    plugins: Plugin[],
  }> => {
    const flags = await this.client?.hGet(`user:${userId}`, 'flags');
    console.log('flags', flags)
    const plugins = await this.client?.hGet(`user:${userId}`, 'plugins');
    console.log('plugins', plugins)
    const team = await this.client?.hGet(`user:${userId}`, 'team');
    console.log('team', team)

    return {
      flags: JSON.parse(flags || '{}'),
      plugins: JSON.parse(plugins || '[]'),
      team: team === ('red' || 'blue')
        ? team
        : 'red',
    };
  }

  setTeamPlugins = async (team: 'red' | 'blue', plugins: Plugin[],) =>
    await this.client?.hSet(`team:${team}`, 'plugins', JSON.stringify(plugins));

  getTeamPlugins = async (team: 'red' | 'blue',) => {
    const res = await this.client?.hGet(`team:${team}`, 'plugins');
    return JSON.parse(res || '[]');
  }

  getTeamMembers = (team: 'red' | 'blue') =>
    team === 'red'
      ? ['Junior Red', 'Senior Red']
      : ['Junior Blue', 'Senior Blue'];

  initializeData = async (teams: Team[], users: User[],) => {
    for (const team of teams) {
      await this.setTeamPlugins(team.name, team.plugins);
    }

    for (const user of users) {
      await this.client?.hSet(`user:${user.userId}`, 'team', user.team);
      await this.client?.hSet(`user:${user.userId}`, 'flags', JSON.stringify(user.flags));
      await this.setUserPlugins(user.userId, user.plugins);
    }
  }
}