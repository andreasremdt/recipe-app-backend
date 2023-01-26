import server from "./server";
import config from "./config";

server.listen(config.port, () => {
  console.log(`Server started on http://localhost:${config.port}.`);
});
