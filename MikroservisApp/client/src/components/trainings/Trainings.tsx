import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Dropdown, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getAllTrainings } from "../../api/trainingsService";
import { TrainingDto, TrainingType } from "../../models/trainings";
import TrainingForm from "./TrainingForm";
import TrainingTypeForm from "./TrainingTypeForm";
import { useNavigate } from "@tanstack/react-router";

function Trainings() {
  //const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const [trainings, setTrainings] = useState<TrainingDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTraining, setTraining] = useState<TrainingDto | undefined>(
    undefined
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedTrainingType, setTrainingType] = useState<
    TrainingType | undefined
  >(undefined);
  const [isTrainingTypeDrawerOpen, setIsTrainingTypeDrawerOpen] =
    useState<boolean>(false);

  const handleOpenDrawer = useCallback((entity?: TrainingDto) => {
    setTraining(entity);
    setIsDrawerOpen(true);
  }, []);

  const handleTrainingTypeOpenDrawer = useCallback((entity?: TrainingType) => {
    setTrainingType(entity);
    setIsTrainingTypeDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setTraining(undefined);
    setTrainingType(undefined);
    setIsDrawerOpen(false);
    setIsTrainingTypeDrawerOpen(false);
  }, []);
  /*
  const handleDeleteModalOpen = useCallback((activity: TrainingDto) => {
    setIsDeleteModalOpen(true);
    setDeleteActivityId(activity.id);
  }, []);
  
  const handleDeleteCancel = useCallback(() => {
    setIsDeleteModalOpen(false);
    //setDeleteActivityId(undefined);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteActivityId) {
      await deleteActivity.mutateAsync(deleteActivityId);

      setIsDeleteModalOpen(false);
      //setDeleteActivityId(undefined);
    }
  }, []);
*/
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const data = await getAllTrainings();
        setTrainings(data);
      } catch (err) {
        setError("Failed to load trainings." + { err });
      }
    };

    fetchTrainings();
  }, []);

  if (error) return <div>{error}</div>;

  const columns = [
    {
      title: "Training",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (value?: Date) =>
        value
          ? `${new Date(value).toLocaleDateString()} ${new Date(value).toLocaleTimeString()}`
          : "",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (value?: Date) =>
        value
          ? `${new Date(value).toLocaleDateString()} ${new Date(value).toLocaleTimeString()}`
          : "",
    },
    {
      title: "Actions",
      key: "actions",
      render: (t: TrainingDto) => {
        const menuItems = [
          {
            key: "delete",
            label: (
              <div
              //onClick={() => handleDeleteModalOpen(activity)}
              >
                {"Delete"}
              </div>
            ),
          },
          {
            key: "edit",
            label: <div onClick={() => handleOpenDrawer(t)}>{"Edit"}</div>,
          },
        ].filter(Boolean) as { key: string; label: JSX.Element }[];

        return (
          <div
            onClick={(event) => event.stopPropagation()}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Dropdown menu={{ items: menuItems }} trigger={["hover"]}>
              <Button icon={<EllipsisOutlined />} />
            </Dropdown>
          </div>
        );
      },
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
        <h1 style={{ margin: 0 }}>Trainings</h1>
        <Button key="1" type="primary" onClick={() => handleOpenDrawer()}>
          <PlusOutlined />
          Add
        </Button>

        <Button
          key="1"
          type="primary"
          onClick={() => handleTrainingTypeOpenDrawer()}
        >
          <PlusOutlined />
          Add training type
        </Button>
      </div>

      <Table
        style={{ width: "100%" }}
        columns={columns}
        dataSource={trainings}
        rowKey={(activity: TrainingDto): string => activity.id.toString()}
        //loading={isLoading}
        onRow={(t: TrainingDto) => ({
          onClick: () =>
            navigate({
              to: "/trainings/$id",
              params: { id: t.id.toString() || "" },
            }),
        })}
        //onChange={handleTableChange}
        bordered
      />

      <Drawer
        title={!selectedTraining ? "Edit" : "Create"}
        open={!!isDrawerOpen}
        onClose={() => handleDrawerClose()}
        destroyOnClose
        width={700}
      >
        <TrainingForm
          training={selectedTraining}
          onClose={() => handleDrawerClose()}
        />
      </Drawer>

      <Drawer
        title={"Create training type"}
        open={!!isTrainingTypeDrawerOpen}
        onClose={() => handleDrawerClose()}
        destroyOnClose
        width={700}
      >
        <TrainingTypeForm
          trainingType={selectedTrainingType}
          onClose={() => handleDrawerClose()}
        />
      </Drawer>
    </>
  );
}

export default Trainings;
