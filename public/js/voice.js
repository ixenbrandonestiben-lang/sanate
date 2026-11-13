// js/voice.js
// Controla el dictado por voz usando la Web Speech API del navegador

// 1. Verificamos si el navegador soporta el robot que escucha
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    
    // Configuración del robot
    recognition.lang = 'es-GT'; // Español (Guatemala) - Puedes cambiarlo a 'es-MX' o 'es-ES'
    recognition.continuous = false; // Se detiene cuando dejas de hablar
    recognition.interimResults = true; // Muestra el texto mientras hablas (en tiempo real)

    // Referencias a los elementos del HTML
    const voiceBtn = document.getElementById('voice-btn');
    const messageInput = document.getElementById('message-input');

    let isRecording = false;

    // 2. Qué hacer cuando el botón es presionado
    voiceBtn.addEventListener('click', () => {
        if (isRecording) {
            recognition.stop(); // Si ya está grabando, lo detenemos
        } else {
            recognition.start(); // Si no, empezamos a grabar
        }
    });

    // 3. Cuando el robot empieza a escuchar
    recognition.onstart = () => {
        isRecording = true;
        voiceBtn.classList.add('recording'); // Le pone el disfraz rojo que late
        voiceBtn.title = 'Escuchando... (clic para detener)';
        messageInput.placeholder = 'Te estoy escuchando...';
    };

    // 4. Cuando el robot deja de escuchar
    recognition.onend = () => {
        isRecording = false;
        voiceBtn.classList.remove('recording'); // Le quita el disfraz rojo
        voiceBtn.title = 'Dictar por voz';
        messageInput.placeholder = 'Escribe tu mensaje o usa el micrófono...';
    };

    // 5. Cuando el robot entiende lo que dices
    recognition.onresult = (event) => {
        let transcript = '';
        
        // Recorremos todos los resultados que el robot entendió
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        
        // Ponemos el texto en la cajita de escribir
        // Si ya había texto escrito, le agregamos un espacio antes
        if (messageInput.value) {
            messageInput.value = messageInput.value + ' ' + transcript;
        } else {
            messageInput.value = transcript;
        }
        
        // Ajustamos la altura del textarea automáticamente
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    };

    // 6. Si el robot no entiende o hay un error
    recognition.onerror = (event) => {
        console.error('[VOICE ERROR]', event.error);
        isRecording = false;
        voiceBtn.classList.remove('recording');
        
        if (event.error === 'no-speech') {
            alert('No te escuché. Intenta hablar más fuerte o revisar tu micrófono.');
        } else if (event.error === 'not-allowed') {
            alert('Necesitas darme permiso para usar el micrófono. Revisa los permisos de tu navegador.');
        }
    };

} else {
    // Si el navegador no tiene el robot, escondemos el botón
    const voiceBtn = document.getElementById('voice-btn');
    if (voiceBtn) {
        voiceBtn.style.display = 'none';
        console.warn('[VOICE] Tu navegador no soporta dictado por voz.');
    }
}