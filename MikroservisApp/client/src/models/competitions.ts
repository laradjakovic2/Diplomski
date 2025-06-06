import { ScoreType } from "./Enums";

export interface CompetitionMembership {
  id: number;
  competitionId: number;
  userId: number;
  userEmail: string;
}

export interface CreateCompetition {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
}

export interface CompetitionDto extends CreateCompetition {
  id: number;
  competitionMemberships?: CompetitionMembership[];
  workouts: WorkoutDto[];
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
  competition?: CompetitionDto;
  results: Result[];
}

export interface CreateCompetitionPayment
{
    userId: number;
    competitionId: number;
    userEmail: string;
    price: number;
    tax: number;
    total: number;
};

export interface UserRegisteredForCompetition {
  userId: number;
  userEmail: string;
  competitionId: number;
}

export interface Result {
  id: number;
  userId: number;
  userEmail: string;
  workoutId: number;
  score: string | number;
}

export interface UpdateResult {
  id?: number;
  userId: number;
  userEmail: string;
  workoutId: number;
  score: string | number;
}

export interface UpdateScoreRequest {
  scores: UpdateResult[];
}

export interface MediaRequestModel {
  file: File;
  entityId: number;
  entityType: "Competition" | "Training" | "User"; // prilagodi enum vrijednosti
}
