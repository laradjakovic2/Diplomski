import { ScoreType } from "./Enums"

export interface CreateCompetition {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
}

export interface CompetitionDto extends CreateCompetition{
  id: number;
}

export interface CreateWorkout {
  title: string;
  description?: string;
  competitionId: number;
  scoreType: ScoreType;
}

export interface Workout {
  id: number;
  title: string;
  description?: string;
  competitionId: number;
  scoreType: ScoreType;
}

export interface WorkoutDto {
  id: number;
  title: string;
  description?: string;
  competitionId: number;
  scoreType: ScoreType;
}

export interface CreateCompetitionPayment {
  userId: number;
  competitionId: number;
  amount: number;
  paymentMethod: "Cash" | "Card" | "Online";
}

export interface UserRegisteredForCompetition {
  userId: number;
  competitionId: number;
}

export interface Result {
  is: number;
  userId: number;
  userEmail: string;
  workoutId: number;
  score: number;
}

export interface MediaRequestModel {
  file: File;
  entityId: number;
  entityType: "Competition" | "Training" | "User"; // prilagodi enum vrijednosti
}
