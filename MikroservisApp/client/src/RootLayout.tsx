// layouts/RootLayout.tsx
import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import { Outlet } from "@tanstack/react-router";

const { Content } = Layout;

const RootLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />

      <Layout style={{ width: '100%'}} >
        <Content style={{ width: "100%" }}>
          <div
            style={{
              padding: 24,
              //minHeight: 360,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default RootLayout;
