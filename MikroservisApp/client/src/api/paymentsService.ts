import { CompetitionPaymentDto } from "../models/payments";
import { apiConfig } from "./api";

export const getAllPayments = async (): Promise<CompetitionPaymentDto[]> => {
    try {
      const response = await fetch(apiConfig.paymentsApi + "/payments", {
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

export const getPaymentsByCompetitionAndUser = async (userEmail: string, competitionId: number): Promise<CompetitionPaymentDto> => {
  try {
    const response = await fetch(apiConfig.paymentsApi + `/payments/single?userEmail=${userEmail}&competitionId=${competitionId}`, {
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