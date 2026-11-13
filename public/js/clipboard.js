// js/clipboard.js
// Maneja la funcionalidad del botón "Copiar" en los bloques de código

/**
 * Inicializa los eventos para copiar código.
 * Usa "delegación de eventos" para no tener que agregar un listener a cada botón nuevo.
 */
function initClipboard() {
    // Buscamos el contenedor de todos los mensajes
    const chatContainer = document.getElementById('chat-messages');
    
    if (!chatContainer) {
        console.warn('[CLIPBOARD] No se encontró el contenedor de mensajes.');
        return;
    }

    // Escuchamos los clics en TODO el contenedor, no en cada botón individual
    chatContainer.addEventListener('click', function(event) {
        // Verificamos si lo que se clickeó fue un botón de copiar
        const copyBtn = event.target.closest('.code-block-copy');
        
        if (!copyBtn) return; // Si no es el botón, no hacemos nada

        // Buscamos la ventanita de código padre
        const codeBlock = copyBtn.closest('.code-block');
        if (!codeBlock) return;

        // Buscamos el elemento <pre> que tiene el código real
        const codeElement = codeBlock.querySelector('.code-block-code');
        if (!codeElement) return;

        // Obtenemos el texto del código
        const codeText = codeElement.textContent;

        // Copiamos al portapapeles
        copyToClipboard(codeText, copyBtn);
    });
}

/**
 * Copia el texto al portapapeles y da feedback visual al botón.
 */
async function copyToClipboard(text, button) {
    try {
        // Usamos la API moderna del portapapeles
        await navigator.clipboard.writeText(text);
        
        // Feedback visual de éxito
        const originalText = button.textContent;
        button.textContent = '¡Copiado!';
        button.classList.add('copied');
        
        // Regresamos el botón a la normalidad después de 2 segundos
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
        
    } catch (error) {
        console.error('[CLIPBOARD ERROR]', error);
        button.textContent = 'Error';
        setTimeout(() => {
            button.textContent = 'Copiar';
        }, 2000);
    }
}

// Inicializamos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initClipboard);