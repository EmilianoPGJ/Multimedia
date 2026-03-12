const inputArea = document.getElementById('input-area');
const outputArea = document.getElementById('output-area');
const statusElement = document.getElementById('voice-status');

const synth = window.speechSynthesis;
const voiceSelect = document.getElementById('voice-select');
const rateInput = document.getElementById('rate');
const pitchInput = document.getElementById('pitch');

let voices = [];
let vozActiva;
function loadVoices(){
  voices = synth.getVoices();
  let vozMX = voices.find(v => v.lang === "es-MX");
  if(!vozMX){
    vozMX = voices.find(v => v.lang.startsWith("es"));
  }
  if(!vozMX){
    vozMX = voices[0];
  }
  vozActiva = vozMX;
  voiceSelect.innerHTML = vozActiva.name + " ("+vozActiva.lang+")";
}

speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// HABLAR 
function speak(){

  const text = inputArea.value.trim();

  if(!text){
    outputArea.innerHTML = "⚠️ Escribe algo primero";
    return;
  }

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.voice = vozActiva;

  utterance.rate = parseFloat(rateInput.value);
  utterance.pitch = parseFloat(pitchInput.value);
  utterance.lang = "es-MX";

  utterance.onstart = ()=> statusElement.innerHTML = "🔊 Hablando...";
  utterance.onend = ()=> statusElement.innerHTML = "⏸️ Listo";

  synth.speak(utterance);

}
function normalizar(texto){

  return texto
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g,"");

}

//  HORA 
function obtenerHoraMX(){

  const ahora = new Date();

  let horas = ahora.getHours();
  let minutos = ahora.getMinutes();

  let ampm = horas >= 12 ? "de la tarde" : "de la mañana";

  horas = horas % 12;
  horas = horas ? horas : 12;

  if(minutos === 0)
  return `Son las ${horas} en punto ${ampm}`;

  if(minutos === 30)
  return `Son las ${horas} y media ${ampm}`;

  return `Son las ${horas} con ${minutos} minutos ${ampm}`;

}

// RESPUESTA 
function responder(texto){

  outputArea.innerHTML = texto;
  inputArea.value = texto;

  setTimeout(()=> speak(),400);

}

function procesarComando(texto){

  const t = normalizar(texto);

  console.log("Comando:",t);


  //  SALUDO 
  if(
    t.includes("hola") ||
    t.includes("buenos")
  ){
    responder("¡Hola! ¿Cómo estás?");
    return;
  }

  // HORA 
  if(
    t.includes("hora") ||
    t.includes("horas") ||
    t.includes("que hora es") ||
    t.includes("que horas son") ||
    t.includes("dime la hora")
  ){

    responder(obtenerHoraMX());
    return;

  }

  // CLIMA 
  if(t.includes("clima")){

    responder("Abriendo información del clima");
    window.open("https://www.google.com/search?q=clima");
    return;

  }

  // PROFESOR
  if(t.includes("profesor")){

    responder("¿Qué desea jefe?");
    return;

  }

  // CANCIÓN 
  if(
    t.includes("cancion") ||
    t.includes("canción")
  ){

    responder("Abriendo video de YouTube");

    window.open("https://www.youtube.com/watch?v=oxxKm_O1xwo");
    return;

  }
  // INSCRIPCIÓN 
  if(
    t.includes("inscripcion") ||
    t.includes("inscribirme") ||
    t.includes("materia") ||
    t.includes("materias") ||
    t.includes("inscripciones")
  ){

    responder("¿En qué carrera estás inscrito?");
    return;

  }

  // CARRERAS 
if(t.includes("bionica")){
  carreraActual = "bionica";
  responder("Carrera de Biónica detectada. ¿A qué semestre deseas inscribirte?");
  return;
}

if(t.includes("mecatronica")){
  carreraActual = "mecatronica";
  responder("Carrera de Mecatrónica detectada. ¿Qué semestre quieres consultar?");
  return;
}

if(t.includes("telematica")){
  carreraActual = "telematica";
  responder("Carrera de Telemática detectada. ¿Qué semestre?");
  return;
}
 if(carreraActual == "mecatronica"){

if(t.includes("primer")){
responder("Primer semestre: Cálculo diferencial e integral, Álgebra lineal y números complejos, Mecánica de la partícula, Introducción a la mecatrónica, Estructura y propiedades de los materiales, Herramientas computacionales, Introducción a la programación, Dibujo asistido por computadora");
return;
}

if(t.includes("segundo")){
responder("Segundo semestre: Ecuaciones diferenciales, Cálculo vectorial, Mecánica del cuerpo rígido, Comunicación oral y escrita, Circuitos eléctricos, Procesos de manufactura, Análisis y diseño de programas");
return;
}

if(t.includes("tercer")){
responder("Tercer semestre: Electricidad y magnetismo, Circuitos eléctricos avanzados, Fundamentos de electrónica, Inglés uno, Mantenimiento y sistemas de manufactura, Análisis y síntesis de mecanismos, Análisis de señales y sistemas");
return;
}

if(t.includes("cuarto")){
responder("Cuarto semestre: Resistencia de materiales, Inglés dos, Termodinámica, Probabilidad y estadística para ingeniería, Electrónica analógica, Simulación electrónica y diseño de circuitos impresos, Oscilaciones y óptica, Programación avanzada");
return;
}

if(t.includes("quinto")){
responder("Quinto semestre: Mecánica de fluidos, Teoría electromagnética, Diseño básico de elementos de máquinas, Administración organizacional, Microprocesadores y microcontroladores, Circuitos lógicos, Modelado y simulación de sistemas mecatrónicos, Ética para el ejercicio profesional, Electrónica de potencia");
return;
}

if(t.includes("sexto")){
responder("Sexto semestre: Sensores y acondicionamiento de señal, Neumática e hidráulica, Dispositivos lógicos programables, Inglés tres, Máquinas eléctricas, Instrumentación virtual, Control clásico, Finanzas e ingeniería económica, Diseño avanzado de elementos de máquinas");
return;
}

if(t.includes("séptimo")){
responder("Séptimo semestre: Sistemas neurodifusos, Liderazgo y emprendedores, Proyecto integrador, Optativa uno, Optativa dos, Procesado digital de señales, Ingeniería asistida por computadora, Control de máquinas eléctricas");
return;
}

if(t.includes("octavo")){
responder("Octavo semestre: Automatización industrial, Ingeniería ambiental, Optativa tres, Optativa cuatro, Proyectos de inversión, Metodología de la investigación, Sistemas de visión artificial, Control de sistemas mecatrónicos");
return;
}

if(t.includes("noveno")){
responder("Noveno semestre: Optativa cinco, Optativa seis, Servicio social, Trabajo terminal uno");
return;
}

if(t.includes("décimo")){
responder("Décimo semestre: Trabajo terminal dos");
return;
}

}

if(carreraActual == "bionica"){

if(t.includes("primer")){
responder("Primer semestre: Cálculo diferencial e integral, Álgebra lineal, Biología celular, Química orgánica, Metrología, Bioética");
return;
}

if(t.includes("segundo")){
responder("Segundo semestre: Herramientas computacionales, Cálculo vectorial, Anatomía, Fundamentos de física para la ingeniería, Inglés uno, Biología molecular, Ecuaciones diferenciales");
return;
}

if(t.includes("tercer")){
responder("Tercer semestre: Programación orientada a objetos, Fundamentos de teoría electromagnética, Desarrollo sostenible, Fisicoquímica, Fisiología, Teoría de circuitos, Inglés dos");
return;
}

if(t.includes("cuarto")){
responder("Cuarto semestre: Bioestadística, Bioquímica, Fundamentos matemáticos de ingeniería, Ondas electromagnéticas y sistemas radiantes, Sistemas de gestión de calidad, Análisis numérico, Dispositivos electrónicos, Inglés tres");
return;
}

if(t.includes("quinto")){
responder("Quinto semestre: Biognosis, Física moderna y óptica, Electrónica analógica de potencia, Electrónica digital, Sensores y actuadores, Biomagnetismo, Mecanismos biomiméticos");
return;
}

if(t.includes("sexto")){
responder("Sexto semestre: Biofísica, Liderazgo y emprendedores, Biomateriales, Teoría del control, Procesamiento de imágenes, Dispositivos programables, Análisis de esfuerzos");
return;
}

if(t.includes("séptimo")){
responder("Séptimo semestre: Investigación y desarrollo de proyectos, Control neurodifuso, Procesamiento de señales biológicas, Bioinstrumentación, Modelado y control de sistemas biónicos, Manufactura de elementos biónicos, Reconocimiento de patrones");
return;
}

if(t.includes("octavo")){
responder("Octavo semestre: Optativa uno, Optativa dos, Normatividad y gestión tecnológica, Metodología de la investigación, Biomecánica, Bioelectrónica");
return;
}

if(t.includes("noveno")){
responder("Noveno semestre: Optativa tres, Biorrobótica, Trabajo terminal uno, Servicio social");
return;
}

if(t.includes("décimo")){
responder("Décimo semestre: Trabajo terminal dos");
return;
}

}

if(carreraActual == "telematica"){

if(t.includes("primer")){
responder("Primer semestre: Álgebra Lineal, Cálculo Diferencial e Integral, Administración de Sistemas Operativos, Análisis y Diseño de Sistemas, Comunicación Oral y Escrita");
return;
}

if(t.includes("segundo")){
responder("Segundo semestre: Ecuaciones Diferenciales, Cálculo Multivariable, Programación, Administración Organizacional, Inglés 1, Fundamentos de Física, Ética, Profesión y Sociedad");
return;
}

if(t.includes("tercer")){
responder("Tercer semestre: Variable Compleja, Probabilidad, Inglés 2, Estructura de Datos, Señales y Sistemas, Teoría de los Circuitos, Información Financiera e Ing. Económica");
return;
}

if(t.includes("cuarto")){
responder("Cuarto semestre: Diseño Digital, Electromagnetismo, Inglés 3, Base de Datos, Programación Avanzada, Electrónica, Teoría de las Comunicaciones");
return;
}

if(t.includes("quinto")){
responder("Arquitectura de Computadoras, Procesamiento Digital de Señales, Ingeniería Web, Propagación de Ondas Electromagnéticas, Comunicaciones Digitales, Transmisión de Datos");
return;
}

if(t.includes("sexto")){
responder("Sexto semestre: Telefonía, Protocolos de Internet, Teoría de la Información, Líneas de Transmisión y Antenas, Administración de Proyectos, Dispositivos Programables");
return;
}

if(t.includes("séptimo")){
responder("Séptimo semestre: Sistemas Celulares,Sistemas Distribuidos, Liderazgo y Emprendedores, Bases de Datos Distribuidas, Redes Inteligentes, Multimedia, Redes de Telecomunicaciones");
return;
}

if(t.includes("octavo")){
responder("Octavo semestre: Optativa 1, Seguridad en Redes, Metodología de la Investigación, Aplicaciones Distribuidas, Servicio Social");
return;
}

if(t.includes("noveno")){
responder("Noveno semestre: Optativa 2, Proyecto Terminal 1");
return;
}

if(t.includes("décimo")){
responder("Décimo semestre: Proyecto Terminal 2");
return;
}

}
  // DESPEDIDA 
  if(
    t.includes("adios") ||
    t.includes("adios") ||
    t.includes("hasta luego")
  ){

    responder("Hasta luego. Que tengas un buen día.");
    return;

  }
  responder("No entendí el comando");
}

// ESCUCHAR
function listen(){

  if(!('webkitSpeechRecognition' in window)){
    alert("Tu navegador no soporta reconocimiento de voz");
    return;
  }

  const recognition = new webkitSpeechRecognition();

  recognition.lang = "es-MX";
  recognition.continuous = false;
  recognition.interimResults = false;

  statusElement.innerHTML = "🎤 Escuchando...";
  recognition.start();


  recognition.onresult = function(event){

    const transcript = event.results[0][0].transcript;

    inputArea.value = transcript;
    outputArea.innerHTML = `"${transcript}"`;

    procesarComando(transcript);

  };


  recognition.onerror = function(){

    outputArea.innerHTML = "❌ Error al reconocer voz";

  };

}
//  INICIO
window.onload = function(){

  statusElement.innerHTML = "⏸️ Presiona escuchar";

};
