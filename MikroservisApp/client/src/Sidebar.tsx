import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from '@tanstack/react-router';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  return (
    <Sider
      collapsible
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          height: 32,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.3)',
        }}
      />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['/']}>
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="/users" icon={<UserOutlined />}>
          <Link to="/users">Users</Link>
        </Menu.Item>
        <Menu.Item key="/trainings" icon={<UserOutlined />}>
          <Link to="/trainings">Trainings</Link>
        </Menu.Item>
        <Menu.Item key="/competitions" icon={<UserOutlined />}>
          <Link to="/competitions">Competitions</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
