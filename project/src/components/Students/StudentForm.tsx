import { Form, Input, Select, DatePicker, Button, Modal } from 'antd';
import { Student } from '../../types';
import dayjs from 'dayjs';

interface StudentFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Student;
  loading: boolean;
}

const StudentForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading,
}: StudentFormProps) => {
  const [form] = Form.useForm();
  const isEditing = !!initialValues;

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // Format date to ISO string
      const formattedValues = {
        ...values,
        applicationDate: values.applicationDate.toISOString(),
      };
      onSubmit(formattedValues);
    });
  };

  return (
    <Modal
      title={isEditing ? 'Edit Student' : 'Add New Student'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {isEditing ? 'Update' : 'Add'}
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          initialValues
            ? {
                ...initialValues,
                applicationDate: dayjs(initialValues.applicationDate),
              }
            : {
                status: 'pending',
                applicationDate: dayjs(),
              }
        }
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter student name' }]}
        >
          <Input placeholder="Enter student name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          name="currentSchool"
          label="Current School"
          rules={[{ required: true, message: 'Please enter current school' }]}
        >
          <Input placeholder="Enter current school" />
        </Form.Item>

        <Form.Item
          name="targetSchool"
          label="Target School"
          rules={[{ required: true, message: 'Please enter target school' }]}
        >
          <Input placeholder="Enter target school" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="approved">Approved</Select.Option>
            <Select.Option value="rejected">Rejected</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="applicationDate"
          label="Application Date"
          rules={[{ required: true, message: 'Please select application date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={4} placeholder="Enter additional notes" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentForm;