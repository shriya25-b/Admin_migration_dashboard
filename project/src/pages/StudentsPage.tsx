import { useState, useEffect } from "react";
import { Typography, Button, message, Dropdown, Menu } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import { useStudents } from "../context/StudentContext";
import StudentTable from "../components/Students/StudentTable";
import StudentForm from "../components/Students/StudentForm";
import { exportStudents } from "../api"; // ✅ Import export function
import { Student } from "../types";

const { Title } = Typography;

const StudentsPage = () => {
  const { fetchAllStudents, addNewStudent, updateExistingStudent, loading } = useStudents();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const showAddModal = () => {
    setEditingStudent(undefined);
    setIsModalVisible(true);
  };

  const showEditModal = (student: Student) => {
    setEditingStudent(student);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingStudent(undefined);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingStudent) {
        await updateExistingStudent(editingStudent["Aadhar No"], values);
        message.success("Student updated successfully");
      } else {
        await addNewStudent(values);
        message.success("Student added successfully");
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save student");
    }
  };

  // ✅ Export Data Function
  const handleExport = async (format: "csv" | "pdf") => {
    try {
      await exportStudents(format);
      message.success(`Student data exported as ${format.toUpperCase()}`);
    } catch (error) {
      message.error("Failed to export student data");
    }
  };

  // ✅ Export Dropdown Menu
  const exportMenu = (
    <Menu>
      <Menu.Item key="csv" onClick={() => handleExport("csv")}>
        Export as CSV
      </Menu.Item>
      <Menu.Item key="pdf" onClick={() => handleExport("pdf")}>
        Export as PDF
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={2}>Student Management</Title>
        
        <div style={{ display: "flex", gap: 10 }}>
          {/* ✅ Export Button */}
          <Dropdown overlay={exportMenu} placement="bottomRight">
            <Button icon={<DownloadOutlined />} type="default">
              Export Data
            </Button>
          </Dropdown>

          {/* ✅ Add Student Button */}
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            Add Student
          </Button>
        </div>
      </div>

      <StudentTable onEdit={showEditModal} />

      <StudentForm visible={isModalVisible} onCancel={handleCancel} onSubmit={handleSubmit} initialValues={editingStudent} loading={loading} />
    </div>
  );
};

export default StudentsPage;
