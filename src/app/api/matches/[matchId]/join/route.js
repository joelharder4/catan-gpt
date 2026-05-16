import { NextResponse } from 'next/server';
import { db } from "@/db";
import { matchPlayer, match, game } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GAME_RULES } from "@/lib/gameRules";

export async function POST(req, { params }) {
  const { matchId } = params;
  const { userId, botId, requestedColor } = await req.json();

  if ((userId && botId) || (!userId && !botId)) return NextResponse.json({ error: 'Exactly one of userId or botId must be sent' }, { status: 422 });

  const [currentMatch] = await db.select({
    gameName: game.name,
    numPlayers: match.numPlayers,
    maxPlayers: game.maxPlayers,
  })
  .from(match)
  .innerJoin(game, eq(match.gameId, game.id))
  .where(eq(match.id, parseInt(matchId)));

  if (!currentMatch) return NextResponse.json({ error: "Match not found" }, { status: 404 });


  const rules = GAME_RULES[currentMatch.gameName];

  const existingPlayers = await db.select({ colour: matchPlayer.colour })
    .from(matchPlayer)
    .where(eq(matchPlayer.matchId, parseInt(matchId)));
  
  if (existingPlayers.length >= currentMatch.maxPlayers) {
    return NextResponse.json({ error: "Match is full" }, { status: 400 });
  }

  if (existingPlayers.length !== currentMatch.numPlayers) {
    console.error(`match ${matchId} thinks it has ${currentMatch.numPlayers} players, but found ${existingPlayers.length} related match_player entries`);
  }


  const takenColours = existingPlayers.map(player => player.colour);
  let assignedColor = null;

  if (requestedColor && rules.baseColors.includes(requestedColor) && !takenColors.includes(requestedColor)) {
    assignedColor = requestedColor;
  } else {
    assignedColor = rules.baseColors.find(c => !takenColours.includes(c));
  }

  if (!assignedColor) return NextResponse.json({ error: "No colors available" }, { status: 400 });

  try {
    const [newPlayer] = await db.insert(matchPlayer).values({
      matchId: parseInt(matchId),
      botId: botId ? parseInt(botId) : null,
      userId: userId ? parseInt(userId) : null,
      colour: assignedColor,
      state: rules.defaultState,
    }).returning();

    return NextResponse.json({ success: true, player: newPlayer });
  } catch (e) {
    return NextResponse.json({ error: "Failed to join match" }, { status: 500 });
  }
}