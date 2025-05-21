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
  score: string;
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
  }
  
  export interface UserRegisteredForTraining {
    userId: number;
    trainingId: number;
  }
  
  export interface CreateTrainingTypeMembership {
    userId: number;
    trainingTypeId: number;
    startDate: Date;
    endDate: Date;
  }
  
  export interface Registration {
    userId: number;
    trainingId: number;
    score: number;
  }
  
