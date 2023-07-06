export const getJson = (endpoint) => {
  return fetch(`https://api.rdhj.dk${endpoint}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then(res => res.json());
}

export const postJson = (endpoint, data) => {
  return fetch(`https://api.rdhj.dk${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());
}
