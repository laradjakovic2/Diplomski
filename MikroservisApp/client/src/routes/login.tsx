import { createFileRoute } from "@tanstack/react-router";
import { Button, Form, Input } from "antd";
import RegisterForm from "../components/users/RegisterForm";
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
      localStorage.setItem("token", token); // <- Spremanje tokena
      // Nastavi s autoriziranim radnjama
    } catch (err) {
      console.error("Login error", err);
    }
  };
  /*
    const handleRegister = async (user: CreateUser) => {
      try {
        const token = await registerUser(user);
        localStorage.setItem("token", token);
        // Možda odmah logiraš korisnika i preusmjeriš
      } catch (err) {
        console.error("Registration error", err);
      }
    };
  */
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
          label={"Pass"}
          rules={[{ max: 500, message: "Too long" }]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Login{" "}
        </Button>
      </Form>

      <RegisterForm />
    </div>
  );
}
