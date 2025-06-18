export interface UserFrequency {
  userId: string;
  email: string;
  totalActions: number;
  locationUpdates: number;
  searches: number;
  parkingLotVisits: number;
}

export interface LocationFrequency {
  location: string;
  count: number;
}

export interface SearchPatterns {
  hourly: number[];
  daily: number[];
  totalSearches: number;
}

export interface ParkingLotStats {
  id: string;
  name: string;
  address: string;
  averageAvailability: number;
  totalReports: number;
  totalVisits: number;
  averageParkingHours: number;
  price: number;
  status: string;
}

export interface UserReportCorrelation {
  userId: string;
  email: string;
  visitedParkingLots: number;
  parkingLotsWithReports: number;
}

export interface DistanceData {
  distance: number;
}

export interface MonthlyGrowth {
  month: string;
  users: number;
  parkingLots: number;
}

export interface GrowthRate {
  users: number;
  parkingLots: number;
}

export interface UserUsage {
  userFrequency: UserFrequency[];
  topUsers: UserFrequency[];
  locationFrequency: LocationFrequency[];
  searchPatterns: SearchPatterns;
}

export interface ParkingLots {
  totalParkingLots: number;
  averageAvailability: number;
  mostVisited: ParkingLotStats[];
  mostReported: ParkingLotStats[];
  availabilityByStatus: {
    OPEN: ParkingLotStats[];
    CLOSED: ParkingLotStats[];
  };
}

export interface Interactions {
  totalReports: number;
  reportReasons: Record<string, unknown>;
  averageResolutionTime: number;
  searchesWithFilters: number;
  pendingReports: number;
  resolvedReports: number;
}

export interface Growth {
  monthlyGrowth: MonthlyGrowth[];
  totalUsers: number;
  totalParkingLots: number;
  growthRate: GrowthRate;
}

export interface Behavior {
  userReportCorrelation: UserReportCorrelation[];
  distanceData: DistanceData[];
  averageDistance: number;
}

export interface DashboardStats {
  userUsage: UserUsage;
  parkingLots: ParkingLots;
  interactions: Interactions;
  growth: Growth;
  behavior: Behavior;
  lastUpdated: string;
}

export interface UserFrequencySummary {
  totalUsers: number;
  averageActionsPerUser: number;
  mostActiveUser: string;
  leastActiveUser: string;
  period: string;
}

export interface DashboardUserFrequency {
  userFrequency: UserFrequency[];
  topUsers: UserFrequency[];
  summary: UserFrequencySummary;
}
