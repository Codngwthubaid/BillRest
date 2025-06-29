import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const generateToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

export const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already registered" });

        // Assign role based on email
        const role =
            email === process.env.MASTER_ADMIN_EMAIL
                ? "master"
                : email === process.env.SUPPORT_ADMIN_EMAIL
                    ? "support"
                    : "customer";

        const user = new User({ name, email, phone, password, role });
        await user.save();

        res.status(201).json({
            token: generateToken(user),
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check for role assignment
        if (email === process.env.MASTER_ADMIN_EMAIL) {
            user.role = "master";
        } else if (email === process.env.SUPPORT_ADMIN_EMAIL) {
            user.role = "support";
        } else {
            user.role = "customer";
        }

        await user.save();

        res.status(200).json({
            token: generateToken(user),
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUserSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("subscription.plan");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ subscription: user.subscription });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
