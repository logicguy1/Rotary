// Liste af applications retuneres tilbage
export const applications = [
  {"id": 4, "name": "Ansøgning om indsamlingstilladelse via Hjælpefonden", "start": "03/05 2023", "stop": "05/05 2023"},
  {"id": 9, "name": "RDH samarbejds aftale", "start": "04/06 2023", "stop": "07/08 2023"},
];

// Formular data, hentes fra database når man skal besvare / redigere, samme struktur sendes tilbage under redigering
export const application_tmp = {
  "title": "Ansøgning om indsamlingstilladelse via Hjælpefonden",
  "subtitle": "For Rotary klubber og distrikter i Danmark",
  "desc": "Rotary Danmarks Hjælpefond\ncvr 11637744\n\nKontakt: Just Hartoft, telefon 40141717, mail: rdh@hartoft.dk",
  "form": [
    {"id": 1, "type": "text", "label": "Dato for ansøgning", "required": true},
    {"id": 4, "type": "plaintext", "label": "Har du måske overvejet hvordan det ville se ud hvis nu man gjorde det her? Eller måske ændrede det her?", "required": false},
    {"id": 8, "type": "text", "label": "Projekt navn (finder du på den ansøgning du har lavet og modtaget kopi af)", "required": true},
    {"id": 5, "type": "longtext", "label": "Indsamlingen formål", "required": false},
    {"id": 9, "type": "dropdown", "label": "Ja eller nej", "required": false, "choices": ["Ja", "Nej", "Noget derimellem"]},
  ],
  "start": "06/09/2023",
  "end": "06/16/2023",
  "emails": "person1@example.com,person2@example.com"
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
