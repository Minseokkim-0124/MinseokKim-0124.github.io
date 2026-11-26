const list = document.querySelector("#papers");
for (const paper of window.papers) {
  const item = document.createElement("article");
  item.className = "paper";
  item.id = `paper-${paper.key}`;
  item.dataset.kind = paper.kind;
  const meta = document.createElement("div");
  meta.className = "paper-meta";
  const year = document.createElement("span");
  year.className = "paper-year";
  year.textContent = paper.year;
  const venue = document.createElement("span");
  venue.className = "venue";
  venue.textContent = paper.venue;
  meta.append(year, venue);
  const content = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = paper.title;
  const authors = document.createElement("p");
  paper.authors.split(" and ").forEach((name, index, array) => {
    if (index) authors.append(document.createTextNode(index === array.length - 1 ? " and " : ", "));
    if (name.startsWith("Minseok Kim")) {
      const strong = document.createElement("strong");
      strong.textContent = name;
      authors.append(strong);
    } else authors.append(document.createTextNode(name));
  });
  content.append(title, authors);
  item.append(meta, content);
  list.append(item);
}
function filterPapers(kind) {
  let count = 0;
  document.querySelectorAll(".paper").forEach((p) => {
    p.hidden = kind !== "all" && p.dataset.kind !== kind;
    if (!p.hidden) count++;
  });
  document.querySelector(".paper-count").textContent = `${count} papers`;
  document.querySelectorAll(".filter").forEach((b) => {
    const active = b.dataset.filter === kind;
    b.classList.toggle("active", active);
    b.setAttribute("aria-pressed", String(active));
  });
}
document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => filterPapers(button.dataset.filter)));
filterPapers("all");
document.querySelectorAll('a[href^="#paper-"]').forEach((a) => a.addEventListener("click", () => filterPapers("all")));

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".nav-link").forEach((a) => {
        const active = a.pathname === location.pathname && a.hash === `#${entry.target.id}`;
        a.classList.toggle("active", active);
        if (active) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    }),
  { rootMargin: "-15% 0px -60% 0px", threshold: 0 }
);
document.querySelectorAll("#home,#research,#publications,#about").forEach((section) => observer.observe(section));
