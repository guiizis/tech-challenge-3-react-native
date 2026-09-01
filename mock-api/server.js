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

server.get("/transactions/search", (request, response) => {
  const {
    userId,
    q,
    type,
    category,
    startDate,
    endDate,
    sort,
    _page,
    _limit,
  } = request.query;
  const normalizedQuery = String(q ?? "").trim().toLowerCase();
  const normalizedType = String(type ?? "").trim();
  const normalizedCategory = String(category ?? "").trim().toLowerCase();
  const numericUserId = Number(userId);
  const page = Math.max(Number(_page) || 1, 1);
  const limit = Math.max(Number(_limit) || 6, 1);

  if (!numericUserId) {
    response.status(400).json({ message: "Usuario invalido." });
    return;
  }

  const transactions = router.db
    .get("transactions")
    .filter((transaction) => {
      const belongsToUser = transaction.userId === numericUserId;
      const matchesType =
        normalizedType === "" ||
        normalizedType === "all" ||
        transaction.type === normalizedType;
      const matchesQuery =
        normalizedQuery === "" ||
        String(transaction.title ?? "").toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        normalizedCategory === "" ||
        String(transaction.category ?? "")
          .toLowerCase()
          .includes(normalizedCategory);
      const matchesStartDate =
        !startDate || String(transaction.date) >= String(startDate);
      const matchesEndDate =
        !endDate || String(transaction.date) <= String(endDate);

      return (
        belongsToUser &&
        matchesType &&
        matchesQuery &&
        matchesCategory &&
        matchesStartDate &&
        matchesEndDate
      );
    })
    .orderBy(["date"], [sort === "date_asc" ? "asc" : "desc"])
    .value();
  const start = (page - 1) * limit;
  const data = transactions.slice(start, start + limit);

  response.status(200).json({
    data,
    total: transactions.length,
    page,
    limit,
    hasMore: start + limit < transactions.length,
  });
});

server.post("/transactions", (request, response) => {
  const {
    userId,
    accountId,
    type,
    title,
    category,
    amount,
    date,
    description,
    receiptUrl,
    receiptName,
  } = request.body;
  const numericUserId = Number(userId);
  const numericAmount = Number(amount);

  if (!numericUserId) {
    response.status(400).json({ message: "Usuario invalido." });
    return;
  }

  if (type !== "income" && type !== "expense") {
    response.status(400).json({ message: "Tipo de transacao invalido." });
    return;
  }

  if (!String(title ?? "").trim()) {
    response.status(400).json({ message: "Informe o nome da transacao." });
    return;
  }

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    response.status(400).json({ message: "Informe um valor valido." });
    return;
  }

  const database = router.db;
  const account =
    database.get("accounts").find({ id: Number(accountId) }).value() ??
    database.get("accounts").find({ userId: numericUserId }).value();

  if (!account) {
    response.status(404).json({ message: "Conta nao encontrada." });
    return;
  }

  const transaction = {
    id: Date.now(),
    userId: numericUserId,
    accountId: account.id,
    type,
    title: String(title).trim(),
    category: String(category ?? "").trim() || "Geral",
    amount: numericAmount,
    date: String(date ?? "").trim() || new Date().toISOString().slice(0, 10),
    description: String(description ?? "").trim(),
    receiptUrl: String(receiptUrl ?? "").trim() || null,
    receiptName: String(receiptName ?? "").trim() || null,
  };

  database.get("transactions").push(transaction).write();

  response.status(201).json(transaction);
});

server.use(router);

server.listen(port, () => {
  console.log(`Mock API running at http://localhost:${port}`);
});
