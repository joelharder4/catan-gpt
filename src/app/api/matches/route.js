import { NextResponse } from 'next/server';
import { db } from "@/db";
import { match, game } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { catanStateSchema } from '@/lib/schema';

export async function POST(req) {
  const { gameName } = await req.json();

  let schemaToUse;
  if (gameName === "Catan") schemaToUse = catanStateSchema;
  else return NextResponse.json({ error: "Unknown game" }, { status: 400 });

  // const validation = schemaToUse.safeParse(newState);

  try {
    const [foundGame] = await db.select().from(game).where(eq(game.name, gameName)).limit(1);
    if (!foundGame) return NextResponse.json({ error: `Game '${gameName}' does not exist` }, { status: 400 });
    // decided to check this on player join and on game start
    // if (numPlayers < foundGame.minPlayers) return NextResponse.json({ error: `${gameName} needs at least ${foundGame.minPlayers} players` }, { status: 422 });
    // if (numPlayers > foundGame.maxPlayers) return NextResponse.json({ error: `${gameName} only supports up to ${foundGame.maxPlayers} players` }, { status: 422 });
    
    const [newMatch] = await db.insert(match).values({ gameId: foundGame.id }).returning();
    
    return NextResponse.json(newMatch);
  } catch (e) {
    console.error("Database Error:", e?.cause?.detail);
    return NextResponse.json({ error: "Failed to insert player" }, { status: 500 });
  }
}


export async function GET() {
  return NextResponse.json({ loser: true });
}


export async function DELETE(req) {

}