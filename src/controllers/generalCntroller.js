import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Section from "../models/Section.js";

export const getAnalytics = async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    const productCount = await Product.countDocuments();
    const deliveredOrderCount = await Order.countDocuments({ status: "delivered" });
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    res.status(200).json({
      orderCount,
      productCount,
      deliveredOrderCount,
      totalSales,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMonthlyStatistic = async(res,req)=>{

  try{
    const monthlyOrders= await Order.find()

  }catch (error) {
    console.error("Error fetching statistic:", error);
    res.status(500).json({ message: "Server error" });
  }
}