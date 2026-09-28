
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to read JSON data
app.use(express.json());

// Temporary student data
let students = [
    {
        id: 1,
        name: "Ravi",
        age: 21,
        department: "CSE"
    },
    {
        id: 2,
        name: "Priya",
        age: 20,
        department: "ECE"
    }
];

// Welcome route
app.get("/", (req, res) => {
    res.send("Welcome to Student CRUD REST API");
});

// READ: Get all students
app.get("/students", (req, res) => {
    res.status(200).json(students);
});

// READ: Get student by ID
app.get("/students/:id", (req, res) => {
    const student = students.find(
        s => s.id === Number(req.params.id)
    );

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});

// CREATE: Add a new student
app.post("/students", (req, res) => {
    const { name, age, department } = req.body;

    if (!name || !age || !department) {
        return res.status(400).json({
            message: "Name, age and department are required"
        });
    }

    const newStudent = {
        id: students.length
            ? Math.max(...students.map(s => s.id)) + 1
            : 1,
        name,
        age,
        department
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});

// UPDATE: Update student details
app.put("/students/:id", (req, res) => {
    const student = students.find(
        s => s.id === Number(req.params.id)
    );

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, age, department } = req.body;

    if (!name || !age || !department) {
        return res.status(400).json({
            message: "Name, age and department are required"
        });
    }

    student.name = name;
    student.age = age;
    student.department = department;

    res.status(200).json({
        message: "Student updated successfully",
        student
    });
});

// DELETE: Delete a student
app.delete("/students/:id", (req, res) => {
    const index = students.findIndex(
        s => s.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const deletedStudent = students.splice(index, 1);

    res.status(200).json({
        message: "Student deleted successfully",
        student: deletedStudent[0]
    });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
});