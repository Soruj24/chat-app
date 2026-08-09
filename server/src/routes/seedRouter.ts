import { Router } from "express";
import { seedAll, getSeedStats } from "../controllers/seedController";
import { isLoggedIn, hasPermission } from "../middleware/auth";
import { Permission } from "../models/interfaces/IUser";
import { NODE_ENV } from "../secret";

const seedRouter = Router();

// In development, allow seed without auth for easy setup
if (NODE_ENV === "production") {
  seedRouter.use(isLoggedIn);
  seedRouter.use(hasPermission(Permission.USERS_DELETE));
}

seedRouter.post("/all", seedAll);
seedRouter.get("/stats", getSeedStats);

export default seedRouter;
