const API = "/api/students";
const rows = document.getElementById("studentRows");
const modal = document.getElementById("modalBackdrop");
const form = document.getElementById("studentForm");
let students = [];

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

async function loadStudents() {
  try {
    students = await request(API);
    renderStudents();
    updateStats();
  } catch (error) {
    rows.innerHTML = `<tr><td colspan="5" class="empty">Could not load students. Please refresh.</td></tr>`;
    showToast(error.message);
  }
}

function renderStudents() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const filtered = students.filter(s =>
    [s.name, s.email, s.department, String(s.id)].some(v => String(v).toLowerCase().includes(query))
  );
  document.getElementById("recordCount").textContent = `${filtered.length} record${filtered.length === 1 ? "" : "s"}`;
  if (!filtered.length) {
    rows.innerHTML = '<tr><td colspan="5" class="empty">No matching students found.</td></tr>';
    return;
  }
  rows.innerHTML = filtered.map(s => `
    <tr>
      <td><div class="student-name">${escapeHTML(s.name)}</div><div class="student-email">${escapeHTML(s.email)}</div></td>
      <td><span class="id-pill">STU-${String(s.id).padStart(3, "0")}</span></td>
      <td><span class="dept-pill">${escapeHTML(s.department)}</span></td>
      <td>${Number(s.age)}</td>
      <td><div class="actions"><button class="action-btn" onclick="editStudent(${s.id})">Edit</button><button class="action-btn delete" onclick="deleteStudent(${s.id})">Delete</button></div></td>
    </tr>`).join("");
}

function updateStats() {
  document.getElementById("totalStudents").textContent = students.length;
  document.getElementById("totalDepartments").textContent = new Set(students.map(s => s.department)).size;
  const average = students.length ? students.reduce((sum, s) => sum + Number(s.age), 0) / students.length : 0;
  document.getElementById("averageAge").textContent = students.length ? average.toFixed(1) : "—";
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]);
}

function openModal(student = null) {
  form.reset();
  document.getElementById("formError").textContent = "";
  document.getElementById("studentId").value = student ? student.id : "";
  document.getElementById("modalTitle").textContent = student ? "Edit student" : "Add student";
  document.getElementById("saveBtn").textContent = student ? "Update student" : "Save student";
  if (student) {
    document.getElementById("name").value = student.name;
    document.getElementById("age").value = student.age;
    document.getElementById("department").value = student.department;
    document.getElementById("email").value = student.email;
  }
  modal.classList.add("open");
  document.getElementById("name").focus();
}
function closeModal() { modal.classList.remove("open"); }
function editStudent(id) {
  const student = students.find(s => s.id === id);
  if (student) openModal(student);
}
async function deleteStudent(id) {
  const student = students.find(s => s.id === id);
  if (!student || !confirm(`Delete ${student.name}'s record?`)) return;
  try {
    await request(`${API}/${id}`, { method: "DELETE" });
    showToast("Student deleted successfully");
    await loadStudents();
  } catch (error) { showToast(error.message); }
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

document.getElementById("addBtn").addEventListener("click", () => openModal());
document.getElementById("closeBtn").addEventListener("click", closeModal);
document.getElementById("cancelBtn").addEventListener("click", closeModal);
document.getElementById("searchInput").addEventListener("input", renderStudents);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
form.addEventListener("submit", async event => {
  event.preventDefault();
  const id = document.getElementById("studentId").value;
  const student = {
    name: document.getElementById("name").value.trim(),
    age: Number(document.getElementById("age").value),
    department: document.getElementById("department").value,
    email: document.getElementById("email").value.trim()
  };
  try {
    await request(id ? `${API}/${id}` : API, {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(student)
    });
    closeModal();
    showToast(id ? "Student updated successfully" : "Student added successfully");
    await loadStudents();
  } catch (error) {
    document.getElementById("formError").textContent = error.message;
  }
});

loadStudents();
