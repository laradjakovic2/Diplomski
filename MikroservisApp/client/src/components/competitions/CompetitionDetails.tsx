import { useCallback, useEffect, useState } from "react";
import { Row, Col, Card, Table, Typography, Drawer, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useParams } from "@tanstack/react-router";
import { getCompetitionById } from "../../api/competitionsService";
import { CompetitionDto } from "../../models/competitions";
import WorkoutForm from "./WorkoutForm";

const { Title } = Typography;

const workouts = [
  { title: "Workout 1", description: "Deadlift + Burpees" },
  { title: "Workout 2", description: "Pull-ups + Rowing" },
  { title: "Workout 3", description: "Squats + Running" },
  { title: "Workout 4", description: "Clean & Jerk + Double Unders" },
];

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
  const [error, setError] = useState<string | undefined>();
  const [isWorkoutDrawerOpen, setIsWorkoutDrawerOpen] =
    useState<boolean>(false);
  const handleDrawerClose = useCallback(() => {
    setIsWorkoutDrawerOpen(false);
  }, []);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const data = await getCompetitionById(+competitionId);
        setCompetition(data);
      } catch (err) {
        setError("Failed to load competitions." + { err });
      }
    };

    fetchCompetition();
  }, [competitionId]);

  if (error) return <div>{error}</div>;
  return (
    <>
      <div>
        <Row>
          <Title level={2}>{competition?.title}</Title>

          <Button
            key="1"
            type="primary"
            style={{marginTop: 25, marginLeft: 15}}
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
              {workouts.map((workout, index) => (
                <Col span={12} key={index}>
                  <Card title={workout.title} bordered>
                    <p>{workout.description}</p>
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
          onClose={() => handleDrawerClose()}
          destroyOnClose
          width={700}
        >
          <WorkoutForm
            competition={competition}
            onClose={() => handleDrawerClose()}
          />
        </Drawer>
      )}
    </>
  );
}

export default CompetitionDetails;
