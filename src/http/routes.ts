import { authenticate } from "./controllers/users/authenticate";
import { profile } from "./controllers/users/profile";
import { register } from "./controllers/users/register";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "./middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);

  app.post("/sessions", authenticate);
  /** Authenticated */
  app.get("/me", { onRequest: [verifyJwt] }, profile);
}
