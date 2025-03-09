import { Form, Input, Select, DatePicker, Button, Modal } from "antd";
import { Student } from "../../types";
import dayjs from "dayjs";
import { useEffect } from "react";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
];

interface StudentFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Student) => void;
  initialValues?: Partial<Student>; // ✅ Ensure initialValues is typed correctly
  loading: boolean;
}

const StudentForm = ({ visible, onCancel, onSubmit, initialValues, loading }: StudentFormProps) => {
  const [form] = Form.useForm();
  const isEditing = !!initialValues;

  useEffect(() => {
    if (initialValues) {
      form.resetFields(); // ✅ Ensure fields reset
      form.setFieldsValue({
        ...(initialValues as Student),
        applicationDate: initialValues?.applicationDate ? dayjs(initialValues.applicationDate) : dayjs(),
        notes: initialValues?.notes || "",
      });
    } else {
      form.resetFields(); // ✅ Reset form when adding a new student
    }
  }, [initialValues, visible]); // ✅ Also reset when modal is opened
  

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        applicationDate: values.applicationDate ? values.applicationDate.format("YYYY-MM-DD") : null,
      };
      console.log("Submitting Data:", formattedValues);
      onSubmit(formattedValues);
    });
  };

  return (
    <Modal
  title={isEditing ? "Edit Student" : "Add New Student"}
  open={visible}
  onCancel={() => {
    form.resetFields(); // ✅ Reset form on cancel
    onCancel();
  }}
  afterOpenChange={(open) => {
    if (!open) form.resetFields(); // ✅ Reset form after modal closes
  }}
  footer={[
    <Button key="cancel" onClick={onCancel}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
      {isEditing ? "Update" : "Add"}
    </Button>,
  ]}
  width={600}
>

      <Form form={form} layout="vertical">
        <Form.Item name="Name" label="Name" rules={[{ required: true, message: "Please enter student name" }]}>
          <Input placeholder="Enter student name" />
        </Form.Item>

        <Form.Item
          name="Email"
          label="Email"
          rules={[{ required: true, message: "Please enter email" }, { type: "email", message: "Please enter a valid email" }]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item name="Aadhar No" label="Aadhar No" rules={[{ required: true, message: "Please enter Aadhar No" }]}>
          <Input placeholder="Enter Aadhar No" disabled={isEditing} />
        </Form.Item>

        <Form.Item name="Migration From City" label="Migration From City" rules={[{ required: true, message: "Please enter migration city" }]}
        >
          <Input placeholder="Enter migration city" />
        </Form.Item>

        <Form.Item name="State" label="State" rules={[{ required: true, message: "Please select a state" }]}
        >
          <Select showSearch placeholder="Select a state">
            {indianStates.map((state) => (
              <Select.Option key={state} value={state}>
                {state}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="Education" label="Education" rules={[{ required: true, message: "Please select education level" }]}
        >
          <Select>
            <Select.Option value="UG">UG</Select.Option>
            <Select.Option value="PG">PG</Select.Option>
            <Select.Option value="PhD">PhD</Select.Option>
            <Select.Option value="Diploma">Diploma</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="Duration of Living" label="Duration of Living" rules={[{ required: true, message: "Please enter duration of living" }]}
        >
          <Input placeholder="Enter duration in years" />
        </Form.Item>

        <Form.Item name="applicationDate" label="Application Date" rules={[{ required: true, message: "Please select application date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={4} placeholder="Enter additional notes (optional)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StudentForm;










// import { Form, Input, Select, DatePicker, Button, Modal } from "antd";
// import { Student } from "../../types";
// import dayjs from "dayjs";

// const indianStates = [
//   "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
//   "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
//   "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
//   "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
//   "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
// ];

// interface StudentFormProps {
//   visible: boolean;
//   onCancel: () => void;
//   onSubmit: (values: any) => void;
//   initialValues?: Student;
//   loading: boolean;
// }

// const StudentForm = ({ visible, onCancel, onSubmit, initialValues, loading }: StudentFormProps) => {
//   const [form] = Form.useForm();
//   const isEditing = !!initialValues;

//   const handleSubmit = () => {
//     form.validateFields().then((values) => {
//       const formattedValues = {
//         ...values,
//         applicationDate: values.applicationDate ? values.applicationDate.format("YYYY-MM-DD") : null,
//       };
//       onSubmit(formattedValues);
//     });
//   };

//   return (
//     <Modal
//       title={isEditing ? "Edit Student" : "Add New Student"}
//       open={visible}
//       onCancel={onCancel}
//       footer={[
//         <Button key="cancel" onClick={onCancel}>
//           Cancel
//         </Button>,
//         <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
//           {isEditing ? "Update" : "Add"}
//         </Button>,
//       ]}
//       width={600}
//     >
//       <Form
//         form={form}
//         layout="vertical"
//         initialValues={{
//           ...initialValues,
//           applicationDate: initialValues?.applicationDate ? dayjs(initialValues.applicationDate) : dayjs(),
//           notes: initialValues?.notes || "",
//         }}
//       >
//         <Form.Item name="Name" label="Name" rules={[{ required: true, message: "Please enter student name" }]}>
//           <Input placeholder="Enter student name" />
//         </Form.Item>

//         <Form.Item
//           name="Email"
//           label="Email"
//           rules={[
//             { required: true, message: "Please enter email" },
//             { type: "email", message: "Please enter a valid email" },
//           ]}
//         >
//           <Input placeholder="Enter email address" />
//         </Form.Item>

//         <Form.Item name="Aadhar No" label="Aadhar No" rules={[{ required: true, message: "Please enter Aadhar No" }]}>
//           <Input placeholder="Enter Aadhar No" disabled={isEditing} />
//         </Form.Item>

//         <Form.Item
//           name="Migration From City"
//           label="Migration From City"
//           rules={[{ required: true, message: "Please enter migration city" }]}
//         >
//           <Input placeholder="Enter migration city" />
//         </Form.Item>

//         <Form.Item name="State" label="State" rules={[{ required: true, message: "Please select a state" }]}>
//           <Select showSearch placeholder="Select a state">
//             {indianStates.map((state) => (
//               <Select.Option key={state} value={state}>
//                 {state}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item name="Education" label="Education" rules={[{ required: true, message: "Please select education level" }]}>
//           <Select>
//             <Select.Option value="UG">UG</Select.Option>
//             <Select.Option value="PG">PG</Select.Option>
//             <Select.Option value="PhD">PhD</Select.Option>
//             <Select.Option value="Diploma">Diploma</Select.Option>
//           </Select>
//         </Form.Item>

//         <Form.Item
//           name="Duration of Living"
//           label="Duration of Living"
//           rules={[{ required: true, message: "Please enter duration of living" }]}
//         >
//           <Input placeholder="Enter duration in years" />
//         </Form.Item>

//         <Form.Item name="applicationDate" label="Application Date" rules={[{ required: true, message: "Please select application date" }]}>
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>

//         <Form.Item name="notes" label="Notes">
//           <Input.TextArea rows={4} placeholder="Enter additional notes (optional)" />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default StudentForm;
