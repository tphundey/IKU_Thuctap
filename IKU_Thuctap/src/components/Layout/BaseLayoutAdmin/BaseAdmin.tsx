import Aside from "@/components/Admin/AsideAdmin/Aside"
import Headeradmin from "@/components/Admin/Headeradmin/Header"
import { Outlet } from "react-router-dom"
import {
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineUser,
  AiOutlineVideoCamera,
  AiOutlineBook,
  AiOutlineBarChart,
  AiOutlineAlignLeft,
  AiFillCloseCircle
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { Layout, Menu, Button, theme } from 'antd';
import React, { useState } from 'react';

const BaseLayoutadmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { Header, Sider, Content } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            style={{ height: 900 }}
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: "1",
                icon: <AiOutlineBarChart />,
                label: <Link to="/admin">Thống kê</Link>,
              },
              {
                key: "2",
                icon: <AiOutlineBook />,
                label: <Link to="/admin/products">Quản lý sách</Link>,
              },
              {
                key: "3",
                icon: <AiOutlineAlignLeft />,
                label: <Link to="/admin/category">Quản lý danh mục</Link>,
              },
              {
                key: "4",
                icon: <AiOutlineVideoCamera />,
                label: <Link to="/admin/user">Quản lý người dùng</Link>,
              },
              {
                key: "5",
                icon: <AiOutlineUser />,
                label: <Link to="/admin/donhang">Quản lý đơn hàng</Link>,
              },
              {
                key: "6",
                icon: <AiFillCloseCircle />,
                label: <Link to="http://localhost:5173">Thoát</Link>,
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default BaseLayoutadmin