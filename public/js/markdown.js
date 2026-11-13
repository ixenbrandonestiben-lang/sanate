// js/markdown.js
// Traductor de Markdown a HTML puro (sin librerías externas)

/**
 * Convierte texto con formato Markdown en HTML seguro.
 * Detecta bloques de código (```lenguaje\ncodigo\n```) y los convierte en ventanitas.
 * @param {string} text - El texto crudo que viene de la IA.
 * @returns {string} - El texto convertido a HTML.
 */
function parseMarkdown(text) {
    if (!text) return '';

    // El "detective": una expresión regular que busca ```lenguaje, luego el código, y luego ```
    // [\s\S]*? significa "cualquier carácter, incluyendo saltos de línea, de forma no codiciosa"
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    
    let lastIndex = 0;
    let result = '';
    let match;

    // Mientras el detective encuentre bloques de código...
    while ((match = codeBlockRegex.exec(text)) !== null) {
        // 1. Procesar el texto normal que está ANTES del bloque de código
        let beforeCode = text.substring(lastIndex, match.index);
        result += formatRegularText(beforeCode);
        
        // 2. Procesar el bloque de código encontrado
        const language = match[1].trim() || 'text'; // Si no dice el lenguaje, pone 'text'
        const code = match[2]; // El código en sí
        result += createCodeBlockHTML(language, code);
        
        // Avanzar el índice para no procesar lo que ya vimos
        lastIndex = match.index + match[0].length;
    }
    
    // 3. Procesar cualquier texto normal que quede DESPUÉS del último bloque de código
    if (lastIndex < text.length) {
        result += formatRegularText(text.substring(lastIndex));
    }
    
    return result;
}

/**
 * Da formato al texto normal (no código).
 * Convierte saltos de línea en <br> y **texto** en negrita.
 */
function formatRegularText(text) {
    if (!text.trim()) return '';
    
    // Primero, escapamos el HTML para que nadie pueda inyectar código malicioso (XSS)
    const escaped = escapeHtml(text);
    
    // Luego, aplicamos formatos básicos
    let formatted = escaped
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **negrita** -> <strong>negrita</strong>
        .replace(/\n/g, '<br>'); // Saltos de línea -> <br>
        
    return `<p>${formatted}</p>`;
}

/**
 * Construye el HTML de la ventanita de código.
 */
function createCodeBlockHTML(language, code) {
    // Dividimos el código en líneas para crear los numeritos de la izquierda
    const lines = code.split('\n');
    const lineNumbers = lines.map((_, i) => i + 1).join('<br>');
    
    // Escapamos el código para que se vea como texto y no se ejecute como HTML
    const escapedCode = escapeHtml(code);
    
    return `
    <div class="code-block">
        <div class="code-block-header">
            <span class="code-block-language">${language}</span>
            <button class="code-block-copy" type="button">Copiar</button>
        </div>
        <div class="code-block-body">
            <div class="code-block-lines">${lineNumbers}</div>
            <pre class="code-block-code">${escapedCode}</pre>
        </div>
    </div>`;
}

/**
 * Función de seguridad: convierte caracteres peligrosos (<, >, &) en texto seguro.
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}