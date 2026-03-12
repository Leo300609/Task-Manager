// Referências do DOM
const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");

// Banco de dados local: tenta ler do navegador ou inicia vazio
let tasks = JSON.parse(localStorage.getItem("tasks_data")) || [];
let currentFilter = "all";

// Salva o array de tarefas convertido em string no LocalStorage
function saveTasks() {
  localStorage.setItem("tasks_data", JSON.stringify(tasks));
}

// Adiciona uma nova tarefa com texto e data
function addTask() {
  const text = taskInput.value.trim();
  const date = taskDate.value;

  if (text === "") {
    alert("Por favor, descreva a tarefa!");
    return;
  }

  const newTask = {
    id: Date.now(), // ID único baseado no tempo
    text: text,
    date: date, // Armazena a string da data e hora
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  // Limpa os campos após a inserção
  taskInput.value = "";
  taskDate.value = "";
}

// Altera o status de concluído (true/false)
function toggleTask(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t,
  );
  saveTasks();
  renderTasks();
}

// Remove uma tarefa filtrando o ID
function removeTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

// Configura os botões de filtro
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    renderTasks();
  });
});

// Desenha a interface baseada no filtro e nos dados
function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks;
  if (currentFilter === "pending") filtered = tasks.filter((t) => !t.completed);
  if (currentFilter === "completed")
    filtered = tasks.filter((t) => t.completed);

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    // Lógica de formatação de data
    let dateHtml = "";
    if (task.date) {
      const dateObj = new Date(task.date);
      // Formata para o padrão: 15/03/2026 19:00
      const formatted = dateObj.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      dateHtml = `<span class="task-deadline"><i class="far fa-calendar-alt"></i> ${formatted}</span>`;
    }

    li.innerHTML = `
            <div>
                <span>${task.text}</span>
                ${dateHtml}
            </div>
            <div class="actions">
                <button onclick="toggleTask(${task.id})">
                    <i class="fas ${task.completed ? "fa-undo" : "fa-check"}"></i>
                </button>
                <button onclick="removeTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    taskList.appendChild(li);
  });
}

// Listeners de eventos
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// Inicialização
renderTasks();
