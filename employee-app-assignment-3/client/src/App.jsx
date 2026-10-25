import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/employees";
const emptyForm = { name: "", designation: "", location: "", salary: "" };

export default function App() {
  const [page, setPage] = useState("home");
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadEmployees() {
    setLoading(true);
    try {
      const response = await fetch(API);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not load employees");
      setEmployees(data);
      setMessage("");
    } catch (error) {
      setMessage(`${error.message}. Make sure the backend is running and MongoDB Atlas is configured.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadEmployees(); }, []);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submitForm(event) {
    event.preventDefault();
    setMessage("");
    try {
      const response = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, salary: Number(form.salary) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Request failed");
      setMessage(editingId ? "Employee updated successfully." : "Employee added successfully.");
      setForm(emptyForm);
      setEditingId(null);
      await loadEmployees();
      setPage("home");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function editEmployee(employee) {
    setForm({
      name: employee.name,
      designation: employee.designation,
      location: employee.location,
      salary: String(employee.salary)
    });
    setEditingId(employee._id);
    setMessage("");
    setPage("form");
  }

  async function deleteEmployee(id) {
    if (!window.confirm("Delete this employee?")) return;
    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed");
      setMessage("Employee deleted successfully.");
      await loadEmployees();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function openNewForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setPage("form");
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">Employee<span>App</span></div>
        <div className="navlinks">
          <button className={page === "home" ? "navlink active" : "navlink"} onClick={() => { setPage("home"); setMessage(""); }}>Home</button>
          <button className={page === "form" ? "navlink active" : "navlink"} onClick={openNewForm}>Employee Form</button>
        </div>
      </nav>

      <main className="container">
        <div className="page-heading">
          <div>
            <p className="eyebrow">EMPLOYEE MANAGEMENT</p>
            <h1>{page === "home" ? "Employee Dashboard" : editingId ? "Update Employee" : "Add Employee"}</h1>
            <p className="subheading">{page === "home" ? "View and manage your employee records." : "Enter the employee details below."}</p>
          </div>
          {page === "home" && <button className="primary" onClick={openNewForm}>+ Add Employee</button>}
        </div>

        {message && <div className="message" role="status">{message}</div>}

        {page === "home" ? (
          <section className="panel">
            <div className="panel-header">
              <h2>All Employees</h2>
              <button className="secondary" onClick={loadEmployees}>Refresh</button>
            </div>
            {loading ? <p className="empty">Loading employees…</p> : employees.length === 0 ? (
              <p className="empty">No employees found. Add an employee to get started.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Employee</th><th>Designation</th><th>Location</th><th>Salary</th><th>Actions</th></tr></thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee._id}>
                        <td><strong>{employee.name}</strong><small>ID: {employee._id}</small></td>
                        <td>{employee.designation}</td>
                        <td>{employee.location}</td>
                        <td>₹{Number(employee.salary).toLocaleString("en-IN")}</td>
                        <td className="actions">
                          <button className="edit" onClick={() => editEmployee(employee)}>Edit</button>
                          <button className="delete" onClick={() => deleteEmployee(employee._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : (
          <section className="panel form-panel">
            <form onSubmit={submitForm}>
              <label>Name<input name="name" value={form.name} onChange={updateField} required placeholder="Enter full name" /></label>
              <label>Designation<input name="designation" value={form.designation} onChange={updateField} required placeholder="e.g. Software Developer" /></label>
              <label>Location<input name="location" value={form.location} onChange={updateField} required placeholder="e.g. Kochi" /></label>
              <label>Salary (₹)<input name="salary" type="number" min="0" value={form.salary} onChange={updateField} required placeholder="Enter salary" /></label>
              <div className="form-actions">
                <button className="secondary" type="button" onClick={() => { setPage("home"); setForm(emptyForm); setEditingId(null); }}>Cancel</button>
                <button className="primary" type="submit">{editingId ? "Save Changes" : "Add Employee"}</button>
              </div>
            </form>
          </section>
        )}
        <p className="footer">Employee App · Assignment 3 · Backend integration with MongoDB</p>
      </main>
    </div>
  );
}
