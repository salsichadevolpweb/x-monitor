# X Monitor

Projeto de teste para registrar acessos ao seu próprio site/link.

## O que ele faz

- Backend Node.js + Express.
- Salva acessos em `backend/visits.json`.
- Painel React/Vite.
- Conta acessos totais e de hoje.
- Mostra horário, origem, navegador e página.
- A rota `/r` registra o clique e depois redireciona.

## O que ele NÃO faz

O X não fornece uma lista de pessoas que simplesmente abriram seu perfil. Portanto, este projeto não consegue descobrir o @ de alguém só porque essa pessoa visitou seu perfil.

Se alguém clicar no seu link, o servidor consegue registrar o clique. Isso não significa que o servidor saiba automaticamente qual conta do X clicou.

## Como iniciar

### 1. Backend

Abra um terminal:

```powershell
cd backend
npm install
npm start
```

Deixe esse terminal aberto.

### 2. Frontend

Abra OUTRO terminal:

```powershell
cd frontend
npm install
npm run dev
```

O Vite vai mostrar um endereço local, normalmente:

```text
http://localhost:5173
```

Abra esse endereço no navegador.

## Testar o rastreador

Com o backend ligado, abra:

```text
http://localhost:3000/r
```

Ele registra a visita e redireciona para o X.

Depois volte ao painel do frontend e veja o registro.

## Colocar o link no seu X

Quando você hospedar o backend, poderá usar algo como:

```text
https://SEU-DOMINIO.com/r
```

na sua bio.

IMPORTANTE: para funcionar fora do seu PC, o backend precisa estar hospedado em um servidor público. O `localhost` só funciona no seu próprio computador.

## Próxima etapa

Podemos adicionar autenticação no painel, gráficos, filtros e integração com os dados que a API oficial do X realmente disponibiliza.
