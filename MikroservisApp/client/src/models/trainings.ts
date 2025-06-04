import { ScoreType } from "./Enums";

export interface TrainingDto {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  trainerId: number;
  trainerEmail: string;
  trainingTypeId: string;
  scoreType: ScoreType;
  registeredAthletes: Registration[];
}

export interface TrainingTypeDto {
  id: number;
  title: string;
  description: string;
}

export interface RegistrationDto {
  id: number;
  trainingId: number;
  userId: number;
  userEmail: string;
  score: string | number;
}

export interface CreateTraining {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  trainerId: number;
  trainingTypeId: number;
  scoreType: ScoreType;
}

export interface Training extends CreateTraining {
  id: number;
  registeredAthletes: Registration[];
}

export interface UserRegisteredForTraining {
  userId: number;
  trainingId: number;
  userEmail: string;
}

export interface CreateTrainingTypeMembership {
  userId: number;
  trainingTypeId: number;
  startDate: Date;
  endDate: Date;
}

export interface CreateTrainingType {
  title: string;
  description?: string;
}

export interface TrainingType extends CreateTrainingType {
  id: number;
}

export interface Registration {
  id:number;
  userId: number;
  trainingId: number;
  score: string | number;
}
