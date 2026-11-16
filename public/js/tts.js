// js/tts.js
// Controla la lectura en voz alta (Text-to-Speech) usando la Web Speech API

document.addEventListener('DOMContentLoaded', () => {
    // Verificamos si el navegador tiene el "loro"
    if (!('speechSynthesis' in window)) {
        console.warn('[TTS] Tu navegador no soporta lectura en voz alta.');
        return;
    }

    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    // Usamos "delegación de eventos" para escuchar clics en todos los botones de hablar
    chatMessages.addEventListener('click', (event) => {
        const speakBtn = event.target.closest('.speak-btn');
        
        // Si no se hizo clic en el botón, no hacemos nada
        if (!speakBtn) return;

        // Buscamos el mensaje padre
        const messageDiv = speakBtn.closest('.message');
        if (!messageDiv) return;

        // Buscamos el texto real dentro del mensaje
        const contentDiv = messageDiv.querySelector('.message-content');
        if (!contentDiv) return;

        // Obtenemos el texto limpio (quitamos etiquetas HTML y números de línea de código)
        const textToSpeak = getCleanText(contentDiv);

        // Si el botón ya está hablando, lo detenemos
        if (speakBtn.classList.contains('speaking')) {
            window.speechSynthesis.cancel();
            speakBtn.classList.remove('speaking');
            speakBtn.innerHTML = '🔊 Escuchar';
            return;
        }

        // Detenemos cualquier otra lectura que esté ocurriendo
        window.speechSynthesis.cancel();

        // Creamos el "guion" para el loro
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'es-GT'; // Español
        utterance.rate = 1;       // Velocidad normal (1 es normal, 0.5 es lento, 2 es rápido)
        utterance.pitch = 1;      // Tono normal

        // Cuando empieza a hablar
        utterance.onstart = () => {
            speakBtn.classList.add('speaking');
            speakBtn.innerHTML = '🔊 Hablando...';
        };

        // Cuando termina de hablar
        utterance.onend = () => {
            speakBtn.classList.remove('speaking');
            speakBtn.innerHTML = '🔊 Escuchar';

            window.dispatchEvent(new CustomEvent('tts-ficiched'));
        };

        // Si hay un error
        utterance.onerror = () => {
            speakBtn.classList.remove('speaking');
            speakBtn.innerHTML = '🔊 Error';
            setTimeout(() => speakBtn.innerHTML = '🔊 Escuchar', 2000);
        };

        // ¡Que hable!
        window.speechSynthesis.speak(utterance);
    });

    /**
     * Limpia el texto para que el "loro" no lea cosas raras como "javascript" o números de línea.
     */
    function getCleanText(element) {
        // Clonamos el elemento para no modificar el original
        const clone = element.cloneNode(true);
        
        // Eliminamos los bloques de código (el loro no sabe leer código)
        const codeBlocks = clone.querySelectorAll('.code-block');
        codeBlocks.forEach(block => block.remove());
        
        // Eliminamos los tiempos
        const times = clone.querySelectorAll('.message-time');
        times.forEach(time => time.remove());

        // Devolvemos el texto limpio
        return clone.textContent.trim();
    }
});