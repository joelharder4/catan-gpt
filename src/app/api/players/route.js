import { NextResponse } from 'next/server';
import { db } from "@/db";
import { user } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function POST(req) {
  const {name, colour} = await req.json();
  if (!name || !colour) {
    return NextResponse.json({ error: 'Did not provide required data' }, { status: 400 });
  }

  try {
    await db.insert(user).values({
      name: name,
      email: `${name}@${colour}.ca`
    });

    return NextResponse.json({});
  } catch (e) {
    console.error("Database Error:", e?.cause?.detail);
    return NextResponse.json({ error: "Failed to insert player" }, { status: 500 });
  }
}

export async function GET() {
  
  const sampleData = [
    { name: "Blue (Based)", colour: "#1b63cf" },
    { name: "Black", colour: "#222222" },
    { name: "White (Bot)", colour: "#f7f7f7" },
    { name: "Orange (Grr)", colour: "#db8121" },
    { name: "Red", colour: "#bf2121" },
  ];

  return NextResponse.json({ data: sampleData });
}

export async function DELETE(req) {
  let name, colour;

  try {
    const body = await req.json();
    name = body.name;
    colour = body.colour;
  } catch (err) {}

  try {
    let condition;

    if (name && colour) {
      condition = and(
        eq(user.name, name), 
        eq(user.email, `${name}@${colour}.ca`)
      );
    } else if (name) {
      condition = eq(user.name, name);
    } else if (colour) {
      condition = like(user.email, `%@${colour}.ca`);
    }

    if (condition) {
      await db.delete(user).where(condition);
    } else {
      await db.delete(user);
    }

    return NextResponse.json({});
  } catch (e) {
    console.error("Database Error:", e);
    return NextResponse.json({ error: "Failed to delete player(s)" }, { status: 500 });
  }
}