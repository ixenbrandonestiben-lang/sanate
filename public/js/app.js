// public/js/app.js
// Lógica del frontend: maneja el DOM, fetch a la API, localStorage y UI.

// ============================================
// ESTADO Y CONFIGURACIÓN
// ============================================
const API_URL = '/api/chat';
let userId = localStorage.getItem('bee_userId') || localStorage.getItem('majeBot_userId');

// Si no hay userId, generamos uno único y lo guardamos
if (!userId) {
  userId = crypto.randomUUID ? crypto.randomUUID() : 'user-' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('bee_userId', userId);
} else {
  localStorage.setItem('bee_userId', userId);
}

// ============================================
// REFERENCIAS AL DOM
// ============================================
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');
const botStatus = document.getElementById('bot-status');
const clearChatBtn = document.getElementById('clear-chat-btn');

// ============================================
// FUNCIONES DE UI
// ============================================

/**
 * Agrega un mensaje al DOM.
 * @param {string} role - 'user' o 'bot'
 * @param {string} text - Contenido del mensaje
 */
function addMessageToUI(role, text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  
  const time = new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
  
  messageDiv.innerHTML = `
    <div class="message-content">${escapeHtml(text)}</div>
    <span class="message-time">${time}</span>
  `;
  
  chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

/**
 * Muestra el indicador de "escribiendo..."
 */
function showTyping() {
  typingIndicator.hidden = false;
  botStatus.textContent = 'Escribiendo...';
  scrollToBottom();
}

/**
 * Oculta el indicador de "escribiendo..."
 */
function hideTyping() {
  typingIndicator.hidden = true;
  botStatus.textContent = 'En línea';
}

/**
 * Hace scroll automático al final del chat.
 */
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Escapa HTML para prevenir XSS (seguridad básica).
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Habilita o deshabilita el input y el botón.
 */
function setLoading(isLoading) {
  messageInput.disabled = isLoading;
  sendBtn.disabled = isLoading;
  clearChatBtn.disabled = isLoading;
  if (!isLoading) {
    messageInput.focus();
  }
}

// ============================================
// LÓGICA DE NEGOCIO
// ============================================

/**
 * Envía el mensaje al backend y maneja la respuesta.
 */
async function handleSendMessage(e) {
  e.preventDefault();
  
  const text = messageInput.value.trim();
  if (!text) return;

  // 1. Mostrar mensaje del usuario inmediatamente (optimistic UI)
  addMessageToUI('user', text);
  messageInput.value = '';
  messageInput.style.height = 'auto'; // Reset altura textarea
  setLoading(true);
  showTyping();

  try {
    // 2. Petición al backend
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        message: text,
        persona: 'MAJE' // Podrías hacer un selector en el UI para cambiar esto
      }),
    });

    const textData = await response.text();
    let result = {};
    if (textData) {
      try {
        result = JSON.parse(textData);
      } catch {
        throw new Error(`Respuesta inválida del servidor (${response.status})`);
      }
    }

    if (!response.ok) {
      throw new Error(result.error || `Error del servidor (${response.status})`);
    }

    if (!result.data || !result.data.reply) {
      throw new Error('La respuesta del servidor no tiene el formato esperado.');
    }

    // 3. Mostrar respuesta del bot
    hideTyping();
    addMessageToUI('bot', result.data.reply);

  } catch (error) {
    console.error('[FRONTEND ERROR]', error);
    hideTyping();
    addMessageToUI('bot', error.message || 'Ala maje, se me fue el internet o el server está caído. Perame un toque y volvé a intentar. 🥲');
  } finally {
    setLoading(false);
  }
}

/**
 * Borra la memoria del usuario en el backend y limpia la UI.
 */
async function handleClearChat() {
  if (!confirm('¿Seguro que querés borrar toda la conversación, maje?')) return;

  setLoading(true);
  try {
    const response = await fetch(`${API_URL}/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
    const textData = await response.text();
    let result = {};
    if (textData) {
      try {
        result = JSON.parse(textData);
      } catch {
        throw new Error(`Respuesta inválida del servidor (${response.status})`);
      }
    }

    if (!response.ok) {
      throw new Error(result.error || `Error ${response.status}`);
    }

    chatMessages.innerHTML = `
      <div class="message bot">
        <div class="message-content">¡Memoria borrada, maje! Empezamos de cero. ¿En qué te ayudo?</div>
        <span class="message-time">Ahora</span>
      </div>
    `;
  } catch (error) {
    console.error('[CLEAR ERROR]', error);
    addMessageToUI('bot', `No se pudo borrar la conversación: ${error.message}`);
  } finally {
    setLoading(false);
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Enviar con el formulario (click o Enter)
chatForm.addEventListener('submit', handleSendMessage);

// Auto-resize del textarea al escribir
messageInput.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Permitir enviar con Enter (sin Shift)
messageInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.requestSubmit();
  }
});

// Botón de borrar chat
clearChatBtn.addEventListener('click', handleClearChat);

// Focus inicial en el input
messageInput.focus();
