"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTickets = exports.generateContent = exports.exampleUserSettings = exports.exampleTeamSettings = exports.descriptions = exports.initialState = void 0;
const types_1 = require("./types");
exports.initialState = {
    areas: [
        types_1.Area.FRONTEND,
        types_1.Area.BACKEND,
        types_1.Area.INFRA,
        types_1.Area.DATABASE
    ],
    boldWords: [],
};
exports.descriptions = [
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
exports.exampleTeamSettings = [
    {
        name: 'red',
        plugins: [
            {
                type: types_1.PluginType.FILTER_AREA,
                keptAreas: [types_1.Area.BACKEND, types_1.Area.DATABASE, types_1.Area.INFRA],
            },
        ]
    },
    {
        name: 'blue',
        plugins: [
            {
                type: types_1.PluginType.FILTER_AREA,
                keptAreas: [types_1.Area.FRONTEND, types_1.Area.BACKEND],
            },
        ]
    },
];
exports.exampleUserSettings = [
    {
        userId: 'Admin Red',
        team: 'red',
        flags: {
            admin: true,
        },
        plugins: [
            {
                type: types_1.PluginType.BOLD_TEXT,
                word: 'urgent',
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
                type: types_1.PluginType.BOLD_TEXT,
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
                type: types_1.PluginType.FILTER_AREA,
                keptAreas: [types_1.Area.BACKEND, types_1.Area.INFRA],
            },
            {
                type: types_1.PluginType.BOLD_TEXT,
                word: 'urgent',
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
        plugins: []
    },
    {
        userId: 'Senior Blue',
        team: 'blue',
        flags: {
            admin: false,
        },
        plugins: [
            {
                type: types_1.PluginType.FILTER_AREA,
                keptAreas: [types_1.Area.FRONTEND],
            },
        ]
    },
];
const generateContent = () => {
    return ['', '', ''].map(() => {
        const index = Math.floor(Math.random() * exports.descriptions.length);
        return exports.descriptions[index];
    }).join(' ');
};
exports.generateContent = generateContent;
const generateTickets = () => {
    let tickets = [];
    for (let i = 0; i < 10; i++) {
        console.log("I", i);
        const ticket = {
            id: i,
            area: Math.floor(Math.random() * 4),
            content: (0, exports.generateContent)()
        };
        console.log('');
        tickets.push(ticket);
    }
    return tickets;
};
exports.generateTickets = generateTickets;
