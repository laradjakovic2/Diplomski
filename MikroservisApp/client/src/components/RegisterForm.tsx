import { CreateUser } from "../models/users";
import { registerUser } from "../api/usersService";
import { Button, DatePicker, Form, Input } from "antd";

function RegisterForm() {
  const [form] = Form.useForm();

  const handleRegister = async (user: CreateUser) => {
    try {
      const token = await registerUser(user);
      localStorage.setItem("token", token);
    } catch (err) {
      console.error("Registration error", err);
    }
  };

  return (
    <div>
      <div>Login</div>
      <Form
        form={form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        onFinish={handleRegister}
      >
        <Form.Item
          name="firstName"
          label={"First name"}
          rules={[{ max: 500, message: "Too long" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label={"Last name"}
          rules={[{ max: 500, message: "Too long" }]}
        >
          <Input />
        </Form.Item>

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

        <Form.Item name="birthDate" label={"Birthdate"}>
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="roleId"
          label={"roleId"}
          rules={[{ max: 500, message: "Too long" }]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Register{" "}
        </Button>
      </Form>
    </div>
  );
}

export default RegisterForm;;
