// variáveis senhas
let realPassword = '';
let isPasswordVisible = false;

// Function to get the selected character types
function getChartTypes() {
    // Retrieve the checked status of each character type checkbox
    const uppercase = document.querySelector('#include_uppercase').checked;
    const lowercase = document.querySelector('#include_lowercase').checked;
    const number = document.querySelector('#include_number').checked;
    const specialCharacter = document.querySelector('#include_special_character').checked;

    // Initialize an empty array to store selected character types
    const charTypes = [];

    // If uppercase is selected, add uppercase characters to charTypes array
    if (uppercase) {
        charTypes.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    }

    // If lowercase is selected, add lowercase characters to charTypes array
    if (lowercase) {
        charTypes.push('abcdefghijklmnopqrstuvwxyz');
    }

    // If number is selected, add numeric characters to charTypes array
    if (number) {
        charTypes.push('0123456789');
    }

    // If specialCharacter is selected, add special characters to charTypes array
    if (specialCharacter) {
        charTypes.push('!@#$%&*()_-+={}[]|\\/?><:;\'.,');
    }

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

