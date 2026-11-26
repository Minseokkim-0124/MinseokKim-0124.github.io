const photos = window.galleryImages;
const grid = document.querySelector("#photo-gallery");
const viewer = document.querySelector("#lightbox");
const fullPhoto = document.querySelector("#full-photo");
const stage = document.querySelector("#photo-stage");
const zoom = document.querySelector("#zoom-photo");
let selected = 0;
let returnFocus;
function renderPhoto() {
  const photo = photos[selected];
  fullPhoto.src = photo.src;
  fullPhoto.alt = photo.alt;
  document.querySelector("#open-photo").href = photo.src;
  document.querySelector("#photo-counter").textContent = `${selected + 1} / ${photos.length}`;
  stage.classList.remove("zoomed");
  zoom.textContent = "Zoom in";
  zoom.setAttribute("aria-label", "Zoom in");
  zoom.setAttribute("aria-pressed", "false");
  stage.scrollTop = 0;
  stage.scrollLeft = 0;
}
photos.forEach((photo, index) => {
  const button = document.createElement("button");
  button.className = "photo-tile";
  button.setAttribute("aria-label", `Open photo ${index + 1} of ${photos.length}`);
  const img = document.createElement("img");
  img.src = photo.thumb;
  img.alt = photo.alt;
  img.width = photo.width;
  img.height = photo.height;
  img.loading = index < 6 ? "eager" : "lazy";
  img.decoding = "async";
  button.append(img);
  grid.append(button);
  button.addEventListener("click", () => {
    selected = index;
    returnFocus = button;
    renderPhoto();
    viewer.showModal();
    document.body.style.overflow = "hidden";
    document.querySelector("#close-photo").focus();
  });
});
function movePhoto(delta) {
  selected = (selected + delta + photos.length) % photos.length;
  renderPhoto();
}
document.querySelector("#previous-photo").addEventListener("click", () => movePhoto(-1));
document.querySelector("#next-photo").addEventListener("click", () => movePhoto(1));
document.querySelector("#close-photo").addEventListener("click", () => viewer.close());
viewer.addEventListener("close", () => {
  document.body.style.overflow = "";
  returnFocus?.focus();
});
viewer.addEventListener("click", (e) => {
  if (e.target === viewer) viewer.close();
});
viewer.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    e.preventDefault();
    movePhoto(1);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    movePhoto(-1);
  }
});
zoom.addEventListener("click", () => {
  const isZoomed = stage.classList.toggle("zoomed");
  zoom.textContent = isZoomed ? "Zoom out" : "Zoom in";
  zoom.setAttribute("aria-label", zoom.textContent);
  zoom.setAttribute("aria-pressed", String(isZoomed));
});
