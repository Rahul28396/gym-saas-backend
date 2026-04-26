const path = require("path");
const fs = require("fs/promises");

const MEMBERS_FILE_LOCATION = path.join("src", "config", "data", "members.json");

async function getMembers() {
  const users = await fs.readFile(MEMBERS_FILE_LOCATION, {
    encoding: "utf-8",
  });

  return JSON.parse(users ? users : JSON.stringify([]));
}

async function getUserById(id) {
  const users = await getMembers();
  const selectedUser = users.find((user) => user._id === id);
  return selectedUser;
}

async function removeUserById(id) {
  try {
    const users = await getMembers();
    const selectedUser = users.find((user) => user._id === id);
    const updatedUsers = users.filter((user) => user._id !== id);
    await updateMembers(updatedUsers);
    return selectedUser;
  } catch (err) {
    throw new Error("Oops!! delete failed");
  }
}

async function updateMembers(users = []) {
  console.log("No of user after update", users.length);
  await fs.writeFile(MEMBERS_FILE_LOCATION, JSON.stringify(users));
}

module.exports = {
  getMembers,
  updateMembers,
  getUserById,
  removeUserById,
};