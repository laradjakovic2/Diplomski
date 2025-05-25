import { Button,  Form, Input, Row } from "antd";
import { useCallback, useEffect } from "react";
import { SaveOutlined } from "@ant-design/icons";
import "../App.css";
import { CompetitionDto, CreateWorkout, WorkoutDto } from "../models/competitions";
import { createWorkout, updateWorkout } from "../api/competitionsService";
import { ScoreType } from "../models/Enums";

interface Props {
  onClose: () => void;
  workout?: WorkoutDto;
  competition: CompetitionDto;
}

function WorkoutForm({ onClose, workout, competition }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (workout) {
      for (const [key, value] of Object.entries(workout)) {
        form.setFieldsValue({ [key]: value });
      }
    }
  }, [form, workout]);

  const handleSubmit = useCallback(
    async (values: CreateWorkout | WorkoutDto) => {
      const command: CreateWorkout = {
        ...values,
        competitionId: competition.id,
        scoreType: ScoreType.Reps
      };

      if (!workout?.id) {
        await createWorkout({ ...command });
      } else {
        await updateWorkout({
          ...command,
          id: workout.id,
        });
      }

      onClose();
    },
    [competition.id, workout?.id, onClose]
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

      <Form.Item name="scoreType" label={"Score"}>
        <Input />
      </Form.Item>

      {!workout?.id && (
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

export default WorkoutForm;
