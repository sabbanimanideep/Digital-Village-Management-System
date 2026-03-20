// ─── MOCK DATA ─────────────────────────────────────────────────────────────
// src/data/mockData.js
// Centralised data store — swap for real API calls here

export const mockUsers = [
  { id: 1, name: "Arjun Reddy",   email: "arjun@village.in",   role: "Villager", status: "Active"   },
  { id: 2, name: "Priya Sharma",  email: "priya@village.in",   role: "Officer",  status: "Active"   },
  { id: 3, name: "Ravi Kumar",    email: "ravi@village.in",    role: "Villager", status: "Inactive" },
  { id: 4, name: "Sunita Devi",   email: "sunita@village.in",  role: "Villager", status: "Active"   },
  { id: 5, name: "Mohan Lal",     email: "mohan@village.in",   role: "Officer",  status: "Active"   },
  { id: 6, name: "Kavitha Rao",   email: "kavitha@village.in", role: "Villager", status: "Active"   },
  { id: 7, name: "Suresh Babu",   email: "suresh@village.in",  role: "Officer",  status: "Inactive" },
];

export const mockComplaints = [
  { id: 1, title: "Road damaged near market",   user: "Arjun Reddy",  status: "Pending",     officer: "Priya Sharma", date: "2024-03-01", desc: "The main road near the market has large potholes causing accidents."           },
  { id: 2, title: "Water supply disruption",    user: "Sunita Devi",  status: "In Progress", officer: "Mohan Lal",    date: "2024-03-03", desc: "Water supply has been irregular for the past week in sector 4."               },
  { id: 3, title: "Streetlight not working",    user: "Ravi Kumar",   status: "Resolved",    officer: "Priya Sharma", date: "2024-02-28", desc: "Three streetlights on the main road have been non-functional."                },
  { id: 4, title: "Drainage overflow issue",    user: "Kavitha Rao",  status: "Pending",     officer: "Unassigned",   date: "2024-03-05", desc: "Drainage overflows during rain causing flooding near school."                 },
  { id: 5, title: "Electricity outage",         user: "Mohan Lal",    status: "In Progress", officer: "Suresh Babu",  date: "2024-03-07", desc: "Frequent power cuts lasting 4-6 hours daily."                                },
  { id: 6, title: "Garbage not collected",      user: "Priya Sharma", status: "Resolved",    officer: "Mohan Lal",    date: "2024-03-02", desc: "Garbage collection has not happened in 2 weeks in our area."                 },
];

export const mockSchemes = [
  { id: 1, name: "PM Awas Yojana",     desc: "Housing for all scheme providing affordable homes to rural citizens.",      status: "Active",   beneficiaries: 240, category: "Housing"    },
  { id: 2, name: "Kisan Samman Nidhi", desc: "Direct income support of ₹6000/year to small and marginal farmers.",        status: "Active",   beneficiaries: 512, category: "Agriculture" },
  { id: 3, name: "Ujjwala Yojana",     desc: "Free LPG connections to women from BPL households.",                        status: "Inactive", beneficiaries: 180, category: "Energy"     },
  { id: 4, name: "Jal Jeevan Mission", desc: "Providing safe drinking water to every rural household.",                    status: "Active",   beneficiaries: 890, category: "Water"      },
  { id: 5, name: "MNREGA",             desc: "100 days of guaranteed wage employment in a financial year.",                status: "Active",   beneficiaries: 320, category: "Employment" },
  { id: 6, name: "Ayushman Bharat",    desc: "Health coverage of ₹5 lakh per family per year.",                           status: "Inactive", beneficiaries: 410, category: "Health"     },
];

export const mockAnnouncements = [
  { id: 1, title: "Vaccination Drive — April 5th",  desc: "Free COVID-19 and seasonal flu vaccinations at the community center.",               date: "2024-03-20", sent: true  },
  { id: 2, title: "Village Council Meeting",         desc: "Monthly meeting of the village panchayat on March 28th at 10 AM.",                   date: "2024-03-18", sent: false },
  { id: 3, title: "Road Repair Notice",              desc: "The main road will be closed for repair from March 22-25. Use alternate routes.",     date: "2024-03-15", sent: true  },
  { id: 4, title: "Water Supply Interruption",       desc: "Water supply will be suspended on March 23rd for pipeline maintenance.",              date: "2024-03-19", sent: false },
];

// ─── CHART DATA ──────────────────────────────────────────────────────────────

export const complaintStatusData = [
  { name: "Pending",     value: 2, color: "#f59e0b" },
  { name: "In Progress", value: 2, color: "#3b82f6" },
  { name: "Resolved",    value: 2, color: "#10b981" },
];

export const userRoleData = [
  { name: "Villagers", value: 4, color: "#6366f1" },
  { name: "Officers",  value: 3, color: "#ec4899" },
];

export const complaintsOverTime = [
  { month: "Oct", complaints: 4  },
  { month: "Nov", complaints: 7  },
  { month: "Dec", complaints: 5  },
  { month: "Jan", complaints: 9  },
  { month: "Feb", complaints: 6  },
  { month: "Mar", complaints: 12 },
];

export const userGrowthData = [
  { month: "Oct", users: 18 },
  { month: "Nov", users: 22 },
  { month: "Dec", users: 25 },
  { month: "Jan", users: 30 },
  { month: "Feb", users: 35 },
  { month: "Mar", users: 42 },
];

export const schemeUsageData = [
  { name: "PM Awas",   users: 240 },
  { name: "Kisan",     users: 512 },
  { name: "Ujjwala",   users: 180 },
  { name: "Jal Jeevan",users: 890 },
  { name: "MNREGA",    users: 320 },
  { name: "Ayushman",  users: 410 },
];