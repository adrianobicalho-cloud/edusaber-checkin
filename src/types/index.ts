export interface Registration {
  id: string;
  fullName: string;
  companions: number;
  totalPeople: number;
  timestamp: string;
}

export interface AdminStats {
  totalRegistrations: number;
  totalCompanions: number;
  totalAttendees: number;
  averageGroupSize: number;
}
