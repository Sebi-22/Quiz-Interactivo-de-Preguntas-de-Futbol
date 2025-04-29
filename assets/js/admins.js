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

// Clase Admin
class Admin {
    constructor() {
        this.categorias = {};
    }

    agregarPregunta(categoria, pregunta) {
        if (!this.categorias[categoria]) {
            this.categorias[categoria] = [];
        }
        this.categorias[categoria].push(pregunta);
    }

    obtenerPreguntas(categoria) {
        return this.categorias[categoria] || [];
    }
}

// Instancia de Admin
const admin = new Admin();

// Manejo del formulario
document.getElementById('formQuestion').addEventListener('submit', (event) => {
    event.preventDefault();

    const nombreUsuario = document.getElementById('NombreUsuario').value;
    const categoriaNueva = document.getElementById('CategoriaNueva').value;
    const preguntaNueva = document.getElementById('PreguntaNueva').value;
    const opcionesNueva = document.getElementById('OpcionesNueva').value.split(',').map(opcion => opcion.trim());
    const respuestaCorrecta = document.getElementById('RespuestaCorrecta').value;

    const nuevaPregunta = new Pregunta(preguntaNueva, opcionesNueva, respuestaCorrecta);
    admin.agregarPregunta(categoriaNueva, nuevaPregunta);

    document.getElementById('resultado').textContent = `Pregunta agregada a la categoría "${categoriaNueva}" por ${nombreUsuario}.`;

    // Limpiar el formulario
    document.getElementById('formQuestion').reset();
});