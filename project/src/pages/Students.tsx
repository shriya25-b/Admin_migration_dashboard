import { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Spin, 
  message, 
  Popconfirm 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { useStudents } from '../context/StudentContext';
import { Student } from '../types';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const Students = () => {
  const { students, loading, fetchStudents, addStudent, updateStudent, deleteStudent } = useStudents();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const showModal = (student: Student | null = null) => {
    setEditingStudent(student);
    if (student) {
      form.setFieldsValue({
        ...student,
        applicationDate: dayjs(student.applicationDate),
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        applicationDate: values.applicationDate.format('YYYY-MM-DD'),
      };

      if (editingStudent) {
        await updateStudent(editingStudent.id, formattedValues);
        message.success('Student updated successfully');
      } else {
        await addStudent(formattedValues as Omit<Student, 'id'>);
        message.success('Student added successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent(id);
      message.success('Student deleted successfully');
    } catch (error) {
      message.error('Failed to delete student');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Student, b: Student) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Current School',
      dataIndex: 'currentSchool',
      key: 'currentSchool',
      filters: [...new Set(students.map(s => s.currentSchool))].map(school => ({
        text: school,
        value: school,
      })),
      onFilter: (value: string, record: Student) => record.currentSchool === value,
    },
    {
      title: 'Target School',
      dataIndex: 'targetSchool',
      key: 'targetSchool',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        if (status === 'approved') color = 'green';
        else if (status === 'rejected') color = 'red';
        else color = 'gold';
        
        return (
          <span style={{ 
            color, 
            fontWeight: 'bold',
            textTransform: 'capitalize' 
          }}>
            {status}
          </span>
        );
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value: string, record: Student) => record.status === value,
    },
    {
      title: 'Application Date',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
      sorter: (a: Student, b: Student) => 
        new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Student) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this student?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Student Management</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => showModal()}
        >
          Add Student
        </Button>
      </div>
      
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table 
          dataSource={students} 
          columns={columns} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
      
      <Modal
        title={editingStudent ? 'Edit Student' : 'Add Student'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter student name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="currentSchool"
            label="Current School"
            rules={[{ required: true, message: 'Please enter current school' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="targetSchool"
            label="Target School"
            rules={[{ required: true, message: 'Please enter target school' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="applicationDate"
            label="Application Date"
            rules={[{ required: true, message: 'Please select application date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Students;