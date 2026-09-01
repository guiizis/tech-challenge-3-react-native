# Tech Challenge 3 - ByteBank

Aplicativo React Native com Expo Router e mock API local usando `json-server`.

## Instalar

```bash
npm install
```

## Configurar variáveis de ambiente

Copie o `.env.example` para `.env.local` e preencha os valores:

```bash
cp .env.example .env.local
```

Preencha `EXPO_PUBLIC_API_MODE`/`EXPO_PUBLIC_API_URL` (veja a seção [Configurar Expo Go no celular](#configurar-expo-go-no-celular) para o valor de `EXPO_PUBLIC_API_URL`) e as chaves do Firebase (usadas pelo Storage, em [src/config/firebase.ts](src/config/firebase.ts)):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Esses valores ficam em **Firebase Console > Configurações do projeto > Geral > Seus apps > Configuração do SDK** (crie um app Web se ainda não existir). Depois de salvar o `.env.local`, reinicie o Expo para as variáveis serem carregadas.

## Rodar app + mock API

```bash
npm run dev:mock
```

Esse comando sobe:

- Expo app
- Mock API em `http://localhost:3000`

## Configurar Expo Go no celular

Quando estiver usando Expo Go em um celular físico, `localhost` aponta para o próprio celular, não para o computador. Por isso, crie um arquivo `.env.local` na raiz do projeto usando o IP da sua máquina na rede:

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

Procure por `Endereço IPv4`.

Depois de alterar `.env.local`, reinicie o Expo:

```bash
npm run dev:mock
```

Para testar se o celular consegue acessar a API, abra no navegador do celular:

```txt
http://SEU_IP_LOCAL:3000/users
```

Se aparecer o JSON, o app também consegue acessar o mock.

## Scripts úteis

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

Usuário inicial:

```txt
email: teste@bytebank.com
senha: teste123
```
