// Clase base: Pregunta
class Pregunta {
    #texto;
    #opciones;
    #respuestaCorrecta;
    #tipoContenido; // 'texto', 'video', 'cancion'
    #contenido; // URL del video o canción

    constructor(texto, opciones, respuestaCorrecta, tipoContenido, contenido) {
        this.#texto = texto;
        this.#opciones = opciones;
        this.#respuestaCorrecta = respuestaCorrecta;
        this.#tipoContenido = tipoContenido;
        this.#contenido = contenido;
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

    get tipoContenido() {
        return this.#tipoContenido;
    }

    get contenido() {
        return this.#contenido;
    }

    esCorrecta(opcion) {
        return this.#respuestaCorrecta === opcion;
    }

    mostrarOpciones() {
        return this.#opciones;
    }

    mostrarContenido() {
        if (this.#tipoContenido === 'video') {
            return `<iframe width="560" height="315" src="${this.#contenido}" frameborder="0" allowfullscreen></iframe>`;
        } else if (this.#tipoContenido === 'cancion') {
            return `<audio src="${this.#contenido}" controls></audio>`;
        }
        return '';
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

    const nombreUsuario = document.getElementById('NombreUsuario').value.trim();
    const categoriaNueva = document.getElementById('CategoriaNueva').value.trim();
    const preguntaNueva = document.getElementById('PreguntaNueva').value.trim();
    const opcionesNueva = document.getElementById('OpcionesNueva').value.split(',').map(opcion => opcion.trim());
    const respuestaCorrecta = document.getElementById('RespuestaCorrecta').value.trim();
    const tipoContenido = document.getElementById('TipoContenido').value; // 'texto', 'video', 'cancion'
    const contenido = document.getElementById('Contenido').value.trim(); // URL del video o canción

    // Validaciones
    if (!nombreUsuario || !categoriaNueva || !preguntaNueva || opcionesNueva.length === 0 || !respuestaCorrecta) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
    }

    if (!opcionesNueva.includes(respuestaCorrecta)) {
        alert('La respuesta correcta debe estar en la lista de opciones.');
        return;
    }

    try {
        const nuevaPregunta = new Pregunta(preguntaNueva, opcionesNueva, respuestaCorrecta, tipoContenido, contenido);
        admin.agregarPregunta(categoriaNueva, nuevaPregunta);

        console.log(`Categoría agregada: "${categoriaNueva}" con la pregunta: "${preguntaNueva}"`);
        document.getElementById('resultado').textContent = `Pregunta agregada a la categoría "${categoriaNueva}" por ${nombreUsuario}.`;

        // Limpiar el formulario
        document.getElementById('formQuestion').reset();
    } catch (error) {
        console.error('Error al agregar la pregunta:', error);
        alert('Ocurrió un error al agregar la pregunta. Por favor, inténtalo de nuevo.');
    }
});