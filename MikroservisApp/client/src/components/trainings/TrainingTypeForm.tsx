import { Button, Form, Input, Row } from "antd";
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

      <Row className="form-buttons">
        <Button type="default" onClick={() => onClose()}>
          {"Cancel"}
        </Button>
        <Button type="primary" htmlType="submit">
          <SaveOutlined />
          {"Save"}
        </Button>
      </Row>
    </Form>
  );
}

export default TrainingTypeForm;
