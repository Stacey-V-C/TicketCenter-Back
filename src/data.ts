import { Area, PluginType } from './types';
import type { PluginState, Team, Ticket, User } from './types';

export const initialState: PluginState = {
  areas: [
    Area.FRONTEND,
    Area.BACKEND,
    Area.INFRA,
    Area.DATABASE
  ],
  boldWords: [],
};

export const descriptions = [
  "I encountered a bug while using the app.",
  "The downtime of our service is causing issues for users.",
  "Please investigate this simple issue with the login page.",
  "I received a complaint from a user regarding an error.",
  "This issue is urgent and needs immediate attention.",
  "An update is required to fix the priority bug.",
  "We need to address the error in the payment processing module.",
  "The downtime is affecting our customer satisfaction.",
  "Please prioritize this bug fix in the next sprint.",
  "Users have reported a complaint about the application's performance.",
  "We're experiencing frequent downtime with our servers.",
  "The error message is not clear to users.",
  "This is a simple issue that should be quick to resolve.",
  "Urgent action is needed to resolve the bug in the checkout process.",
  "An update is available that should address the priority issue.",
  "Users are complaining about the frequent downtime.",
  "We need to investigate and fix this error as soon as possible.",
  "Please prioritize this urgent bug in the backlog.",
  "This simple bug is causing frustration for our users.",
  "The error is preventing users from completing their tasks.",
  'An urgent login issue has been reported by a customer.',
  'The database is down.',
  'We caught a bug in messaging.',
  'Microservices are out of sync.',
];

export const exampleTeamSettings: Team[] = [
  {
    name: 'red',
    plugins: [
      {
        type: PluginType.FILTER_AREA,
        keptAreas: [Area.BACKEND, Area.DATABASE, Area.INFRA],
      },
      {
        type: PluginType.BOLD_TEXT,
        word: 'urgent',
      }
    ]
  },
  {
    name: 'blue',
    plugins: [
      {
        type: PluginType.FILTER_AREA,
        keptAreas: [Area.FRONTEND, Area.BACKEND],
      },
    ]
  },
]

export const exampleUserSettings: User[] = [
  {
    userId: 'Admin Red',
    team: 'red',
    flags: {
      admin: true,
    },
    plugins: [
      {
        type: PluginType.BOLD_TEXT,
        word: 'user',
      },
    ]
  },
  {
    userId: 'Admin Blue',
    team: 'blue',
    flags: {
      admin: true,
    },
    plugins: [
      {
        type: PluginType.BOLD_TEXT,
        word: 'urgent',
      },
    ]
  },
  {
    userId: 'Junior Red',
    team: 'red',
    flags: {
      admin: false,
    },
    plugins: [
      {
        type: PluginType.FILTER_AREA,
        keptAreas: [Area.BACKEND, Area.INFRA],
      },
      {
        type: PluginType.BOLD_TEXT,
        word: 'error',
      },
    ]
  },
  {
    userId: 'Junior Blue',
    team: 'blue',
    flags: {
      admin: false,
    },
    plugins: [],
  },
  {
    userId: 'Senior Red',
    team: 'red',
    flags: {
      admin: false,
    },
    plugins: [
      {
        type: PluginType.FILTER_AREA,
        keptAreas: [Area.BACKEND, Area.DATABASE],
      },
    ]
  },
  {
    userId: 'Senior Blue',
    team: 'blue',
    flags: {
      admin: false,
    },
    plugins: [
      {
        type: PluginType.FILTER_AREA,
        keptAreas: [Area.FRONTEND],
      },
    ]
  },
];

export const generateContent = () => {
  return ['', '', ''].map(() => {
    const index = Math.floor(Math.random() * descriptions.length);
    return descriptions[index];
  }).join(' ');
}

export const generateTickets = () => {
  let tickets: Ticket[] = [];
  for (let i = 0; i < 10; i++) {
    const ticket: any = {
      id: i,
      area: Math.floor(Math.random() * 4),
      content: generateContent()
    }

    tickets.push(ticket);
  }

  return tickets;
}