let deviceCount = 0;
const container = document.getElementById("deviceContainer");
const label = document.getElementById("deviceCountLabel");
const deliveryContainer = document.getElementById("deliveryContainer");
const form = document.getElementById("onboardingForm");

// Inicializar Delivery Rows
const platforms = [
  { id: "ue", name: "Uber Eats" },
  { id: "dd", name: "DoorDash" },
  { id: "gh", name: "GrubHub" },
];

platforms.forEach((p) => {
  const div = document.createElement("div");
  div.className = "delivery-row";
  div.innerHTML = `
        <label>${p.name.toUpperCase()}</label>
        <div class="binary-choice">
            <label class="check-item"><input type="checkbox" name="${p.id}_active" value="yes" class="exclusive platform-toggle"> YES</label>
            <label class="check-item"><input type="checkbox" name="${p.id}_active" value="no" class="exclusive platform-toggle"> NO</label>
        </div>
        <div class="field-group time-field" style="opacity: 0.4;">
            <label>Conf. Time</label><input type="time" disabled>
        </div>
    `;
  deliveryContainer.appendChild(div);
});

// Event Listeners para botones
document
  .getElementById("plus-btn")
  .addEventListener("click", () => updateDevices(1));
document
  .getElementById("minus-btn")
  .addEventListener("click", () => updateDevices(-1));
document
  .getElementById("print-btn")
  .addEventListener("click", () => window.print());

function updateDevices(val) {
  deviceCount = Math.max(0, deviceCount + val);
  label.innerText = deviceCount;
  renderCards();
}

function renderCards() {
  const current = container.querySelectorAll(".device-table").length;
  const models = [
    "Sunmi p3 mix",
    "valor vp800",
    "valor vp550e",
    "volcora printer",
    "cashdrawer",
  ];

  if (deviceCount > current) {
    for (let i = current + 1; i <= deviceCount; i++) {
      const table = document.createElement("table");
      table.className = "device-table";
      table.innerHTML = `
                <tbody>
                    <tr>
                        <td class="label-cell">Device #${i} Model</td>
                        <td>
                            <select name="model_${i}">
                                <option disabled selected>Select hardware...</option>
                                ${models.map((m) => `<option value="${m}">${m}</option>`).join("")}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td class="label-cell">Autobatch</td>
                        <td>
                            <div class="binary-choice">
                                <label class="check-item"><input type="checkbox" name="db_${i}" value="yes" class="dev-toggle"> YES</label>
                                <label class="check-item"><input type="checkbox" name="db_${i}" value="no" class="dev-toggle"> NO</label>
                            </div>
                        </td>
                    </tr>
                    <tr class="time-row" id="tbox_${i}" style="opacity: 0.4;">
                        <td class="label-cell">Batch Time</td>
                        <td><input type="time" disabled></td>
                    </tr>
                </tbody>
            `;
      container.appendChild(table);
    }
  } else {
    while (container.children.length > deviceCount) {
      container.removeChild(container.lastChild);
    }
  }
}

// Lógica de Checkboxes y habilitación de campos
form.addEventListener("change", (e) => {
  const target = e.target;
  if (target.type !== "checkbox") return;

  // Exclusividad
  if (
    target.classList.contains("exclusive") ||
    target.name.startsWith("db_") ||
    target.name.startsWith("fund_")
  ) {
    const group = form.querySelectorAll(`input[name="${target.name}"]`);
    group.forEach((cb) => {
      if (cb !== target) cb.checked = false;
    });
  }

  const isYes = target.value === "yes" && target.checked;

  // Lógica dinámica para Cash Discount
  if (target.classList.contains("cdp-toggle")) {
    const rateBox = document.getElementById("cdp-rate-box");
    const input = rateBox.querySelector("input");
    input.disabled = !isYes;
    rateBox.style.opacity = isYes ? "1" : "0.4";
  }

  // Lógica para Dispositivos
  if (target.classList.contains("dev-toggle")) {
    const id = target.name.split("_")[1];
    const timeRow = document.getElementById(`tbox_${id}`);
    const input = timeRow.querySelector("input");
    input.disabled = !isYes;
    timeRow.style.opacity = isYes ? "1" : "0.4";
  }

  // Lógica para Delivery
  if (target.classList.contains("platform-toggle")) {
    const row = target.closest(".delivery-row");
    const timeField = row.querySelector(".time-field");
    const input = timeField.querySelector("input");
    input.disabled = !isYes;
    timeField.style.opacity = isYes ? "1" : "0.4";
  }
});
