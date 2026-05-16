import { NextResponse } from "next/server";

export async function newUser(name, colour) {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: name, colour: colour})
    });
    return res.status;
}


export async function getUser(id = null, name = null, role = "users") {
  if (!id && !name) return await NextResponse.json({ error: "Did not supply id or name" }, { status: 400 }).json();
  const res = await fetch(`/api/users/${id}`);
  return await res.json();
}


export async function deleteUser() {
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.status;
}