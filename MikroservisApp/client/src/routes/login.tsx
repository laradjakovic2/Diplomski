import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Form, Input } from "antd";
import { loginUser } from "../api/usersService";
import { LoginUser } from "../models/users";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [form] = Form.useForm();
  const handleLogin = async (credentials: LoginUser) => {
    try {
      const token = await loginUser(credentials);
      localStorage.setItem("token", token);
    } catch (err) {
      console.error("Login error", err);
    }
  };

  return (
    <div style={{ width: "50%" }}>
      <div>Login</div>
      <Form
        form={form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        onFinish={handleLogin}
      >
        <Form.Item
          name="email"
          label={"Email"}
          rules={[{ max: 500, message: "Too long" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label={"Password"}
          rules={[{ max: 500, message: "Too long" }]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Login{" "}
        </Button>

        <div>
          You don't have an account? <Link to="/register">Register</Link>
        </div>
      </Form>
    </div>
  );
}
