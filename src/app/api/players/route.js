import { NextResponse } from 'next/server';
import { db } from "@/db";
import { matchPlayer } from '@/db/schema';
import { eq, and } from 'drizzle-orm';


// export async function POST(req) {
//   const {matchId, teamName, userId, botId} = await req.json();
//   if (!matchId || !teamName || (!userId && !botId)) {
//     return NextResponse.json({ error: 'Did not provide required data' }, { status: 400 });
//   }
//   if (userId === botId) return NextResponse.json({ error: 'Exactly one of userId or botId must be sent' }, { status: 422 });

//   try {
//     await db.insert(matchPlayer).values({
//       matchId: matchId,
//       botId: botId ?? null,
//       userId: userId ?? null,
//       state: catanStateSchema.toJSONSchema(),
//     });

//     return NextResponse.json({});
//   } catch (e) {
//     console.error("Database Error:", e?.cause?.detail);
//     return NextResponse.json({ error: "Failed to insert player" }, { status: 500 });
//   }
// }


export async function GET(req) {
  const { searchParams } = req.nextUrl;
  
  const id = searchParams.get("id");
  const matchId = searchParams.get("matchId");
  const teamId = searchParams.get("teamId");
  const userId = searchParams.get("userId");
  const botId = searchParams.get("botId");
  const isWinner = searchParams.get("isWinner");

  const conditions = [];

  if (id) conditions.push(eq(matchPlayer.id, parseInt(id)));
  if (matchId) conditions.push(eq(matchPlayer.matchId, parseInt(matchId)));
  if (teamId) conditions.push(eq(matchPlayer.teamId, parseInt(teamId)));
  if (userId) conditions.push(eq(matchPlayer.userId, parseInt(userId)));
  if (botId) conditions.push(eq(matchPlayer.botId, parseInt(botId)));
  
  if (isWinner === "true") conditions.push(eq(matchPlayer.isWinner, true));
  if (isWinner === "false") conditions.push(eq(matchPlayer.isWinner, false));

  try {
    let query = db.select().from(matchPlayer);

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    const results = await query;

    return NextResponse.json({ success: true, players: results });

  } catch (e) {
    console.error("Database Error:", e?.cause?.detail);
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
  }
}


export async function DELETE(req) {
  // verify this is coming from the host or the player themselves
  return NextResponse.json({ error: "Not Implemented" }, { status: 501 });
}