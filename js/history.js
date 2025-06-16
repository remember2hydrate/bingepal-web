function loadHistory() {
  fetch('https://bingepal.onrender.com/api/history?limit=50')
    .then(res => res.json())
    .then(data => {
      const logList = document.getElementById("logList");
      logList.innerHTML = ""; // clear any previous rows

      data.forEach(item => {
        // Converts UTC ISO string to local date/time
        const formattedDate = new Date(item.timestamp).toLocaleString();

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${formattedDate}</td>
          <td class="text-capitalize">${item.type}</td>
          <td>${item.title}</td>
        `;
        logList.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Failed to load history:", err);
    });
}

// Auto-load
document.addEventListener("DOMContentLoaded", loadHistory);
