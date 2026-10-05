const STORAGE_KEY = "tpe401-meson-pedidos-v1";
const states = ["pending", "progress", "ready", "delivered"];
const labels = {
  pending: "Por preparar",
  progress: "En preparación",
  ready: "Listo para retiro",
  delivered: "Entregado",
};
const nextLabels = {
  pending: "Iniciar preparación",
  progress: "Marcar listo",
  ready: "Marcar entregado",
};
const sampleOrders = [
  {
    id: 1004,
    customer: "Camila Rojas",
    phone: "+56 9 8451 2200",
    items: "2 cajas de tornillos 3/4 y 1 tarro de pintura blanca",
    status: "pending",
    createdAt: "2026-10-05T09:40:00-03:00",
  },
  {
    id: 1003,
    customer: "Luis Andrade",
    phone: "+56 9 7312 4680",
    items: "4 metros de cable eléctrico y 2 enchufes dobles",
    status: "progress",
    createdAt: "2026-10-05T09:15:00-03:00",
  },
  {
    id: 1002,
    customer: "María Paredes",
    phone: "+56 9 6678 9051",
    items: "1 cerradura de sobreponer",
    status: "ready",
    createdAt: "2026-10-05T08:57:00-03:00",
  },
  {
    id: 1001,
    customer: "Jorge Muñoz",
    phone: "+56 9 9123 4456",
    items: "3 sacos de cemento de 25 kg",
    status: "delivered",
    createdAt: "2026-10-05T08:32:00-03:00",
  },
];

function initialOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.every(isOrder)) return saved;
  } catch (_) {
    /* Una copia dañada se reemplaza por los datos de ejemplo. */
  }
  return structuredClone(sampleOrders);
}
function isOrder(value) {
  return (
    value &&
    Number.isSafeInteger(value.id) &&
    typeof value.customer === "string" &&
    typeof value.phone === "string" &&
    typeof value.items === "string" &&
    states.includes(value.status) &&
    typeof value.createdAt === "string"
  );
}
let orders = initialOrders();
const list = document.querySelector("#orders-list");
const search = document.querySelector("#search");
const filter = document.querySelector("#status-filter");
const dialog = document.querySelector("#order-dialog");
const form = document.querySelector("#order-form");
const toast = document.querySelector("#toast");
let toastTimer;
let editingId = null;

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (_) {
    announce("No se pudo guardar en este navegador.");
  }
}
function announce(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3000);
}
function textNode(tag, content, className) {
  const element = document.createElement(tag);
  element.textContent = content;
  if (className) element.className = className;
  return element;
}
function render() {
  for (const state of states)
    document.querySelector(`#count-${state}`).textContent = orders.filter(
      (order) => order.status === state,
    ).length;
  const term = search.value.trim().toLocaleLowerCase("es");
  const visible = orders
    .filter(
      (order) =>
        (filter.value === "all" || order.status === filter.value) &&
        [order.customer, order.phone, order.items].some((value) =>
          value.toLocaleLowerCase("es").includes(term),
        ),
    )
    .sort((a, b) => b.id - a.id);
  list.replaceChildren();
  if (!visible.length) {
    const empty = textNode("div", "", "empty");
    empty.append(
      textNode(
        "strong",
        orders.length
          ? "No hay pedidos con esos filtros."
          : "Todavía no hay pedidos.",
      ),
      textNode(
        "span",
        orders.length
          ? "Prueba otra búsqueda o cambia el estado."
          : "Usa «Nuevo pedido» para registrar el primero.",
      ),
    );
    list.append(empty);
    return;
  }
  for (const order of visible) {
    const article = document.createElement("article");
    article.className = "order";
    const main = textNode("div", "", "order-main"),
      title = textNode("div", "", "order-title");
    title.append(
      textNode("h3", order.customer),
      textNode("span", `#${order.id}`, "order-id"),
    );
    main.append(
      title,
      textNode(
        "p",
        `${order.phone} · ${new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "America/Santiago" }).format(new Date(order.createdAt))}`,
        "order-meta",
      ),
      textNode("p", order.items, "order-items"),
    );
    const actions = textNode("div", "", "order-actions");
    actions.append(
      textNode("span", labels[order.status], `badge ${order.status}`),
    );
    if (order.status === "pending") {
      const editButton = textNode("button", "Editar", "edit-button");
      editButton.type = "button";
      editButton.dataset.edit = String(order.id);
      editButton.setAttribute(
        "aria-label",
        `Editar pedido de ${order.customer}`,
      );
      actions.append(editButton);
    }
    if (nextLabels[order.status]) {
      const button = textNode(
        "button",
        nextLabels[order.status],
        "next-button",
      );
      button.type = "button";
      button.dataset.advance = String(order.id);
      button.setAttribute(
        "aria-label",
        `${nextLabels[order.status]}: pedido de ${order.customer}`,
      );
      actions.append(button);
    }
    article.append(main, actions);
    list.append(article);
  }
}

function openOrderDialog(order = null) {
  editingId = order?.id ?? null;
  form.reset();
  document.querySelector("#dialog-kicker").textContent = order
    ? `Pedido #${order.id}`
    : "Registro";
  document.querySelector("#dialog-title").textContent = order
    ? "Editar pedido"
    : "Nuevo pedido";
  document.querySelector("#dialog-intro").textContent = order
    ? "Corrige los datos antes de iniciar la preparación. El número y el estado del pedido se conservan."
    : "Copia los datos del mensaje para que el pedido no dependa del cuaderno.";
  document.querySelector("#save-order").textContent = order
    ? "Guardar cambios"
    : "Guardar pedido";
  if (order) {
    form.elements.customer.value = order.customer;
    form.elements.phone.value = order.phone;
    form.elements.items.value = order.items;
  }
  dialog.showModal();
  form.elements.customer.focus();
}
document.querySelector("#new-order").addEventListener("click", () => {
  openOrderDialog();
});
document
  .querySelector("#close-dialog")
  .addEventListener("click", () => dialog.close());
document
  .querySelector("#cancel-dialog")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const customer = String(data.get("customer")).trim(),
    phone = String(data.get("phone")).trim(),
    items = String(data.get("items")).trim();
  if (!customer || !phone || !items) {
    announce("Completa todos los datos del pedido.");
    return;
  }
  if (editingId !== null) {
    const order = orders.find((item) => item.id === editingId);
    if (!order || order.status !== "pending") {
      dialog.close();
      announce("Este pedido ya no se puede editar.");
      return;
    }
    Object.assign(order, { customer, phone, items });
    save();
    render();
    dialog.close();
    announce(`Pedido #${order.id} actualizado.`);
    return;
  }
  const id = Math.max(1000, ...orders.map((order) => order.id)) + 1;
  orders.unshift({
    id,
    customer,
    phone,
    items,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  save();
  render();
  dialog.close();
  announce(`Pedido #${id} guardado.`);
});
list.addEventListener("click", (event) => {
  const editButton = event.target.closest("button[data-edit]");
  if (editButton) {
    const order = orders.find(
      (item) => item.id === Number(editButton.dataset.edit),
    );
    if (order?.status === "pending") openOrderDialog(order);
    return;
  }
  const button = event.target.closest("button[data-advance]");
  if (!button) return;
  const order = orders.find(
    (item) => item.id === Number(button.dataset.advance),
  );
  if (!order) return;
  const index = states.indexOf(order.status);
  if (index < 0 || index >= states.length - 1) return;
  order.status = states[index + 1];
  save();
  render();
  announce(`Pedido #${order.id}: ${labels[order.status].toLowerCase()}.`);
});
search.addEventListener("input", render);
filter.addEventListener("change", render);
document.querySelector("#reset-demo").addEventListener("click", () => {
  if (
    !confirm(
      "¿Restablecer los pedidos de ejemplo? Se borrarán los pedidos creados en este navegador.",
    )
  )
    return;
  orders = structuredClone(sampleOrders);
  save();
  search.value = "";
  filter.value = "all";
  render();
  announce("Datos de ejemplo restablecidos.");
});
render();
