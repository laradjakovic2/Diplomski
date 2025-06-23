import { useCallback, useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Typography,
  Drawer,
  Button,
  Input,
  Image,
} from "antd";
import { DownOutlined, PlusOutlined, UpOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "@tanstack/react-router";
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
import { EntityType } from "../../models/Enums";
import { getFileUrl } from "../../api/mediaService";

const { Title } = Typography;

interface ColumnProp {
  title: string;
  dataIndex: string;
  key: string;
  sort: number;
}

interface ScoreItem {
  key: string;
  userEmail: string;
  workout1?: number | string;
  workout2?: number | string;
  workout3?: number | string;
  workout4?: number | string;
  workout5?: number | string;
  workout6?: number | string;
  total: number | string;
}

function CompetitionDetails() {
  const navigate = useNavigate();
  const { id: competitionId } = useParams({ from: "/competitions/$id/" });

  const [competition, setCompetition] = useState<CompetitionDto | undefined>();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [isWorkoutDrawerOpen, setIsWorkoutDrawerOpen] =
    useState<boolean>(false);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<
    number | undefined
  >(undefined);
  const [scores, setScores] = useState<UpdateResult[]>([]);
  const [totalScoreColumns, setTotalScoreColumns] = useState<ColumnProp[]>([
    { title: "Name", dataIndex: "name", key: "name", sort: -1 },
    { title: "Workout 0", dataIndex: "workout0", key: "workout0", sort: 0 },
    { title: "Workout 1", dataIndex: "workout1", key: "workout1", sort: 0 },
    { title: "Total", dataIndex: "total", key: "total", sort: 100 },
  ]);
  const [totalScoreData, setTotalScoreData] = useState<ScoreItem[]>([
    {
      key: "1",
      userEmail: "Ana Kovač",
      workout1: "120 pts",
      workout2: "100 pts",
      workout3: "95 pts",
      workout4: "110 pts",
      total: "425 pts",
    },
  ]);

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
        const imageUrl = await getFileUrl(
          +competitionId,
          EntityType.Competition
        );
        console.log(data);
        setCompetition(data);
        setImageUrl(imageUrl);

        const totalScoreCols: ColumnProp[] = [];

        data.workouts.forEach((workout, index) => {
          totalScoreCols.push({
            title: workout.title,
            dataIndex: workout.id.toString(),
            key: workout.id.toString(),
            sort: index,
          });
        });

        setTotalScoreColumns(totalScoreCols.sort((c) => c.sort));
        setTotalScoreData([
          {
            key: "1",
            userEmail: "Ana Kovač",
            workout1: "120 pts",
            workout2: "100 pts",
            workout3: "95 pts",
            workout4: "110 pts",
            total: "425 pts",
          },
          {
            key: "2",
            userEmail: "Ivan Horvat",
            workout1: "110 pts",
            workout2: "105 pts",
            workout3: "98 pts",
            workout4: "115 pts",
            total: "428 pts",
          },
          {
            key: "3",
            userEmail: "Marija Petrović",
            workout1: "95 pts",
            workout2: "90 pts",
            workout3: "100 pts",
            workout4: "105 pts",
            total: "390 pts",
          },
        ]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCompetition();
  }, [competitionId, expandedWorkoutId, totalScoreColumns]);

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
          <div>Price: {competition?.totalPrice}</div>

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
        {imageUrl && (
          <Row>
            <Image width={450} src={imageUrl} />
          </Row>
        )}

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
            <Title level={3}>Results</Title>
            <Table
              dataSource={totalScoreData}
              columns={totalScoreColumns}
              pagination={false}
              bordered
            />
          </Col>
        </Row>

        <Row>
          <Button
            type="primary"
            onClick={() => {
              navigate({
                to: "/competitions/$id/registration",
                params: { id: competitionId },
              });
            }}
          >
            Register
          </Button>
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
