// ================================
// MANAGE PROFILE
// ================================

function fillParamsForm() {
  const pseudo = sessionStorage.getItem('pseudo');
  const email = sessionStorage.getItem('email');
  const pseudoInput = document.getElementById('paramsPseudo');
  const emailInput = document.getElementById('paramsEmail');
  
  const user = USERS_DATA.find(u => u.pseudo === pseudo); // a supprimer? 

  if (pseudoInput) pseudoInput.value = pseudo || '';
  if (emailInput) emailInput.value = email || '';
}

async function updateProfile() {
  const id = sessionStorage.getItem('id');
  const pseudo = document.getElementById('paramsPseudo').value.trim();
  const email = document.getElementById('paramsEmail').value.trim();
  const password = document.getElementById('paramsPassword').value;
  const confirm = document.getElementById('paramsPasswordConfirm').value;

  const errorEl = document.getElementById('paramsError');
  errorEl.style.display = 'none';

  if (password && password !== confirm) {
    errorEl.textContent = 'Les mots de passe ne correspondent pas.';
    errorEl.style.display = 'block';
    return;
  }

  const payload = { pseudo, email };
  if (password) payload.password = password;

  const token = sessionStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json();
      errorEl.textContent = err.detail || 'Erreur lors de la mise à jour.';
      errorEl.style.display = 'block';
      return;
    }

    sessionStorage.setItem('pseudo', pseudo);
    sessionStorage.setItem('email', email);
    showToast('Profil mis à jour !');

  } catch(error) {
    console.error(error);
    errorEl.textContent = 'Erreur de connexion au serveur.';
    errorEl.style.display = 'block';
  }
}