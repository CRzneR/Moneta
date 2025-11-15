"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const formFixCost = document.getElementById("newFixCostForm");
  const fixCostInput = document.getElementById("fixCost");
  const nameInput = document.getElementById("fixName");
  const categorySelect = document.getElementById("fixCategory");
  const typeSelect = document.getElementById("fixCostType");

  formFixCost.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fixCostData = {
      cost: Number(costInput.value),
      name: nameInput.value.trim(),
      category: categorySelect.value,
      type: typeSelect.value,
    };

    if (!data.cost || !data.name || !data.category) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }

    // 1. An Backend schicken
    try {
      const res = await fetch("/api/fixcosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("Server-Antwort:", result);
      alert("Eintrag erfolgreich gespeichert!");
    } catch (err) {
      console.error("Fehler:", err);
      alert("Fehler beim Speichern!");
    }

    form.reset();
  });

  const addFixBtn = document.querySelector(".addFixCostBtn");
  const overlay = document.getElementById("fixCostOverlay");
  const closeOverlay = document.getElementById("closeOverlay");

  addFixBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
  });

  closeOverlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  const form = document.getElementById("overlayFixCostForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      cost: Number(document.getElementById("ovCost").value),
      name: document.getElementById("ovName").value,
      category: document.getElementById("ovCategory").value,
      type: document.getElementById("ovType").value,
    };

    if (!data.cost || !data.name || !data.category) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }

    // 👉 1. an Backend senden
    const response = await fetch("/api/fixcosts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const saved = await response.json();

    // 👉 2. Tabelle sofort aktualisieren
    addRowToTable(saved.entry);

    // 👉 3. Overlay schließen + Formular leeren
    overlay.classList.add("hidden");
    form.reset();
  });

  function addRowToTable(entry) {
    let table;

    if (entry.type === "fix") {
      table = document.querySelector("#fixKostenTabelle tbody");
    } else if (entry.type === "jährlich") {
      table = document.querySelector("#jaehrlicheKostenTabelle tbody");
    } else {
      table = document.querySelector("#variableKostenTabelle tbody");
    }

    const row = document.createElement("tr");

    row.innerHTML = `
    <td class="border px-2 py-1">${entry.cost.toFixed(2)} €</td>
    <td class="border px-2 py-1">${entry.name}</td>
    <td class="border px-2 py-1">${entry.category}</td>
    <td class="border px-2 py-1 text-center">
      <button class="p-1 text-red-600">🗑️</button>
    </td>
  `;

    table.appendChild(row);
  }
});
