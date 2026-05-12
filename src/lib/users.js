
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


export async function getUser() {
    const res = await fetch('/api/users');
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