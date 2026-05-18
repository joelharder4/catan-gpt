import { NextResponse } from 'next/server';
import { db } from "@/db";
import { user } from '@/db/schema';
import { eq, not } from 'drizzle-orm';


export async function POST(req) {
  const {name, email, role} = await req.json();
  if (!name || !email) {
    return NextResponse.json({ error: 'Did not provide required data' }, { status: 400 });
  }

  try {
    // TODO: provide better error messages to detect existing emails
    await db.insert(user).values({
      name: name,
      email: email,
      role: role,
    });

    return NextResponse.json({});
  } catch (e) {
    console.error("Database Error:", e?.cause?.detail);
    return NextResponse.json({ error: "Failed to insert player" }, { status: 500 });
  }
}


export async function GET(req) {
  const { searchParams } = req.nextUrl;
  
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const role = searchParams.get("role");

  const conditions = [];

  if (id) conditions.push(eq(user.id, parseInt(id)));
  if (name) conditions.push(eq(user.name, name));
  if (role) conditions.push(eq(user.role, role));

  try {
    let query = db.select({
      id: user.id,
      name: user.name,
      role: user.role,
    })
    .from(user)
    .limit(1);

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


// export async function GET() {
  
//   const sampleData = [
//     { name: "Blue (Based)", colour: "#1b63cf" },
//     { name: "Black", colour: "#222222" },
//     { name: "White (Bot)", colour: "#f7f7f7" },
//     { name: "Orange (Grr)", colour: "#db8121" },
//     { name: "Red", colour: "#bf2121" },
//   ];

//   return NextResponse.json({ data: sampleData });
// }


export async function DELETE(req) {
  // TODO: OMEGA VERIFY THIS IS BEING MADE BY THE ACTUAL USER
  let name, email;

  try {
    const body = await req.json();
    name = body.name;
    email = body.email;
  } catch (err) {}

  const conditions = [];

  conditions.push(not(eq(user.role, "admin")));
  if (name) conditions.push(eq(user.name, name));
  if (colour) conditions.push(eq(user.email, email));
 
  try {
    const results = await db.delete(user).where(and(...conditions));

    return NextResponse.json({});
  } catch (e) {
    console.error("Database Error:", e);
    return NextResponse.json({ error: "Failed to delete player(s)" }, { status: 500 });
  }
}