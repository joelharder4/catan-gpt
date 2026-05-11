
export async function newMatch(gameName = "Catan") {
    const res = await fetch('/api/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({gameName: gameName})
    });

    return res.json();
}


// export async function getPlayers() {
//     const res = await fetch('/api/players');
//     return await res.json();
// }


// export async function deletePlayers() {
//     const res = await fetch('/api/players', {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//     return res.status;
// }