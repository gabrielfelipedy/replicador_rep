<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- PROJECT LOGO -->
<br />
<div align="center">
<!--   <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

  <h3 align="center">REPLICADOR REP</h3>

  <p align="center">
    Um projeto para replicar registros de ponto de um relógio de ponto em um banco de dados qualquer
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template">View Demo</a>
    &middot;
    <a href="https://github.com/othneildrew/Best-README-Template/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/othneildrew/Best-README-Template/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Sumário</summary>
  <ol>
    <li>
      <a href="#about-the-project">Sobre o Projeto</a>
      <ul>
        <li><a href="#built-with">Feito com</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Iniciando</a>
      <ul>
        <li><a href="#prerequisites">Pré-requisitos</a></li>
        <li><a href="#installation">Instalação</a></li>
      </ul>
    </li>
    <li><a href="#testes">Testes</a></li>
    <li><a href="#deploying">Deploying</a></li>
    <li><a href="#usage">Uso</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Como contribuir</a></li>
    <li><a href="#license">Licença</a></li>
    <li><a href="#contact">Contato</a></li>
    <li><a href="#acknowledgments">Agradecimentos</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## Sobre o projeto

O projeto foi pensando visando integrar o relógio de control Control iD a uma base de dados privada. Apesar do relógio já possuir uma base própria chamada AFD, esta é útil para fins de registro de logs, mas não representa ótima estrutura para processar registros de ponto e armazená-los. Assim, esse projeto nasceu para solucionar esse problema.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Tecnologias usadas no projeto:

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/-Vitest-252529?style=for-the-badge&logo=vitest&logoColor=FCC72B)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Iniciando

Uma pequena explicação e mini-tutorial de como rodar o projeto

### Pré-requisitos

Recomenda-se a versão 22.14 do NodeJS ou superior

### Installation

1. Clonar o repositório
   ```sh
   git clone https://github.com/gabrielfelipedy/replicador_rep.git
   ```
2. Install NPM packages
   ```sh
   npm i
   ```
3. Copiar o arquivo `.env.sample` para um arquivo `.env` inserindo a string de conexão do seu banco de dados
   ```js
   NODE_TLS_REJECT_UNAUTHORIZED='0'
   POSTGRES_URL='sua_string_de_conexao'
   ```
4. Configurar o arquivo `relogios.json` colocando cada relógio, seu IP, credenciais e um ID arbitrário
   ```js
   [
      {
        "id": 1,
        "ip": "192.168.0.1", // IP Exemplo
        "user": "admin", // Credenciais exemplo
        "password": "admin"
      },
      {
        "id": 2,
        "ip": "192.168.0.2", // IP Exemplo
        "user": "admin", // Credenciais exemplo
        "password": "admin"
      }
   ]
   ```

5. Configurar o arquivo `nsr.json` colocando o NSR inicial correspondente a cada relógio (se for a primeira vez executando, preencher com 0, 0):
   ```js
   [
     {
       "clock_id": 1,
       "last_nsr": 0
     },
     {
       "clock_id": 2,
       "last_nsr": 0
     }
   ]
   ```

A partir daqui é só rodar com `npm run dev`.

## Testes

Para rodar os tests unitários use `npm run test`. Para testes de cobertura rode `npm run coverage`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Uso

O software é script-like. Para deploy em produção é recomendado criar uma build e inserir em um agendador de tarefas como cron-tab em servidores linux ou utilizado uma solução como [PM2](https://pm2.keymetrics.io/) que automatiza esse processso.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contruibuindo

Se você possui uma sugestão que poderia tornar esse projeto ainda melhor, faça um fork do projeto e abra um pull request. Ou você pode abrir uma issue com a tag `sugestões`. Não esqueça de dar uma estrela no projeto. Muito obrigado!

### Passo-a-passo:

1. Crie um Fork
2. Crie uma branch com a sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça um commit das suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Push para sua branch (`git push origin feature/AmazingFeature`)
5. Abra o pull request


<!-- CONTACT -->
## Contato dos desenvolvedores

Gabriel Felipe - [@gabrielfelipedy](https://twitter.com/gabrielfelipedy) - gabriel.felipe.dy@gmail.com <br>
Bruno Prestes - [@brunoprestesap](https://github.com/brunoprestesap) - brunoprestesap@gmail.com

Link do projeto: [https://github.com/gabrielfelipedy/user_sincronyzer](https://github.com/gabrielfelipedy/user_sincronyzer)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[devto-shield]: https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=dev.to&logoColor=white
[devto-url]: https://dev.to/gabrielfelipe
[instagram-shield]: https://img.shields.io/badge/Instagram-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white
[instagram-url]: https://instagram.com/gabrielfelipedy
[facebook-shield]: https://img.shields.io/badge/Facebook-%231877F2.svg?style=for-the-badge&logo=Facebook&logoColor=white
[facebook-url]: https://facebook.com/gabrielfelipedy
