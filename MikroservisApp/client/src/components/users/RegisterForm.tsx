import { CreateUser } from "../../models/users";
import { registerUser } from "../../api/usersService";
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
      <div>Register</div>
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
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
          label={"Password"}
          rules={[{ max: 500, message: "Too long" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label={"Repeat password"}
          rules={[{ max: 500, message: "Too long" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="birthDate" label={"Birthdate"}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/*<Form.Item
          name="roleId"
          label={"Role"}
          rules={[{ max: 500, message: "Too long" }]}
        >
          <Select placeholder="Select role" style={{ width: "100%" }}>
            {Object.values(UserRole)
              .filter((key) => isNaN(Number(key)))
              .map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
          </Select>
        </Form.Item>*/}

        <Button type="primary" htmlType="submit">
          Register{" "}
        </Button>
      </Form>
    </div>
  );
}

export default RegisterForm;
