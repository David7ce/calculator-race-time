document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");

    const form = document.createElement("div");
    form.classList.add("calculator");

    const title = document.createElement("h2");
    title.id = "dynamic-title";
    title.textContent = "";

    // Label carrera
    const carreraLabel = document.createElement("label");
    carreraLabel.textContent = "Selecciona tu carrera:";

    const selectDistancia = document.createElement("select");
    selectDistancia.id = "distance";
    [
        { label: "5K", value: 5 },
        { label: "10K", value: 10 },
        { label: "20K", value: 20 },
        { label: "40K", value: 40 },
        { label: "Maratón (42.195K)", value: 42.195 },
        { label: "50K", value: 50 },
    ].forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.label;
        selectDistancia.appendChild(option);
    });

    const radioContainer = document.createElement("div");
    radioContainer.classList.add("radio-group");

    const opciones = [
        { value: "time", label: "Tiempo total", titulo: "Calcula tu ritmo de carrera", labelTiempo: "Introduce tu tiempo total" },
        { value: "pace", label: "Ritmo por km", titulo: "Calcula tu tiempo total", labelTiempo: "Introduce tu ritmo de carrera" },
    ];

    // Label de tiempo dinámico
    const timeLabel = document.createElement("label");
    timeLabel.id = "time-label";
    timeLabel.textContent = "";

    opciones.forEach(op => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "mode";
        input.value = op.value;

        if (op.value === "time") {
            input.checked = true;
            title.textContent = op.titulo;
            timeLabel.textContent = op.labelTiempo;
        }

        input.addEventListener("change", () => {
            title.textContent = op.titulo;
            timeLabel.textContent = op.labelTiempo;
        });
        label.appendChild(input);
        label.append(" " + op.label);
        radioContainer.appendChild(label);
    });

    const timeInputs = document.createElement("div");
    timeInputs.classList.add("time-inputs");

    const createTimeSelect = (id, max) => {
        const select = document.createElement("select");
        select.id = id;
        for (let i = 0; i <= max; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = i.toString().padStart(2, "0");
            select.appendChild(option);
        }
        return select;
    };

    const hoursSelect = createTimeSelect("hours", 10);
    const minutesSelect = createTimeSelect("minutes", 59);
    const secondsSelect = createTimeSelect("seconds", 59);

    timeInputs.appendChild(hoursSelect);
    timeInputs.appendChild(document.createTextNode(":"));
    timeInputs.appendChild(minutesSelect);
    timeInputs.appendChild(document.createTextNode(":"));
    timeInputs.appendChild(secondsSelect);

    const calcularBtn = document.createElement("button");
    calcularBtn.textContent = "Calcular";
    calcularBtn.onclick = calcular;

    const resultado = document.createElement("div");
    resultado.id = "resultado";

    // Ensamblar el formulario
    form.appendChild(title);
    form.appendChild(carreraLabel);
    form.appendChild(selectDistancia);
    form.appendChild(radioContainer);
    form.appendChild(timeLabel);
    form.appendChild(timeInputs);
    form.appendChild(calcularBtn);
    form.appendChild(resultado);
    app.appendChild(form);
});

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function calcular() {
    const distancia = parseFloat(document.getElementById("distance").value);
    const modo = document.querySelector('input[name="mode"]:checked')?.value;

    const horas = parseInt(document.getElementById("hours").value) || 0;
    const minutos = parseInt(document.getElementById("minutes").value) || 0;
    const segundos = parseInt(document.getElementById("seconds").value) || 0;

    let totalSegundos = horas * 3600 + minutos * 60 + segundos;
    if (!modo || totalSegundos === 0) {
        alert("Selecciona un modo y un tiempo válido.");
        return;
    }

    let ritmoPorKm;
    if (modo === "time") {
        ritmoPorKm = totalSegundos / distancia;
    } else {
        ritmoPorKm = totalSegundos;
        totalSegundos = ritmoPorKm * distancia;
    }

    let tabla = `<table><thead><tr><th>Km</th><th>Tiempo acumulado</th><th>Ritmo por km</th></tr></thead><tbody>`;

    for (let km = 1; km <= Math.floor(distancia); km++) {
        const tiempoAcumulado = ritmoPorKm * km;
        tabla += `<tr class="${km % 5 === 0 ? 'resalted-cell' : ''}">
                <td>${km}</td>
                <td>${formatTime(tiempoAcumulado)}</td>
                <td>${formatTime(ritmoPorKm)}</td>
              </tr>`;
    }

    if (distancia % 1 !== 0) {
        const tiempoAcumulado = ritmoPorKm * distancia;
        tabla += `<tr>
                <td>${distancia.toFixed(3)}</td>
                <td>${formatTime(tiempoAcumulado)}</td>
                <td>${formatTime(ritmoPorKm)}</td>
              </tr>`;
    }

    tabla += `</tbody></table>`;
    document.getElementById("resultado").innerHTML = tabla;
}
