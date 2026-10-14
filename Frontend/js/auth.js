// ================================
// CONNEXION
// ================================

let toastTimeout;

function switchAuthTab(tab) {
  const isConnexion = tab === 'connexion';
  document.getElementById('formConnexion').style.display   = isConnexion ? 'block' : 'none';
  document.getElementById('formInscription').style.display = isConnexion ? 'none'  : 'block';
  document.getElementById('tabConnexion').classList.toggle('active', isConnexion);
  document.getElementById('tabInscription').classList.toggle('active', !isConnexion);
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.style.color = isHidden ? 'var(--blue)' : 'var(--text-muted)';
}


function showAuthError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.style.display = 'block';
}
function hideAuthError(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

async function handleLogin() {
  hideAuthError('loginError');
  const identifiant = document.getElementById('loginIdentifiant').value.trim();
  const password    = document.getElementById('loginPassword').value;

  if (!identifiant || !password) {
    showAuthError('loginError', 'Merci de remplir tous les champs.');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, //on utilise ce content type pour les login en Oauth2PasswordRequestForm
      credentials: 'include', // envoie et reçoit les cookies
      body: new URLSearchParams({ username: identifiant, password: password })
    });

    if (!response.ok) {
      showAuthError('loginError', 'Identifiant ou mot de passe incorrect.');
      return;
    }

    const data = await response.json();

    // On stocke les infos users non sensibles comme dans auth.py
    sessionStorage.setItem('token', data.access_token);
    sessionStorage.setItem('pseudo', data.pseudo);
    sessionStorage.setItem('id', data.id);
    sessionStorage.setItem('id_role', data.id_role);

    showToast(`Bienvenue ${data.pseudo} !`);

    setTimeout(() => {
      if (data.id_role === 2)      window.location.href = 'dashboard-admin.html';
      else if (data.id_role === 3) window.location.href = 'dashboard-organisateur.html';
      else                         window.location.href = 'espace-joueur.html';
    }, 800);

  } catch(error) {
    showAuthError('loginError', 'Erreur de connexion au serveur.');
    console.error(error);
  }
}


async function handleRegister() {
  hideAuthError('registerError');
  const pseudo    = document.getElementById('regPseudo').value.trim();
  const email     = document.getElementById('regEmail').value.trim();
  const password  = document.getElementById('regPassword').value;
  const confirm   = document.getElementById('regPasswordConfirm').value;
  const cgu       = document.getElementById('regCGU').checked;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!pseudo || !email || !password || !confirm) {
    showAuthError('registerError', 'Merci de remplir tous les champs obligatoires.');
    return;
  }
  if (password !== confirm) {
    showAuthError('registerError', 'Les mots de passe ne correspondent pas.');
    return;
  }
  if (!passwordRegex.test(password)) {
    showAuthError('registerError', 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, et un caractère spécial (@,$,!,%,*,?,&).');
    return;
  }
  if (!cgu) {
    showAuthError('registerError', "Merci d'accepter les conditions d'utilisation.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ pseudo, email, password })
    });

    if (!response.ok) {
      const err = await response.json();
      showAuthError('registerError', err.detail || 'Erreur lors de la création du compte.');
      return;
    }

  showToast('Compte créé ! Tu peux maintenant te connecter.');
  setTimeout(() => switchAuthTab('connexion'), 2000);
    }
    catch(error) {
    showAuthError('registerError', 'Erreur de connexion au serveur.');
    console.error(error);
  }
}

if (document.getElementById('formConnexion')) {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const formConn = document.getElementById('formConnexion');
    const formInsc = document.getElementById('formInscription');
    if (formConn && formConn.style.display !== 'none') handleLogin();
    else if (formInsc && formInsc.style.display !== 'none') handleRegister();
  });
  const params = new URLSearchParams(window.location.search);
  const reason = params.get('reason');
  
  if (reason === 'not_logged_in') {
    showToast('Connecte-toi pour accéder à cette page.');
  } else if (reason === 'unauthorized') {
    showToast("Tu n'as pas accès à cette page.");
  }
}


async function handleLogout() {
  const token = sessionStorage.getItem('token');
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    sessionStorage.clear();
    window.location.href = 'connexion.html';
}


//Pour verifier si le user est bien connecté sinon pas d'acces au dashboard
function checkAuth(roleRequis) {
  const id = sessionStorage.getItem('id');
  const role = sessionStorage.getItem('id_role');

  if (!id) {
    window.location.href = 'connexion.html?reason=not_logged_in';
    return false;
  }

  if (roleRequis && String(role) !== String(roleRequis)) {
    window.location.href = 'connexion.html?reason=unauthorized';
    return false;
  }

  return true;
}


function updateNavbar() {
  const pseudo = sessionStorage.getItem('pseudo');
  const role = sessionStorage.getItem('id_role');
  const btnJoin = document.querySelector('.btn-join');
  
  if (!btnJoin) return;
  
  if (pseudo) {
    // User connecté
    if (role == 2) {
      btnJoin.textContent = 'ADMIN';
      btnJoin.href = 'dashboard-admin.html';
      btnJoin.style.background = 'var(--purple)';
    } else if (role == 3) {
      btnJoin.textContent = 'MON ESPACE';
      btnJoin.href = 'dashboard-organisateur.html';
    } else {
      btnJoin.textContent = 'MON ESPACE';
      btnJoin.href = 'espace-joueur.html';
    }
  }
  // Si pas connecté — le bouton reste "NOUS REJOINDRE" par défaut
}
