import type { Plugin, ProcessedView, Ticket, View } from "../types";

import { DAO } from "../db";

import { applyStateToTickets, summarizePlugins } from "../processing";
import { generateTickets } from "../data";


export class Controller {
  dao = new DAO();

  constructor(cb?: (d: DAO) => void) {
    this.dao = new DAO(cb);
  }

  getUserData = async (userId: string): Promise<ProcessedView[]> => {
    const views = await this.getViews(userId);
    const tickets = await this.dao.getTickets();

    return views.map(v => this.processViewAndTickets(v, tickets));
  }

  processViewAndTickets = (view: View, allTickets: Ticket[]): ProcessedView => {
    const summary = summarizePlugins(view.plugins);
    const plugins = summary.plugins
      .filter(({ plugin }) => plugin.isEditable);
    const tickets = applyStateToTickets(summary.latestState, allTickets);

    return { name: view.name, plugins, tickets };
  }
  getViews = async (userId: string): Promise<View[]> => {
    const allowEditing = (plugins: Plugin[]) =>
      plugins.map(p => ({ ...p, isEditable: true }));

    const { flags, team, plugins: userPlugins } = await this.dao.getUserSettings(userId,);
    const teamPlugins = await this.dao.getTeamPlugins(team,);

    if (flags.admin) {
      const teamMemberViews = await this.getTeamMemberViews(team, teamPlugins);
      const ownPlugins = [...teamPlugins, ...(allowEditing(userPlugins))];

      return [
        { name: userId, plugins: ownPlugins },
        { name: 'Team', plugins: allowEditing(teamPlugins) },
        ...teamMemberViews,
      ];
    } else {
      const plugins = [...teamPlugins, ...(allowEditing(userPlugins))];

      return [{ name: userId, plugins }];
    }
  }

  getTeamMemberViews = async (team: 'red' | 'blue', teamPlugins: Plugin[]): Promise<View[]> => {
    const teamMembers = await this.dao.getTeamMembers(team);

    return await Promise.all(teamMembers.map(async (user) => {
      const { plugins: teamMemberPlugins } = await this.dao.getUserSettings(user,);
      const groupedPlugins = [...teamPlugins, ...teamMemberPlugins];

      return { name: user, plugins: groupedPlugins };
    }))
  }

  refreshTickets = async (): Promise<void> => {
    await this.dao.saveTickets(generateTickets(),);
  }

  setUserPlugins = async (userId: string, plugins: Plugin[],) =>
    await this.dao.setUserPlugins(userId, plugins);

  setTeamPlugins = async (team: 'red' | 'blue', plugins: Plugin[],) =>
    await this.dao.setTeamPlugins(team, plugins);

  getUserSettings = async (userId: string,): Promise<{
    flags: { admin: boolean },
    team: 'red' | 'blue',
    plugins: Plugin[],
  }> => await this.dao.getUserSettings(userId,);

}

