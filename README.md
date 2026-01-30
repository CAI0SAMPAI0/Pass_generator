# Pass_generator
Gerador de Senhas Pro
Gerador de senhas aleatórias de alta segurança desenvolvido como uma aplicação progressiva (PWA) e desktop (Electron). O sistema prioriza a privacidade do usuário, realizando todo o processamento localmente no dispositivo.

Funcionalidades Principais
Customização de Parâmetros: Ajuste de comprimento entre 4 e 50 caracteres.

Seleção de Caracteres: Inclusão opcional de letras maiúsculas, minúsculas, numerais e caracteres especiais.

Análise de Entropia: Medidor de força da senha baseado na complexidade dos caracteres selecionados.

Histórico de Sessão: Registro das últimas 5 senhas geradas com controles individuais de visualização e cópia.

Operação Offline: Funcionamento integral sem necessidade de conexão com a internet.

Especificações Técnicas
Frontend: HTML5, CSS3 (Flexbox e variáveis nativas) e JavaScript Vanilla.

Desktop Engine: Electron Framework para encapsulamento em executável nativo.

Distribuição Mobile: PWA (Progressive Web App) com Service Workers para cache e persistência.

Interface de Ícones: FontAwesome.

Notificações: Toastify JS para confirmações de ações em interface.

Instalação e Uso
Aplicação Desktop (Windows)
Acesse a aba de Releases deste repositório.

Faça o download do arquivo GeradorDeSenhas.exe.

Execute o arquivo para iniciar a aplicação.

Instalação Mobile (PWA)
Acesse a URL do projeto através de um navegador móvel.

No menu do navegador, selecione a opção Instalar Aplicativo ou Adicionar à Tela de Início.

Para clonar o repositório e executar o ambiente de desenvolvimento:

Bash
# Clonar o repositório
git clone https://github.com/usuario/repositorio.git

# Instalar dependências do projeto
npm install

# Iniciar a aplicação em modo de desenvolvimento (Electron)
npm start
Segurança e Privacidade
Este software foi projetado para garantir que nenhum dado saia do ambiente local. Não existem integrações com APIs externas ou bancos de dados remotos para o armazenamento das senhas geradas. O histórico é mantido apenas em memória durante a execução da aplicação.