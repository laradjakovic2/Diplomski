import { TrainingDto, CreateTraining, Training, UserRegisteredForTraining, CreateTrainingTypeMembership, Registration, CreateTrainingType } from "../models/trainings";
import { apiConfig } from "./api";

// 1. GET /trainings
export const getAllTrainings = async (): Promise<TrainingDto[]> => {
  try {
    const response = await fetch(apiConfig.trainingsApi + "/trainings", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
    return await response.json();
  } catch (err) {
    console.error("Error fetching trainings", err);
    throw err;
  }
};

// 2. GET /trainings/{id}
export const getTrainingById = async (id: number): Promise<TrainingDto> => {
  try {
    const response = await fetch(`${apiConfig.trainingsApi}/trainings/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
    return await response.json();
  } catch (err) {
    console.error(`Error fetching training with ID ${id}`, err);
    throw err;
  }
};

// 3. POST /trainings
export const createTraining = async (training: CreateTraining): Promise<void> => {
  try {
    const response = await fetch(apiConfig.trainingsApi + "/trainings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(training),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
  } catch (err) {
    console.error("Error creating training", err);
    throw err;
  }
};

// 4. PUT /trainings
export const updateTraining = async (training: Training): Promise<void> => {
  try {
    const response = await fetch(apiConfig.trainingsApi + "/trainings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(training),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
  } catch (err) {
    console.error("Error updating training", err);
    throw err;
  }
};

// 5. DELETE /trainings/{id}
export const deleteTraining = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${apiConfig.trainingsApi}/trainings/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
  } catch (err) {
    console.error(`Error deleting training with ID ${id}`, err);
    throw err;
  }
};

// 6. POST /trainings/register-user-for-training
export const registerUserForTraining = async (data: UserRegisteredForTraining): Promise<void> => {
  try {
    const response = await fetch(apiConfig.trainingsApi + "/trainings/register-user-for-training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
  } catch (err) {
    console.error("Error registering user for training", err);
    throw err;
  }
};

// 7. POST /trainings/register-user-for-membership
export const registerUserForMembership = async (data: CreateTrainingTypeMembership): Promise<void> => {
  try {
    const response = await fetch(apiConfig.trainingsApi + "/trainings/register-user-for-membership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
  } catch (err) {
    console.error("Error registering user for membership", err);
    throw err;
  }
};

// 8. PUT /trainings/update-score
export const updateScore = async (data: Registration): Promise<void> => {
  try {
    const response = await fetch(apiConfig.trainingsApi + "/trainings/update-score", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
  } catch (err) {
    console.error("Error updating score", err);
    throw err;
  }
};

export const createTrainingType = async (trainingType: CreateTrainingType): Promise<void> => {
  try {
    const response = await fetch(apiConfig.trainingsApi + "/trainingType", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trainingType),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
  } catch (err) {
    console.error("Error creating training", err);
    throw err;
  }
};
