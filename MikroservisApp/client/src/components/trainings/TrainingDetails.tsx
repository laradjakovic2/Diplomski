import { useCallback, useEffect, useState } from "react";
import { Row, Card, Table, Button, Input, Col, Form, Image } from "antd";
import { useParams } from "@tanstack/react-router";
import {
  Registration,
  TrainingDto,
  UserRegisteredForTraining,
} from "../../models/trainings";
import {
  getTrainingById,
  registerUserForTraining,
  updateScore,
} from "../../api/trainingsService";
import { EntityType } from "../../models/Enums";
import { getFileUrl } from "../../api/mediaService";

function TrainingDetails() {
  const [form] = Form.useForm();
  const { id: trainingId } = useParams({ from: "/trainings/$id" });

  const [training, setTraining] = useState<TrainingDto | undefined>();
  const [scores, setScores] = useState<Registration[]>([]);
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  const handleScoreChange = (userEmail: string, value: string | number) => {
    setScores((prevScores) =>
      prevScores.map((s) =>
        s.userEmail === userEmail
          ? {
              ...s,
              score: value,
            }
          : s
      )
    );
  };

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const data = await getTrainingById(+trainingId);
        const imageUrl = await getFileUrl(
                  +trainingId,
                  EntityType.Training
                );

        setTraining(data);
        setImageUrl(imageUrl);
        setScores(data.registeredAthletes);
        
      } catch (err) {
        console.log(err);
      }
    };

    fetchTraining();
  }, [trainingId]);

  const handleClose = useCallback(() => {
    setScores([]);
  }, []);

  const handleUpdateScore = useCallback(
    async (userEmail: string) => {
      const score = scores.find((s) => s.userEmail === userEmail);

      if (score) {
        await updateScore(score);
      }

      handleClose();
    },
    [handleClose, scores]
  );

  const handleRegisterForTraining = useCallback(
    async (values: UserRegisteredForTraining) => {
      const command: UserRegisteredForTraining = {
        userId: 0,
        trainingId: training?.id || 0,
        userEmail: values.userEmail,
      };

      await registerUserForTraining(command);

      handleClose();
    },
    [handleClose, training?.id]
  );

  return (
    <>
      <div>
        <Form
          form={form}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          onFinish={handleRegisterForTraining}
        >
          <Row gutter={24}>
            <Col>
              <Form.Item
                name="userEmail"
                label={"User Email"}
                rules={[{ max: 500, message: "Too long" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Button htmlType="submit">Add user to training</Button>
            </Col>
          </Row>
        </Form>

        <Row gutter={24}>
          <Col span={10}>
            <Card
              title={training?.title}
              bordered
              headStyle={{ backgroundColor: "#e6f7ff" }}
            >
              <div>{training?.startDate?.toString()}</div>
              <div>{training?.description}</div>
              <Image width={300} src={imageUrl} />
            </Card>
          </Col>
          <Col span={14}>
            <Card
              title={"Results"}
              bordered
              headStyle={{ backgroundColor: "#e6f7ff" }}
            >
              <>
                <Table
                  size="small"
                  dataSource={scores}
                  pagination={false}
                  rowKey="id"
                  columns={[
                    {
                      title: "User",
                      dataIndex: "userEmail",
                      key: "userEmail",
                    },
                    {
                      title: "Score",
                      dataIndex: "score",
                      key: "score",
                      render: (_, record: Registration) => (
                        <Input
                          value={record.score}
                          onChange={(e: { target: { value: string } }) =>
                            handleScoreChange(record.userEmail, e.target.value)
                          }
                        />
                      ),
                    },
                    {
                      title: "Update",
                      dataIndex: "update",
                      key: "update",
                      render: (_, record: Registration) => (
                        <Button
                          type="primary"
                          onClick={() => handleUpdateScore(record.userEmail)}
                        >
                          Update score
                        </Button>
                      ),
                    },
                  ]}
                />
              </>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default TrainingDetails;
