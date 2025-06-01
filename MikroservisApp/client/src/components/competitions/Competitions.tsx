import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Dropdown, Modal, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import {
  CompetitionDto,
  UserRegisteredForCompetition,
} from "../../models/competitions";
import CompetitionForm from "./CompetitionForm";
import {
  getAllCompetitions,
  registerUserForCompetition,
} from "../../api/competitionsService";
import WorkoutForm from "./WorkoutForm";

function Competitions() {
  //const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [competitions, setcompetitions] = useState<CompetitionDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompetition, setCompetition] = useState<
    CompetitionDto | undefined
  >(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isWorkoutDrawerOpen, setIsWorkoutDrawerOpen] =
    useState<boolean>(false);
  const [isRegisterUserModalOpen, setIsRegisterUserModalOpen] =
    useState<boolean>(false);

  const handleOpenDrawer = useCallback((entity?: CompetitionDto) => {
    setCompetition(entity);
    setIsDrawerOpen(true);
  }, []);

  const handleWorkoutDrawerOpen = useCallback(
    (competition?: CompetitionDto) => {
      setIsWorkoutDrawerOpen(true);
      setCompetition(competition);
    },
    []
  );

  const handleRegisterUserDrawerOpen = useCallback(
    (competition?: CompetitionDto) => {
      setIsRegisterUserModalOpen(true);
      setCompetition(competition);
    },
    []
  );

  const handleDrawerClose = useCallback(() => {
    setCompetition(undefined);
    setIsDrawerOpen(false);
    setIsWorkoutDrawerOpen(false);
    setIsRegisterUserModalOpen(false);
  }, []);

  const handleRegisterToCompetition = useCallback(
    async (competitionId: number, userId: number) => {
      const command: UserRegisteredForCompetition = {
        userId: userId,
        competitionId: competitionId,
      };

      await registerUserForCompetition(command);

      handleDrawerClose();
    },
    [handleDrawerClose]
  );
  /*
  const handleDeleteModalOpen = useCallback((activity: CompetitionDto) => {
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
    const fetchcompetitions = async () => {
      try {
        const data = await getAllCompetitions();
        setcompetitions(data);
      } catch (err) {
        setError("Failed to load competitions." + { err });
      }
    };

    fetchcompetitions();
  }, []);

  if (error) return <div>{error}</div>;

  const columns = [
    {
      title: "Competition",
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
        value ? new Date(value).toLocaleDateString() : "",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString() : "",
    },
    {
      title: "Location",
      dataIndex: "location",
    },
    {
      title: "Actions",
      key: "actions",
      render: (t: CompetitionDto) => {
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
            label: <div onClick={() => handleOpenDrawer(t)}>{"<Edit"}</div>,
          },
          {
            key: "add-workout",
            label: (
              <div onClick={() => handleWorkoutDrawerOpen(t)}>
                {"Add workout"}
              </div>
            ),
          },
          {
            key: "register",
            label: (
              <div onClick={() => handleRegisterUserDrawerOpen(t)}>
                {"Register for competition"}
              </div>
            ),
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
        <h1 style={{ margin: 0 }}>competitions</h1>
        <Button key="1" type="primary" onClick={() => handleOpenDrawer()}>
          <PlusOutlined />
          Add
        </Button>
      </div>

      <Table
        style={{ width: "100%" }}
        columns={columns}
        dataSource={competitions}
        rowKey={(activity: CompetitionDto): string => activity.id.toString()}
        //loading={isLoading}
        onRow={(t: CompetitionDto) => ({
          onClick: () => handleOpenDrawer(t),
        })}
        //onChange={handleTableChange}
        bordered
      />

      <Drawer
        title={selectedCompetition ? "Edit" : "Create"}
        open={!!isDrawerOpen}
        onClose={() => handleDrawerClose()}
        destroyOnClose
        width={700}
      >
        <CompetitionForm
          Competition={selectedCompetition}
          onClose={() => handleDrawerClose()}
        />
      </Drawer>

      {selectedCompetition !== undefined ? (
        <Drawer
          title={"Workout"}
          open={!!isWorkoutDrawerOpen}
          onClose={() => handleDrawerClose()}
          destroyOnClose
          width={700}
        >
          <WorkoutForm
            competition={selectedCompetition}
            onClose={() => handleDrawerClose()}
          />
        </Drawer>
      ) : (
        <></>
      )}

      {selectedCompetition ? (
        <Modal
          open={isRegisterUserModalOpen}
          onCancel={() => handleDrawerClose()}
          onOk={() => handleRegisterToCompetition(selectedCompetition?.id, 1)}
        >
          Register to competition {selectedCompetition.title}?
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
}

export default Competitions;
