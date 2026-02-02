// data/staffData.js

export const kpiData = [
  {
    title: "Total Staff",
    value: 128,
    icon: "👥",
    color: "text-blue-500",
  },
  {
    title: "Vacations Today",
    value: 5,
    icon: "🏖️",
    color: "text-yellow-500",
  },
  {
    title: "Open Roles",
    value: 12,
    icon: "💼",
    color: "text-red-500",
  },
  {
    title: "New Hires (30 days)",
    value: 8,
    icon: "🎉",
    color: "text-green-500",
  },
];

export const recentActivityData = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Software Engineer",
    department: "Tech",
    status: "Active",
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "Marketing Manager",
    department: "Marketing",
    status: "Vacation",
  },
  {
    id: 3,
    name: "Charlie Brown",
    role: "HR Specialist",
    department: "HR",
    status: "Active",
  },
  {
    id: 4,
    name: "Diana Prince",
    role: "Project Lead",
    department: "Operations",
    status: "Onboarding",
  },
];

export const staffDistributionData = {
    labels: ['Tech', 'Marketing', 'HR', 'Sales', 'Operations'],
    data: [45, 25, 15, 28, 15],
};