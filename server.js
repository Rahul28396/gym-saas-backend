const server = require("./app");
const PORT = 3000;


server.listen(PORT, "localhost", () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
