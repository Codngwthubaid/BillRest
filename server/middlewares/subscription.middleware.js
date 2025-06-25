import { Subscription } from "../models/subscription.model.js";

export const checkSubscription = async (req, res, next) => {
    const subscription = await Subscription.findOne({ user: req.user.id })
        .populate("plan")
        .sort({ endDate: -1 });

    if (!subscription || subscription.endDate < new Date()) {
        console.warn(`Blocked user: ${req.user.id}, Expired: ${subscription?.endDate}`);
        return res.status(403).json({ message: "⛔ Subscription expired or not found" });
    }

    next();
};
