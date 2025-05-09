import authRouter from "./auth.route.js";
import productRouter from "./product.route.js";
import cartRouter from "./cart.route.js";
import couponsRouter from "./coupons.route.js";
import paymentRouter from "./payment.route.js";
import analyticsRouter from "./analytics.route.js";
import express from "express";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/cart", cartRouter);
router.use("/coupons", couponsRouter);
router.use("/payment", paymentRouter);
router.use("/analytics", analyticsRouter);

export default router;
