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
  CompetitionMembership,
  UpdateResult,
  UpdateScoreRequest,
  WorkoutDto,
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
  [key: string]: number | string; // za workout1, workout2,
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
  const [totalScoreColumns, setTotalScoreColumns] = useState<ColumnProp[]>([]);
  const [totalScoreData, setTotalScoreData] = useState<ScoreItem[]>([]);

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

  const generateScoreTable = (
    workouts: WorkoutDto[],
    memberships: CompetitionMembership[]
  ): { columns: ColumnProp[]; data: ScoreItem[] } => {
    const columns: ColumnProp[] = [
      {
        title: "Natjecatelj",
        dataIndex: "userEmail",
        key: "userEmail",
        sort: 0,
      },
    ];
    const data: ScoreItem[] = [];
    const sortedWorkouts = [...workouts].sort((a, b) => a.id - b.id);

    // Map trening ID -> workout key npr: workout1, workout2...
    const workoutKeys = sortedWorkouts.map((w, index) => ({
      key: `workout${index + 1}`,
      workout: w,
    }));

    workoutKeys.forEach(({ key }, index) => {
      columns.push({
        title: `Workout ${index + 1}`,
        dataIndex: key,
        key,
        sort: index + 1,
      });
    });

    columns.push({
      title: "Total",
      dataIndex: "total",
      key: "total",
      sort: workoutKeys.length + 1,
    });

    for (const member of memberships) {
      const scoreItem: ScoreItem = {
        key: member.userId.toString(),
        userEmail: member.userEmail ?? "",
        total: 0,
      };

      let total = 0;

      workoutKeys.forEach(({ key, workout }) => {
        const result = workout.results.find((r) => r.userId === member.userId);
        const scoreStr = result?.score ?? "0";

        const score = parseFloat(scoreStr.toString());
        const validScore = isNaN(score) ? 0 : score;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (scoreItem as any)[key] = validScore;
        total += validScore;
      });

      scoreItem.total = total;
      data.push(scoreItem);
    }

    return { columns, data };
  };

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const data = await getCompetitionById(+competitionId);
        setCompetition(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchImage = async () => {
      try {
        const imageUrl = await getFileUrl(
          +competitionId,
          EntityType.Competition
        );
        setImageUrl(imageUrl);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCompetition();
    fetchImage();
  }, [competitionId]);

  useEffect(() => {
    if (competition?.workouts && competition.competitionMemberships) {
      const { columns, data } = generateScoreTable(
        competition.workouts,
        competition.competitionMemberships
      );
      setTotalScoreColumns(columns);
      setTotalScoreData(data);
    }
  }, [competition]);

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

        <Row>
          <Title level={4}>{competition?.totalPrice}</Title>
          <div>{competition?.description}</div>
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
