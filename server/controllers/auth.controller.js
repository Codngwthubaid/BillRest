import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const generateToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

export const register = async (req, res) => {
    try {
        const { name, email, phone, password, type } = req.body;

        const isMaster = email === process.env.MASTER_ADMIN_EMAIL;
        const isSupport = email === process.env.SUPPORT_ADMIN_EMAIL;

        if (!isMaster && !isSupport && !["billrest_general", "billrest_health"].includes(type)) {
            return res.status(400).json({ message: "Invalid or missing software type" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        let role = "customer";

        if (isMaster) {
            role = "master";
        } else if (isSupport) {
            role = "support";
        } else if (type === "billrest_health") {
            role = "clinic";
        }

        const user = new User({ name, email, phone, password, role, type });
        await user.save();

        res.status(201).json({
            token: generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                type: user.type,
            },
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

        // Admin role override
        if (email === process.env.MASTER_ADMIN_EMAIL) {
            user.role = "master";
        } else if (email === process.env.SUPPORT_ADMIN_EMAIL) {
            user.role = "support";
        } else {
            // Only for non-admins: ensure a valid type is present
            if (!["billrest_general", "billrest_health"].includes(user.type)) {
                return res.status(400).json({ message: "Invalid or missing software type" });
            }
        }

        await user.save();

        res.status(200).json({
            token: generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                type: user.type,
            },
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
