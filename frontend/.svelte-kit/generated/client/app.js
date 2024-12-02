export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/classification": [3],
		"/dashboard": [4],
		"/departments": [5],
		"/leads": [6],
		"/login": [7],
		"/monitoring": [8],
		"/monitoring/mid-year": [9],
		"/opportunities": [10],
		"/plans": [11],
		"/plans/operationalPlans": [12],
		"/plans/operationalPlans/[id]": [13],
		"/plans/strategicPlans": [14],
		"/plans/[id]": [15],
		"/plans/[id]/[id]": [16],
		"/profile": [17],
		"/riskManagement": [18],
		"/risks": [19],
		"/risks/riskAssessment": [20],
		"/users": [21]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.js';