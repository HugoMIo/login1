document.addEventListener('DOMContentLoaded', () => {
  const email = document.getElementById('email');
  const senha = document.getElementById('senha');
  const emailError = document.getElementById('email-error');
  const senhaError = document.getElementById('senha-error');
  const reqList = document.getElementById('password-requirements');
  const items = [...reqList.querySelectorAll('li')];
  const toggle = document.getElementById('changeatribute');
  const form = document.querySelector('form');

  const rules = {
    length: v => v.length >= 8,
    lower: v => /[a-z]/.test(v),
    upper: v => /[A-Z]/.test(v),
    number: v => /[0-9]/.test(v),
    special: v => /[^A-Za-z0-9\s]/.test(v)
  };

  const ruleMessages = {
    length: 'mínimo 8 caracteres',
    lower: 'uma letra minúscula (a–z)',
    upper: 'uma letra maiúscula (A–Z)',
    number: 'um número (0–9)',
    special: 'um caractere especial (ex.: !@#$%)'
  };

  function getMissingRules(password) {
    return Object.keys(rules).filter(rule => !rules[rule](password));
  }

  function formatMissingRules(missing) {
    if (!missing || missing.length === 0) return '';
    const texts = missing.map(m => ruleMessages[m] || m);
    return (texts.length === 1 ? 'Falta: ' : 'Faltam: ') + texts.join(', ') + '.';
  }

  function updateRules(value) {
    items.forEach(li => {
      const rule = li.dataset.rule;
      if (rules[rule](value)) {
        li.classList.add('valid');
        li.classList.remove('invalid');
      } else {
        li.classList.add('invalid');
        li.classList.remove('valid');
      }
    });
  }

  senha.addEventListener('input', (e) => {
    const v = e.target.value;
    updateRules(v);
    // mostrar dica em tempo real sem marcar aria-invalid até o submit
    const missing = getMissingRules(v);
    if (v && missing.length > 0) {
      senhaError.textContent = formatMissingRules(missing);
      senhaError.classList.add('visible');
    } else {
      if (!senha.hasAttribute('aria-invalid')) hideError(senha, senhaError);
    }
  });

  toggle && toggle.addEventListener('click', () => {
    senha.type = senha.type === 'password' ? 'text' : 'password';
    toggle.classList.toggle('bxs-lock-open-alt');
    toggle.classList.toggle('bxs-lock-alt');
  });

  updateRules(senha.value || '');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePassword(password) {
    return Object.values(rules).every(rule => rule(password));
  }

  function showError(element, errorDiv, message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('visible');
    element.parentElement.classList.add('error');
    // accessibility: mark the input as invalid so AT can detect
    element.setAttribute('aria-invalid', 'true');
  }

  function hideError(element, errorDiv) {
    errorDiv.classList.remove('visible');
    errorDiv.textContent = '';
    element.parentElement.classList.remove('error');
    element.removeAttribute('aria-invalid');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (!email.value.trim()) {
      showError(email, emailError, 'Por favor, insira seu e‑mail.');
      isValid = false;
    } else if (!validateEmail(email.value)) {
      showError(email, emailError, 'Insira um e‑mail válido (ex.: usuario@exemplo.com).');
      isValid = false;
    } else {
      hideError(email, emailError);
    }

    if (!senha.value) {
      showError(senha, senhaError, 'Por favor, insira sua senha.');
      isValid = false;
    } else if (!validatePassword(senha.value)) {
      const missing = getMissingRules(senha.value);
      showError(senha, senhaError, formatMissingRules(missing));
      isValid = false;
    } else {
      hideError(senha, senhaError);
    }

    if (isValid) {
      console.log('Formulário válido - pode ser enviado');
    } else {
      const firstInvalid = form.querySelector('input[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }
  });

  email.addEventListener('input', () => hideError(email, emailError));
});
