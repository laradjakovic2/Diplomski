import { useEffect, useState } from "react";
import { CompetitionPaymentDto } from "../../models/payments";
import { getAllPayments } from "../../api/paymentsService";
import { Table } from "antd";

function Payments() {
  const [payments, setPayments] = useState<CompetitionPaymentDto[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();
        console.log(data);
        setPayments(data);
      } catch (err) {
        console.log("Failed to load Payments." + { err });
      }
    };

    fetchPayments();
  }, []);

  const columns = [
    {
      title: "User",
      dataIndex: "userEmail",
    },
    /*{
      title: "Competition",
      dataIndex: "competitionId",
    },*/
    {
      title: "Price",
      dataIndex: "total",
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Payments</h1>
      </div>

      <Table
        style={{ width: "100%" }}
        columns={columns}
        dataSource={payments}
        bordered
      />
    </>
  );
}

export default Payments;
