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
        }
        return false;
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

// Elementos del DOM
const preguntaElement = document.getElementById('pregunta');
const opcionesElement = document.getElementById('opciones');
const siguientePreguntaButton = document.getElementById('siguiente-pregunta');
const resultadoElement = document.getElementById('resultado');
const finalElement = document.getElementById('final');

// Función para mostrar la pregunta actual
function mostrarPregunta() {
    if (quizz.hayMasPreguntas()) {
        const preguntaActual = quizz.obtenerPreguntaActual();
        preguntaElement.textContent = preguntaActual.texto;
        opcionesElement.innerHTML = '';

        if (preguntaActual instanceof PreguntaAdivina) {
            const imagenElement = preguntaActual.mostrarContenido();
            opcionesElement.appendChild(imagenElement);

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

// Función para manejar la selección de una opción
function seleccionarOpcion(opcion) {
    const preguntaActual = quizz.obtenerPreguntaActual();
    const esCorrecta = quizz.verificarRespuesta(opcion);

    if (esCorrecta) {
        resultadoElement.textContent = "¡Respuesta correcta!";
        resultadoElement.classList.add('correcta');
    } else {
        resultadoElement.textContent = `Respuesta incorrecta. La respuesta correcta era: ${preguntaActual.respuestaCorrecta}`;
        resultadoElement.classList.add('incorrecta');
    }

    quizz.preguntaActual++;
    siguientePreguntaButton.style.display = 'block';
}

// Función para mostrar el resultado final
function mostrarResultadoFinal() {
    preguntaElement.textContent = '';
    opcionesElement.innerHTML = '';
    resultadoElement.textContent = '';
    finalElement.style.display = 'block';
    finalElement.textContent = `¡Juego terminado! Tu puntaje final es: ${quizz.puntaje}/${quizz.preguntas.length}`;
}

// Evento para pasar a la siguiente pregunta
siguientePreguntaButton.addEventListener('click', () => {
    resultadoElement.textContent = '';
    resultadoElement.classList.remove('correcta', 'incorrecta');
    mostrarPregunta();
    siguientePreguntaButton.style.display = 'none';
});

// Mostrar la primera pregunta al cargar la página
mostrarPregunta();