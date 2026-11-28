# Portfólio Integrado Digital

## Sobre o projeto

O Portfólio Integrado Digital é uma aplicação web
desenvolvida para organizar e apresentar atividades,
projetos, trabalhos e aprendizados adquiridos durante
a formação no SESI e SENAI.

O sistema possui uma área pública para visualização
dos registros acadêmicos e uma área administrativa
para gerenciamento dos conteúdos.

## Objetivo

Centralizar os registros acadêmicos em um ambiente
digital organizado, facilitando a visualização e o
acompanhamento da trajetória escolar e profissional.

## Tecnologias utilizadas

### Backend

- Node.js
- Express
- Sequelize
- SQLite
- JWT
- Bcrypt
- Multer

### Frontend

- React
- JavaScript
- HTML
- CSS
- React Router DOM
- Vite

### Testes

- Vitest
- Supertest
- React Testing Library

### Versionamento

- Git
- GitHub

## Funcionalidades

### Área pública

- Página inicial com apresentação pessoal;
- Página Quem Sou Eu;
- Visualização do portfólio do SESI e SENAI;
- Consulta das áreas de conhecimento;
- Visualização dos registros acadêmicos;
- Organização por seção e bimestre;
- Visualização de imagens, documentos e vídeos;
- Acesso aos links das evidências.

### Área administrativa

- Autenticação do administrador;
- Cadastro, edição e exclusão de áreas;
- Cadastro, edição e exclusão de registros;
- Pesquisa de registros acadêmicos;
- Upload de imagens, documentos e vídeos;
- Cadastro de links de evidências;
- Controle de permissões de acesso.

## Organização do portfólio

O portfólio está dividido entre a formação escolar
do SESI e a formação profissional do SENAI.

Os registros acadêmicos são organizados nas
seguintes seções:

- Fundamentos Teóricos;
- Participação em Sala de Aula;
- Projetos e Trabalhos Desenvolvidos;
- Reflexão Crítica;
- Conexões Interdisciplinares;
- Aprendizados da Escola para a Vida.

Os registros do SESI possuem organização por
bimestre nas seções bimestrais. Os registros do
SENAI são organizados por área de conhecimento
e seção.

## Banco de dados

O sistema utiliza SQLite como banco de dados e
Sequelize para realizar a comunicação entre
a aplicação e o banco.

As principais entidades são:

- Usuários;
- Áreas de conhecimento;
- Registros acadêmicos.

## Segurança

O sistema utiliza JWT para autenticação,
Bcrypt para proteção de senhas por meio de hash
e controle de permissões para proteger as
funcionalidades administrativas.

A consulta dos registros é pública, enquanto
as operações de cadastro, edição e exclusão
são restritas ao administrador autenticado.

As credenciais e a chave de autenticação são
armazenadas em variáveis de ambiente, evitando
a exposição dessas informações no código-fonte.

## Evidências

O sistema permite adicionar evidências nas
seções de Participação em Sala de Aula e
Projetos e Trabalhos Desenvolvidos.

Os formatos permitidos são:

- Imagens: JPG, JPEG, PNG e WEBP;
- Documentos: PDF, DOCX, PPTX e XLSX;
- Vídeos: MP4 e WEBM;
- Links externos: HTTP e HTTPS.

Limites:

- Até 10 arquivos por envio;
- Imagens e documentos de até 20 MB por arquivo;
- Vídeos de até 100 MB por arquivo;
- Até 10 links por registro.

## Instalação e execução

### Pré-requisitos

- Node.js;
- NPM;
- Git.

### Clonando o repositório

Clone o repositório e acesse a pasta do projeto:

```bash
git clone https://github.com/julibeatriz/Portf-lio-Integrado-Digital.git
cd Portf-lio-Integrado-Digital
```

### Backend

Acesse a pasta backend e instale as dependências:

```bash
cd backend
npm install
```

Crie um arquivo .env na pasta backend e configure
as seguintes variáveis de ambiente:

```env
ADMIN_EMAIL=seu_email
ADMIN_SENHA=sua_senha
JWT_SECRET=sua_chave_secreta
```

Substitua os valores de exemplo por suas próprias
credenciais e utilize uma chave secreta forte.

Crie o usuário administrador:

```bash
node src/Admin.js
```

Inicie o servidor:

```bash
npm run dev
```

O banco de dados SQLite será inicializado
automaticamente pelo Sequelize, conforme a
configuração da aplicação.

A API estará disponível no endereço:

```text
http://localhost:3333/api
```

### Frontend

Abra outro terminal na pasta raiz do projeto,
acesse a pasta frontend e instale as dependências:

```bash
cd frontend
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

Acesse o endereço disponibilizado pelo Vite,
normalmente:

```text
http://localhost:5173
```

Mantenha o backend e o frontend em execução
simultaneamente para utilizar o sistema.

### Acesso administrativo

Acesse a página de login e utilize o e-mail
e a senha definidos no arquivo .env durante
a criação do administrador.

Após a autenticação, será possível cadastrar,
editar e excluir áreas de conhecimento e
registros acadêmicos.

Para começar a preencher o portfólio, cadastre
primeiramente as áreas de conhecimento e,
em seguida, os registros acadêmicos.

### Observações sobre a instalação

As pastas node_modules não estão incluídas
no repositório, pois as dependências são
instaladas pelo comando npm install.

O arquivo .env, o banco de dados local e
os arquivos de evidências não estão incluídos
no repositório.

Uma nova instalação será iniciada sem os
registros acadêmicos cadastrados anteriormente,
permitindo a criação de novos conteúdos pelo
administrador.

## Testes

Foram desenvolvidos testes para o backend e
frontend com o objetivo de verificar o
funcionamento das principais funcionalidades
do sistema.

### Testes do backend

- Autenticação;
- Cadastro e gerenciamento de áreas;
- Cadastro e gerenciamento de registros;
- Validação de dados;
- Controle de permissões;
- Upload de arquivos;
- Cadastro de links de evidências.

Para executar os testes do backend, acesse
a pasta correspondente:

```bash
cd backend
npm test
```

Recomenda-se realizar um backup do banco de dados
antes da execução dos testes, caso existam
registros cadastrados.

### Testes do frontend

- Renderização de componentes;
- Navegação entre páginas;
- Formulários de cadastro;
- Autenticação;
- Gerenciamento de áreas;
- Gerenciamento de registros.

Para executar os testes do frontend, acesse
a pasta correspondente:

```bash
cd frontend
npm test
```

## Status do projeto

Desenvolvimento concluído.

O backend e o frontend foram implementados
e integrados, permitindo o gerenciamento e
a visualização dos registros acadêmicos.

## Autoria

Projeto desenvolvido por Júlia Beatriz.

Curso Técnico em Informática para Internet.

Projeto acadêmico integrado SESI e SENAI.