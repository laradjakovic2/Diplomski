import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Dropdown, Table } from "antd";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/usersService";
import { UserDto } from "../../models/users";

function Users() {
  const [Users, setUsers] = useState<UserDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError("Failed to load Users." + { err });
      }
    };

    fetchUsers();
  }, []);

  if (error) return <div>{error}</div>;

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Birthdate",
      dataIndex: "birthDate",
      render: (value?: Date) => value ? new Date(value).toLocaleDateString() : "",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Actions",
      key: "actions",
      render: () => {
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
        <h1 style={{ margin: 0 }}>Users</h1>
      </div>

      <Table
        style={{ width: "100%" }}
        columns={columns}
        dataSource={Users}
        rowKey={(activity: UserDto): string => activity.id.toString()}
        //loading={isLoading}
        //onChange={handleTableChange}
        bordered
      />
    </>
  );
}

export default Users;
