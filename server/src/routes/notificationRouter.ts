import { Router } from "express";
import { isLoggedIn } from "../middleware/auth";
import { Types } from "mongoose";
import Notification from "../models/Notification";

const notificationRouter = Router();

// Get user's notifications
notificationRouter.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const userId = (req as any).user?._id;
    const { limit = 50, unreadOnly = false } = req.query;

    let query: any = { recipient: userId };
    if (unreadOnly === "true") {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("sender", "username avatar");

    const unreadCount = await Notification.countDocuments({ recipient: userId, read: false });

    res.json({ notifications, unreadCount });
  } catch (err) {
    next(err);
  }
});

// Mark notification as read
notificationRouter.post("/:id/read", isLoggedIn, async (req, res, next) => {
  try {
    const userId = (req as any).user?._id;
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: userId,
    });

    if (!notification) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    notification.read = true;
    await notification.save();

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Mark all as read
notificationRouter.post("/read-all", isLoggedIn, async (req, res, next) => {
  try {
    const userId = (req as any).user?._id;
    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true },
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Delete notification
notificationRouter.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const userId = (req as any).user?._id;
    await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: userId,
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default notificationRouter;