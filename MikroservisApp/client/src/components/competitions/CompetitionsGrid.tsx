import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import {
  CompetitionDto,
} from "../../models/competitions";
import {
  getAllCompetitions,
} from "../../api/competitionsService";
import { Link } from "@tanstack/react-router";

function Competitions() {
  const [competitions, setCompetitions] = useState<
    CompetitionDto[] | undefined
  >();
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const data = await getAllCompetitions();
        setCompetitions(data);
      } catch (err) {
        console.log("Failed to load Competitions." + { err });
      }
    };

    fetchCompetitions();
  }, []);

  return (
    <div>
      <Row gutter={[16, 16]} style={{ width: "100%" }}>
        {competitions?.map((competition, i) => (
          <Col span={6} key={i}>
            <Link to={`/competitions/${competition.id}`}>
              <Card
                title={competition.title}
                variant="borderless"
                headStyle={{ backgroundColor: "#e6f7ff" }}
                hoverable
              >
                <div>{competition.startDate.toString()}</div>
                <div>{competition.endDate.toString()}</div>
                <div>{competition.description}</div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Competitions;
