<h1 align="center">
    <a href="#" alt="">Chat em tempo real</a>
</h1>

<h4 align="center">
	🚧 Em produção 🚧
</h4>

<p align="center">
 <a href="#sobre-o-projeto">Sobre o projeto</a> •
 <a href="#funcionalidades">Funcionalidades</a> • 
 <a href="#layout">Layout</a> • 
 <a href="#como-executar-o-projeto">Como executar o projeto</a> • 
 <a href="#pré-requisitos">Pré-requisitos</a> •
 <a href="#rodando-o-projeto">Rodando o projeto</a> •
 <a href="#tecnologias">Tecnologias</a> 
</p>

## Sobre o projeto
Desenvolver uma aplicação web que seja capaz de funcionar como
um chat aberto, sem a necessidade de cadastro prévio de usuário
Para participar da sala como observador, o usuário precisa inserir uma
identificação nome. Ou seja um chat com variás salas e com usuarios 
se comunicando em tempo real

### Funcionalidades do projeto 

- [x] foi feita....

---
## Layout

O layout da aplicação:

<p align="center" style="display: flex; align-items: flex-start; justify-content: center;">
  <img alt="img1" title="#img1" src="./assets" width="400px">
</p>

---
## Como executar o projeto
    - Seguir o README.md primeiro pasta back-end, em seguida o README.md pasta front-end 
### Pré-requisitos
    - ter ide para codificar
    - node
    - browser ou postman
    - react

### Rodando o projeto

```bash

- Como dito acima é necessário estar primeiro com back-end ok, em seguida do front-end ok
- Cada um contém um README.md como esse explicando como fazer para colocar a sua parte do projeto e assim rodando o projeto 

```

---
## Tecnologias do projeto

As seguintes ferramentas foram usadas na construção do projeto:
 
```bash
    "react": "^18.2.0", //front-end da aplicação
    "dotenv": "^16.0.3", //lida com variavel de ambiente
    "express": "~4.18.2", //criar um servidor http
    "node": "v18.12.0", //back end da aplicação
    "nodemon": "^2.0.20", //restar a aplicação a cada mudança
    "npm": "8.19.2" //gerecia pacotes do node
    "browser" //ver as requisições
    "socket.io-client": "^4.5.4",// comunicação e montagem do chat
```




DESAFIO MP
Estamos em busca de profissionais que gostem de programar e que busquem,
diariamente, melhorar a qualidade do seu código, sempre atentos às boas
práticas de desenvolvimento de software consagradas pelo mercado.
Qualidade, aliás, é requisito inegociável, tanto do código quanto do produto
entregue em si.
Sendo assim, seja cuidadoso com seu código, observe boas práticas e
padrões de projeto na hora “desenhar” sua aplicação, pois nossa avaliação
será baseada não somente no que pode ser visto em tela ou testado via
Postman e afins, mas também em como você organiza seus arquivos, pastas,
métodos, nomeia variáveis e lida com sua base de código como um todo.
Levando em consideração os pontos descritos acima, nossa proposta é a
seguinte:
Você deve desenvolver uma aplicação web que seja capaz de funcionar como
um chat aberto (sem a necessidade de cadastro prévio de usuário);
Para participar da sala como observador, o usuário precisa inserir uma
identificação (nome ou nickname);
Ao entrar em uma sala do Chat, devem ser exibidas a lista de mensagens já
enviadas nesta sala; as mensagens deverão ser ordenadas por data de envio
e de forma crescente.Para enviar mensagens, o usuário deve completar seu
cadastro (nome, email -- chave única -- e data de nascimento) e somente
após esta ação poderá enviar “falar” no Chat;
Durante a conversa, o usuário deverá visualizar novas mensagens enviadas
e também ser alertado quando outro usuário entrar/ou sair do Chat;
O usuário pode se deslogar a qualquer momento e voltar a utilizar o Chat sem
poder enviar mensagens;
Ao sair da aplicação sem fazer logoff, o usuário permanece logado e apto a
enviar mensagens quando retornar à aplicação;
Através da API é possível visualizar todos os usuários que fizeram cadastro;
Desejável:
Criar uma estrutura onde é possível ter vários chats/salas. Quem tem o link da
sala consegue entrar e conversar seguindo as mesmas regras descritas acima
(deslogado somente pode visualizar e logado pode enviar mensagens).
Os vários chats seriam criados automaticamente quando o primeiro usuário
acessar uma url inexistente. Ou seja, cada chat representa uma url na
aplicação.
Exemplo: http://localhost:3000/ - chat principal
http://localhost:3000/nova-sala - Outro chat
Observações importantes:Esperamos uma UI simples (somos desenvolvedores, não designers), porém
elegante e responsiva; Sua API deve ser acessível/testável independente do
front-end.
Dica: Não crie um servidor para atender o seu front-end. Crie uma API.
Requisitos:
- Front-end: React
- Back-end: Node.js
Certifique-se de escrever um README claro, como se fosse para um projeto
de código aberto. Pense que, se um novo desenvolvedor for se juntar ao seu
projeto, ele deve conseguir obter as informações necessárias para rodá-lo e
entendê-lo (o código) através do README.
Quer nos agradar? Escreva testes de unidade para seus componentes e
métodos.
Obrigado e boa sorte!
Como entregar?
Publique o código-fonte no Github, BitBucket ou Gitlab.