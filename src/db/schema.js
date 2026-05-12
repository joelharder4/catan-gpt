import { pgTable, pgEnum, serial, text, timestamp, integer, varchar, boolean, check, uniqueIndex, char, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const rolesEnum = pgEnum("roles", ["user", "admin"]);
export const matchStatusEnum = pgEnum("match_status", ["pending", "in-progress", "completed", "aborted"])

const timestamps = {
  updatedAt: timestamp("updated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}


export const user = pgTable("user", {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().unique().notNull(),
  role: rolesEnum().default("user"),
  ...timestamps,
})

// e.g. 1, "Catan", "Strategy", 2, 4
export const game = pgTable("game", {
  id: serial().primaryKey(),
  name: text().unique().notNull(),
  genre: text(), // could be turned into a different table
  minPlayers: integer("min_players").notNull().default(1),
  maxPlayers: integer("max_players").notNull(),
});

export const bot = pgTable("bot", {
  id: serial().primaryKey(),
  ownerId: integer("owner_id").references(() => user.id),
  name: varchar({ length: 128 }),
});

export const match = pgTable("match", {
  id: serial().primaryKey(),
  gameId: integer("game_id").references(() => game.id).notNull(),
  numPlayers: integer("num_players").default(0).notNull(),
  status: matchStatusEnum().default("pending").notNull(),
});

export const team = pgTable("team", {
  id: serial().primaryKey(),
  name: varchar({ length: 32 }).unique(),
  colour: char({ length: 7 }).default("#000000"),
});

export const matchPlayer = pgTable("match_player", {
  id: serial().primaryKey(),
  matchId: integer("match_id").references(() => match.id).notNull(),
  teamId: integer("team_id").references(() => team.id),

  botId: integer("bot_id").references(() => bot.id),
  userId: integer("user_id").references(() => user.id),
  
  score: integer().default(0),
  state: jsonb().default({}),
  isWinner: boolean("is_winner").default(false).notNull(),
}, (table) => [
  // validates that the player is either a user XOR a bot
  check(
    "participant_type_check",
    sql`(${table.botId} IS NOT NULL AND ${table.userId} IS NULL) OR (${table.botId} IS NULL AND ${table.userId} IS NOT NULL)`
  ),
]);