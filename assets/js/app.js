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

// Clase para manejar usuarios
class Usuario {
    constructor(nombre, contrasena) {
        this.nombre = nombre;
        this.contrasena = contrasena;
    }
}

// Almacenamiento de usuarios
const usuarios = [];

// Inicialización del quizz
const quizz = new Quizz();
const preguntasFaciles = [
    new PreguntaMultiple("¿Quién ganó la Copa del Mundo 2018?", ["Francia", "Brasil", "Alemania", "Argentina"], "Francia"),
    new PreguntaVerdaderoFalso("¿Carlos Tévez jugó en Boca Juniors, Corinthians, y Juventus?", "Verdadero"),
    new PreguntaAdivina("Adivina el jugador por su imagen", "assets/images-videos/Messi con la copa.jpeg", "Lionel Messi"),
    new PreguntaAbierta("¿Cuál es el club donde juega Neymar?", "Santos"),
    new PreguntaMultiple("¿Qué país organizó la Copa del Mundo 2014?", ["Brasil", "Alemania", "Sudáfrica", "Francia"], "Brasil")
];

const preguntasIntermedias = [
    new PreguntaMultiple("¿Quién es el máximo goleador de la historia de la Champions League?", ["Cristiano Ronaldo", "Lionel Messi", "Raúl", "Gerd Müller"], "Cristiano Ronaldo"),
    new PreguntaVerdaderoFalso("¿El fútbol se originó en Inglaterra?", "Verdadero"),
    new PreguntaAdivina("Adivina el jugador por su imagen", "assets/images-videos/Riquelme desenfocado.png", "Juan Roman Riquelme"),
    new PreguntaAbierta("¿Qué selección ganó la Copa del Mundo en 1998 y fue anfitriona del torneo ese mismo año?", "Francia"),
    new PreguntaMultiple("¿Qué jugador tiene más Balones de Oro?", ["Cristiano Ronaldo", "Lionel Messi", "Johan Cruyff", "Zinedine Zidane"], "Lionel Messi")
];

const preguntasDificiles = [
    new PreguntaMultiple("¿Quién ganó la Eurocopa 2004?", ["Grecia", "Portugal", "Francia", "Italia"], "Grecia"),
    new PreguntaVerdaderoFalso("Estudiantes de La Plata nunca perdió una final de Copa Libertadores en su historia."
, "Falso"),
    new PreguntaAdivina("Adivina el jugador por su imagen", "assets/images/Zidane.jpeg", "Ruso Rodriguez"),
    new PreguntaAbierta("¿¿Quién fue el primer jugador argentino en ganar el Balón de Oro?", "Omar Sivori"),
    new PreguntaMultiple("¿Qué selección quedo tercera en el mundial 1978?", ["Brasil", "Italia", "Alemania", "Francia"], "Brasil")
];

// Agregar preguntas al quizz
preguntasFaciles.forEach(pregunta => quizz.agregarPregunta(pregunta));
preguntasIntermedias.forEach(pregunta => quizz.agregarPregunta(pregunta));
preguntasDificiles.forEach(pregunta => quizz.agregarPregunta(pregunta));

// Elementos del DOM
const preguntaElement = document.getElementById('pregunta');
const opcionesElement = document.getElementById('opciones');
const siguientePreguntaButton = document.getElementById('siguiente-pregunta');
const resultadoElement = document.getElementById('resultado');
const finalElement = document.getElementById('final');
const registroContainer = document.getElementById('registro-container');
const loginContainer = document.getElementById('login-container');
const temporizadorElement = document.getElementById('tiempo');
let temporizador;

// Función para registrar un nuevo usuario
document.getElementById('registrar').addEventListener('click', () => {
    const nombre = document.getElementById('usuario-registro').value;
    const contrasena = document.getElementById('contrasena-registro').value;
    const nuevoUsuario = new Usuario(nombre, contrasena);
    usuarios.push(nuevoUsuario);
    alert('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
    registroContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

// Función para iniciar sesión
document.getElementById('iniciar-sesion').addEventListener('click', () => {
    const nombre = document.getElementById('usuario-login').value;
    const contrasena = document.getElementById('contrasena-login').value;
    const usuarioEncontrado = usuarios.find(usuario => usuario.nombre === nombre && usuario.contrasena === contrasena);

    if (usuarioEncontrado) {
        alert('Inicio de sesión exitoso. ¡Bienvenido al quiz!');
        loginContainer.style.display = 'none';
        document.getElementById('quizz-container').style.display = 'block';
        mostrarPregunta();
    } else {
        alert('Nombre de usuario o contraseña incorrectos. Intenta de nuevo.');
    }
});

// Función para mostrar la pregunta actual
function mostrarPregunta() {
    if (quizz.hayMasPreguntas ()) {
        const preguntaActual = quizz.obtenerPreguntaActual();
        preguntaElement.textContent = preguntaActual.texto;
        opcionesElement.innerHTML = '';
        resetearTemporizador();

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
    clearInterval(temporizador);
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

// Función para reiniciar el temporizador
function resetearTemporizador() {
    let tiempoRestante = 30;
    temporizadorElement.textContent = tiempoRestante;
    clearInterval(temporizador);
    temporizador = setInterval(() => {
        tiempoRestante--;
        temporizadorElement.textContent = tiempoRestante;
        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            resultadoElement.textContent = `Se acabó el tiempo. La respuesta correcta era: ${quizz.obtenerPreguntaActual().respuestaCorrecta}`;
            resultadoElement.classList.add('incorrecta');
            quizz.preguntaActual++;
            siguientePreguntaButton.style.display = 'block';
        }
    }, 1000);
}

// Evento para pasar a la siguiente pregunta
siguientePreguntaButton.addEventListener('click', () => {
    resultadoElement.textContent = '';
    resultadoElement.classList.remove('correcta', 'incorrecta');
    mostrarPregunta();
    siguientePreguntaButton.style.display = 'none';
});

// Mostrar el formulario de registro al cargar la página
registroContainer.style.display = 'block';