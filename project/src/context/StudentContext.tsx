import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { Student, DashboardStats } from '../types';

interface StudentContextType {
  students: Student[];
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  fetchStats: () => Promise<void>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  uploadCSV: (data: any[]) => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api';

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/stats`);
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (student: Omit<Student, 'id'>) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/students`, student);
      setStudents([...students, response.data]);
      await fetchStats(); // Update stats after adding a student
      setError(null);
    } catch (err) {
      setError('Failed to add student');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id: string, student: Partial<Student>) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/students/${id}`, student);
      setStudents(
        students.map((s) => (s.id === id ? { ...s, ...response.data } : s))
      );
      await fetchStats(); // Update stats after updating a student
      setError(null);
    } catch (err) {
      setError('Failed to update student');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/students/${id}`);
      setStudents(students.filter((s) => s.id !== id));
      await fetchStats(); // Update stats after deleting a student
      setError(null);
    } catch (err) {
      setError('Failed to delete student');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadCSV = async (data: any[]) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/students/upload`, { data });
      await fetchStudents(); // Refresh student list
      await fetchStats(); // Update stats after CSV upload
      setError(null);
    } catch (err) {
      setError('Failed to upload CSV');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        stats,
        loading,
        error,
        fetchStudents,
        fetchStats,
        addStudent,
        updateStudent,
        deleteStudent,
        uploadCSV,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};