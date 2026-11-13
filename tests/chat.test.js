import assert from 'node:assert/strict';
import test from 'node:test';
import { validateChatMessage } from '../src/core/chat/chatValidator.js';
import { getPersonaPrompt } from '../src/core/ai/prompts/personas.js';

test('usa MAJE cuando no se especifica una personalidad', () => {
  const result = validateChatMessage({ userId: 'user-1', message: 'Hola' });

  assert.equal(result.persona, 'MAJE');
});

test('rechaza personalidades inválidas como un error de validación 400', () => {
  assert.throws(
    () => validateChatMessage({ userId: 'user-1', message: 'Hola', persona: 'SOPILOT' }),
    (error) => error.status === 400 && error.message.includes('Validación fallida'),
  );
});

test('normaliza VEDOR al nombre de personalidad VENDEDOR', () => {
  const result = validateChatMessage({ userId: 'user-1', message: 'Hola', persona: 'VEDOR' });

  assert.equal(result.persona, 'VENDEDOR');
  assert.match(getPersonaPrompt(result.persona), /asistente de ventas/i);
});

test('acepta VENDEDOR como personalidad', () => {
  const result = validateChatMessage({ userId: 'user-1', message: 'Hola', persona: 'VENDEDOR' });

  assert.equal(result.persona, 'VENDEDOR');
});