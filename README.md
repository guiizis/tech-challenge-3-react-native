# Tech Challenge 3 - ByteBank

Aplicativo React Native com Expo Router e mock API local usando `json-server`.

## Instalar

```bash
npm install
```

## Rodar app + mock API

```bash
npm run dev:mock
```

Esse comando sobe:

- Expo app
- Mock API em `http://localhost:3000`

## Configurar Expo Go no celular

Quando estiver usando Expo Go em um celular fisico, `localhost` aponta para o proprio celular, nao para o computador. Por isso, crie um arquivo `.env.local` na raiz do projeto usando o IP da sua maquina na rede:

```env
EXPO_PUBLIC_API_MODE=mock
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000
```

Exemplo:

```env
EXPO_PUBLIC_API_MODE=mock
EXPO_PUBLIC_API_URL=http://10.60.1.17:3000
```

Para descobrir o IP no Windows:

```bash
ipconfig
```

Procure por `Endereco IPv4`.

Depois de alterar `.env.local`, reinicie o Expo:

```bash
npm run dev:mock
```

Para testar se o celular consegue acessar a API, abra no navegador do celular:

```txt
http://SEU_IP_LOCAL:3000/users
```

Se aparecer o JSON, o app tambem consegue acessar o mock.

## Scripts uteis

```bash
npm run start
npm run mock:api
npm run dev:mock
npm run lint
```

## Mock API

Arquivos:

```txt
mock-api/db.json
mock-api/server.js
```

Principais rotas:

```txt
POST /login
POST /signup
GET /users
GET /accounts
GET /cards
GET /transactions
```

Usuario inicial:

```txt
email: teste@bytebank.com
senha: teste123
```
