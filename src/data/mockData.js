// Liste af applications retuneres tilbage
export const applications = [
  {"id": 4, "name": "Ansøgning om indsamlingstilladelse via Hjælpefonden", "start": "03/05 2023", "stop": "05/05 2023"},
  {"id": 9, "name": "RDH samarbejds aftale", "start": "04/06 2023", "stop": "07/08 2023"},
];

// Formular data, hentes fra database når man skal besvare / redigere, samme struktur sendes tilbage under redigering
export const application_tmp = {
  "title": "Loader din ansøgning...",
  "subtitle": "",
  "desc": "",
  "fond_id": 1,
  "form": [
  ],
  "start": "06/09/2023",
  "end": "06/16/2023",
  "emails": ""
};

// Besvarelse af formular
export const reply = {
  1: "Svar 1",
  5: "Et meget langt svar 2",
  8: "Svar 3",
  9: "Choice 1"
}


/*
const onSubmitLogin = (e, setUser, isAdmin) => {
  e.preventDefault();

  if (!isAdmin) {
    setUser({
      "user_id": e.target.Medlemsnummer.value,
      "name": e.target.Navn.value,
      "distrikt": e.target.Distrikt.value,
      "klub": e.target.Klub.value,
      "email": e.target.Email.value,
      "number": e.target.Telefon.value,
      "isAdmin": false
    });
  } else {
    let token = e.target.AdgangskodeAdmin.value
    setUser({
      "email": e.target.EmailAdmin.value,
      "auth": token,
      "isAdmin": true
    });
  }
};
*/
