// Maxwell Fleming — main.js
// PHONE and EMAIL are injected by the 11ty template from content/home.json

const toast  = document.getElementById('toast');
const _phone = typeof PHONE !== 'undefined' ? PHONE : '';
const _email = typeof EMAIL !== 'undefined' ? EMAIL : '';

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2100);
}

async function copyText(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(label + ' copied 👍');
  } catch (e) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    showToast(label + ' copied 👍');
  }
}

document.getElementById('copyPhone')?.addEventListener('click', () => copyText(_phone, 'Phone number'));
document.getElementById('copyEmail')?.addEventListener('click', () => copyText(_email, 'Email'));
