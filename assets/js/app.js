// Clase base: Pregunta
class Pregunta {
    #texto;
    #opciones;
    #respuestaCorrecta;

    constructor(texto, opciones, respuestaCorrecta) {
        this.#texto = texto;
        this.#opciones = opciones;
        this.#respuestaCorrecta = respuestaCorrecta;
    }

    get texto() {
        return this.#texto;
    }

    get opciones() {
        return this.#opciones;
    }

    get respuestaCorrecta() {
        return this.#respuestaCorrecta;
    }

    esCorrecta(opcion) {
        return this.#respuestaCorrecta === opcion;
    }

    mostrarOpciones() {
        return this.#opciones;
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
        return this.respuestaCorrecta.toLowerCase().includes(respuestaUsuario.toLowerCase());
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

// Almacenamiento de puntajes
const puntajes = [];

// Inicialización del quizz
const quizz = new Quizz();
const preguntasFaciles = [
    new PreguntaMultiple("¿Quién ganó la Copa del Mundo 2018?", ["Francia", "Brasil", "Alemania", "Argentina"], "Francia"),
    new PreguntaVerdaderoFalso("¿Carlos Tévez jugó en Boca Juni Juniors, Corinthians, y Juventus?", "Verdadero"),
    new PreguntaAdivina("Adivina el jugador por su imagen", "assets/images-videos/Messi con la copa.jpeg", "Lionel Messi"),
    new PreguntaAbierta("¿Cuál es el club donde juega Neymar?", "Santos"),
    new PreguntaMultiple("¿Qué país organizó la Copa del Mundo 2014?", ["Brasil", "Alemania", "Sudáfrica", "Francia"], "Brasil")
];

const preguntasIntermedias = [
    new PreguntaMultiple("¿Quién es el máximo goleador de la historia de la Champions League?", ["Cristiano Ronaldo", "Lionel Messi", "Raúl", "Gerd Müller"], "Cristiano Ronaldo"),
    new PreguntaVerdaderoFalso("¿El fútbol se originó en Inglaterra?", "Verdadero"),
    new PreguntaAdivina("Adivina el jugador por su imagen", "assets/images-videos/Riquelme desenfocado.png", "Riquelme"),
    new PreguntaAbierta("¿Qué selección ganó la Copa del Mundo en 1998 y fue anfitriona del torneo ese mismo año?", "Francia"),
    new PreguntaMultiple("¿Qué jugador tiene más Balones de Oro?", ["Cristiano Ronaldo", "Lionel Messi", "Johan Cruyff", "Zinedine Zidane"], "Lionel Messi")
];

const preguntasDificiles = [
    new PreguntaMultiple("¿Quién ganó la Eurocopa 2004?", ["Grecia", "Portugal", "Francia", "Italia"], "Grecia"),
    new PreguntaVerdaderoFalso("Estudiantes de La Plata nunca perdió una final de Copa Libertadores en su historia", "Verdadero"),
    new PreguntaAdivina("Adivina el jugador por su imagen", "assets/images-videos/Rodriguez.jpg", "Ruso Rodriguez"),
    new PreguntaAbierta("¿Quién fue el primer jugador argentino en ganar el Balón de Oro?", "Omar Sivori"),
    new PreguntaMultiple("¿Qué selección quedó tercera en el mundial 1978?", ["Brasil", "Italia", "Alemania", "Francia"], "Brasil")
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
const recuperarContainer = document.getElementById('recuperar-contrasena-container');
const quizzContainer = document.getElementById('quizz-container');
const temporizadorElement = document.getElementById('temporizador');
const tablaPuntajesElement = document.getElementById('tabla-puntajes');
const cuerpoTablaPuntajes = document.getElementById('cuerpo-tabla-puntajes');
let temporizador;

// Al cargar la página, ocultar los contenedores de registro y recuperación de contraseña
registroContainer.style.display = 'none';
recuperarContainer.style.display = 'none';
quizzContainer.style.display = 'none'; // Ocultar el contenedor del quiz al inicio
temporizadorElement.style.display = 'none'; // Ocultar el temporizador al inicio
siguientePreguntaButton.style.display = 'none'; // Ocultar el botón de siguiente pregunta al inicio
tablaPuntajesElement.classList.add('hidden'); // Asegurarse de que la tabla de puntajes esté oculta al inicio

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
        quizzContainer.style.display = 'block'; // Mostrar el contenedor del quiz
        mostrarPregunta();
    } else {
        alert('Nombre de usuario o contraseña incorrectos. Intenta de nuevo.');
    }
});

// Evento para ir al formulario de registro
document.getElementById('ir-a-registro').addEventListener('click', () => {
    loginContainer.style.display = 'none';
    registroContainer.style.display = 'block';
});

// Evento para ir al formulario de inicio de sesión
document.getElementById('ir-a-login').addEventListener('click', () => {
    registroContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

// Evento para ir al formulario de recuperación de contraseña
document.getElementById('recuperar-contrasena').addEventListener('click', () => {
    loginContainer.style.display = 'none';
    recuperarContainer.style.display = 'block';
});

// Función para enviar la solicitud de recuperación de contraseña
document.getElementById('enviar-recuperacion').addEventListener('click', () => {
    const nombreUsuario = document.getElementById('usuario-recuperacion').value;
    const usuarioEncontrado = usuarios.find(usuario => usuario.nombre === nombreUsuario);

    if (usuarioEncontrado) {
        alert('Se ha enviado un enlace de recuperación a tu correo electrónico.');
        recuperarContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    } else {
        alert('Usuario no encontrado. Verifica el nombre de usuario.');
    }
});

// Evento para volver al inicio de sesión desde la recuperación de contraseña
document.getElementById('ir-a-login-recuperacion').addEventListener('click', () => {
    recuperarContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

// Función para mostrar la pregunta actual
function mostrarPregunta() {
    if (quizz.hayMasPreguntas()) {
        const preguntaActual = quizz.obtenerPreguntaActual();
        preguntaElement.textContent = preguntaActual.texto;
        opcionesElement.innerHTML = ''; 
        resetearTemporizador();

        // Mostrar el temporizador solo durante las preguntas
        temporizadorElement.style.display = 'block';

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
            preguntaActual.mostrarOpciones().forEach(opcion => {
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

    // Limpiar el resultado anterior
    resultadoElement.textContent = '';
    resultadoElement.classList.remove('correcta', 'incorrecta');

    if (preguntaActual instanceof PreguntaMultiple || preguntaActual instanceof PreguntaVerdaderoFalso) {
        // Marcar la opción correcta
        const opciones = opcionesElement.children;
        for (let i = 0; i < opciones.length; i++) {
            const opcionElement = opciones[i];
            if (opcionElement.textContent === preguntaActual.respuestaCorrecta) {
                opcionElement.classList.add('correcta'); // Marcar la opción correcta
            } else if (opcionElement.textContent === opcion) {
                opcionElement.classList.add('incorrect a'); // Marcar la opción seleccionada como incorrecta
            }
        }
        resultadoElement.textContent = esCorrecta ? "¡Respuesta correcta!" : `Respuesta incorrecta. La respuesta correcta era: ${preguntaActual.respuestaCorrecta}`;
        resultadoElement.classList.add(esCorrecta ? 'correcta' : 'incorrecta');
    } else {
        // Para preguntas de tipo Adivina y Abierta
        resultadoElement.textContent = esCorrecta ? "¡Respuesta correcta!" : `Respuesta incorrecta. La respuesta correcta era: ${preguntaActual.respuestaCorrecta}`;
        resultadoElement.classList.add(esCorrecta ? 'correcta' : 'incorrecta');
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

    // Guardar el puntaje del usuario
    const nombreUsuario = document.getElementById('usuario-login').value;
    const puntajeUsuario = {
        nombre: nombreUsuario,
        puntaje: quizz.puntaje
    };
    puntajes.push(puntajeUsuario);
    mostrarTablaPuntajes();

    // Ocultar el temporizador
    temporizadorElement.style.display = 'none';
}

// Función para mostrar la tabla de puntajes
function mostrarTablaPuntajes() {
    cuerpoTablaPuntajes.innerHTML = ''; // Limpiar la tabla antes de mostrar los nuevos puntajes
    const puntajesOrdenados = puntajes.sort((a, b) => b.puntaje - a.puntaje).slice(0, 3); // Obtener los tres primeros puntajes

    puntajesOrdenados.forEach((usuario, index) => {
        const fila = document.createElement('tr');
        const medalla = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        fila.innerHTML = `<td>${usuario.nombre}</td><td>${usuario.puntaje}</td><td>${medalla}</td>`;
        cuerpoTablaPuntajes.appendChild(fila);
    });

    tablaPuntajesElement.classList.remove('hidden'); // Mostrar la tabla de puntajes
}

// Función para reiniciar el juego
document.getElementById('reiniciar-juego').addEventListener('click', () => {
    quizz.reiniciar();
    finalElement.style.display = 'none'; // Ocultar el resultado final
    tablaPuntajesElement.classList.add('hidden'); // Ocultar la tabla de puntajes al reiniciar
    quizzContainer.style.display = 'block'; // Mostrar el contenedor del quiz
    mostrarPregunta(); // Mostrar la primera pregunta
});

// Función para resetear el temporizador
function resetearTemporizador() {
    clearInterval(temporizador);
    let tiempoRestante = 30; // Tiempo en segundos
    temporizadorElement.textContent = `Tiempo restante: ${tiempoRestante} segundos`;
    temporizadorElement.style.display = 'block';

    temporizador = setInterval(() => {
        tiempoRestante--;
        temporizadorElement.textContent = `Tiempo restante: ${tiempoRestante} segundos`;
        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            seleccionarOpcion(''); // Llama a seleccionarOpcion con un valor vacío para indicar que se acabó el tiempo
        }
    }, 1000);
}

// Evento para pasar a la siguiente pregunta
siguientePreguntaButton.addEventListener('click', () => {
    resultadoElement.textContent = '';
    resultadoElement.classList.remove('correcta', 'incorrecta');
    mostrarPregunta();
    siguientePreguntaButton.style.display = 'none'; // Ocultar el botón de siguiente pregunta
});

// Mostrar el formulario de inicio de sesión al cargar la página
loginContainer.style.display = 'block';