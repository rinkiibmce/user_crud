// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(loginForm);
    
    const resp = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(fd))
    });
    const data = await resp.json();
    if (data.success) {
      window.location.href = '/users';
    } else {
      document.getElementById('loginError').textContent = data.error;
    }
  });
}

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(registerForm);
    const resp = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(fd))
    });
    const data = await resp.json();
    if (data.success) {
      window.location.href = '/users';
    } else {
      document.getElementById('registerError').textContent = data.error;
    }
  });
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  });
}

// Users Table
const usersTable = document.getElementById('usersTable');
if (usersTable) {
  fetch('/api/users')
    .then(response => response.json())
    .then(users => {
      users.forEach(u => {
        const row = usersTable.insertRow();
        row.insertCell().textContent = u.username;
        row.insertCell().textContent = u.name;
        row.insertCell().textContent = u.email;
        const editCell = row.insertCell();
        const editLink = document.createElement('a');
        editLink.textContent = 'Edit';
        editLink.href = `/edit?id=${u._id}`;
        editCell.appendChild(editLink);
        const delCell = row.insertCell();
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = async () => {
          await fetch(`/api/delete/${u._id}`, { method: 'POST' });
          window.location.reload();
        };
        delCell.appendChild(delBtn);
      });
    });
}

// Edit user page (prefill and update)
const editForm = document.getElementById('editForm');
if (editForm) {
  // Get ID from query string
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');
  fetch('/api/user/' + userId)
    .then(res => res.json())
    .then(u => {
      document.getElementById('editName').value = u.name || '';
      document.getElementById('editEmail').value = u.email || '';
    });
  editForm.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(editForm);
    await fetch('/api/edit/' + userId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(fd))
    });
    window.location.href = '/users';
  });
}
