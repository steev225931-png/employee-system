const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Employee model
const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    salary: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Employee App API is running" });
});

// GET: all employees
app.get("/api/employees", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees", error: error.message });
  }
});

// GET: one employee by MongoDB document ID
app.get("/api/employees/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employee", error: error.message });
  }
});

// POST: create employee
app.post("/api/employees", async (req, res) => {
  try {
    const { name, designation, location, salary } = req.body;
    if (!name || !designation || !location || salary === undefined || salary === "") {
      return res.status(400).json({
        message: "name, designation, location, and salary are required"
      });
    }

    const numericSalary = Number(salary);
    if (!Number.isFinite(numericSalary) || numericSalary < 0) {
      return res.status(400).json({ message: "salary must be a non-negative number" });
    }

    const employee = await Employee.create({
      name, designation, location, salary: numericSalary
    });
    res.status(201).json(employee);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to create employee", error: error.message });
  }
});

// PUT: update employee
app.put("/api/employees/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const allowed = ["name", "designation", "location", "salary"];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (updates.salary !== undefined) {
      updates.salary = Number(updates.salary);
      if (!Number.isFinite(updates.salary) || updates.salary < 0) {
        return res.status(400).json({ message: "salary must be a non-negative number" });
      }
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to update employee", error: error.message });
  }
});

// DELETE: remove employee
app.delete("/api/employees/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete employee", error: error.message });
  }
});

// Start only after MongoDB connects successfully
async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI. Create server/.env using .env.example.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Employee API listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
