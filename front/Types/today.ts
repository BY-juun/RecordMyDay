import { Plan } from "./common";

export interface TodayPlan {
  UserId: number;
  createdAt: string;
  dayinfo: number;
  id: number;
  updatedAt: string;
  Plans: Array<Plan>;
}
