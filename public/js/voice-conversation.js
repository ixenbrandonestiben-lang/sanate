// js/voice-conversation.js
// Conecta el micrófono y la voz para simular una conversación automática

document.addEventListener('DOMContentLoaded', () => {
    const modeBtn = document.getElementById('voice-mode-btn');
    const micBtn = document.getElementById('voice-btn');
    const chatForm = document.getElementById('chat-form');
    
    let isConversationMode = false;

    // 1. Activar o desactivar el modo
    if (modeBtn) {
        modeBtn.addEventListener('click', () => {
            isConversationMode = !isConversationMode;
            modeBtn.classList.toggle('active', isConversationMode);
            
            // Feedback visual en el título
            modeBtn.title = isConversationMode 
                ? 'Modo Conversación: ACTIVO (Clic para apagar)' 
                : 'Activar Modo Conversación Automática';
        });
    }

    // 2. Cuando el micrófono se apaga (Señal: 'voice-stopped')
    window.addEventListener('voice-stopped', () => {
        if (isConversationMode && chatForm) {
            // Esperamos 500ms para asegurar que el texto ya está en la cajita
            setTimeout(() => {
                // Solo enviamos si hay texto
                const input = document.getElementById('message-input');
                if (input && input.value.trim() !== '') {
                    chatForm.requestSubmit();
                }
            }, 500);
        }
    });

    // 3. Cuando la voz termina de leer (Señal: 'tts-finished')
    window.addEventListener('tts-finished', () => {
        if (isConversationMode && micBtn) {
            // Esperamos 1 segundo antes de volver a escuchar para no cortar el silencio
            setTimeout(() => {
                // Simulamos un clic en el micrófono para que empiece a escuchar de nuevo
                micBtn.click();
            }, 1000);
        }
    });
});