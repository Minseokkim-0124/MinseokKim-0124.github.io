---
layout: page
title: Gallery
permalink: /gallery/
nav: true
nav_order: 6
images:
  photoswipe: true
---

<div class="gallery-grid" id="photo-gallery">
  {% assign gallery_images = site.static_files | where_exp: "file", "file.path contains '/assets/img/gallery/'" %}
  {% for image in gallery_images %}
    {% assign ext = image.extname | downcase %}
    {% if ext == '.jpg' or ext == '.jpeg' or ext == '.png' %}
      <a href="{{ image.path | relative_url }}"
         class="gallery-item"
         data-pswp-width="0"
         data-pswp-height="0"
         target="_blank">
        <img src="{{ image.path | relative_url }}"
             alt="{{ image.name | remove: image.extname }}"
             loading="lazy" />
      </a>
    {% endif %}
  {% endfor %}
</div>

<style>
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 10px;
    margin-top: 20px;
  }
  .gallery-grid a img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 6px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    display: block;
  }
  .gallery-grid a img:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  }
</style>

<script>
  // Auto-detect actual image dimensions for PhotoSwipe
  document.querySelectorAll(".gallery-grid a").forEach(function (a) {
    var img = new Image();
    img.onload = function () {
      a.dataset.pswpWidth = this.naturalWidth;
      a.dataset.pswpHeight = this.naturalHeight;
    };
    img.src = a.href;
  });
</script>
