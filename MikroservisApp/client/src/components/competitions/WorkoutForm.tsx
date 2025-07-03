import { Button, Col, Form, Input, Row, Select } from "antd";
import { useCallback, useEffect } from "react";
import { SaveOutlined } from "@ant-design/icons";
import "../../App.css";
import {
  CompetitionDto,
  CreateWorkout,
  WorkoutDto,
} from "../../models/competitions";
import { createWorkout, updateWorkout } from "../../api/competitionsService";
import { ScoreType } from "../../models/Enums";

const { Option } = Select;
const { TextArea } = Input;

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
        scoreType: ScoreType.Reps,
        competitionId: competition.id,
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
        <TextArea />
      </Form.Item>

      <Form.Item name="scoreType" label={"Score"}>
        <Select placeholder="Select score" style={{ width: "100%" }}>
          {Object.values(ScoreType)
            .filter((key) => isNaN(Number(key)))
            .map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
        </Select>
      </Form.Item>

      {!workout?.id && (
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
      )}
    </Form>
  );
}

export default WorkoutForm;
