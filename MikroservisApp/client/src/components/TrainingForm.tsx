import { Button, DatePicker, Form, Input, Row } from "antd";
import { useCallback, useEffect } from "react";
import { SaveOutlined } from "@ant-design/icons";
import "../App.css";
import { createTraining, updateTraining } from "../api/trainingsService";
import { CreateTraining, Training, TrainingDto } from "../models/trainings";
import { ScoreType } from "../models/Enums";

interface Props {
  onClose: () => void;
  training?: TrainingDto;
}

function TrainingForm({ onClose, training }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (training) {
      for (const [key, value] of Object.entries(training)) {
        form.setFieldsValue({ [key]: value });
      }
    }
  }, [form, training]);

  const handleSubmit = useCallback(
    async (values: CreateTraining | Training) => {
      const command = {
        ...values,
        title: 'Trening 2',
        startDate: new Date(),
        endDate: new Date(),
        trainerId: 1,
        trainingTypeId: 1,
        scoreType: ScoreType.Time,
      };

      if (!training?.id) {
        await createTraining({ ...command });
      } else {
        await updateTraining({
          ...command,
          id: training.id,
        });
      }

      onClose();
    },
    [training, onClose]
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

      {!training?.id && (
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

export default TrainingForm;
