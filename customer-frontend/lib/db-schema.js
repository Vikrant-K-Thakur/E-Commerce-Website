// MongoDB/NoSQL Database Schema for Customers Collection
const customerSchema = {
  id: String, // Unique identifier
  name: String, // Customer name
  email: String, // Customer email (unique)
  phone: String, // Customer phone (optional)
  address: String, // Customer address (optional)
  created_at: Date, // Creation timestamp
  updated_at: Date // Last update timestamp
};

// MongoDB Collection Setup Example:
// db.customers.createIndex({ "email": 1 }, { unique: true })

module.exports = { customerSchema };