import { Customer } from "../models/customer.model.js";

export const getCustomers = async (req, res) => {
  try {
    const userId = req.user.id;

    const customers = await Customer.find({ user: userId })
      .populate({
        path: 'invoices',
        select: 'invoiceNumber totalAmount status createdAt products'
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log("Fetched customers with invoices:", JSON.stringify(customers, null, 2));

    res.json(customers);
  } catch (err) {
    console.error("Get customers error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const userId = req.user.id;
    const customerId = req.params.id;

    const customer = await Customer.findOneAndDelete({
      _id: customerId,
      user: userId,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found or already deleted." });
    }

    res.json({ message: "Customer deleted successfully." });
  } catch (err) {
    console.error("Delete customer error:", err);
    res.status(500).json({ message: "Failed to delete customer." });
  }
};
