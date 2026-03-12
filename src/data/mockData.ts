// ====== SUPER ADMIN DATA ======
export const platformStats = {
  totalClients: 156,
  activeSubscriptions: 142,
  revenue: 485000,
  gymClients: 98,
  pgClients: 58,
  trialClients: 14,
};

export const clients = [
  { id: "t1", name: "FitZone Gym", type: "gym" as const, owner: "Rajesh Kumar", plan: "Pro", status: "active" as const, members: 245, revenue: 12500, joinedAt: "2025-01-15" },
  { id: "t2", name: "Comfort PG", type: "pg" as const, owner: "Priya Sharma", plan: "Enterprise", status: "active" as const, members: 64, revenue: 8200, joinedAt: "2025-02-01" },
  { id: "t3", name: "PowerHouse Gym", type: "gym" as const, owner: "Suresh Reddy", plan: "Basic", status: "active" as const, members: 89, revenue: 4500, joinedAt: "2025-03-10" },
  { id: "t4", name: "City Stay PG", type: "pg" as const, owner: "Anita Das", plan: "Pro", status: "expiring" as const, members: 42, revenue: 6300, joinedAt: "2025-01-20" },
  { id: "t5", name: "Iron Paradise", type: "gym" as const, owner: "Karan Mehta", plan: "Pro", status: "active" as const, members: 312, revenue: 18000, joinedAt: "2024-11-05" },
  { id: "t6", name: "Green Residency", type: "pg" as const, owner: "Meera Joshi", plan: "Basic", status: "trial" as const, members: 18, revenue: 0, joinedAt: "2025-08-01" },
];

export const subscriptionPlans = [
  { id: "basic", name: "Basic", price: 999, features: ["Up to 50 members", "1 Staff", "Basic reports", "Email support"], popular: false },
  { id: "pro", name: "Pro", price: 2499, features: ["Up to 500 members", "10 Staff", "Advanced analytics", "Priority support", "Custom branding"], popular: true },
  { id: "enterprise", name: "Enterprise", price: 4999, features: ["Unlimited members", "Unlimited staff", "API access", "Dedicated support", "White-label", "Custom integrations"], popular: false },
];

// Membership duration plans (for trainers to show members) — Monthly, Quarterly, Half-yearly, Annually
export const membershipPlans = [
  { id: "monthly", name: "Monthly", duration: "1 month", price: 1500, perMonth: 1500, popular: false },
  { id: "quarterly", name: "Quarterly", duration: "3 months", price: 3000, perMonth: 1000, popular: true },
  { id: "halfyearly", name: "Half-yearly", duration: "6 months", price: 6000, perMonth: 1000, popular: false },
  { id: "annually", name: "Annually", duration: "12 months", price: 12000, perMonth: 1000, popular: false },
];

export const revenueData = [
  { month: "Jan", revenue: 32000 }, { month: "Feb", revenue: 38000 }, { month: "Mar", revenue: 42000 },
  { month: "Apr", revenue: 45000 }, { month: "May", revenue: 48000 }, { month: "Jun", revenue: 52000 },
  { month: "Jul", revenue: 55000 }, { month: "Aug", revenue: 58000 },
];

// ====== GYM DATA ======
export const gymStats = {
  totalMembers: 245,
  activeMembers: 198,
  pendingPayments: 23,
  droppedMembers: 12,
  totalTrainers: 8,
  monthlyRevenue: 125000,
};

export const gymMembers = [
  { id: "m1", name: "Amit Patel", email: "amit@gmail.com", phone: "9876543210", plan: "Annual", trainer: "Arjun", status: "active" as const, joinDate: "2025-01-10", expiryDate: "2026-01-10", totalAmount: 12000, amountDue: 0 },
  { id: "m2", name: "Sneha Gupta", email: "sneha@gmail.com", phone: "9876543211", plan: "Monthly", trainer: "Arjun", status: "active" as const, joinDate: "2025-07-01", expiryDate: "2025-08-01", totalAmount: 1500, amountDue: 0 },
  { id: "m3", name: "Rahul Verma", email: "rahul@gmail.com", phone: "9876543212", plan: "Quarterly", trainer: "Pooja", status: "pending" as const, joinDate: "2025-04-15", expiryDate: "2025-07-15", totalAmount: 3000, amountDue: 3000 },
  { id: "m4", name: "Deepa Nair", email: "deepa@gmail.com", phone: "9876543213", plan: "Annual", trainer: "Arjun", status: "active" as const, joinDate: "2025-02-20", expiryDate: "2026-02-20", totalAmount: 12000, amountDue: 0 },
  { id: "m5", name: "Kiran Shah", email: "kiran@gmail.com", phone: "9876543214", plan: "Monthly", trainer: "Pooja", status: "overdue" as const, joinDate: "2025-05-01", expiryDate: "2025-06-01", totalAmount: 1500, amountDue: 1500 },
  { id: "m6", name: "Ravi Kumar", email: "ravi@gmail.com", phone: "9876543215", plan: "Quarterly", trainer: "Arjun", status: "dropped" as const, joinDate: "2025-01-01", expiryDate: "2025-04-01", totalAmount: 3000, amountDue: 0 },
];

export const trainers = [
  { id: "tr1", name: "Arjun Singh", email: "arjun@fitzone.com", phone: "9876543220", specialization: "Strength Training", assignedMembers: 42, rating: 4.8 },
  { id: "tr2", name: "Pooja Reddy", email: "pooja@fitzone.com", phone: "9876543221", specialization: "Yoga & Flexibility", assignedMembers: 35, rating: 4.9 },
  { id: "tr3", name: "Vikash Yadav", email: "vikash@fitzone.com", phone: "9876543222", specialization: "Cardio & HIIT", assignedMembers: 28, rating: 4.6 },
  { id: "tr4", name: "Meena Kumari", email: "meena@fitzone.com", phone: "9876543223", specialization: "CrossFit", assignedMembers: 31, rating: 4.7 },
];

export const gymMembershipData = [
  { month: "Jan", active: 180, new: 22, dropped: 5 },
  { month: "Feb", active: 190, new: 18, dropped: 8 },
  { month: "Mar", active: 195, new: 25, dropped: 3 },
  { month: "Apr", active: 200, new: 15, dropped: 10 },
  { month: "May", active: 198, new: 20, dropped: 7 },
  { month: "Jun", active: 205, new: 30, dropped: 4 },
  { month: "Jul", active: 210, new: 12, dropped: 7 },
  { month: "Aug", active: 198, new: 8, dropped: 12 },
];

// ====== PG DATA ======
export const pgStats = {
  totalRooms: 48,
  occupiedRooms: 42,
  vacantRooms: 6,
  pendingRent: 15,
  totalTenants: 64,
  monthlyRevenue: 82000,
};

export const pgRooms = [
  { id: "r1", number: "101", type: "Single", floor: 1, capacity: 1, occupied: 1, rent: 8000, status: "occupied" as const },
  { id: "r2", number: "102", type: "Double", floor: 1, capacity: 2, occupied: 2, rent: 12000, status: "occupied" as const },
  { id: "r3", number: "103", type: "Triple", floor: 1, capacity: 3, occupied: 2, rent: 15000, status: "occupied" as const },
  { id: "r4", number: "201", type: "Single", floor: 2, capacity: 1, occupied: 0, rent: 8500, status: "vacant" as const },
  { id: "r5", number: "202", type: "Double", floor: 2, capacity: 2, occupied: 2, rent: 12500, status: "occupied" as const },
  { id: "r6", number: "203", type: "Single", floor: 2, capacity: 1, occupied: 0, rent: 8500, status: "vacant" as const },
];

export const pgTenants = [
  { id: "pt1", name: "Vikram Singh", email: "vikram@gmail.com", phone: "9876543230", room: "101", rent: 8000, status: "paid" as const, joinDate: "2025-03-01", dueDate: "2025-09-01" },
  { id: "pt2", name: "Anil Sharma", email: "anil@gmail.com", phone: "9876543231", room: "102", rent: 6000, status: "paid" as const, joinDate: "2025-01-15", dueDate: "2025-09-15" },
  { id: "pt3", name: "Ritu Saxena", email: "ritu@gmail.com", phone: "9876543232", room: "102", rent: 6000, status: "pending" as const, joinDate: "2025-04-01", dueDate: "2025-09-01" },
  { id: "pt4", name: "Manoj Kumar", email: "manoj@gmail.com", phone: "9876543233", room: "103", rent: 5000, status: "overdue" as const, joinDate: "2025-02-10", dueDate: "2025-08-10" },
  { id: "pt5", name: "Geeta Devi", email: "geeta@gmail.com", phone: "9876543234", room: "103", rent: 5000, status: "paid" as const, joinDate: "2025-05-01", dueDate: "2025-09-01" },
  { id: "pt6", name: "Sunil Rao", email: "sunil@gmail.com", phone: "9876543235", room: "202", rent: 6250, status: "pending" as const, joinDate: "2025-06-01", dueDate: "2025-09-01" },
];

export const pgManagers = [
  { id: "pm1", name: "Neha Jain", email: "neha@comfortpg.com", phone: "9876543240", assignedFloors: [1, 2], tenantsManaged: 32 },
  { id: "pm2", name: "Rohit Kapoor", email: "rohit@comfortpg.com", phone: "9876543241", assignedFloors: [3, 4], tenantsManaged: 32 },
];

export const pgOccupancyData = [
  { month: "Jan", occupied: 38, vacant: 10 },
  { month: "Feb", occupied: 39, vacant: 9 },
  { month: "Mar", occupied: 40, vacant: 8 },
  { month: "Apr", occupied: 41, vacant: 7 },
  { month: "May", occupied: 42, vacant: 6 },
  { month: "Jun", occupied: 42, vacant: 6 },
  { month: "Jul", occupied: 43, vacant: 5 },
  { month: "Aug", occupied: 42, vacant: 6 },
];

// ====== PAYMENT DATA ======
export const payments = [
  { id: "p1", user: "Amit Patel", type: "gym" as const, amount: 12000, status: "paid" as const, date: "2025-07-01", method: "UPI" },
  { id: "p2", user: "Sneha Gupta", type: "gym" as const, amount: 1500, status: "paid" as const, date: "2025-07-01", method: "Cash" },
  { id: "p3", user: "Rahul Verma", type: "gym" as const, amount: 3000, status: "pending" as const, date: "2025-07-15", method: "-" },
  { id: "p4", user: "Kiran Shah", type: "gym" as const, amount: 1500, status: "overdue" as const, date: "2025-06-01", method: "-" },
  { id: "p5", user: "Vikram Singh", type: "pg" as const, amount: 8000, status: "paid" as const, date: "2025-08-01", method: "Bank Transfer" },
  { id: "p6", user: "Ritu Saxena", type: "pg" as const, amount: 6000, status: "pending" as const, date: "2025-09-01", method: "-" },
  { id: "p7", user: "Manoj Kumar", type: "pg" as const, amount: 5000, status: "overdue" as const, date: "2025-08-10", method: "-" },
];
