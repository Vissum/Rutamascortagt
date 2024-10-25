$(document).ready(function() {
    // Efecto de máquina de escribir
    $(".typewriter-title").each(function() {
        var $this = $(this);
        var text = $this.text();
        $this.empty();
        var index = 0;

        function type() {
            if (index < text.length) {
                $this.append(text.charAt(index));
                index++;
                setTimeout(type, 100);
            }
        }

        setTimeout(type, 1000); 
    });
});

// Definición del grafo
const graph = {
    "Guatemala": {"Sacatepéquez": 30, "Escuintla": 60, "El Progreso": 75, "Chimaltenango": 54, "Santa Rosa": 95},
    "Sacatepéquez": {"Guatemala": 30, "Chimaltenango": 20, "Escuintla": 50},
    "Escuintla": {"Guatemala": 60, "Sacatepéquez": 50, "Suchitepéquez": 80, "Santa Rosa": 70},
    "Chimaltenango": {"Guatemala": 54, "Sacatepéquez": 20, "Sololá": 82, "Baja Verapaz": 65},
    "Sololá": {"Chimaltenango": 82, "Quetzaltenango": 47, "Totonicapán": 35},
    "Quetzaltenango": {"Sololá": 47, "Retalhuleu": 60, "San Marcos": 57, "Totonicapán": 25},
    "Totonicapán": {"Quetzaltenango": 25, "Huehuetenango": 85, "Quiché": 45, "Sololá": 35},
    "Huehuetenango": {"Totonicapán": 85, "Quiché": 100, "San Marcos": 60},
    "Quiché": {"Totonicapán": 45, "Huehuetenango": 100, "Alta Verapaz": 110, "Baja Verapaz": 95},
    "Alta Verapaz": {"Quiché": 110, "Baja Verapaz": 60, "Petén": 280},
    "Baja Verapaz": {"Alta Verapaz": 60, "El Progreso": 40, "Chimaltenango": 65},
    "El Progreso": {"Guatemala": 75, "Baja Verapaz": 40, "Zacapa": 85, "Jalapa": 90},
    "Zacapa": {"El Progreso": 85, "Chiquimula": 30, "Izabal": 90},
    "Chiquimula": {"Zacapa": 30, "Jalapa": 75, "Jutiapa": 70},
    "Izabal": {"Zacapa": 90, "Petén": 210},
    "Petén": {"Alta Verapaz": 280, "Izabal": 210},
    "Jalapa": {"Chiquimula": 75, "El Progreso": 90, "Santa Rosa": 50, "Jutiapa": 60},
    "Jutiapa": {"Chiquimula": 70, "Jalapa": 60, "Santa Rosa": 80},
    "Santa Rosa": {"Jalapa": 50, "Jutiapa": 80, "Escuintla": 70, "Guatemala": 95},
    "Retalhuleu": {"Quetzaltenango": 60, "Suchitepéquez": 30},
    "Suchitepéquez": {"Retalhuleu": 30, "Escuintla": 80},
    "San Marcos": {"Quetzaltenango": 57, "Huehuetenango": 60},
};

// Coordenadas de los departamentos en el mapa
const departmentCoordinates = {
    "Guatemala": [270, 450],
    "Sacatepéquez": [235, 460],
    "Escuintla": [200, 510],
    "Chimaltenango": [205, 445],
    "Sololá": [165, 435],
    "Quetzaltenango": [120, 420],
    "Totonicapán": [155, 395],
    "Huehuetenango": [130, 310],
    "Quiché": [210, 340],
    "Alta Verapaz": [315, 320],
    "Baja Verapaz": [280, 390],
    "El Progreso": [320, 410],
    "Zacapa": [390, 395],
    "Chiquimula": [405, 440],
    "Izabal": [450, 330],
    "Petén": [340, 150],
    "Jalapa": [340, 445],
    "Jutiapa": [350, 500],
    "Santa Rosa": [285, 505],
    "Retalhuleu": [100, 480],
    "Suchitepéquez": [145, 470],
    "San Marcos": [80, 400],
};

// Clase PriorityQueue para el algoritmo de Dijkstra
class PriorityQueue {
    constructor() {
        this.collection = [];
    }

    enqueue(element) {
        if (this.isEmpty()) {
            this.collection.push(element);
        } else {
            let added = false;
            for (let i = 0; i < this.collection.length; i++) {
                if (element[1] < this.collection[i][1]) {
                    this.collection.splice(i, 0, element);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.collection.push(element);
            }
        }
    }

    dequeue() {
        return this.collection.shift();
    }

    isEmpty() {
        return this.collection.length === 0;
    }
}

// Función Dijkstra
function dijkstra(graph, start, end) {
    const distances = {};
    const prev = {};
    const pq = new PriorityQueue();

    for (let node in graph) {
        distances[node] = Infinity;
        prev[node] = null;
    }
    distances[start] = 0;
    pq.enqueue([start, 0]);

    while (!pq.isEmpty()) {
        const [currentNode, currentDist] = pq.dequeue();

        if (currentNode === end) break;

        for (let neighbor in graph[currentNode]) {
            const newDist = currentDist + graph[currentNode][neighbor];
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                prev[neighbor] = currentNode;
                pq.enqueue([neighbor, newDist]);
            }
        }
    }

    const path = [];
    let temp = end;
    while (temp) {
        path.unshift(temp);
        temp = prev[temp];
    }

    return { path, distance: distances[end] };
}

// Función para dibujar el grafo
function drawGraph(context) {
    // Limpiar el canvas antes de dibujar
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    // Dibujar las aristas (conexiones)
    context.strokeStyle = "#aaa"; // Color de las aristas
    context.lineWidth = 1;        // Grosor de las aristas
    for (let department in graph) {
        const [x1, y1] = departmentCoordinates[department];
        for (let neighbor in graph[department]) {
            const [x2, y2] = departmentCoordinates[neighbor];
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
        }
    }

    // Dibujar los nodos (departamentos)
    for (let department in departmentCoordinates) {
        const [x, y] = departmentCoordinates[department];
        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI);
        context.fillStyle = "#007bff"; // Color de los nodos
        context.fill();

        context.strokeStyle = "#000";  // Color del borde de los nodos
        context.lineWidth = 1;         // Grosor del borde de los nodos
        context.stroke();
    }
}

// Función para resaltar la ruta encontrada
function highlightPath(context, path) {
    context.save();               // Guarda el estado actual del contexto
    context.strokeStyle = "#ff0000";
    context.lineWidth = 3;
    for (let i = 0; i < path.length - 1; i++) {
        const [x1, y1] = departmentCoordinates[path[i]];
        const [x2, y2] = departmentCoordinates[path[i + 1]];
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    }
    context.restore();            // Restaura el estado del contexto
}

// Dibujar el grafo completo cuando la página se carga
$(window).on('load', function() {
    const canvas = document.getElementById("graphCanvas");
    const mapa = document.getElementById("mapa");
    const context = canvas.getContext("2d");

    // Esperar a que la imagen se cargue completamente
    $(mapa).on('load', function() {
        // Asegurar que el canvas tenga las mismas dimensiones que la imagen del mapa
        canvas.width = mapa.clientWidth;
        canvas.height = mapa.clientHeight;

        drawGraph(context);
    });

    // Si la imagen ya está cargada (por caché), iniciar el dibujo de inmediato
    if (mapa.complete) {
        $(mapa).trigger('load');
    }
});

// Resaltar una nueva ruta y eliminar la anterior redibujando el grafo
$("#findRoute").on("click", function() {
    const start = $("#start").val();
    const end = $("#end").val();

    const { path, distance } = dijkstra(graph, start, end);

    $("#route").text(`Ruta: ${path.join(" → ")}`);
    $("#distance").text(`Distancia total: ${distance} km`);

    const canvas = document.getElementById("graphCanvas");
    const context = canvas.getContext("2d");

    // Redibujar el grafo completo
    drawGraph(context);

    // Resaltar la nueva ruta
    highlightPath(context, path);
});
