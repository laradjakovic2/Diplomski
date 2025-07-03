import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import { useCallback, useEffect } from "react";
import { SaveOutlined } from "@ant-design/icons";
import "../../App.css";
import {
  CompetitionDto,
  CreateCompetition,
  UpdateCompetition,
} from "../../models/competitions";
import {
  createCompetition,
  updateCompetition,
} from "../../api/competitionsService";
import dayjs from "dayjs";

interface Props {
  onClose: () => void;
  Competition?: CompetitionDto;
}

function CompetitionForm({ onClose, Competition }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (Competition) {
      for (const [key, value] of Object.entries(Competition)) {
        if (key === "startDate" || key === "endDate") {
          form.setFieldsValue({ [key]: dayjs(value) });
        } else {
          form.setFieldsValue({ [key]: value });
        }
      }
    }
  }, [form, Competition]);

  const handleSubmit = useCallback(
    async (values: CreateCompetition | UpdateCompetition) => {
      const command = {
        ...values,
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

      <Form.Item name="price" label={"Price"}>
        <Input />
      </Form.Item>

      <Form.Item name="tax" label={"Tax"}>
        <Input />
      </Form.Item>

      <Form.Item name="location" label={"Location"}>
        <Input />
      </Form.Item>

      <Row justify="end" gutter={8} className="form-buttons">
        <Col>
          <Button type="default" onClick={() => onClose()}>
            Cancel
          </Button>
        </Col>
        <Col>
          <Button type="primary" htmlType="submit">
            <SaveOutlined />
            Save
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default CompetitionForm;
