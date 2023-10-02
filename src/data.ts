import { Area, ContentFields } from './types';
import type { PluginState, Ticket } from './types';

export const initialState: PluginState = {
  areas: [
    Area.FRONTEND,
    Area.BACKEND,
    Area.INFRA,
    Area.DATABASE
  ],
  contentFields: [
    ContentFields.title,
    ContentFields.description,
    ContentFields.history,
    ContentFields.adminNotes,
    ContentFields.customerCommunication,
  ],
  boldWords: [],
};

export const descriptions = [
  'An urgent login issue has been reported by a customer.',
  'The database is down.',
  'We caught a bug in messaging.',
  'Microservices are out of sync.',
];

export const exampleTeamSettings = [
  {
    name: 'red',
    plugins: [
      {
        type: 'filterArea',
        keptAreas: [Area.BACKEND, Area.DATABASE, Area.INFRA],
      },
    ]
  },
  {
    name: 'blue',
    plugins: [
      {
        type: 'filterArea',
        keptAreas: [Area.FRONTEND, Area.BACKEND],
      },
    ]
  },
]

const exampleUserSettings = [
  {
    id: 'Admin Red',
    team: 'red',
    flags: {
      admin: true,
    },
    plugins: [
      {
        type: 'boldText',
        word: 'urgent',
      },
    ]
  },
  {
    id: 'Admin Blue',
    team: 'blue',
    flags: {
      admin: true,
    },
    plugins: [
      {
        type: 'removeContentField',
        removedContentField: ContentFields.customerCommunication,
      },
      {
        type: 'boldText',
        word: 'urgent',
      },
    ]
  },
  {
    id: 'Junior Red',
    team: 'red',
    flags: {
      admin: false,
    },
    plugins: [
      {
        type: 'filterArea',
        keptAreas: [Area.BACKEND, Area.INFRA],
      },
      {
        type: 'boldText',
        word: 'urgent',
      },
    ]
  },
  {
    id: 'Junior Blue',
    team: 'blue',
    flags: {
      admin: false,
    },
  },
  {
    id: 'Senior Red',
    team: 'red',
    flags: {
      admin: false,
    },
  },
  {
    id: 'Senior Blue',
    team: 'blue',
    flags: {
      admin: false,
    },
  },
];

export const generateTickets = () => {
  const tickets: Ticket[] = [];
  for (let i = 0; i++; i < 10) {
    const ticket: Ticket = {
      id: i,
      area: Math.floor(Math.random() * 4),
      content: {
        title: `Ticket ${i}`,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        history: [`Ticket ${i} was created`, `Ticket ${i} was scoped`, `Ticket ${i} was revisited due to a bug`],
        adminNotes: [`Ticket ${i} admin notes`, `Ticket ${i} risks down time`],
        customerCommunication: [`Ticket ${i} customer followup`, `Ticket ${i} first contact`],
      }
    }

    tickets.push(ticket);
  }

  return tickets;
}