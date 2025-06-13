import { useCallback, useEffect, useState } from "react";
import { Row, Typography, Button, Input, Form } from "antd";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  getCompetitionById,
  payCompetitionMembership,
} from "../../api/competitionsService";
import {
  CompetitionDto,
  CreateCompetitionPayment,
} from "../../models/competitions";

const { Title } = Typography;

function CompetitionRegistration() {
  const navigate = useNavigate();
  const { id: competitionId } = useParams({
    from: "/competitions/$id/registration",
  });
  const [form] = Form.useForm();
  const [competition, setCompetition] = useState<CompetitionDto | undefined>();

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
  }, [competitionId]);

  const onClose = useCallback(() => {
    navigate({
      to: "/competitions/$id",
      params: { id: competitionId },
    });
  }, [competitionId, navigate]);

  const handleSubmit = useCallback(
    async (values: CreateCompetitionPayment) => {
      const command: CreateCompetitionPayment = {
        ...values,
        competitionId: +competitionId,
        price: 100,
        tax: 25,
        total: 125,
      };

      await payCompetitionMembership({
        ...command,
      });
      onClose();
    },
    [competitionId, onClose]
  );

  return (
    <>
      <Title level={3}>{competition?.title}</Title>
      <Title level={4}>Payment data</Title>
      <Form
        form={form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="firstName"
          label={"First name"}
          rules={[{ max: 500, message: "Too long" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="lastName" label={"LastName"}>
          <Input />
        </Form.Item>

        <Form.Item name="userEmail" label={"Email"}>
          <Input />
        </Form.Item>

        <Row className="form-buttons">
          <Button type="default" onClick={onClose}>
            {"Cancel"}
          </Button>
          <Button type="primary" htmlType="submit">
            Checkout and pay
          </Button>
        </Row>
      </Form>
    </>
  );
}

export default CompetitionRegistration;
