import CouponModel from "../models/Coupon.model.js";
export const getCoupon = async (req, res) => {
  try {
    const coupon = await CouponModel.findOne({
      userId: req.user._id,
      isActive: true,
    });
    return res.json(coupon || null);
  } catch (error) {
    console.log("Error in getCoupon controller", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await CouponModel.findOne({
      code: code,
      userId: req.user._id,
    });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon expired" });
    }
    return res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validateCoupon controller", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
