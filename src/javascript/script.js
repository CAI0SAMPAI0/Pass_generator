// variáveis senhas
let realPassword = '';
let isPasswordVisible = false;
let history = [];

// Function to get the selected character types
function getChartTypes() {
    // Retrieve the checked status of each character type checkbox
    const uppercase = document.querySelector('#include_uppercase').checked;
    const lowercase = document.querySelector('#include_lowercase').checked;
    const number = document.querySelector('#include_number').checked;
    const specialCharacter = document.querySelector('#include_special_character').checked;

    // Initialize an empty array to store selected character types
    const charTypes = [];

    if (uppercase) charTypes.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (lowercase) charTypes.push('abcdefghijklmnopqrstuvwxyz');
    if (number) charTypes.push('0123456789');
    if (specialCharacter) charTypes.push('!@#$%&*()_-+={}[]|\\/?><:;\'.,');

    // Return the array of selected character types
    return charTypes;
}

// Function to get the desired password size
function getPasswordSize() {
    const sizeInput = document.querySelector('#size');
    const size = Number(sizeInput.value);

    if (isNaN(size) || size < 4 || size > 50) {
        message('Tamanho inválido, digite um número entre 4 e 50!', 'danger');
        return null;
    }

    return size;
}

// function medidor de senha
function updateStrength(password) {
    const bar = document.querySelector('#strength_bar');
    const text = document.querySelector('#strength_text');
    const container = document.querySelector('#strength_container');

    if (!container) return; // Proteção caso o elemento não exista
    container.style.display = 'flex';

    let score = 0;
    if (password.length > 10) score++;
    if (password.length > 15) score++;
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
    text.textContent = result.label;
}

// function update history
function updateHistory(pw) {
    history.unshift(pw);
    if (history.length > 10) history.pop();

    const list = document.querySelector('#history_list');
    if (!list) return;

    list.innerHTML = ''; // limpa a lista atual
    history.forEach(passData => {
        const li = document.createElement('li');
        let isItemVisible = false;

        // 1. O texto da senha (inicia mascarado)
        const passSpan = document.createElement('span');
        passSpan.className = 'history-pass-text';
        passSpan.textContent = '*'.repeat(passData.length);

        // 2. Container para os botões
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'history-actions';

        // Botão Copiar
        const copyBtn = document.createElement('button');
        copyBtn.className = 'history-btn';
        copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';
        copyBtn.onclick = function () {
            navigator.clipboard.writeText(passData);
            message('Senha do histórico copiada!', 'success');
        };

        // Botão Ver/Esconder
        const viewBtn = document.createElement('button');
        viewBtn.className = 'history-btn';
        viewBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
        viewBtn.onclick = function () {
            const icon = viewBtn.querySelector('i');
            if (isItemVisible) {
                passSpan.textContent = '*'.repeat(passData.length);
                icon.classList.replace('fa-eye-slash', 'fa-eye');
                isItemVisible = false;
            } else {
                passSpan.textContent = passData;
                icon.classList.replace('fa-eye', 'fa-eye-slash');
                isItemVisible = true;
            }
        };

        // Monta o item da lista
        actionsDiv.appendChild(copyBtn);
        actionsDiv.appendChild(viewBtn);
        li.appendChild(passSpan);
        li.appendChild(actionsDiv);
        list.appendChild(li);
    });
}

// Function to generate a password with specified size and character types
function generatePassword(size, charTypes) {
    let passwordGenerated = '';
    // Concatenate all selected character types into a single string
    const selectedChars = charTypes.join('');

    // Ensure at least one character from each selected character type
    charTypes.forEach(type => {
        passwordGenerated += type[Math.floor(Math.random() * type.length)];
    });

    // Generate remaining characters randomly from the selected character types
    while (passwordGenerated.length < size) {
        passwordGenerated += selectedChars[Math.floor(Math.random() * selectedChars.length)];
    }

    // Shuffle the password string to enhance randomness
    passwordGenerated = passwordGenerated.split('').sort(() => Math.random() - 0.5).join('');

    // Return the generated password
    return passwordGenerated;
}

// Function to display a message using Toastify library
function message(text, status = 'success') {
    Toastify({
        text: text,
        duration: 2000,
        style: {
            background: status === 'success' ? '#84cc16' : '#dc2626',
            boxShadow: 'none'
        }
    }).showToast();
}

// Event listener for the "Generate" button
document.querySelector('#generate').addEventListener('click', function () {
    // Get the desired password size
    const size = getPasswordSize();
    // Get the selected character types
    const charTypes = getChartTypes();

    // If size is not valid, return and do not proceed further
    if (!size) {
        return;
    }

    // If no character type is selected, display an error message and return
    if (!charTypes.length) {
        message('Selecione pelo menos um tipo de caractere!', 'danger');
        return;
    }
    // Generate the password with the specified size and character types
    const passwordGenerated = generatePassword(size, charTypes);
    realPassword = passwordGenerated;
    isPasswordVisible = false;
    // Remove e adiciona a classe para reiniciar a animação do CSS
    const container = document.querySelector('#password_container');
    container.classList.remove('show');
    void container.offsetWidth;
    container.classList.add('show');

    document.querySelector('#password').textContent =
        '*'.repeat(realPassword.length);

    // Reseta o ícone do olho para o estado "fechado" (caso aberto)
    const eyeIcon = document.querySelector('#toggle_visibility i');
    eyeIcon.classList.remove('fa-eye-slash');
    eyeIcon.classList.add('fa-eye');

    // Atualiza força e histórico
    updateStrength(realPassword);
    updateHistory(realPassword);
});

// Botão Limpar
document.querySelector('#clear_btn')?.addEventListener('click', function () {
    resetPasswordDisplay();
    // Reseta medidor
    const strengthContainer = document.querySelector('#strength_container');
    if (strengthContainer) strengthContainer.style.display = 'none';

    // Reseta checkboxes e inputs
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelector('#size').value = '';

    // Reseta histórico visual
    const list = document.querySelector('#history_list');
    if (list) list.innerHTML = '';
    history = [];

    message('Campos limpos!', 'success');
});

function resetPasswordDisplay() {
    realPassword = '';
    isPasswordVisible = false;
    document.querySelector('#password_container').classList.remove('show');

}

// Event listener for the "Copy" button
document.querySelector('#copy').addEventListener('click', function () {
    if (!realPassword) return;
    // Copy the generated password to the clipboard
    navigator.clipboard.writeText(realPassword);
    message('Senha copiada com sucesso!', 'success');
});

// Event listener for visibility toggle
document.querySelector('#toggle_visibility').addEventListener('click', function () {
    if (!realPassword) return;

    const passwordSpan = document.querySelector('#password');
    const icon = this.querySelector('i');

    if (isPasswordVisible) {
        passwordSpan.textContent = '*'.repeat(realPassword.length);
        icon.classList.replace('fa-eye-slash', 'fa-eye');
        isPasswordVisible = false;
    } else {
        passwordSpan.textContent = realPassword;
        icon.classList.replace('fa-eye', 'fa-eye-slash');
        isPasswordVisible = true;
    }
});

