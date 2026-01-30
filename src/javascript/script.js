// --- 1. CONFIGURAÇÕES E VARIÁVEIS GLOBAIS ---
let realPassword = '';
let isPasswordVisible = false;
let history = [];
let MASTER_KEY = localStorage.getItem('master_key_vault');
let vaultEntries = JSON.parse(localStorage.getItem('my_vault')) || [];
let isVaultUnlocked = false;

// --- 2. FUNÇÕES DE APOIO (GERAÇÃO E FORÇA) ---

function getChartTypes() {
    const charTypes = [];
    if (document.querySelector('#include_uppercase').checked) charTypes.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (document.querySelector('#include_lowercase').checked) charTypes.push('abcdefghijklmnopqrstuvwxyz');
    if (document.querySelector('#include_number').checked) charTypes.push('0123456789');
    if (document.querySelector('#include_special_character').checked) charTypes.push('!@#$%&*()_-+={}[]|\\/?><:;\'.,');
    return charTypes;
}

function generatePassword(size, charTypes) {
    let passwordGenerated = '';
    const selectedChars = charTypes.join('');
    charTypes.forEach(type => {
        passwordGenerated += type[Math.floor(Math.random() * type.length)];
    });
    while (passwordGenerated.length < size) {
        passwordGenerated += selectedChars[Math.floor(Math.random() * selectedChars.length)];
    }
    return passwordGenerated.split('').sort(() => Math.random() - 0.5).join('');
}

function updateStrength(password) {
    const bar = document.querySelector('#strength_bar');
    const text = document.querySelector('#strength_text');
    const container = document.querySelector('#strength_container');
    if (!container || !bar) return;
    
    container.style.display = 'flex';
    let score = 0;
    if (password.length > 8) score++;
    if (password.length > 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
        { width: '20%', color: '#dc2626', label: 'Muito Fraca' },
        { width: '40%', color: '#fbbf24', label: 'Fraca' },
        { width: '60%', color: '#f59e0b', label: 'Média' },
        { width: '80%', color: '#84cc16', label: 'Forte' },
        { width: '100%', color: '#22c55e', label: 'Excelente' }
    ];

    const result = levels[Math.min(score, 4)];
    bar.style.width = result.width;
    bar.style.backgroundColor = result.color;
    text.textContent = result.label; // Aqui exibe o texto "Forte", "Excelente", etc.
}

function updateHistory(pw) {
    history.unshift(pw);
    if (history.length > 10) history.pop();
    const list = document.querySelector('#history_list');
    if (!list) return;
    list.innerHTML = '';
    history.forEach(passData => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="history-pass-text">${'*'.repeat(passData.length)}</span>
            <div class="history-actions">
                <button class="history-copy-btn"><i class="fa-solid fa-copy"></i></button>
            </div>`;
        li.querySelector('.history-copy-btn').onclick = () => {
            navigator.clipboard.writeText(passData);
            message('Copiada do histórico!');
        };
        list.appendChild(li);
    });
}

function message(text, status = 'success') {
    Toastify({
        text: text,
        duration: 2000,
        style: { background: status === 'success' ? '#84cc16' : '#dc2626' }
    }).showToast();
}

// --- 3. COFRE E NAVEGAÇÃO ---

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const targetPage = document.querySelector(`#page_${pageId}`);
    if (targetPage) targetPage.style.display = 'block';
    
    document.querySelectorAll('.app-nav button').forEach(b => b.classList.remove('active'));
    document.querySelector(`#btn_nav_${pageId}`)?.classList.add('active');
}

function setupMasterKey() {
    if (!MASTER_KEY) {
        let firstPass = prompt("PRIMEIRO ACESSO: Defina sua SENHA MESTRA para o cofre:");
        if (firstPass && firstPass.length >= 4) {
            localStorage.setItem('master_key_vault', firstPass);
            MASTER_KEY = firstPass;
            message("Senha Mestra configurada!");
        }
    }
}

function unlockVault() {
    if (!MASTER_KEY) return setupMasterKey();
    const trial = prompt("Digite sua Senha Mestra:");
    if (trial === MASTER_KEY) {
        isVaultUnlocked = true;
        document.querySelector('#unlock_vault_btn').style.display = 'none';
        document.querySelector('#vault_list').style.display = 'block';
        renderVault();
        message("Cofre aberto!", "success");
    } else {
        message("Senha incorreta!", "danger");
    }
}

function renderVault() {
    const list = document.querySelector('#vault_list');
    if (!list || !isVaultUnlocked) return;
    list.innerHTML = '';

    if (vaultEntries.length === 0) {
        list.innerHTML = '<p style="color: #666; text-align: center; margin-top: 20px;">Nenhuma senha salva.</p>';
        return;
    }

    vaultEntries.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'vault-item';
        
        const domain = item.service.toLowerCase().replace(/\s/g, '') + '.com';
        const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

        li.innerHTML = `
            <img src="${iconUrl}" class="service-icon" onerror="this.src='https://cdn-icons-png.flaticon.com/512/2889/2889676.png'">
            <div class="vault-info">
                <p style="color: white;"><strong>${item.service.toUpperCase()}</strong></p>
                <small>${item.user}</small>
            </div>
            <div class="vault-actions">
                <button onclick="revealVaultPass(${index})" title="Ver"><i class="fa-solid fa-eye"></i></button>
                <button onclick="handleVaultCopy(${index})" title="Copiar"><i class="fa-solid fa-copy"></i></button>
                <button onclick="deleteFromVault(${index})" title="Excluir"><i class="fa-solid fa-trash"></i></button>
            </div>`;
        list.appendChild(li);
    });
}

window.revealVaultPass = (index) => {
    const check = prompt("Senha Mestra para visualizar:");
    if (check === MASTER_KEY) {
        try {
            const bytes = CryptoJS.AES.decrypt(vaultEntries[index].pass, MASTER_KEY);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            alert(`Senha (${vaultEntries[index].service}): ${originalText}`);
        } catch(e) { message("Erro ao descriptografar!", "danger"); }
    } else { message("Senha incorreta!", "danger"); }
};

window.handleVaultCopy = (index) => {
    try {
        const bytes = CryptoJS.AES.decrypt(vaultEntries[index].pass, MASTER_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        navigator.clipboard.writeText(originalText);
        message("Copiado do cofre!");
    } catch(e) { message("Erro ao copiar!", "danger"); }
};

window.deleteFromVault = (index) => {
    if (confirm('Deseja excluir esta senha permanentemente?')) {
        const serviceName = vaultEntries[index].service;
        vaultEntries.splice(index, 1);
        localStorage.setItem('my_vault', JSON.stringify(vaultEntries));
        renderVault();
        message(`Senha de "${serviceName}" excluída!`, "danger");
    }
};

function resetEverything() {
    if (confirm("Apagar TUDO (incluindo cofre e senha mestra)?")) { 
        localStorage.clear(); 
        location.reload(); 
    }
}

// --- 4. EVENTOS ---

document.querySelector('#generate').addEventListener('click', () => {
    const size = Number(document.querySelector('#size').value);
    const charTypes = getChartTypes();
    if (size < 4 || size > 50 || !charTypes.length) return message("Verifique as opções!", "danger");

    realPassword = generatePassword(size, charTypes);
    document.querySelector('#password_container').classList.add('show');
    document.querySelector('#password').textContent = '*'.repeat(realPassword.length);
    isPasswordVisible = false;
    document.querySelector('#toggle_visibility i').className = 'fa-solid fa-eye';
    
    updateStrength(realPassword);
    updateHistory(realPassword);
});

document.querySelector('#toggle_visibility').onclick = () => {
    if (!realPassword) return;
    const span = document.querySelector('#password');
    const icon = document.querySelector('#toggle_visibility i');
    isPasswordVisible = !isPasswordVisible;
    span.textContent = isPasswordVisible ? realPassword : '*'.repeat(realPassword.length);
    icon.className = isPasswordVisible ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
};

document.querySelector('#copy').onclick = () => {
    if (!realPassword) return;
    navigator.clipboard.writeText(realPassword);
    message('Senha copiada!');
};

document.querySelector('#save_password_btn').onclick = () => {
    const service = document.querySelector('#service_name').value;
    const user = document.querySelector('#service_user').value;
    if (!realPassword || !service) return message("Gere uma senha e digite o serviço!", "danger");
    
    const encrypted = CryptoJS.AES.encrypt(realPassword, MASTER_KEY).toString();
    vaultEntries.push({ service, user, pass: encrypted });
    localStorage.setItem('my_vault', JSON.stringify(vaultEntries));
    
    document.querySelector('#service_name').value = '';
    document.querySelector('#service_user').value = '';
    
    message("Salvo no cofre!", "success");
    if (isVaultUnlocked) renderVault();
};

document.querySelector('#clear_btn').onclick = () => {
    realPassword = '';
    document.querySelector('#password_container').classList.remove('show');
    document.querySelector('#size').value = '12';
    message("Limpo!");
};

// Iniciar
setupMasterKey();