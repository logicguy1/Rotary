export const getJson = async (endpoint) => {
  return fetch(`https://api.rdhj.dk${endpoint}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(res => res.json())
    .catch(err => console.log("HTTPERR", err));
}

export const postJson = (endpoint, data) => {
  return fetch(`https://api.rdhj.dk${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());
}
