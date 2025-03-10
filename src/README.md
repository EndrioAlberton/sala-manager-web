# Sistema de Gerenciamento de Salas

Uma aplicação web para gerenciar salas de aula, desenvolvida com React, TypeScript e Material-UI.

## Funcionalidades

### 1. Visualização de Salas
- Lista de salas em formato de cards
- Separação entre salas ocupadas e disponíveis
- Informações detalhadas de cada sala:
  - Número da sala
  - Prédio
  - Andar
  - Capacidade máxima
  - Número de mesas e cadeiras
  - Quantidade de computadores e projetores
  - Status de ocupação

### 2. Gerenciamento de Salas
- **Adicionar Nova Sala**
  - Formulário com validação de dados
  - Campos obrigatórios e opcionais
  - Validação de limites mínimos e máximos

- **Editar Sala**
  - Preenchimento automático dos dados da sala
  - Validação de dados atualizados
  - Não é possível editar salas ocupadas

- **Deletar Sala**
  - Confirmação antes de deletar
  - Não é possível deletar salas ocupadas
  - Feedback visual do status da operação

### 3. Busca e Filtros
- **Para Salas Ocupadas**
  - Busca por número da sala
  - Busca por nome do professor
  - Busca por disciplina

- **Para Salas Disponíveis**
  - Busca por número da sala
  - Filtro por capacidade mínima de alunos
  - Filtro por disponibilidade de projetor

### 4. Validações
- Todos os campos são obrigatórios exceto:
  - Número de computadores
  - Número de projetores
- Limites de caracteres para campos de texto
- Limites mínimos e máximos para campos numéricos
- Validação de dados antes de enviar para a API

### 5. Interface do Usuário
- Design responsivo
- Feedback visual para ações do usuário
- Tooltips informativos
- Mensagens de erro e sucesso
- Indicadores de carregamento

## Tecnologias Utilizadas

- React
- TypeScript
- Material-UI
- React Hook Form
- Zod (validação de dados)
- Axios (requisições HTTP)

## Requisitos do Sistema

- Node.js
- NPM ou Yarn
- Navegador moderno com suporte a JavaScript ES6+

## Instalação

1. Clone o repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

4. Acesse a aplicação em `http://localhost:5173`

## Configuração da API

A aplicação espera que a API esteja rodando em `http://localhost:3000`. Certifique-se de que:

1. A API está rodando
2. O CORS está configurado para aceitar requisições de `http://localhost:5173`
3. Os endpoints necessários estão disponíveis
