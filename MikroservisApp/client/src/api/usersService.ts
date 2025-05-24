import { CreateUser, LoginUser, UserDto } from "../models/users";
import { apiConfig } from "./api";

const USERS_API = apiConfig.usersApi + "/users";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Get all users
export const getAllUsers = async (): Promise<UserDto[]> => {
  try {
    const response = await fetch(USERS_API, {
      method: "GET",
      headers: getAuthHeaders(),
    });
// eslint-disable-next-line no-debugger
debugger;
    if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
    return await response.json();
  } catch (err) {
    console.error("Error fetching users", err);
    throw err;
  }
};

// Get user by ID
export const getUserById = async (id: number): Promise<UserDto> => {
  try {
    const response = await fetch(`${USERS_API}/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
    return await response.json();
  } catch (err) {
    console.error(`Error fetching user ${id}`, err);
    throw err;
  }
};

// Register (no auth needed)
export const registerUser = async (data: CreateUser): Promise<string> => {
  try {
    const response = await fetch(USERS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Registration failed: ${response.statusText}`);
    return await response.text(); // JWT token string
  } catch (err) {
    console.error("Error registering user", err);
    throw err;
  }
};

// Login (no auth needed)
export const loginUser = async (data: LoginUser): Promise<string> => {
  try {
    const response = await fetch(`${USERS_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
// eslint-disable-next-line no-debugger
debugger;
    if (!response.ok) throw new Error(`Login failed: ${response.statusText}`);
    return await response.text(); // JWT token string
  } catch (err) {
    console.error("Error logging in", err);
    throw err;
  }
};

// Update user (requires auth)
export const updateUser = async (data: UserDto): Promise<void> => {
  try {
    const response = await fetch(USERS_API, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Update failed: ${response.statusText}`);
  } catch (err) {
    console.error("Error updating user", err);
    throw err;
  }
};

// Delete user (requires auth)
export const deleteUser = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${USERS_API}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Delete failed: ${response.statusText}`);
  } catch (err) {
    console.error("Error deleting user", err);
    throw err;
  }
};
