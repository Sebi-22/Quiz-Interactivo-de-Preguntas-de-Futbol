 // Clase base: Pregunta
 class Pregunta {
    constructor(texto, opciones, respuestaCorrecta) {
        this.texto = texto;
        this.opciones = opciones;
        this.respuestaCorrecta = respuestaCorrecta;
    }

    esCorrecta(opcion) {
        return this.respuestaCorrecta === opcion;
    }
}

// Subclase: PreguntaMultiple
class PreguntaMultiple extends Pregunta {
    constructor(texto, opciones, respuestaCorrecta) {
        super(texto, opciones, respuestaCorrecta);
    }
}

// Subclase: PreguntaVerdaderoFalso
class PreguntaVerdaderoFalso extends Pregunta {
    constructor(texto, respuestaCorrecta) {
        super(texto, ["Verdadero", "Falso"], respuestaCorrecta);
    }
}

// Subclase: PreguntaAdivina
class PreguntaAdivina extends Pregunta {
    constructor(texto, url, respuestaCorrecta) {
        super(texto, [], respuestaCorrecta);
        this.url = url;
    }

    mostrarContenido() {
        // Crear un elemento de imagen
        const imagenElement = document.createElement('img');
        imagenElement.src = this.url;
        imagenElement.alt = "Imagen del jugador";
        return imagenElement;
    }
}

// Subclase: PreguntaAbierta
class PreguntaAbierta extends Pregunta {
    constructor(texto, respuestaCorrecta) {
        super(texto, [], respuestaCorrecta);
    }

    esCorrecta(respuestaUsuario) {
        return this.respuestaCorrecta.toLowerCase() === respuestaUsuario.toLowerCase();
    }
}

// Clase: Quizz
class Quizz {
    constructor() {
        this.preguntas = [];
        this.puntaje = 0;
        this.preguntaActual = 0;
    }

    agregarPregunta(pregunta) {
        this.preguntas.push(pregunta);
    }

    obtenerPreguntaActual() {
        return this.preguntas[this.preguntaActual];
    }

    verificarRespuesta(opcion) {
        const pregunta = this.obtenerPreguntaActual();
        if (pregunta.esCorrecta(opcion)) {
            this.puntaje++;
            return true;
        } else {
            return false;
        }
    }

    hayMasPreguntas() {
        return this.preguntaActual < this.preguntas.length;
    }

    reiniciar() {
        this.puntaje = 0;
        this.preguntaActual = 0;
    }
}

// Inicialización del quizz
const quizz = new Quizz();
quizz.agregarPregunta(new PreguntaMultiple("¿Quién ganó la Copa del Mundo 2018?", ["Francia", "Brasil", "Alemania", "Argentina"], "Francia"));
quizz.agregarPregunta(new PreguntaVerdaderoFalso("¿Lionel Messi ha ganado un Mundial?", "Verdadero"));
quizz.agregarPregunta(new PreguntaAdivina("Adivina el jugador por su imagen", "assets/images/Messi con la copa.jpeg", "Lionel Messi"));
quizz.agregarPregunta(new PreguntaAbierta("¿Cuál es el club donde juega Neymar?", "Santos"));

const preguntaElement = document.getElementById('pregunta');
const opcionesElement = document.getElementById('opciones');
const siguientePreguntaButton = document.getElementById('siguiente-pregunta');
const resultadoElement = document.getElementById('resultado');
const finalElement = document.getElementById('final');

function mostrarPregunta() {
    if (quizz.hayMasPreguntas()) {
        const preguntaActual = quizz.obtenerPreguntaActual();
        preguntaElement.textContent = preguntaActual.texto;
        opcionesElement.innerHTML = '';

        if (preguntaActual instanceof PreguntaAdivina) {
            const imagenElement = preguntaActual.mostrarContenido();
            opcionesElement.appendChild(imagenElement);

            // Crear un campo de entrada para la respuesta
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.placeholder = 'Escribe tu respuesta aquí';
            opcionesElement.appendChild(inputElement);

            // Crear un botón para enviar la respuesta
            const enviarButton = document.createElement('button');
            enviarButton.textContent = 'Enviar';
            enviarButton.addEventListener('click', () => {
                seleccionarOpcion(inputElement.value);
            });
            opcionesElement.appendChild(enviarButton);
        } else if (preguntaActual instanceof PreguntaAbierta) {
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.placeholder = 'Escribe tu respuesta aquí';
            opcionesElement.appendChild(inputElement);
            const enviarButton = document.createElement('button');
            enviarButton.textContent = 'Enviar';
            enviarButton.addEventListener('click', () => {
                seleccionarOpcion(inputElement.value);
            });
            opcionesElement.appendChild(enviarButton);
        } else {
            preguntaActual.opciones.forEach(opcion => {
                const opcionElement = document.createElement('div');
                opcionElement.classList.add('opcion');
                opcionElement.textContent = opcion;
                opcionElement.addEventListener('click', () => seleccionarOpcion(opcion));
                opcionesElement.appendChild(opcionElement);
            });
        }
    } else {
        mostrarResultadoFinal();
    }
}

function seleccionarOpcion(opcion) {
    const preguntaActual = quizz.obtenerPreguntaActual();
    const esCorrecta = quizz.verificarRespuesta(opcion);
    if (esCorrecta) {
        resultadoElement.textContent = "¡Respuesta correcta!";
    } else {
        resultadoElement.textContent = "Respuesta incorrecta. La respuesta correcta era: " + preguntaActual.respuestaCorrecta;
    }
    quizz.preguntaActual++;
    siguientePreguntaButton.style.display = 'block';
}

siguientePreguntaButton.addEventListener('click', () => {
    resultadoElement.textContent = '';
    mostrarPregunta();
    siguientePreguntaButton.style.display = 'none';
});

mostrarPregunta();