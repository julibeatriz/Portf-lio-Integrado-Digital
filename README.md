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
Bcrypt para criptografia de senhas por hash
e controle de permissões para proteger as
funcionalidades administrativas.

A consulta dos registros é pública, enquanto
as operações de cadastro, edição e exclusão
são restritas ao administrador autenticado.

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

### Backend

Acesse a pasta backend e instale as dependências:

    cd backend
    npm install

Configure o arquivo .env com as variáveis de
ambiente necessárias:

    ADMIN_EMAIL=seu_email
    ADMIN_SENHA=sua_senha
    JWT_SECRET=sua_chave_secreta

Execute o servidor utilizando o script definido
no package.json.

A API utiliza o endereço:

    http://localhost:3333/api

### Frontend

Em outro terminal, acesse a pasta frontend:

    cd frontend
    npm install
    npm run dev

Acesse o endereço disponibilizado pelo Vite,
normalmente:

    http://localhost:5173

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

### Testes do frontend

- Renderização de componentes;
- Navegação entre páginas;
- Formulários de cadastro;
- Autenticação;
- Gerenciamento de áreas;
- Gerenciamento de registros.

Para executar os testes, utilize o comando
abaixo na pasta correspondente:

    npm test

## Status do projeto

Desenvolvimento concluído.

O backend e o frontend foram implementados
e integrados, permitindo o gerenciamento e
a visualização dos registros acadêmicos.

## Autoria

Projeto desenvolvido por Júlia Beatriz.

Curso Técnico em Informática para Internet.

Projeto acadêmico integrado SESI e SENAI.