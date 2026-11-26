const themeButton = document.querySelector("#theme-toggle");
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
}
try {
  setTheme(localStorage.getItem("portfolio-theme") || "dark");
} catch {}
themeButton.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(theme);
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch {}
});
function updateClock() {
  document.querySelector("#seoul-time").textContent = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}
updateClock();
setInterval(updateClock, 30000);
