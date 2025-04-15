import Product from "../models/Product.js";
import Order from "../models/Order.js";
//import User from "../models/User.js";
import Section from "../models/Section.js";
import excelJS from 'exceljs'

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

export const getMonthlyStatistic = async(req,res)=>{

  try{
    const monthlyOrders= await Order.find()

  }catch (error) {
    console.error("Error fetching statistic:", error);
    res.status(500).json({ message: "Server error" });
  }
}


const Users = [
  { firstname: "Amir", lastname: "Mustafa", email: "amir@gmail.com" },
  { firstname: "Ashwani", lastname: "Jumar", email: "ashwani@gmail.com" },
  { firstname: "Nupur", lastname: "Shah", email: "nupur@gmail.com" },
  { firstname: "Himanshu", lastname: "Mewari", email: "himanshu@gmail.com" },
  { firstname: "Vankayala", lastname: "Sirisha", email: "sirisha@gmail.com" },
];

export const ExportData = async (req, res) => {
  console.log("Generating Excel file...");

  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("My Users");

  worksheet.columns = [
    { header: "S No.", key: "s_no", width: 10 },
    { header: "First Name", key: "firstname", width: 20 },
    { header: "Last Name", key: "lastname", width: 20 },
    { header: "Email", key: "email", width: 30 },
  ];

  let counter = 1;
  Users.forEach((user) => {
    user.s_no = counter++;
    worksheet.addRow(user);
  });

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  try {
    // Set headers to trigger download in browser
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users.xlsx"
    );

    // Write workbook to response as stream
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (err) {
    console.error("ExportData error:", err);
    res.status(500).send({
      status: "error",
      message: "Failed to export data",
    });
  }
};
