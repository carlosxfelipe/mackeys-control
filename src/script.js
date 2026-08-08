globalThis.handleAction = async function (action) {
  const statusEl = document.getElementById("status-message");
  const buttons = document.querySelectorAll(".btn");

  // Set loading state
  statusEl.textContent = "Executando...";
  statusEl.classList.add("loading");
  buttons.forEach((btn) => btn.disabled = true);

  try {
    const response = await fetch(`/api/${action}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro desconhecido");
    }

    statusEl.textContent = data.message;
  } catch (error) {
    statusEl.textContent = `Erro: ${error.message}`;
  } finally {
    // Remove loading state
    statusEl.classList.remove("loading");
    buttons.forEach((btn) => btn.disabled = false);
  }
};
