const chatPanel = document.querySelector('.care-chat');
const chatLauncher = document.querySelector('.chat-launcher');
const chatInput = document.querySelector('#chat-input');
const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.querySelector('.chat-form');
const chatStatus = document.querySelector('.chat-status');
const chatSuggestions = [...document.querySelectorAll('.chat-questions button')];
let answering = false;

function toggleChat(open) {
  chatPanel.hidden = !open;
  chatLauncher.setAttribute('aria-expanded', String(open));
  if (open) chatInput.focus({ preventScroll: true });
  else chatLauncher.focus({ preventScroll: true });
}

chatLauncher.addEventListener('click', () => toggleChat(chatPanel.hidden));
document.querySelector('.chat-close').addEventListener('click', () => toggleChat(false));
chatPanel.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    event.stopPropagation();
    toggleChat(false);
  }
});

function sampleReply(question) {
  const text = question.toLowerCase();
  if (/price|cost|rate|fee|book|contact|phone|appointment/.test(text)) {
    return 'Contact details and pricing are still being prepared for this preview. You can use Find care to download notes about your family’s needs before speaking with an agency.';
  }
  if (/first|visit/.test(text)) {
    return 'Start with an unhurried time your loved one prefers. Try a familiar activity together, such as making tea. Afterward, ask what felt comfortable and what they would change. The Your first visit section walks through each step.';
  }
  if (/companion|lonely|company/.test(text)) {
    return 'Companionship can mean sharing a puzzle, talking over tea, or spending a quiet afternoon together. Begin with activities your loved one enjoys and ask how often company would feel welcome.';
  }
  if (/personal|dress|mobility/.test(text)) {
    return 'The personal care section describes help with dressing, moving between rooms, and evening routines. Ask your loved one which routines they want support with and who they feel comfortable receiving help from.';
  }
  if (/meal|food|home|house|care.*available|service/.test(text)) {
    return 'Explore three types of support on this page — help around the home, companionship, and personal care. That could begin with preparing a favorite meal, sharing an afternoon, or getting comfortable for the evening.';
  }
  if (/start|help|plan|notes/.test(text)) {
    return 'Ask your loved one which part of the day they would like help with. Use the Find care button to choose a type of support and download conversation notes. You can also explore the first-visit guide together.';
  }
  return 'This preview can answer sample questions about care services and first visits. Try “What care is available?” or “Plan a first visit.” For a family conversation, the Find care planner helps you prepare downloadable notes.';
}

function appendMessage(text, type) {
  const message = document.createElement('div');
  message.className = 'message ' + type;
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  message.append(paragraph);
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendQuestion(question) {
  const text = question.trim().slice(0, 500);
  if (!text || answering) return;
  answering = true;
  appendMessage(text, 'user');
  chatInput.value = '';
  chatStatus.textContent = 'Preparing a sample reply…';
  chatForm.querySelector('button').disabled = true;
  chatSuggestions.forEach(button => button.disabled = true);
  setTimeout(() => {
    appendMessage(sampleReply(text), 'assistant');
    chatStatus.textContent = '';
    chatForm.querySelector('button').disabled = false;
    chatSuggestions.forEach(button => button.disabled = false);
    answering = false;
  }, 650);
}

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  sendQuestion(chatInput.value);
});
chatSuggestions.forEach(button => button.addEventListener('click', () => sendQuestion(button.textContent)));
