import { Button, DatePicker, Form, Input, Row, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { SaveOutlined } from "@ant-design/icons";
import "../../App.css";
import {
  createTraining,
  getAllTrainingTypes,
  updateTraining,
} from "../../api/trainingsService";
import {
  CreateTraining,
  Training,
  TrainingDto,
  TrainingTypeDto,
} from "../../models/trainings";
import { ScoreType } from "../../models/Enums";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

interface Props {
  initialStartDate?: Date;
  initialEndDate?: Date;
  onClose: () => void;
  training?: TrainingDto;
}

function TrainingForm({
  onClose,
  training,
  initialEndDate,
  initialStartDate,
}: Props) {
  const [form] = Form.useForm();
  const [trainingTypes, setTrainingTypes] = useState<TrainingTypeDto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllTrainingTypes();
        console.log(data);
        setTrainingTypes(data);
        // eslint-disable-next-line no-debugger
        debugger;
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    if (training) {
      for (const [key, value] of Object.entries(training)) {
        if (key === "startDate" || key === "endDate") {
          form.setFieldsValue({ [key]: dayjs(value) });
        } else {
          form.setFieldsValue({ [key]: value });
        }
      }
    }
  }, [form, training]);

  const handleSubmit = useCallback(
    async (values: CreateTraining | Training) => {
      const command = {
        ...values,
        trainerId: 1,
        scoreType: ScoreType.Time,
      };
      // eslint-disable-next-line no-debugger
      debugger;
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
        <TextArea />
      </Form.Item>

      <Form.Item
        name="startDate"
        label={"Start"}
        initialValue={initialStartDate ? dayjs(initialStartDate) : dayjs()}
      >
        <DatePicker showTime />
      </Form.Item>

      <Form.Item
        name="endDate"
        label={"End"}
        initialValue={
          initialEndDate ? dayjs(initialEndDate) : dayjs().add(1, "hour")
        }
      >
        <DatePicker showTime />
      </Form.Item>

      <Form.Item name="traininTypeId" label={"Training type"}>
        <Select placeholder="Select training type" style={{ width: "100%" }}>
          {trainingTypes?.map((type) => (
            <Option key={type.id} value={type.id}>
              {type.title}
            </Option>
          ))}
        </Select>
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

export default TrainingForm;
