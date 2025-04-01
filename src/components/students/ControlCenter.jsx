import { Layout, Menu, Breadcrumb } from 'antd';
import Link from 'next/link';
import {
  User,
  FileText,
  Book,
  FormInput,
  Target,
  AlertCircle,
  Clock,
} from 'lucide-react';

const { Content, Sider } = Layout;

const ControlCenter = ({ children, studentId }) => {
  const menuItems = [
    {
      key: 'details',
      icon: <User size={16} />,
      label: <Link href={`/students/${studentId}`}>Details</Link>,
    },
    {
      key: 'documents',
      icon: <FileText size={16} />,
      label: <Link href={`/students/${studentId}/documents`}>Documents</Link>,
    },
    {
      key: 'casenotes',
      icon: <Book size={16} />,
      label: <Link href={`/students/${studentId}/casenotes`}>Case Notes</Link>,
    },
    {
      key: 'forms',
      icon: <FormInput size={16} />,
      label: <Link href={`/students/${studentId}/forms`}>Forms</Link>,
    },
    {
      key: 'goals',
      icon: <Target size={16} />,
      label: <Link href={`/students/${studentId}/goals`}>Goals</Link>,
    },
    {
      key: 'incidents',
      icon: <AlertCircle size={16} />,
      label: <Link href={`/students/${studentId}/incidents`}>Incidents</Link>,
    },
    {
      key: 'sessions',
      icon: <Clock size={16} />,
      label: <Link href={`/students/${studentId}/sessions`}>Sessions</Link>,
    },
  ];

  return (
    <Layout hasSider className="min-h-screen">
      <Sider
        width={250}
        theme="light"
        className="border-r"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={['details']}
          items={menuItems}
          style={{ height: '100%', borderRight: 0 }}
        />
      </Sider>

      <Content className="p-6 bg-white">
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <Link href="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/students">Students</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        {children}
      </Content>
    </Layout>
  );
};

export default ControlCenter;
