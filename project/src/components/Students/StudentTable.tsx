import { useState } from "react";
import { Table, Button, Space, Input, Popconfirm, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Student } from "../../types";
import { useStudents } from "../../context/StudentContext";

interface StudentTableProps {
  onEdit: (student: Student) => void;
}

const StudentTable = ({ onEdit }: StudentTableProps) => {
  const { students, loading, deleteExistingStudent } = useStudents();
  const [searchText, setSearchText] = useState("");

  // ✅ Ensure Aadhar No is passed correctly in API requests
  const handleDelete = async (student: Student) => {
    try {
      console.log("Deleting Student:", student["Aadhar No"]); // ✅ Debugging
      await deleteExistingStudent(student["Aadhar No"]);
      message.success("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
      message.error("Failed to delete student.");
    }
  };
  

  const handleEdit = (student: Student) => {
    console.log("Editing Student:", student["Aadhar No"]); // ✅ Debugging
    onEdit(student);
  };

  const columns: ColumnsType<Student> = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      sorter: (a, b) => a.Name.localeCompare(b.Name),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.Name.toLowerCase().includes(value.toString().toLowerCase()) ||
        record.Email.toLowerCase().includes(value.toString().toLowerCase()) ||
        record["Migration From City"].toLowerCase().includes(value.toString().toLowerCase()) ||
        record.State.toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "Migration From City",
      dataIndex: "Migration From City",
      key: "Migration From City",
      sorter: (a, b) => a["Migration From City"].localeCompare(b["Migration From City"]),
      filters: [...new Set(students.map((s) => s["Migration From City"]))].map((city) => ({
        text: city,
        value: city,
      })),
      onFilter: (value, record) => record["Migration From City"] === value,
    },
    {
      title: "State",
      dataIndex: "State",
      key: "State",
      sorter: (a, b) => a.State.localeCompare(b.State),
      filters: [...new Set(students.map((s) => s.State))].map((state) => ({
        text: state,
        value: state,
      })),
      onFilter: (value, record) => record.State === value,
    },
    {
      title: "Education",
      dataIndex: "Education",
      key: "Education",
      filters: [...new Set(students.map((s) => s.Education))].map((education) => ({
        text: education,
        value: education,
      })),
      onFilter: (value, record) => record.Education === value,
    },
    {
      title: "Duration of Living",
      dataIndex: "Duration of Living",
      key: "Duration of Living",
      sorter: (a, b) => parseInt(a["Duration of Living"]) - parseInt(b["Duration of Living"]),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" />
          <Popconfirm
            title="Delete student"
            description="Are you sure you want to delete this student?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
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
        rowKey="Aadhar No"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default StudentTable;
