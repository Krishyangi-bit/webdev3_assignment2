const API = "/students";

const form = document.getElementById("student-form");
const idInput = document.getElementById("student-id");
const fields = ["name", "email", "course", "age"].reduce((acc, key) => {
  acc[key] = document.getElementById(key);
  return acc;
}, {});
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const list = document.getElementById("student-list");
const empty = document.getElementById("empty");
const count = document.getElementById("count");
const search = document.getElementById("search");
const findId = document.getElementById("find-id");
const statusEl = document.getElementById("status");
const toast = document.getElementById("toast");

let students = [];

// ---------- API helper ----------
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json().catch(() => ({}));

  const method = options.method || "GET";
  statusEl.textContent = `${method} ${url} → ${res.status} ${res.statusText}`;
  statusEl.className = res.ok ? "ok" : "err";

  if (!res.ok) {
    const detail = body.errors ? `: ${body.errors.join(", ")}` : "";
    throw new Error((body.message || "Request failed") + detail);
  }
  return body;
}

// ---------- UI helpers ----------
let toastTimer;
function notify(message, isError = false) {
  toast.textContent = message;
  toast.className = `toast show${isError ? " error" : ""}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.className = "toast"), 2800);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

function render(highlightId) {
  const q = search.value.trim().toLowerCase();
  const rows = students.filter((s) =>
    [s.name, s.email, s.course].some((v) => v.toLowerCase().includes(q))
  );

  list.innerHTML = rows
    .map(
      (s) => `
      <tr data-id="${s.id}" class="${s.id === highlightId ? "highlight" : ""}">
        <td>${s.id}</td>
        <td>${escapeHtml(s.name)}</td>
        <td>${escapeHtml(s.email)}</td>
        <td>${escapeHtml(s.course)}</td>
        <td>${s.age}</td>
        <td>
          <button class="link" data-action="edit">Edit</button>
          <button class="link danger" data-action="delete">Delete</button>
        </td>
      </tr>`
    )
    .join("");

  empty.hidden = rows.length > 0;
  count.textContent = `${students.length} total`;
}

function resetForm() {
  form.reset();
  idInput.value = "";
  formTitle.textContent = "Add student";
  submitBtn.textContent = "Add student";
  cancelBtn.hidden = true;
  Object.values(fields).forEach((f) => f.classList.remove("invalid"));
}

function fillForm(student) {
  idInput.value = student.id;
  Object.keys(fields).forEach((key) => (fields[key].value = student[key]));
  formTitle.textContent = `Edit student #${student.id}`;
  submitBtn.textContent = "Save changes";
  cancelBtn.hidden = false;
  fields.name.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function validateForm() {
  let ok = true;
  Object.values(fields).forEach((f) => {
    const valid = f.checkValidity() && f.value.trim() !== "";
    f.classList.toggle("invalid", !valid);
    if (!valid) ok = false;
  });
  return ok;
}

// ---------- CRUD ----------
async function loadStudents(highlightId) {
  try {
    const { data } = await request(API);
    students = data;
    render(highlightId);
  } catch (err) {
    notify(err.message, true);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateForm()) return notify("Please fill all fields correctly", true);

  const payload = {
    name: fields.name.value,
    email: fields.email.value,
    course: fields.course.value,
    age: Number(fields.age.value),
  };
  const id = idInput.value;

  try {
    const { message, data } = id
      ? await request(`${API}/${id}`, { method: "PUT", body: JSON.stringify(payload) })
      : await request(API, { method: "POST", body: JSON.stringify(payload) });
    notify(message);
    resetForm();
    loadStudents(data.id);
  } catch (err) {
    notify(err.message, true);
  }
});

cancelBtn.addEventListener("click", resetForm);

list.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = Number(btn.closest("tr").dataset.id);

  if (btn.dataset.action === "edit") {
    try {
      const { data } = await request(`${API}/${id}`);
      fillForm(data);
    } catch (err) {
      notify(err.message, true);
    }
  }

  if (btn.dataset.action === "delete") {
    if (!confirm(`Delete student #${id}?`)) return;
    try {
      const { message } = await request(`${API}/${id}`, { method: "DELETE" });
      notify(message);
      if (Number(idInput.value) === id) resetForm();
      loadStudents();
    } catch (err) {
      notify(err.message, true);
    }
  }
});

search.addEventListener("input", () => render());

findId.addEventListener("keydown", async (e) => {
  if (e.key !== "Enter") return;
  const id = findId.value.trim();
  if (!id) return render();
  try {
    const { data } = await request(`${API}/${id}`);
    search.value = "";
    render(data.id);
    notify(`Found: ${data.name}`);
  } catch (err) {
    notify(err.message, true);
  }
});

loadStudents();
