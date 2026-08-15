import type { ClassItem } from '../types';

/**
 * Kyaira's Fall schedule, seeded on first launch.
 * Times were read off a visual schedule image, so they're approximate —
 * everything here is editable from Settings / the class detail page.
 */
export const CLASS_COLORS = [
  '#e8a3b8', // rose
  '#d888a8', // deeper pink
  '#c96f95', // muted raspberry
  '#e6bccb', // light mauve
  '#b25c7c', // dusty berry
];

export const defaultClasses: ClassItem[] = [
  {
    id: 'class-career-dev',
    name: 'Career Development in the Health',
    professor: '',
    location: '',
    color: CLASS_COLORS[0],
    meetings: [{ day: 'Mon', startTime: '09:45', endTime: '10:30' }],
    links: [],
    createdAt: new Date(2026, 7, 1).toISOString(),
  },
  {
    id: 'class-sci-writing',
    name: 'Scientific Writing for Healthcare Professionals',
    professor: '',
    location: '',
    color: CLASS_COLORS[1],
    meetings: [{ day: 'Mon', startTime: '11:45', endTime: '13:30' }],
    links: [],
    createdAt: new Date(2026, 7, 1).toISOString(),
  },
  {
    id: 'class-biochem',
    name: 'Concepts in Biochemistry and Cell Biology',
    professor: '',
    location: '',
    color: CLASS_COLORS[2],
    meetings: [
      { day: 'Tue', startTime: '09:45', endTime: '11:30' },
      { day: 'Thu', startTime: '09:45', endTime: '11:30' },
    ],
    links: [],
    createdAt: new Date(2026, 7, 1).toISOString(),
  },
  {
    id: 'class-strategic-comm',
    name: 'Strategic Communication and Professional Development',
    professor: '',
    location: '',
    color: CLASS_COLORS[3],
    meetings: [{ day: 'Tue', startTime: '11:45', endTime: '13:30' }],
    links: [],
    createdAt: new Date(2026, 7, 1).toISOString(),
  },
  {
    id: 'class-community-med',
    name: 'Community Dimensions of Medicine',
    professor: '',
    location: '',
    color: CLASS_COLORS[4],
    meetings: [{ day: 'Fri', startTime: '09:00', endTime: '10:30' }],
    links: [],
    createdAt: new Date(2026, 7, 1).toISOString(),
  },
];
