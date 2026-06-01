import { Router } from "express";
import { isLoggedIn } from "../middleware/auth";
import User from "../models/schemas/User";

const userRouter = Router();

userRouter.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const currentUserId = (req as any).user?._id;
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("-password")
      .limit(100);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

userRouter.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default userRouter;