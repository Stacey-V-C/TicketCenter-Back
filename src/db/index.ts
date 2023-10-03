import type { Plugin, Team, Ticket, User } from '../types';

type Database = {
  users: Record<string, User>,
  teams: Record<string, Team>,
  tickets: Ticket[],
}

export class DAO {
  data: Database = {
    teams: {},
    users: {},
    tickets: [],
  }

  saveTickets = (tickets: Ticket[],) =>
    this.data.tickets = tickets;

  getTickets = (): Ticket[] =>
    this.data.tickets;

  setUserPlugins = (userId: string, plugins: Plugin[],) => {
    console.log("HERE", userId, plugins)
    if (this.data.users?.[userId]) {
      this.data.users[userId].plugins = plugins;
    }
  }

  getUserSettings = (userId: string,): {
    flags: { admin: boolean },
    team: 'red' | 'blue',
    plugins: Plugin[],
  } => this.data.users[userId];

  setTeamPlugins = (team: 'red' | 'blue', plugins: Plugin[],) => {
    if (!this.data.teams[team]) {
      this.data.teams[team].plugins = plugins;
    }
  }

  getTeamPlugins = (team: 'red' | 'blue',) =>
    this.data.teams[team].plugins;

  getTeamMembers = (team: 'red' | 'blue') =>
    team === 'red'
      ? ['Junior Red', 'Senior Red']
      : ['Junior Blue', 'Senior Blue'];

  initializeData = (teams: Team[], users: User[],) => {
    for (const team of teams) {
      this.data.teams[team.name] = team;
    }

    for (const user of users) {
      this.data.users[user.userId] = user;
    }
  }
}