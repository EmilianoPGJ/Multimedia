// script.js - Asistente de Voz con TTS y Reconocimiento de Voz

// Elementos del DOM
const inputArea = document.getElementById('input-area');
const outputArea = document.getElementById('output-area');
const statusElement = document.getElementById('voice-status');

// Elementos TTS
const synth = window.speechSynthesis;
const voiceSelect = document.getElementById('voice-select');
const rateInput = document.getElementById('rate');
const pitchInput = document.getElementById('pitch');
let voices = [];

// Variable para almacenar la voz femenina seleccionada
let vozFemeninaMX = null;

/**
 * Carga las voces disponibles en el sistema
 */
function loadVoices() {
      voices = synth.getVoices();
      voiceSelect.innerHTML = '';
      voices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(1);
      });
    }

// Evento para cuando cambian las voces
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}
loadVoices();

// Actualizar etiquetas de sliders
rateInput.addEventListener('input', () => {
  document.getElementById('rate-val').textContent = rateInput.value;
});

pitchInput.addEventListener('input', () => {
  document.getElementById('pitch-val').textContent = pitchInput.value;
});

/**
 * Función principal para reproducir texto con TTS
 */
function speak() {
  const text = inputArea.value.trim();

  if (!text) {
    outputArea.innerHTML = '⚠️ Escribe algo o usa el botón Escuchar primero.';
    return;
  }

  // Detener cualquier lectura previa
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  
  if (voiceSelect.selectedIndex >= 0) {
    utterance.voice = voices[voiceSelect.value];
  } else if (vozFemeninaMX) {
    utterance.voice = vozFemeninaMX;
  }
  
  utterance.rate = parseFloat(rateInput.value);
  utterance.pitch = parseFloat(pitchInput.value);
  utterance.lang = 'es-MX';

  // Eventos del TTS
  utterance.onstart = () => {
    outputArea.innerHTML = '🔊 Reproduciendo...';
    statusElement.innerHTML = '🔊 Hablando...';
  };
  
  utterance.onend = () => {
    outputArea.innerHTML = '✅ Reproducción completada.';
    statusElement.innerHTML = '⏸️ Presiona un botón';
  };
  
  utterance.onerror = (e) => {
    outputArea.innerHTML = `❌ Error: ${e.error}`;
    statusElement.innerHTML = '❌ Error';
  };

  synth.speak(utterance);
}
/**
 * Obtiene la hora actual en formato mexicano
 */
function obtenerHoraMX() {
  const ahora = new Date();
  
  const opciones = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  let hora = ahora.toLocaleTimeString('es-MX', opciones);
  hora = hora.replace('a.m.', 'de la mañana')
            .replace('p.m.', 'de la tarde');
  
  let horas = ahora.getHours();
  let minutos = ahora.getMinutes();
  let ampm = horas >= 12 ? 'de la tarde' : 'de la mañana';
  
  horas = horas % 12;
  horas = horas ? horas : 12;
  
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
 * Función para escuchar comandos de voz
 */
function listen() {
  // Verificar soporte del navegador
  if (!('webkitSpeechRecognition' in window)) {
    alert('Tu navegador no soporta reconocimiento de voz. Prueba con Google Chrome.');
    return;
  }
  
  const recognition = new webkitSpeechRecognition();
  
  // Configurar para español de México
  recognition.lang = "es-MX";
  recognition.continuous = false;
  recognition.interimResults = false;
  
  // Actualizar UI
  statusElement.innerHTML = "🎤 Escuchando... habla ahora";
  outputArea.innerHTML = "Escuchando...";
  
  recognition.start();
  
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    const transcriptLower = transcript.toLowerCase().trim();
    
    // Mostrar lo que se escuchó en el área de texto
    inputArea.value = transcript;
    outputArea.innerHTML = `"${transcript}"`;
    statusElement.innerHTML = "✅ Procesando...";
    
    console.log("Comando detectado:", transcriptLower);
    
    // Procesar comandos
    if (transcriptLower.includes("hora") || 
        transcriptLower.includes("horas") || 
        transcriptLower.includes("qué hora es") ||
        transcriptLower.includes("que hora es") ||
        transcriptLower.includes("dime la hora")) {
      
      const hora = obtenerHoraMX();
      outputArea.innerHTML = `Son ${hora.pantalla}`;
      
      // Preparar el texto para TTS y reproducir automáticamente
      inputArea.value = `Son ${hora.voz}`;
      setTimeout(() => speak(), 500); // Pequeño delay para asegurar que el input se actualice
      
    } else if (transcriptLower.includes("hola") || 
              transcriptLower.includes("buenos")) {
      
      outputArea.innerHTML = "¡Hola! ¿Cómo estás?";
      inputArea.value = "¡Hola! ¿Cómo estás?";
      setTimeout(() => speak(), 500);
      
    } else if (transcriptLower.includes("adiós") || 
              transcriptLower.includes("adios") ||
              transcriptLower.includes("hasta luego")) {
      
      outputArea.innerHTML = "¡Hasta luego!";
      inputArea.value = "¡Hasta luego! Que tengas un buen día.";
      setTimeout(() => speak(), 500);
      
    } else if (transcriptLower.includes("clima")) {
      
      outputArea.innerHTML = "Abriendo clima";
      inputArea.value = "Abriendo información del clima";
      setTimeout(() => speak(), 500);
      window.open("https://www.google.com/search?q=clima");
      
    } else if (transcriptLower.includes("profesor")) {
      
      outputArea.innerHTML = "¿Qué desea jefe?";
      inputArea.value = "¿Qué desea jefe?";
      setTimeout(() => speak(), 500);
      
    } else if (transcriptLower.includes("canción")) {
      
      outputArea.innerHTML = "Abriendo Canción";
      inputArea.value = "Abriendo video de YouTube";
      setTimeout(() => speak(), 500);
      window.open("https://www.youtube.com/watch?v=oxxKm_O1xwo");
      
    } else {
      outputArea.innerHTML = "No entendí. Puedes editar el texto y presionar Reproducir.";
      statusElement.innerHTML = "Edita el texto o vuelve a intentar";
    }
  }
  
  recognition.onerror = function(event) {
    let mensajeError = "Error al reconocer voz";
    switch(event.error) {
      case 'no-speech':
        mensajeError = "No se detectó voz. Intenta de nuevo.";
        break;
      case 'not-allowed':
        mensajeError = "Permite el acceso al micrófono.";
        break;
    }
    
    statusElement.innerHTML = "❌ " + mensajeError;
    outputArea.innerHTML = mensajeError;
  }
  
  recognition.onend = function() {
    if (statusElement.innerHTML.includes("Escuchando")) {
      statusElement.innerHTML = "⏸️ Presiona un botón";
    }
  }
}

// Inicialización
window.onload = function() {
  console.log('✅ Asistente de voz cargado');
  statusElement.innerHTML = "⏸️ Presiona un botón";
};