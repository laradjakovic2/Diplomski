import { useCallback, useEffect, useState } from "react";
import { Row, Col, Card, Table, Typography, Drawer, Button, Input } from "antd";
import { DownOutlined, PlusOutlined, UpOutlined } from "@ant-design/icons";
import { useParams } from "@tanstack/react-router";
import {
  getCompetitionById,
  updateCompetitionScore,
} from "../../api/competitionsService";
import {
  CompetitionDto,
  UpdateResult,
  UpdateScoreRequest,
} from "../../models/competitions";
import WorkoutForm from "./WorkoutForm";

const { Title } = Typography;

const scoreData = [
  {
    key: "1",
    name: "Ana Kovač",
    workout1: "120 pts",
    workout2: "100 pts",
    workout3: "95 pts",
    workout4: "110 pts",
    total: "425 pts",
  },
  {
    key: "2",
    name: "Ivan Horvat",
    workout1: "110 pts",
    workout2: "105 pts",
    workout3: "98 pts",
    workout4: "115 pts",
    total: "428 pts",
  },
  {
    key: "3",
    name: "Marija Petrović",
    workout1: "95 pts",
    workout2: "90 pts",
    workout3: "100 pts",
    workout4: "105 pts",
    total: "390 pts",
  },
];

const scoreColumns = [
  { title: "Natjecatelj", dataIndex: "name", key: "name" },
  { title: "Workout 1", dataIndex: "workout1", key: "workout1" },
  { title: "Workout 2", dataIndex: "workout2", key: "workout2" },
  { title: "Workout 3", dataIndex: "workout3", key: "workout3" },
  { title: "Workout 4", dataIndex: "workout4", key: "workout4" },
  { title: "Ukupno", dataIndex: "total", key: "total" },
];

function CompetitionDetails() {
  const { id: competitionId } = useParams({ from: "/competitions/$id" });

  const [competition, setCompetition] = useState<CompetitionDto | undefined>();
  const [isWorkoutDrawerOpen, setIsWorkoutDrawerOpen] =
    useState<boolean>(false);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<
    number | undefined
  >(undefined);
  const [scores, setScores] = useState<UpdateResult[]>([]);

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

  const handleWorkoutExpand = (workoutId: number) => {
    const scores: UpdateResult[] = [];

    competition?.competitionMemberships?.forEach((m) => {
      const result = competition.workouts
        .find((w) => w.id === workoutId)
        ?.results.find((r) => r.userId === m.userId);

      if (result) {
        scores.push({
          id: result.id,
          userId: m.userId,
          userEmail: m.userEmail,
          workoutId: workoutId,
          score: result?.score || 0,
        });
      } else {
        scores.push({
          userId: m.userId,
          userEmail: m.userEmail,
          workoutId: workoutId,
          score: 0,
        });
      }
    });
    setScores(scores);

    setExpandedWorkoutId((prev) =>
      prev === workoutId ? undefined : workoutId
    );
  };

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const data = await getCompetitionById(+competitionId);
        console.log(data);
        setCompetition(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCompetition();
  }, [competitionId, expandedWorkoutId]);

  const handleClose = useCallback(() => {
    setScores([]);
    setIsWorkoutDrawerOpen(false);
    setExpandedWorkoutId(undefined);
  }, []);

  const handleUpdateScoreSubmit = useCallback(async () => {
    const request: UpdateScoreRequest = {
      scores: scores,
    };

    await updateCompetitionScore(request);

    handleClose();
  }, [handleClose, scores]);

  return (
    <>
      <div>
        <Row>
          <Title level={2}>{competition?.title}</Title>

          <Button
            key="1"
            type="primary"
            style={{ marginTop: 25, marginLeft: 15 }}
            onClick={() => setIsWorkoutDrawerOpen(true)}
          >
            <PlusOutlined />
            Add workout
          </Button>
        </Row>

        <Row gutter={24}>
          {/* LEFT: Workouts */}
          <Col span={12}>
            <Title level={3}>Workouts</Title>
            <Row gutter={[16, 16]}>
              {competition?.workouts.map((workout, index) => (
                <Col span={12} key={index}>
                  <Card
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>{workout.title}</span>
                        <Button
                          type="link"
                          icon={
                            expandedWorkoutId === workout.id ? (
                              <UpOutlined />
                            ) : (
                              <DownOutlined />
                            )
                          }
                          onClick={(e: { stopPropagation: () => void }) => {
                            e.stopPropagation();
                            handleWorkoutExpand(workout.id);
                          }}
                        />
                      </div>
                    }
                    bordered
                    headStyle={{ backgroundColor: "#e6f7ff" }}
                  >
                    <p>{workout.description}</p>

                    {expandedWorkoutId === workout.id && (
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
                              render: (_, record: UpdateResult) => (
                                <Input
                                  value={record.score}
                                  onChange={(e: {
                                    target: { value: string };
                                  }) =>
                                    handleScoreChange(
                                      record.userId,
                                      e.target.value
                                    )
                                  }
                                />
                              ),
                            },
                          ]}
                        />
                        <Button onClick={handleUpdateScoreSubmit}>
                          Update score
                        </Button>
                      </>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          {/* RIGHT: Scores */}
          <Col span={12}>
            <Title level={3}>Rezultati</Title>
            <Table
              dataSource={scoreData}
              columns={scoreColumns}
              pagination={false}
              bordered
            />
          </Col>
        </Row>
      </div>
      {competition && (
        <Drawer
          title={"Add workout"}
          open={!!isWorkoutDrawerOpen}
          onClose={() => handleClose()}
          destroyOnClose
          width={700}
        >
          <WorkoutForm
            competition={competition}
            onClose={() => handleClose()}
          />
        </Drawer>
      )}
    </>
  );
}

export default CompetitionDetails;
