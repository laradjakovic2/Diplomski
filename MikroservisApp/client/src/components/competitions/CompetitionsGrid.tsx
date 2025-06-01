import { Card, Col, Row } from "antd";
import {  useEffect, useState } from "react";
import { CompetitionDto } from "../../models/competitions";
import { getAllCompetitions } from "../../api/competitionsService";
import { Link } from "@tanstack/react-router";

function Competitions() {
  const [error, setError] = useState<string | undefined>();
  const [competitions, setCompetitions] = useState<
    CompetitionDto[] | undefined
  >();
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const data = await getAllCompetitions();
        setCompetitions(data);
      } catch (err) {
        setError("Failed to load Competitions." + { err });
      }
    };

    fetchCompetitions();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div>
      <Row gutter={24} style={{ width: "100%" }}>
        {competitions?.map((competition, i) => {
          return (
            <Col span={24} key={i}>
              <Link to={`/competitions/${competition.id}`}>
                <Card title={competition.title} variant="borderless">
                  <div>{competition.startDate.toString()}</div>
                  <div>{competition.endDate.toString()}</div>
                  <div>{competition.description}</div>
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default Competitions;
