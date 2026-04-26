const {
  getMembers,
  updateMembers,
  getUserById,
  removeUserById,
} = require("./member.service");

const getMembersController = async (req, res) => {
  try {
    console.log("Called");
    const users = await getMembers();
    return res.status(200).send(users);
  } catch (err) {
    console.log(err);
    return res.status(404).send({ error: "bad response" });
  }
};

const createMemberController = async (req, res) => {
  try {
    let users = [];

    users = await getMembers();

    const newUser = req.body;
    newUser._id = users.length + 1;

    users.push(newUser);

    await updateMembers(users);

    return res.status(200).send(newUser);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "bad response" });
  }
};

const getMemberByIdController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).send({ error: "Member not found" });
    }

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: "Bad request" });
  }
};

const updateMemberController = async (req, res) => {
  try {
    let users = await getMembers();
    const id = Number(req.params.id); // ensure numeric comparison
    const user = await getUserById(id);

    if (user) {
      const updatedFields = req.body;
      const updatedUser = { ...user, ...updatedFields };

      // Replace old user with updated one
      users = users.map((user) => (user._id === id ? updatedUser : user));

      await updateMembers(users);

      return res.status(200).send(updatedUser);
    } else {
      return res.status(404).send({ error: "Member not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: "Bad response" });
  }
};

const deleteMemberController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await removeUserById(id);

    if (!user) {
      return res.status(404).send({ error: "Not member found" });
    }

    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};

module.exports = {
    getMembersController,
    createMemberController,
    getMemberByIdController,
    updateMemberController,
    deleteMemberController
}