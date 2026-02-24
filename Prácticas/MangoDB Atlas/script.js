    const synth = window.speechSynthesis;
    const voiceSelect = document.getElementById('voice-select');
    const outputArea = document.getElementById('output-area');
    const rateInput  = document.getElementById('rate');
    const pitchInput = document.getElementById('pitch');
    let voices = [];

    // Cargar voces disponibles
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

    // Las voces pueden cargarse de forma asíncrona
    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    // Actualizar etiquetas de sliders
    rateInput.addEventListener('input',  () => document.getElementById('rate-val').textContent  = rateInput.value);
    pitchInput.addEventListener('input', () => document.getElementById('pitch-val').textContent = pitchInput.value);

    function speak() {
      const text = document.getElementById('input-area').value.trim();

      if (!text) {
        outputArea.innerHTML = '⚠️ Escribe algún texto primero.';
        return;
      }

      // Detener cualquier lectura previa
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voices[voiceSelect.value];
      utterance.rate  = parseFloat(rateInput.value);
      utterance.pitch = parseFloat(pitchInput.value);

      utterance.onstart = () => outputArea.innerHTML = '🔊 Reproduciendo...';
      utterance.onend   = () => outputArea.innerHTML = '✅ Lectura completada.';
      utterance.onerror = (e) => outputArea.innerHTML = `❌ Error: ${e.error}`;

      synth.speak(utterance);
    }

    function togglePause() {
      if (synth.paused) {
        synth.resume();
        outputArea.innerHTML = '🔊 Reproduciendo...';
      } else if (synth.speaking) {
        synth.pause();
        outputArea.innerHTML = '⏸ Pausado.';
      }
    }

    function stopSpeech() {
      synth.cancel();
      outputArea.innerHTML = '⏹ Detenido.';
    }