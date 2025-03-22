import { serve } from "@hono/node-server";
import api from "./api.js";
import routes from "./routes.js";

const app = api; 
app.route("/", routes); 

const port = process.env.PORT || 3000;
console.log(`Server running on http://localhost:${port}`);
serve({fetch: app.fetch, port: Number(port),});
