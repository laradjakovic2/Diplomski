import { CompetitionDto, CreateCompetitionPayment, CreateWorkout, Result, UserRegisteredForCompetition, Workout } from "../models/competitions";
import { apiConfig } from "./api";

const BASE_URL = apiConfig.competitionsApi + "/competitions";

export const getAllCompetitions = async (): Promise<CompetitionDto[]> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`[${response.status}] ${response.statusText}`);
    return await response.json();
  } catch (err) {
    console.error("Error fetching competitions", err);
    throw err;
  }
};

export const getCompetitionById = async (id: number): Promise<CompetitionDto> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`[${response.status}] ${response.statusText}`);
    return await response.json();
  } catch (err) {
    console.error(`Error fetching competition with ID ${id}`, err);
    throw err;
  }
};

export const createCompetition = async (competition: CompetitionDto): Promise<void> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(competition),
    });
    if (!response.ok) throw new Error(`[${response.status}] ${response.statusText}`);
  } catch (err) {
    console.error("Error creating competition", err);
    throw err;
  }
};

export const updateCompetition = async (competition: CompetitionDto): Promise<void> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(competition),
    });
    if (!response.ok) throw new Error(`[${response.status}] ${response.statusText}`);
  } catch (err) {
    console.error("Error updating competition", err);
    throw err;
  }
};

export const deleteCompetition = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`[${response.status}] ${response.statusText}`);
  } catch (err) {
    console.error(`Error deleting competition with ID ${id}`, err);
    throw err;
  }
};

export const createWorkout = async (workout: CreateWorkout): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/workout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workout),
    });
    if (!response.ok) throw new Error(`[${response.status}] ${response.statusText}`);
  } catch (err) {
    console.error("Error creating workout", err);
    throw err;
  }
};

export const updateWorkout = async (workout: Workout): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/workout`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workout),
    });
    if (!response.ok) throw new Error(`[${response.status}] ${response.statusText}`);
  } catch (err) {
    console.error("Error updating workout", err);
    throw err;
  }
};

export const payCompetitionMembership = async (request: CreateCompetitionPayment): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/pay-competition-membership`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error(`[${response.status}] ${response.statusText}`);
  } catch (err) {
    console.error("Error paying competition membership", err);
    throw err;
  }
};

export const registerUserForCompetition = async (request: UserRegisteredForCompetition): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/register-user-for-competition`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error(`[${response.status}] ${response.statusText}`);
  } catch (err) {
    console.error("Error registering user for competition", err);
    throw err;
  }
};

export const updateCompetitionScore = async (result: Result): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/update-score`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    });
    if (!response.ok) throw new Error(`[${response.status}] ${response.statusText}`);
  } catch (err) {
    console.error("Error updating competition score", err);
    throw err;
  }
};

export const uploadCompetitionImage = async (formData: FormData): Promise<{ mediaId: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/upload-image`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error(`[${response.status}] ${response.statusText}`);
    return await response.json();
  } catch (err) {
    console.error("Error uploading competition image", err);
    throw err;
  }
};

export const getCompetitionImageUrl = async (competitionId: number): Promise<{ imageUrl: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/${competitionId}/image-url`, {
      method: "GET",
    });
    if (!response.ok) throw new Error(`[${response.status}] ${response.statusText}`);
    return await response.json();
  } catch (err) {
    console.error(`Error fetching image URL for competition ${competitionId}`, err);
    throw err;
  }
};
