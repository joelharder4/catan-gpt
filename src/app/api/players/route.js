import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import Player from '../../models/Player';

export async function POST(req) {
    await dbConnect();
    const data = await req.json();

    const player = await Player.create(data);
    return NextResponse.json({ success: true, data: player });
}

export async function GET(req) {
    await dbConnect();

    const players = await Player.find({});
    return NextResponse.json({ success: true, data: players });
}