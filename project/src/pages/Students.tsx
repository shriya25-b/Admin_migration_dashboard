import { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Form, Input, Select,Spin, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useStudents } from "../context/StudentContext";
import { Student } from "../types";
import dayjs from "dayjs";

const { Option } = Select;

const Students = () => {
  const { students, loading, fetchAllStudents, addNewStudent, updateExistingStudent, deleteExistingStudent } = useStudents();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const showModal = (student: Student | null = null) => {
    setEditingStudent(student);
    if (student) {
      form.setFieldsValue({ ...student, applicationDate: dayjs(student.applicationDate) });
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
      const formattedValues = { ...values, applicationDate: values.applicationDate.format("YYYY-MM-DD") };

      if (editingStudent) {
        await updateExistingStudent(editingStudent["Aadhar No"], formattedValues);
        message.success("Student updated successfully");
      } else {
        await addNewStudent(formattedValues);
        message.success("Student added successfully");
      }

      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save student");
    }
  };

  const handleDelete = async (aadharNo: string) => {
    try {
      await deleteExistingStudent(aadharNo);
      message.success("Student deleted successfully");
    } catch (error) {
      message.error("Failed to delete student");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "Name", key: "Name", sorter: (a: Student, b: Student) => a.Name.localeCompare(b.Name) },
    { title: "Email", dataIndex: "Email", key: "Email" },
    { title: "State", dataIndex: "State", key: "State" },
    { title: "Education", dataIndex: "Education", key: "Education" },
    { title: "Duration of Living", dataIndex: "Duration of Living", key: "Duration of Living" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Student) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record["Aadhar No"])} okText="Yes" cancelText="No">
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h1>Student Management</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add Student
        </Button>
      </div>

      {loading ? <Spin size="large" /> : <Table dataSource={students} columns={columns} rowKey="Aadhar No" pagination={{ pageSize: 10 }} />}

      <Modal title={editingStudent ? "Edit Student" : "Add Student"} open={isModalVisible} onOk={handleSubmit} onCancel={handleCancel} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="Name" label="Name" rules={[{ required: true, message: "Please enter student name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="State" label="State">
            <Input />
          </Form.Item>
          <Form.Item name="Education" label="Education">
            <Select>
              <Option value="UG">UG</Option>
              <Option value="PG">PG</Option>
            </Select>
          </Form.Item>
          <Form.Item name="Duration of Living" label="Duration of Living">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Students;
