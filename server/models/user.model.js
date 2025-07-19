import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isActive: { type: Boolean, default: true },

        role: {
            type: String,
            enum: ["master", "customer", "clinic", "support"],
            default: "customer",
        },

        type: {
            type: String,
            enum: ["billrest_general", "billrest_health", "billrest_master", "billrest_support"],
            required: true
        },

        subscription: {
            plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
            startDate: Date,
            endDate: Date,
        },
        features: {
            whatsappInvoice: { type: Boolean, default: false },
            barcode: { type: Boolean, default: false },
            pwa: { type: Boolean, default: true },
            backup: { type: Boolean, default: false },
            IPD: { type: Boolean, default: false }
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
