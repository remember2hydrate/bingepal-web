document.addEventListener("DOMContentLoaded", async () => {
  const logsDiv = document.getElementById("logs");
  const tokenInput = document.getElementById("tokenInput");
  const submitBtn = document.getElementById("submitToken");
  const msgBox = document.getElementById("msgBox");

  const modal = new bootstrap.Modal(document.getElementById("clueModal"));

  async function fetchLogsWithToken(hash) {
    try {
      const res = await fetch("https://bingepal.onrender.com/api/dev-logs", {
        headers: { Authorization: hash },
      });

      if (res.status === 401) {
        return { ok: false, msg: "❌ Incorrect phrase. Try again!" };
      } else if (!res.ok) {
        return { ok: false, msg: "⚠️ Server error. Please try later." };
      }

      const data = await res.text();
      return { ok: true, logs: data };
    } catch (err) {
      return { ok: false, msg: "⚠️ Network error. Please try again." };
    }
  }

  async function tryWithStoredToken() {
    const cached = localStorage.getItem("devTokenHash");
    if (!cached) {
      modal.show();
      return;
    }

    const result = await fetchLogsWithToken(cached);
    if (result.ok) {
      showLogs(result.logs);
    } else {
      modal.show();
    }
  }

  function showLogs(data) {
    document.getElementById("warn-p").style.display = "none";
    logsDiv.textContent = data;
    logsDiv.style.filter = "none";
    logsDiv.style.pointerEvents = "auto";
    modal.hide();
  }

  submitBtn.addEventListener("click", async () => {
    const input = tokenInput.value.trim().toLowerCase();
    if (!input) return;

    const hash = await sha256(input);
    const result = await fetchLogsWithToken(hash);

    if (result.ok) {
      localStorage.setItem("devTokenHash", hash);

      showLogs(result.logs);
    } else {
      msgBox.textContent = result.msg;
    }
  });

  tryWithStoredToken();
});

async function sha256(str) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
