const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();
const port = process.env.MOCK_API_PORT || 3000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );

  setTimeout(next, 300);
});

server.post("/login", (request, response) => {
  const { email, password } = request.body;
  const users = router.db.get("users");
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const user = users.find({ email: normalizedEmail }).value();

  if (!user) {
    response.status(404).json({ message: "Usuario nao encontrado." });
    return;
  }

  if (user.password !== password) {
    response.status(401).json({ message: "Senha incorreta." });
    return;
  }

  const { password: _password, ...safeUser } = user;

  response.status(200).json({ user: safeUser });
});

server.post("/signup", (request, response) => {
  const { name, email, password } = request.body;
  const database = router.db;
  const users = database.get("users");
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const existingUser = users.find({ email: normalizedEmail }).value();

  if (existingUser) {
    response.status(409).json({ message: "Este email ja esta cadastrado." });
    return;
  }

  const userId = Date.now();
  const accountId = userId + 1;
  const user = {
    id: userId,
    name: String(name ?? "").trim(),
    email: normalizedEmail,
    password,
    avatarUrl: "https://i.pravatar.cc/100?img=13",
    accountId,
  };

  const account = {
    id: accountId,
    userId,
    type: "Conta Corrente",
    initialBalance: 0,
    balance: 0,
    currency: "BRL",
    agency: "0001",
    number: `${String(userId).slice(-5)}-0`,
  };

  users.push(user).write();
  database.get("accounts").push(account).write();

  const { password: _password, ...safeUser } = user;

  response.status(201).json({
    user: safeUser,
    account,
  });
});

server.patch("/password", (request, response) => {
  const { email, password } = request.body;
  const users = router.db.get("users");
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const user = users.find({ email: normalizedEmail }).value();

  if (!user) {
    response.status(404).json({ message: "Usuario nao encontrado." });
    return;
  }

  users.find({ id: user.id }).assign({ password }).write();

  const updatedUser = users.find({ id: user.id }).value();
  const { password: _password, ...safeUser } = updatedUser;

  response.status(200).json({ user: safeUser });
});

server.use(router);

server.listen(port, () => {
  console.log(`Mock API running at http://localhost:${port}`);
});
