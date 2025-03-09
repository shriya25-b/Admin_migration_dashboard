export interface Student {
  id: string;
  name: string;
  email: string;
  currentSchool: string;
  targetSchool: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  notes?: string;
}
export interface Student {
  "Aadhar No": string;
  Name: string;
  Email: string;
  "Migration From City": string;
  State: string;
  Education: string;
  "Duration of Living": string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface DashboardStats {
  totalStudents: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  schoolDistribution: {
    [key: string]: number;
  };
  monthlyApplications: {
    month: string;
    count: number;
  }[];
}