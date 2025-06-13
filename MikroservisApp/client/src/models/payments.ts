export interface CompetitionPaymentDto
{
  id: number;
  userId: number;
  competitionId: number;
  userEmail: string;
  price: number;
  tax: number;
  total: number;
};