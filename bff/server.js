const jsonServer = require("json-server");
const {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
} = require("firebase/firestore");

const { db } = require("./firebase");

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const port = process.env.BFF_PORT || 3000;

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function sortByDate(items, order) {
  return [...items].sort((a, b) =>
    order === "asc"
      ? String(a.date).localeCompare(String(b.date))
      : String(b.date).localeCompare(String(a.date)),
  );
}

async function findUserByEmail(email) {
  const snapshot = await getDocs(
    query(collection(db, "users"), where("email", "==", email)),
  );

  return snapshot.empty ? null : snapshot.docs[0].data();
}

async function findAccountsByUserId(userId) {
  const snapshot = await getDocs(
    query(collection(db, "accounts"), where("userId", "==", userId)),
  );

  return snapshot.docs.map((snapshotDoc) => snapshotDoc.data());
}

async function findTransactionsByUserId(userId) {
  const snapshot = await getDocs(
    query(collection(db, "transactions"), where("userId", "==", userId)),
  );

  return snapshot.docs.map((snapshotDoc) => snapshotDoc.data());
}

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

server.post("/login", async (request, response) => {
  const { email, password } = request.body;
  const normalizedEmail = String(email ?? "")
    .trim()
    .toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

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

server.post("/signup", async (request, response) => {
  const { name, email, password } = request.body;
  const normalizedEmail = String(email ?? "")
    .trim()
    .toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);

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

  await setDoc(doc(db, "users", String(userId)), user);
  await setDoc(doc(db, "accounts", String(accountId)), account);

  const { password: _password, ...safeUser } = user;

  response.status(201).json({
    user: safeUser,
    account,
  });
});

server.patch("/password", async (request, response) => {
  const { email, password } = request.body;
  const normalizedEmail = String(email ?? "")
    .trim()
    .toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    response.status(404).json({ message: "Usuario nao encontrado." });
    return;
  }

  await updateDoc(doc(db, "users", String(user.id)), { password });

  const { password: _password, ...safeUser } = { ...user, password };

  response.status(200).json({ user: safeUser });
});

server.get("/accounts", async (request, response) => {
  const numericUserId = Number(request.query.userId);

  if (!numericUserId) {
    response.status(400).json({ message: "Usuario invalido." });
    return;
  }

  const accounts = await findAccountsByUserId(numericUserId);

  response.status(200).json(accounts);
});

server.get("/cards", async (request, response) => {
  const numericUserId = Number(request.query.userId);

  if (!numericUserId) {
    response.status(400).json({ message: "Usuario invalido." });
    return;
  }

  const snapshot = await getDocs(
    query(collection(db, "cards"), where("userId", "==", numericUserId)),
  );

  response.status(200).json(snapshot.docs.map((snapshotDoc) => snapshotDoc.data()));
});

server.get("/categories", async (_request, response) => {
  const snapshot = await getDocs(collection(db, "categories"));

  response.status(200).json(snapshot.docs.map((snapshotDoc) => snapshotDoc.data()));
});

server.get("/transactions/search", async (request, response) => {
  const { userId, q, type, category, startDate, endDate, sort, _page, _limit } =
    request.query;
  const normalizedQuery = normalizeText(q).trim();
  const normalizedType = String(type ?? "").trim();
  const normalizedCategory = String(category ?? "")
    .trim()
    .toLowerCase();
  const numericUserId = Number(userId);
  const page = Math.max(Number(_page) || 1, 1);
  const limit = Math.max(Number(_limit) || 6, 1);

  if (!numericUserId) {
    response.status(400).json({ message: "Usuario invalido." });
    return;
  }

  const userTransactions = await findTransactionsByUserId(numericUserId);
  const filtered = userTransactions.filter((transaction) => {
    const matchesType =
      normalizedType === "" ||
      normalizedType === "all" ||
      transaction.type === normalizedType;
    const matchesQuery =
      normalizedQuery === "" ||
      normalizeText(transaction.title).includes(normalizedQuery);
    const matchesCategory =
      normalizedCategory === "" ||
      String(transaction.category ?? "")
        .toLowerCase()
        .includes(normalizedCategory);
    const matchesStartDate =
      !startDate || String(transaction.date) >= String(startDate);
    const matchesEndDate =
      !endDate || String(transaction.date) <= String(endDate);

    return matchesType && matchesQuery && matchesCategory && matchesStartDate && matchesEndDate;
  });
  const transactions = sortByDate(filtered, sort === "date_asc" ? "asc" : "desc");
  const start = (page - 1) * limit;
  const data = transactions.slice(start, start + limit);

  setTimeout(() => {
    response.status(200).json({
      data,
      total: transactions.length,
      page,
      limit,
      hasMore: start + limit < transactions.length,
    });
  }, 1500);
});

server.get("/transactions", async (request, response) => {
  const numericUserId = Number(request.query.userId);

  if (!numericUserId) {
    response.status(400).json({ message: "Usuario invalido." });
    return;
  }

  const order = request.query._order === "asc" ? "asc" : "desc";
  const transactions = sortByDate(
    await findTransactionsByUserId(numericUserId),
    order,
  );

  response.status(200).json(transactions);
});

server.post("/transactions", async (request, response) => {
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

  const accountByIdSnapshot = accountId
    ? await getDoc(doc(db, "accounts", String(accountId)))
    : null;
  const account = accountByIdSnapshot?.exists()
    ? accountByIdSnapshot.data()
    : (await findAccountsByUserId(numericUserId))[0];

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

  await setDoc(doc(db, "transactions", String(transaction.id)), transaction);

  response.status(201).json(transaction);
});

server.patch("/transactions/:id", async (request, response) => {
  const transactionRef = doc(db, "transactions", String(request.params.id));
  const snapshot = await getDoc(transactionRef);

  if (!snapshot.exists()) {
    response.status(404).json({ message: "Transacao nao encontrada." });
    return;
  }

  await updateDoc(transactionRef, request.body);

  const updatedSnapshot = await getDoc(transactionRef);

  response.status(200).json(updatedSnapshot.data());
});

server.delete("/transactions/:id", async (request, response) => {
  const transactionRef = doc(db, "transactions", String(request.params.id));
  const snapshot = await getDoc(transactionRef);

  if (!snapshot.exists()) {
    response.status(404).json({ message: "Transacao nao encontrada." });
    return;
  }

  await deleteDoc(transactionRef);

  response.status(200).json({});
});

server.listen(port, () => {
  console.log(`BFF running at http://localhost:${port}`);
});
