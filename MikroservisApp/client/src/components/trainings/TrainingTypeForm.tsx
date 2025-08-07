import { Button, Col, Form, Input, Row } from "antd";
import { useCallback, useEffect } from "react";
import { SaveOutlined } from "@ant-design/icons";
import "../../App.css";
import { createTrainingType } from "../../api/trainingsService";
import { CreateTrainingType, TrainingType } from "../../models/trainings";

interface Props {
  initialStartDate?: Date;
  initialEndDate?: Date;
  onClose: () => void;
  trainingType?: TrainingType;
}

function TrainingTypeForm({ onClose, trainingType }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (trainingType) {
      for (const [key, value] of Object.entries(trainingType)) {
        form.setFieldsValue({ [key]: value });
      }
    }
  }, [form, trainingType]);

  const handleSubmit = useCallback(
    async (values: CreateTrainingType) => {
      await createTrainingType({ ...values });

      onClose();
    },
    [onClose]
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

      <Row justify="end" gutter={8} className="form-buttons">
        <Col>
          <Button type="default" onClick={() => onClose()}>
            {"Cancel"}
          </Button>
        </Col>

        <Col>
          <Button type="primary" htmlType="submit">
            <SaveOutlined />
            {"Save"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default TrainingTypeForm;
