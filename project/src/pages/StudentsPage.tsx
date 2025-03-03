import { useState, useEffect } from 'react';
import { Typography, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useStudents } from '../context/StudentContext';
import StudentTable from '../components/Students/StudentTable';
import StudentForm from '../components/Students/StudentForm';
import { Student } from '../types';

const { Title } = Typography;

const StudentsPage = () => {
  const { fetchStudents, addStudent, updateStudent, loading } = useStudents();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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
        await updateStudent(editingStudent.id, values);
        message.success('Student updated successfully');
      } else {
        await addStudent(values);
        message.success('Student added successfully');
      }
      setIsModalVisible(false);
      setEditingStudent(undefined);
    } catch (error) {
      message.error(
        editingStudent
          ? 'Failed to update student'
          : 'Failed to add student'
      );
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Student Management</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
        >
          Add Student
        </Button>
      </div>

      <StudentTable onEdit={showEditModal} />

      <StudentForm
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        initialValues={editingStudent}
        loading={loading}
      />
    </div>
  );
};

export default StudentsPage;