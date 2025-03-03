import { useState } from 'react';
import { Table, Button, Space, Tag, Input, Popconfirm, message } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Student } from '../../types';
import { useStudents } from '../../context/StudentContext';

interface StudentTableProps {
  onEdit: (student: Student) => void;
}

const StudentTable = ({ onEdit }: StudentTableProps) => {
  const { students, loading, deleteStudent } = useStudents();
  const [searchText, setSearchText] = useState('');

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent(id);
      message.success('Student deleted successfully');
    } catch (error) {
      message.error('Failed to delete student');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const columns: ColumnsType<Student> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        return record.name.toLowerCase().includes(value.toString().toLowerCase()) ||
               record.email.toLowerCase().includes(value.toString().toLowerCase()) ||
               record.currentSchool.toLowerCase().includes(value.toString().toLowerCase()) ||
               record.targetSchool.toLowerCase().includes(value.toString().toLowerCase());
      },
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
      sorter: (a, b) => a.currentSchool.localeCompare(b.currentSchool),
    },
    {
      title: 'Target School',
      dataIndex: 'targetSchool',
      key: 'targetSchool',
      sorter: (a, b) => a.targetSchool.localeCompare(b.targetSchool),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Application Date',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
      sorter: (a, b) => new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime(),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Delete student"
            description="Are you sure you want to delete this student?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search students..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={students}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default StudentTable;