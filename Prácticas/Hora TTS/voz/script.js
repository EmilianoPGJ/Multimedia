// script.js - Asistente de Voz para Español Mexicano

// Elementos del DOM
const inputArea = document.getElementById('input-area');
const outputArea = document.getElementById('output-area');
const statusElement = document.getElementById('status');

/**
 * Obtiene la hora actual en formato mexicano
 * @returns {Object} Objeto con formatos para pantalla y voz
 */
function obtenerHoraMX() {
    const ahora = new Date();
    
    // Opciones para formato de hora en español mexicano
    const opciones = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    
    // Obtener la hora formateada
    let hora = ahora.toLocaleTimeString('es-MX', opciones);
    
    // Reemplazar a.m./p.m. con formato más natural para México
    hora = hora.replace('a.m.', 'de la mañana')
              .replace('p.m.', 'de la tarde');
    
    // Obtener la hora en formato de 12 horas para la voz
    let horas = ahora.getHours();
    let minutos = ahora.getMinutes();
    let ampm = horas >= 12 ? 'de la tarde' : 'de la mañana';
    
    // Convertir a formato 12 horas
    horas = horas % 12;
    horas = horas ? horas : 12; // La hora 0 debe ser 12
    
    // Formato para el TTS (más natural)
    let horaVoz;
    if (minutos === 0) {
        horaVoz = `Son las ${horas} en punto ${ampm}`;
    } else if (minutos === 30) {
        horaVoz = `Son las ${horas} y media ${ampm}`;
    } else {
        horaVoz = `Son las ${horas} con ${minutos} minutos ${ampm}`;
    }
    
    return {
        pantalla: hora,
        voz: horaVoz
    };
}

/**
 * Convierte texto a voz en español mexicano
 * @param {string} texto - Texto a hablar
 */
function hablar(texto) {
    // Detener cualquier síntesis en curso
    window.speechSynthesis.cancel();
    
    // Crear un nuevo objeto de síntesis de voz
    const utterance = new SpeechSynthesisUtterance(texto);
    
    // Configurar para español de México
    utterance.lang = 'es-MX';
    utterance.rate = 0.9; // Velocidad un poco más lenta
    utterance.pitch = 1; // Tono normal
    utterance.volume = 1; // Volumen máximo
    
    // Obtener voces disponibles
    const voces = window.speechSynthesis.getVoices();
    
    // Buscar una voz en español mexicano
    const vozMX = voces.find(voz => 
        voz.lang.includes('es-MX') || 
        voz.lang.includes('es_MX') ||
        (voz.lang.includes('es') && voz.lang.includes('MX'))
    );
    
    // Si no encuentra español MX, busca cualquier español
    const vozES = voces.find(voz => 
        voz.lang.includes('es-') || voz.lang.includes('es_')
    );
    
    if (vozMX) {
        utterance.voice = vozMX;
        console.log('Usando voz MX:', vozMX.name);
    } else if (vozES) {
        utterance.voice = vozES;
        console.log('Usando voz ES:', vozES.name);
    }
    
    // Hablar el texto
    window.speechSynthesis.speak(utterance);
}

/**
 * Función principal para escuchar y procesar comandos de voz
 */
function listen() {
    // Verificar si el navegador soporta reconocimiento de voz
    if (!('webkitSpeechRecognition' in window)) {
        alert('Tu navegador no soporta reconocimiento de voz. Prueba con Google Chrome.');
        return;
    }
    
    const recognition = new webkitSpeechRecognition();
    
    // Configurar para español de México
    recognition.lang = "es-MX";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    // Actualizar UI
    statusElement.innerHTML = "Escuchando...";
    inputArea.innerHTML = "Escuchando...";
    outputArea.innerHTML = "...";
    
    recognition.start();
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const transcriptLower = transcript.toLowerCase().trim();
        
        inputArea.innerHTML = `"${transcript}"`;
        statusElement.innerHTML = "Comando recibido";
        
        console.log("Comando detectado:", transcriptLower);
        
        // Detectar solicitud de hora (español MX)
        if (transcriptLower.includes("hora") || 
            transcriptLower.includes("horas") || 
            transcriptLower.includes("qué hora es") ||
            transcriptLower.includes("que hora es") ||
            transcriptLower.includes("dime la hora")) {
            
            const hora = obtenerHoraMX();
            outputArea.innerHTML = `Son ${hora.pantalla}`;
            
            // Usar TTS para decir la hora
            hablar(`Son ${hora.voz}`);
            
        } else if (transcriptLower.includes("hola") || 
                  transcriptLower.includes("buenos") || 
                  transcriptLower.includes("buenas")) {
            
            outputArea.innerHTML = "¡Hola! ¿Cómo estás?";
            hablar("¡Hola! ¿Cómo estás?");
            
        } else if (transcriptLower.includes("adiós") || 
                  transcriptLower.includes("adios") ||
                  transcriptLower.includes("hasta luego") || 
                  transcriptLower.includes("nos vemos")) {
            
            outputArea.innerHTML = "¡Hasta luego! Que tengas un buen día.";
            hablar("¡Hasta luego! Que tengas un buen día.");
            
        } else if (transcriptLower.includes("clima") || 
                  transcriptLower.includes("tiempo")) {
            
            outputArea.innerHTML = "Abriendo información del clima...";
            hablar("Abriendo información del clima");
            window.open("https://www.google.com/search?q=clima");
            
        } else if (transcriptLower.includes("profesor") || 
                  transcriptLower.includes("teacher")) {
            
            outputArea.innerHTML = "¿Qué desea jefe?";
            hablar("¿Qué desea jefe?");
            
        } else if (transcriptLower.includes("canción")) {
            
            outputArea.innerHTML = "Abriendo canción...";
            hablar("Abriendo video de YouTube");
            window.open("https://www.youtube.com/watch?v=JYuyWrkwpok&list=RDJYuyWrkwpok&start_radio=1");
            
        } else {
            outputArea.innerHTML = "No entendí lo que dijiste. Intenta de nuevo.";
            hablar("No entendí lo que dijiste. Intenta de nuevo.");
        }
    }
    
    recognition.onerror = function(event) {
        console.error('Error:', event.error);
        statusElement.innerHTML = "Error: " + obtenerMensajeError(event.error);
        inputArea.innerHTML = "Error al reconocer voz";
        
        if (event.error === 'not-allowed') {
            outputArea.innerHTML = "Por favor permite el acceso al micrófono.";
        } else if (event.error === 'language-not-supported') {
            outputArea.innerHTML = "El idioma seleccionado no es compatible. Usando español por defecto.";
        }
    }
    
    recognition.onend = function() {
        statusElement.innerHTML = "Presiona el botón para hablar";
    }
}

/**
 * Traduce códigos de error a mensajes en español
 * @param {string} errorCode - Código de error del reconocimiento
 * @returns {string} Mensaje de error en español
 */
function obtenerMensajeError(errorCode) {
    const mensajes = {
        'no-speech': 'No se detectó voz',
        'aborted': 'Se canceló la operación',
        'audio-capture': 'No se encontró micrófono',
        'network': 'Error de red',
        'not-allowed': 'Acceso al micrófono denegado',
        'service-not-allowed': 'Servicio no permitido',
        'bad-grammar': 'Error de gramática',
        'language-not-supported': 'Idioma no soportado'
    };
    
    return mensajes[errorCode] || errorCode;
}

// Precargar voces disponibles cuando el navegador las tenga listas
window.speechSynthesis.onvoiceschanged = function() {
    const voces = window.speechSynthesis.getVoices();
    console.log("Voces disponibles:", voces.map(v => `${v.name} (${v.lang})`));
    
    // Mostrar si hay voz mexicana disponible
    const vozMX = voces.find(v => v.lang.includes('es-MX'));
    if (vozMX) {
        console.log('Voz mexicana encontrada:', vozMX.name);
    } else {
        console.log('No se encontró voz mexicana específica, se usará español genérico');
    }
};

// Mensaje inicial cuando carga la página
window.onload = function() {
    console.log('Asistente de voz cargado - Español México');
    statusElement.innerHTML = "Presiona el botón para hablar";
};