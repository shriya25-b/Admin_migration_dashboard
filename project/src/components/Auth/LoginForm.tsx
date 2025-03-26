import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigation

const { Title } = Typography;

const LoginForm = () => {
  const { login, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize navigation

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      navigate('/dashboard'); // ✅ Redirect after login
    } catch (err) {
      // Error is handled in the AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      width: '100vw', 
      backgroundImage: 'url("/pune1.webp")', 
      backgroundSize: '100% auto', // ✅ Fit width fully, auto height
      backgroundPosition: 'top center', // ✅ Align to top
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed', 
      overflow: 'hidden',
      
    }}>
    
    
      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>
              Migration Dashboard
            </Title>
            <Title level={4} style={{ fontWeight: 'normal', marginTop: 0 }}>
              Admin Login
            </Title>
          </div>

          {error && <Alert message={error} type="error" showIcon />}

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default LoginForm;
