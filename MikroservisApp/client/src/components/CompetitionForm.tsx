import { Button, DatePicker, Form, Input, Row } from "antd";
import { useCallback, useEffect } from "react";
import { SaveOutlined } from "@ant-design/icons";
import "../App.css";
import { CompetitionDto, CreateCompetition } from "../models/competitions";
import { createCompetition, updateCompetition } from "../api/competitionsService";

interface Props {
  onClose: () => void;
  Competition?: CompetitionDto;
}

function CompetitionForm({ onClose, Competition }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (Competition) {
      for (const [key, value] of Object.entries(Competition)) {
        form.setFieldsValue({ [key]: value });
      }
    }
  }, [form, Competition]);

  const handleSubmit = useCallback(
    async (values: CreateCompetition | CompetitionDto) => {
      const command = {
        ...values,
        title: 'Trening 2',
        startDate: new Date(),
        endDate: new Date(),
        location:'zagreb'
      };

      if (!Competition?.id) {
        await createCompetition({ ...command });
      } else {
        await updateCompetition({
          ...command,
          id: Competition.id,
        });
      }

      onClose();
    },
    [Competition, onClose]
  );

  return (
    <Form
      form={form}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 17 }}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="title"
        label={"Title"}
        rules={[{ max: 500, message: "Too long" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="description" label={"Description"}>
        <Input />
      </Form.Item>

      <Form.Item name="startDate" label={"Start"}>
        <DatePicker />
      </Form.Item>

      <Form.Item name="endDate" label={"End"}>
        <DatePicker />
      </Form.Item>

      <Form.Item name="location" label={"Location"}>
        <Input />
      </Form.Item>

      {!Competition?.id && (
        <Row className="form-buttons">
          <Button type="default" onClick={() => onClose()}>
            {"Cancel"}
          </Button>
          <Button type="primary" htmlType="submit">
            <SaveOutlined />
            {"Save"}
          </Button>
        </Row>
      )}
    </Form>
  );
}

export default CompetitionForm;
