export const getJson = (endpoint) => {
  return fetch(`http://api.ssl10.saldi.dk/index.php${endpoint}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then(res => res.json());
}

export const postJson = (endpoint, data) => {
  return fetch(`http://api.ssl10.saldi.dk/index.php${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());
}
