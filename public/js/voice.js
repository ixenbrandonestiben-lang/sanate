// js/voice.js
// Controla el dictado por voz usando la Web Speech API del navegador

// 1. Verificamos si el navegador soporta el robot que escucha
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    
    // Configuración del robot
    recognition.lang = 'es-GT'; // Español (Guatemala)
    recognition.continuous = true; // 👈 CAMBIO: true para que no se detenga a cada rato si haces pausas
    recognition.interimResults = true; // Muestra el texto mientras hablas (en tiempo real)

    // Referencias a los elementos del HTML
    const voiceBtn = document.getElementById('voice-btn');
    const messageInput = document.getElementById('message-input');

    let isRecording = false;
    let finalTranscript = ''; // 👈 NUEVO: La "Hoja Oficial" (memoria a largo plazo)

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
        voiceBtn.classList.add('recording'); 
        voiceBtn.title = 'Escuchando... (clic para detener)';
        messageInput.placeholder = 'Te estoy escuchando...';
        
        // 👈 NUEVO: Guardamos lo que ya había escrito para no borrarlo al empezar
        finalTranscript = messageInput.value ? messageInput.value + ' ' : '';
    };

    // 4. Cuando el robot deja de escuchar
    recognition.onend = () => {
        isRecording = false;
        voiceBtn.classList.remove('recording'); 
        voiceBtn.title = 'Dictar por voz';
        messageInput.placeholder = 'Escribe tu mensaje o usa el micrófono...';
    };

    // 5. Cuando el robot entiende lo que dices (Lógica a prueba de duplicados)
    recognition.onresult = (event) => {
        let interimTranscript = ''; // La "Hoja Borrador" (texto temporal)

        // Recorremos los resultados
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript; // Lo confirmamos en la Hoja Oficial
            } else {
                interimTranscript += transcript; // Lo guardamos en la Hoja Borrador
            }
        }
        
        // 👈 LA MAGIA: Reemplazamos el texto de la cajita con (Oficial + Borrador)
        // Esto evita por completo que se duplique, porque nunca sumamos sobre lo que ya había
        messageInput.value = finalTranscript + interimTranscript;
        
        // Ajustamos la altura del textarea automáticamente
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    };

    // 6. Si el robot no entiende o hay un error
    recognition.onerror = (event) => {
        console.error('[VOICE ERROR]', event.error);
        
        // Solo mostramos alertas para errores críticos, ignoramos los ruidos de fondo
        if (event.error === 'not-allowed') {
            alert('Necesitas darme permiso para usar el micrófono. Revisa los permisos de tu navegador.');
            isRecording = false;
            voiceBtn.classList.remove('recording');
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