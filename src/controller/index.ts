import type { Plugin, ProcessedView, Ticket, View } from "../types";

import { DAO } from "../db";

import { applyStateToTickets, summarizePlugins } from "../processing";
import { exampleTeamSettings, exampleUserSettings, generateTickets } from "../data";


export class Controller {
  dao = new DAO();

  // core logic

  getUserData = (userId: string): ProcessedView[] => {
    const views = this.getViews(userId);
    const tickets = this.dao.getTickets();

    return views.map(v => this.processViewAndTickets(v, tickets));
  }

  processViewAndTickets = (view: View, allTickets: Ticket[]): ProcessedView => {
    const summary = summarizePlugins(view.plugins);

    const plugins = summary.plugins
      .filter(({ plugin }) => plugin.isEditable);
    const tickets = applyStateToTickets(summary.latestState, allTickets);

    return {
      name: view.name,
      plugins,
      tickets,
      latestState: summary.latestState
    };
  }
  getViews = (userId: string): View[] => {
    const allowEditing = (plugins: Plugin[]) =>
      plugins.map(p => ({ ...p, isEditable: true }));

    const { flags, team, plugins: userPlugins } = this.dao.getUserSettings(userId);
    const teamPlugins = this.dao.getTeamPlugins(team,);

    if (!flags.admin) {
      const plugins = [...teamPlugins, ...(allowEditing(userPlugins))];

      return [{ name: userId, plugins }];
    } else {
      const teamMemberViews = this.getTeamMemberViews(team, teamPlugins);
      const ownPlugins = [...teamPlugins, ...(allowEditing(userPlugins))];

      return [
        { name: userId, plugins: ownPlugins },
        { name: 'Team', plugins: allowEditing(teamPlugins) },
        ...teamMemberViews,
      ];
    }
  }

  getTeamMemberViews = (team: 'red' | 'blue', teamPlugins: Plugin[]): View[] => {
    const teamMembers = this.dao.getTeamMembers(team);

    return teamMembers.map((user) => {
      const { plugins: teamMemberPlugins } = this.dao.getUserSettings(user,);
      const groupedPlugins = [...teamPlugins, ...teamMemberPlugins];

      return { name: user, plugins: groupedPlugins };
    })
  }

  // just wrapper functions

  refreshTickets = () => {
    this.dao.saveTickets(generateTickets(),);
  }

  setUserPlugins = (userId: string, plugins: Plugin[],) =>
    this.dao.setUserPlugins(userId, plugins);

  setTeamPlugins = (team: 'red' | 'blue', plugins: Plugin[],) =>
    this.dao.setTeamPlugins(team, plugins);

  getUserSettings = (userId: string,): {
    flags: { admin: boolean },
    team: 'red' | 'blue',
    plugins: Plugin[],
  } => this.dao.getUserSettings(userId,);

  initializeData = () => {
    this.dao.initializeData(
      exampleTeamSettings,
      exampleUserSettings,
    )

    this.refreshTickets();
  }
}

