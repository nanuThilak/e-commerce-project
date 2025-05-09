import stripePack from "stripe";
import dotenv from "dotenv";
dotenv.config();
export const stripe = new stripePack(process.env.STRIPE_SECRET_KEY);
