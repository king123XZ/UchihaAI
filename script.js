function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const code = generateCode();
document.getElementById("codeBox").innerText = code;

function connectBot() {
  fetch("https://tu-api.com/vincular", { // cambia esto por tu API real
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ code: code })
  })
  .then(res => res.json())
  .then(data => {
    alert("¡Bot vinculado correctamente!");
  })
  .catch(err => {
    alert("Error al conectar el bot. Intenta de nuevo.");
  });
}