

export async function newPlayer(name, colour) {
    const res = await fetch('/api/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: name, colour: colour})
    });
    return res.status;
}

export async function getPlayers() {
    const res = await fetch('/api/players');
    return await res.json();
}

export async function deletePlayers() {
    const res = await fetch('/api/players', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.status;
}