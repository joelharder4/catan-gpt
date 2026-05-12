import { z } from 'zod';

export const catanStateSchema = z.object({
  resources: z.object({
    wood: z.number().min(0).default(0),
    brick: z.number().min(0).default(0),
    wheat: z.number().min(0).default(0),
    sheep: z.number().min(0).default(0),
    rock: z.number().min(0).default(0),
  }),
  devCards: z.object({
    knights: z.number().min(0).max(14).default(0),
    monopoly: z.number().min(0).max(2).default(0),
    yearOfPlenty: z.number().min(0).max(2).default(0),
    roadBuilding: z.number().min(0).max(2).default(0),
    victoryPoint: z.number().min(0).max(5).default(0),
  }),
  knightsPlayed: z.number().min(0).max(14).default(0),
  longestRoad: z.boolean().default(false),
});