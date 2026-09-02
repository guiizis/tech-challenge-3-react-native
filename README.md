# Tech Challenge 3 - ByteBank

ByteBank é um app de gestão financeira pessoal feito com React Native e Expo Router, desenvolvido como Tech Challenge da Pós FIAP. Ele traz login/cadastro, um dashboard com saldo da conta e resumo de receitas x despesas, e um extrato de transações com busca, filtros avançados, paginação e anexo de comprovante.

O app consome uma API própria (BFF em Node/Express) que persiste os dados no Cloud Firestore.

## Instalar

```bash
npm install
```

## Configurar variáveis de ambiente

O projeto não versiona nenhum arquivo `.env*` com valores reais — apenas o `.env.example`, que serve de modelo. Antes de rodar o app, copie-o para `.env.local` e preencha os valores:

```bash
cp .env.example .env.local
```

Chaves disponíveis:

- `EXPO_PUBLIC_API_MODE` / `EXPO_PUBLIC_API_URL`: endereço do BFF que o app vai consultar. Por padrão `EXPO_PUBLIC_API_URL=http://localhost:3000` funciona para emulador/web; para testar em um celular físico via Expo Go, veja a seção [Configurar Expo Go no celular](#configurar-expo-go-no-celular).
- Chaves do Firebase (`EXPO_PUBLIC_FIREBASE_*`), usadas tanto pelo app (Storage, em [src/config/firebase.ts](src/config/firebase.ts)) quanto pelo BFF (Firestore, em [bff/firebase.js](bff/firebase.js)):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Esses valores ficam em **Firebase Console > Configurações do projeto > Geral > Seus apps > Configuração do SDK** (crie um app Web se ainda não existir). Depois de salvar o `.env.local`, reinicie o Expo para as variáveis serem carregadas.

> **Observação:** para os avaliadores do Tech Challenge, as credenciais serão fornecidas separadamente.

## Rodar app + BFF

```bash
npm run dev:bff
```

Esse comando sobe:

- Expo app (menu do Expo, escolha a plataforma no terminal)
- BFF em `http://localhost:3000`

Também há um script dedicado por plataforma, cada um subindo o BFF junto com o Expo já apontado para o alvo escolhido:

- `npm run web:bff`: abre o app no navegador. Como o app foi pensado para celular, alguns recursos podem não funcionar corretamente no navegador — por exemplo, os modais nativos de confirmação (`Alert.alert`) usados para excluir uma transação e para o logout.
- `npm run android:bff`: abre o app em um emulador Android ou dispositivo conectado.
- `npm run ios:bff`: abre o app em um simulador iOS (requer macOS).

## Configurar Expo Go no celular

Para funcionar via Expo Go, o app instalado no celular precisa ter suporte ao SDK deste projeto, o **Expo SDK 57**. Se a versão disponível na Play Store ainda não suportar o SDK 57, instale a APK diretamente pelo link:

```txt
https://expo.dev/go?sdkVersion=57&platform=android
```

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
npm run dev:bff
```

Para testar se o celular consegue acessar a API, abra no navegador do celular:

```txt
http://SEU_IP_LOCAL:3000/categories
```

Se aparecer o JSON, o app também consegue acessar o BFF.

## Scripts úteis

```bash
npm run start
npm run bff
npm run dev:bff
npm run web:bff
npm run android:bff
npm run ios:bff
npm run lint
```

## BFF

O BFF roda localmente e é construído sobre o `json-server` (Node/Express), mas em vez de ler/escrever num arquivo `db.json`, ele foi adaptado para persistir os dados diretamente no Cloud Firestore: cada requisição REST do app é traduzida em uma leitura/escrita nas coleções do Firestore, funcionando como uma camada intermediária (BFF) entre o app e o banco.

Arquivos:

```txt
bff/firebase.js  # inicializacao do client SDK do Firebase/Firestore
bff/server.js    # rotas do BFF
```

Principais rotas:

```txt
POST /login
POST /signup
PATCH /password
GET /accounts
GET /cards
GET /categories
GET /transactions
GET /transactions/search
POST /transactions
PATCH /transactions/:id
DELETE /transactions/:id
```

Usuário inicial:

```txt
email: teste@bytebank.com
senha: teste123
```
