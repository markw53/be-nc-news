// server.js
import app from "./app.js";

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}...`);
});