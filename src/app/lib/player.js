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
    const data = await res.json();
    return data;
}