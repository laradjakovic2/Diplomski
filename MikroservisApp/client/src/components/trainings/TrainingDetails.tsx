import { useCallback, useEffect, useState } from "react";
import { Row, Card, Table, Typography, Button, Input } from "antd";
import { useParams } from "@tanstack/react-router";
import { Registration, TrainingDto } from "../../models/trainings";
import { getTrainingById, updateScore } from "../../api/trainingsService";

const { Title } = Typography;

function TrainingDetails() {
  const { id: trainingId } = useParams({ from: "/trainings/$id" });

  const [training, setTraining] = useState<TrainingDto | undefined>();
  const [scores, setScores] = useState<Registration[]>([]);

  const handleScoreChange = (userId: number, value: string | number) => {
    setScores((prevScores) =>
      prevScores.map((s) =>
        s.userId === userId
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
        
        setTraining(data);
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
    async (userId: number) => {
      const score = scores.find((s) => s.userId === userId);

      if (score) {
        await updateScore(score);
      }

      handleClose();
    },
    [handleClose, scores]
  );

  return (
    <>
      <div>
        <Row>
          <Title level={2}>{training?.title}</Title>

          <div>{training?.description}</div>
        </Row>

        <Row gutter={48}>
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
                          handleScoreChange(record.userId, e.target.value)
                        }
                      />
                    ),
                  },
                  {
                    title: "Update",
                    dataIndex: "update",
                    key: "update",
                    render: (_, record: Registration) => (
                      <Button onClick={() => handleUpdateScore(record.userId)}>
                        Update score
                      </Button>
                    ),
                  },
                ]}
              />
            </>
          </Card>
        </Row>
      </div>
    </>
  );
}

export default TrainingDetails;
