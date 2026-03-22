# 🔐 Pass Generator — Gerador de Senhas Seguras

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python&logoColor=white)](https://www.python.org/)
[![Security](https://img.shields.io/badge/Security-Cryptography-red?logo=letsencrypt&logoColor=white)](https://pypi.org/project/cryptography/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**Gerador de senhas fortes e aleatórias com opções personalizáveis de complexidade e segurança.**

[Demo](#-uso) · [Instalação](#-instalação) · [Documentação](#-funcionalidades)

</div>

---

## 📋 Sobre o Projeto

Ferramenta CLI (Command Line Interface) e GUI (Graphical User Interface) para gerar senhas criptograficamente seguras com controle total sobre comprimento, caracteres permitidos e padrões de complexidade.

---

## 🎯 Problema que Resolve

### Riscos de Senhas Fracas

**Vulnerabilidades Comuns:**
- ❌ **Senhas Previsíveis**: "123456", "senha123", "nome+ano"
- ❌ **Reutilização**: Mesma senha em múltiplos serviços
- ❌ **Fácil Brute Force**: Senhas curtas (<8 caracteres)
- ❌ **Vazamentos**: Senhas comuns em databases vazadas
- ❌ **Social Engineering**: Senhas baseadas em informações públicas

**Impactos:**
- 🔓 81% dos breaches são causados por senhas fracas/roubadas
- 💰 Custo médio de um breach: $4.35 milhões (IBM, 2022)
- ⚠️ 73% das pessoas reutilizam senhas em múltiplos sites

### Solução Automatizada

✅ **Geração Aleatória** - Impossível adivinhar  
✅ **Criptografia Forte** - Usa `secrets` module (não `random`)  
✅ **Customização Total** - Controle sobre complexidade  
✅ **Bulk Generation** - Crie múltiplas senhas de uma vez  
✅ **Validação Integrada** - Verifica força automaticamente  
✅ **Zero Armazenamento** - Senhas não são salvas no código  

---

## ✨ Funcionalidades

### 🔒 Geração Segura

- **Módulo `secrets`**: Geração criptograficamente segura (CSPRNG)
- **Entropia Máxima**: Pool diversificado de caracteres
- **Anti-Padrões**: Evita sequências óbvias (abc, 123)

### ⚙️ Opções Configuráveis

```bash
# Comprimento personalizável
--length 16          # Padrão: 12

# Tipos de caracteres
--upper              # Maiúsculas (A-Z)
--lower              # Minúsculas (a-z)
--digits             # Números (0-9)
--special            # Símbolos (!@#$%^&*)

# Complexidade presets
--preset weak        # 8 chars, letters+numbers
--preset medium      # 12 chars, letters+numbers+symbols
--preset strong      # 16 chars, tudo habilitado
--preset paranoid    # 24 chars, complexidade máxima
```

### 📊 Validador de Força

- Análise de entropia (bits)
- Score de complexidade (0-100)
- Verificação contra dicionário de senhas comuns
- Sugestões de melhoria

### 🎨 Interface

**CLI Mode:**
```bash
python pass_generator.py --length 16 --all
```

**GUI Mode:**
- Interface gráfica com Tkinter
- Slider de comprimento
- Checkboxes para opções
- Preview de força em tempo real
- Copy to clipboard

---

## 🛠️ Stack Tecnológica

| Componente | Tecnologia | Função |
|-----------|-----------|---------|
| **Core** | Python 3.8+ | Lógica principal |
| **Crypto** | secrets module | CSPRNG seguro |
| **CLI** | argparse | Interface linha de comando |
| **GUI** | Tkinter | Interface gráfica |
| **Validation** | zxcvbn-python | Análise de força |

---

## 🚀 Instalação

### Pré-requisitos

- Python 3.8 ou superior

### Setup

```bash
# Clone o repositório
git clone https://github.com/CAI0SAMPAI0/Pass_generator.git
cd Pass_generator

# (Opcional) Crie ambiente virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instale dependências
pip install -r requirements.txt
```

### Dependências

```txt
zxcvbn-python>=4.4.24
pyperclip>=1.8.2         # Para copy to clipboard
```

---

## 📖 Uso

### Modo CLI

**Básico:**
```bash
# Senha padrão (12 chars, mixed)
python pass_generator.py

# Output: Kp9#mL2$nQ8v
```

**Customizado:**
```bash
# 20 caracteres, tudo habilitado
python pass_generator.py --length 20 --all

# Apenas letras e números
python pass_generator.py --upper --lower --digits

# 5 senhas de uma vez
python pass_generator.py --count 5 --strong
```

**Presets:**
```bash
# Fraca (uso não recomendado)
python pass_generator.py --preset weak

# Média (email secundário)
python pass_generator.py --preset medium

# Forte (contas importantes)
python pass_generator.py --preset strong

# Paranóica (cripto wallets, root)
python pass_generator.py --preset paranoid
```

### Modo GUI

```bash
python gui_pass_generator.py
```

**Interface:**
1. Arraste slider para comprimento desejado
2. Marque checkboxes de caracteres permitidos
3. Clique em "Gerar Senha"
4. Veja score de força (0-100)
5. Clique em "Copiar" para clipboard

---

## 🔐 Melhores Práticas

### Recomendações de Uso

**Por Tipo de Conta:**

| Serviço | Comprimento | Preset | Observações |
|---------|------------|--------|-------------|
| Redes Sociais | 12-16 | `medium` | OK reutilizar entre redes |
| Email Principal | 16+ | `strong` | NUNCA reusar |
| Banking | 16+ | `strong` | Adicionar 2FA |
| Crypto Wallets | 24+ | `paranoid` | Backup offline |
| Wi-Fi | 16+ | `strong` | WPA3 preferível |
| Servidores/Root | 24+ | `paranoid` | Trocar periodicamente |

### Segurança Adicional

```bash
# ✅ BOM: Gerar e salvar em password manager
python pass_generator.py --strong > senha_temp.txt
# Copie para 1Password/Bitwarden, então:
shred -u senha_temp.txt  # Linux
# ou
del /P senha_temp.txt    # Windows

# ❌ RUIM: Armazenar em plaintext
python pass_generator.py --all > senhas.txt  # NÃO FAÇA ISSO
```

---

## 📊 Análise de Força

### Entropia (bits)

```
Fraca:     < 40 bits   ⚠️  Crackable em horas
Média:     40-60 bits  ⚡  Crackable em dias/semanas  
Forte:     60-80 bits  ✅  Crackable em anos
Paranóica: > 80 bits   🔒  Crackable em séculos
```

### Exemplos

```bash
# Senha fraca
"senha123"         → 18 bits, Score: 10/100 ❌

# Senha média
"K3lp@22Mno"       → 51 bits, Score: 50/100 ⚡

# Senha forte
"Kp9#mL2$nQ8vXr3!" → 72 bits, Score: 85/100 ✅

# Senha paranóica
"7&Km@9pL#2nQ$8vX3r!5tY^4uI" → 112 bits, Score: 100/100 🔒
```

---

## 📁 Estrutura do Projeto

```
Pass_generator/
├── pass_generator.py        # CLI principal
├── gui_pass_generator.py    # Interface gráfica
├── modules/
│   ├── generator.py         # Lógica de geração
│   ├── validator.py         # Análise de força
│   └── utils.py             # Funções auxiliares
├── data/
│   └── common_passwords.txt # Database senhas comuns
├── tests/
│   └── test_generator.py    # Testes unitários
├── requirements.txt
└── README.md
```

---

## 🧪 Testes

```bash
# Execute testes unitários
python -m pytest tests/

# Teste de força específico
python -c "from modules.validator import check_strength; print(check_strength('SuaSenhaAqui'))"
```

---

## 🔒 Segurança

### O Que Fazemos

✅ Uso de `secrets` (CSPRNG) ao invés de `random`  
✅ Senhas não são logadas ou armazenadas  
✅ Sem transmissão de dados pela rede  
✅ Código open-source auditável  

### O Que NÃO Fazemos

❌ Armazenar senhas geradas  
❌ Enviar dados para servidores externos  
❌ Usar geradores pseudo-aleatórios fracos  
❌ Incluir backdoors ou telemetria  

---

## 🗺️ Roadmap

- [ ] Geração de passphrases (método Diceware)
- [ ] Integração com password managers (API 1Password/Bitwarden)
- [ ] App mobile (React Native / Flutter)
- [ ] Check contra API Have I Been Pwned
- [ ] Geração baseada em padrões (leet speak, etc.)
- [ ] Export seguro (encrypted PDF)

---

## 📄 Licença

MIT © 2025 Pass Generator - Use livremente, com responsabilidade.

---

## 👨‍💻 Autor

**Caio Sampaio** - [@CAI0SAMPAI0](https://github.com/CAI0SAMPAI0)

---

## 🔗 Recursos Relacionados

- [Have I Been Pwned](https://haveibeenpwned.com/) - Verifique se senhas vazaram
- [How Secure Is My Password](https://howsecureismypassword.net/) - Teste força
- [Bitwarden](https://bitwarden.com/) - Password manager open-source
- [OWASP Password Guide](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

<div align="center">

**🔐 Mantenha-se seguro!**

Made with ❤️ and 🔒 in Brazil

</div>
