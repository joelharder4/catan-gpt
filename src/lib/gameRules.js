import { catanStateSchema } from "./schema"

export const GAME_RULES = {
  "Catan": {
    baseColors: ["#1b63cf", "#f7f7f7", "#db8121", "#bf2121"], 
    defaultState: catanStateSchema.toJSONSchema(),
  },
}