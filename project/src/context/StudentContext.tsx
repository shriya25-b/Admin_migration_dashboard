import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchStudents, addStudent, updateStudent, deleteStudent } from "../api";

interface StatsType {
  totalStudents: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  stateDistribution: Record<string, number>;
  yearlyApplications: Record<string, number>;
  educationDistribution: Record<string, number>;
}

interface StudentContextType {
  students: any[];
  loading: boolean;
  stats: StatsType | null;
  fetchAllStudents: () => void;
  addNewStudent: (student: any) => Promise<void>;
  updateExistingStudent: (aadharNo: string, updatedData: any) => Promise<void>;
  deleteExistingStudent: (aadharNo: string) => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<StatsType | null>(null);

  // ✅ Compute statistics from student data
  const calculateStats = (studentsData: any[]) => {
    const totalStudents = studentsData.length;
  
    // Classify applications based on Education & Duration of Living
    const pendingApplications = studentsData.filter(student => student["Duration of Living"] && parseInt(student["Duration of Living"]) < 2).length;
    const approvedApplications = studentsData.filter(student => student["Education"] && student["Education"] !== "Diploma").length;
    const rejectedApplications = totalStudents - (pendingApplications + approvedApplications); // Remaining as rejected
  
    const stateDistribution: Record<string, number> = {};
    const yearlyApplications: Record<string, number> = {};
    const educationDistribution: Record<string, number> = {};
  
    studentsData.forEach(student => {
      stateDistribution[student.State] = (stateDistribution[student.State] || 0) + 1;
  
      const year = new Date().getFullYear() - Math.floor(parseInt(student["Duration of Living"] || "0") / 12);
      yearlyApplications[year] = (yearlyApplications[year] || 0) + 1;
  
      educationDistribution[student.Education] = (educationDistribution[student.Education] || 0) + 1;
    });
  
    return {
      totalStudents,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      stateDistribution,
      yearlyApplications,
      educationDistribution,
    };
  };
  

  // ✅ Fetch Students & Compute Stats
  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents();
      setStudents(data);
      setStats(calculateStats(data)); // ✅ Compute stats after fetching
    } catch (error) {
      console.error("❌ Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add Student (Then Refresh List & Stats)
  const addNewStudent = async (student: any) => {
    try {
      await addStudent(student);
      await fetchAllStudents();
    } catch (error) {
      console.error("❌ Error adding student:", error);
    }
  };

  // ✅ Update Student (Then Refresh List & Stats)
  const updateExistingStudent = async (aadharNo: string, updatedData: any) => {
    try {
      await updateStudent(aadharNo, updatedData);
      await fetchAllStudents();
    } catch (error) {
      console.error("❌ Error updating student:", error);
    }
  };

  // ✅ Delete Student (Then Refresh List & Stats)
  const deleteExistingStudent = async (aadharNo: string) => {
    try {
      await deleteStudent(aadharNo);
      await fetchAllStudents();
    } catch (error) {
      console.error("❌ Error deleting student:", error);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  return (
    <StudentContext.Provider
      value={{
        students,
        loading,
        stats,
        fetchAllStudents,
        addNewStudent,
        updateExistingStudent,
        deleteExistingStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudents must be used within a StudentProvider");
  }
  return context;
};





// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { fetchStudents, addStudent, updateStudent, deleteStudent } from "../api";

// interface StudentContextType {
//   students: any[];
//   loading: boolean;
//   fetchAllStudents: () => void;
//   addNewStudent: (student: any) => Promise<void>;
//   updateExistingStudent: (aadharNo: string, updatedData: any) => Promise<void>;
//   deleteExistingStudent: (aadharNo: string) => Promise<void>;
// }

// const StudentContext = createContext<StudentContextType | undefined>(undefined);

// export const StudentProvider = ({ children }: { children: ReactNode }) => {
//   const [students, setStudents] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // ✅ Fetch Students from API
//   const fetchAllStudents = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchStudents();
//       console.log("✅ Fetched Students:", data);
//       setStudents(data);
//     } catch (error) {
//       console.error("❌ Error fetching students:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Add Student (Then Refresh List)
//   const addNewStudent = async (student: any) => {
//     try {
//       await addStudent(student);
//       console.log("✅ Student Added");
//       await fetchAllStudents(); // Refresh UI after adding
//     } catch (error) {
//       console.error("❌ Error adding student:", error);
//     }
//   };

//   // ✅ Update Student (Then Refresh List)
//   const updateExistingStudent = async (aadharNo: string, updatedData: any) => {
//     try {
//       await updateStudent(aadharNo, updatedData);
//       console.log("✅ Student Updated");
//       await fetchAllStudents(); // Refresh UI after updating
//     } catch (error) {
//       console.error("❌ Error updating student:", error);
//     }
//   };

//   // ✅ Delete Student (Then Refresh List)
//   const deleteExistingStudent = async (aadharNo: string) => {
//     try {
//       await deleteStudent(aadharNo);
//       console.log("✅ Student Deleted");
//       await fetchAllStudents(); // Refresh UI after deleting
//     } catch (error) {
//       console.error("❌ Error deleting student:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllStudents();
//   }, []);

//   return (
//     <StudentContext.Provider
//       value={{
//         students,
//         loading,
//         fetchAllStudents,
//         addNewStudent,
//         updateExistingStudent,
//         deleteExistingStudent,
//       }}
//     >
//       {children}
//     </StudentContext.Provider>
//   );
// };

// export const useStudents = () => {
//   const context = useContext(StudentContext);
//   if (!context) {
//     throw new Error("useStudents must be used within a StudentProvider");
//   }
//   return context;
// };
