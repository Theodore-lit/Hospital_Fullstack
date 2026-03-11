import RECEPTIONNISTS from "../data/receptionnists.json" with { type: "json" };

export const getRecept = (req, res) => {
  const limit = parseInt(req.query.limit ?? 10);
  const page = parseInt(req.query.page ?? 1);
  const searchByName = req.query.search;
  let receptionnists = [...RECEPTIONNISTS];
  if (page < 1 || limit < 1) {
    res.status(400).json({ message: "Page or limit must be >= 1" });
    return;
  }
  const start = (page - 1) * limit;
  receptionnists = receptionnists.slice(start, start + limit);

  if (searchByName) {
    receptionnists = RECEPTIONNISTS.filter((recp) => {
      const fullName = recp.name.toLowerCase();
      const matchesSearch = fullName.includes(searchByName.toLowerCase());
      return matchesSearch;
    });
  }
  res.status(200).json({ receptionnists });
};

// rechercher un receptionnist par son id
export const getReceptById = (req, res) => {
  const recptId = req.params.id;
  const receptionnist = RECEPTIONNISTS.find((recp) => recp.id === Number(recptId));
  if (receptionnist.length == 0)
    return res.status(400).json({ message: "Bad request" });
  res.status(200).json(receptionnist);
};

// ajout de receptionnist
export const addRecept = (req, res) => {
  let templateReceptionnist = {
    id: Date.now(),
    password: "1234",
    role: "receptionnist",
    service: "Acceuil général"
  };
  const newRecept = req.body;

  if (
    !newRecept.name &&
    !newRecept.email && newRecept.phone
  )
    return res.status(400).json("Bad request");
  if (
    newRecept.name &&
    newRecept.email && newRecept.phone
  ) {
    templateReceptionnist = { ...newRecept };
    let data = fs.readFileSync("src/data/receptionnists.json", "utf-8");
    let dataUsers = fs.readFileSync("src/data/users.json", "utf-8");
    let users = JSON.parse(dataUsers);
    let receptionnists = JSON.parse(data);
    receptionnists.push(templateReceptionnist);
    users.push(templateReceptionnist);
    fs.writeFileSync("src/data/receptionnists.json", JSON.stringify(receptionnists, null, 2));
    fs.writeFileSync("src/data/users.json", JSON.stringify(users, null, 2));
    res.status(201).json({ message: "patient added" });
  }
};

// modifier un receptionnist
export const updateRecept = (req, res) => {
  let data = fs.readFileSync("src/data/receptionnists.json", "utf-8");
  let dataUsers = fs.readFileSync("src/data/users.json", "utf-8");
  let users = JSON.parse(dataUsers);
  let receptionnists = JSON.parse(data);
  const updateId = res.params.id;
  const toUpdate = res.body;
  const index = receptionnists.findIndex((r) => r.id === updateId);
  const indexUser = users.findIndex((r) => r.id === updateId);
  if (toUpdate.role || toUpdate.id)
    return res.status(400).json({ message: "Bad request" });
  if (
    index !== -1 &&
    (toUpdate.name ||
      toUpdate.email ||
      toUpdate.specialty ||
      toUpdate.phone ||
      toUpdate.experience ||
      toUpdate.city)
  ) {
    receptionnists[index] = { ...receptionnists[index],...toUpdate };
    users[indexUser] = { ...users[indexUser],...toUpdate };
    fs.writeFileSync("src/data/receptionnists.json", JSON.stringify(receptionnists, null, 2));
    fs.writeFileSync("src/data/users.json", JSON.stringify(users, null, 2));
    res.status(201).json({ message: "update sucessfully" });
  } else {
    res.status(400).json({ message: "Not found" });
  }
};

// suppression d'un receptionnist
export const removeRecept = (req, res) => {
  const recptId = req.params.id;
  let dataDoc = fs.readFileSync("src/data/receptionnists.json", "utf-8");
  let dataUsers = fs.readFileSync("src/data/users.json", "utf-8");
  let receptionnists = JSON.parse(dataDoc);
  let users = JSON.parse(dataUsers);
  let deletedDoc = receptionnists.find((recp) => recp.id == recptId);
  let deletedUser = users.find((us) => us.id == recptId);
  if (deletedDoc || deletedUser) {
    receptionnists = receptionnists.filter((recp) => recp.id !== recptId);
    users = users.filter((us) => us.id !== recptId);
    fs.writeFileSync("src/data/receptionnists.json", JSON.stringify(receptionnists, null, 2));
    fs.writeFileSync("src/data/users.json", JSON.stringify(receptionnists, null, 2));
    res.status(200).json({ message: "patient deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
};
