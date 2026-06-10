---
layout: page
title: Gallery
permalink: /gallery/
nav: true
nav_order: 6
images:
  photoswipe: true
---

<div class="pswp-gallery pswp-gallery--single-column" id="photo-gallery">

  {% assign gallery_images = site.static_files | where_exp: "file", "file.path contains 'assets/img/gallery'" %}
  {% for image in gallery_images %}
    {% assign ext = image.extname | downcase %}
    {% if ext == '.jpg' or ext == '.jpeg' or ext == '.png' or ext == '.webp' %}
      <a href="{{ image.path | relative_url }}"
         data-pswp-width="2000"
         data-pswp-height="1500"
         target="_blank">
        <img src="{{ image.path | relative_url }}" alt="{{ image.name | remove: image.extname }}" />
      </a>
    {% endif %}
  {% endfor %}

</div>

<style>
  .pswp-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 12px;
    margin-top: 20px;
  }
  .pswp-gallery a img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 8px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
  }
  .pswp-gallery a img:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }
</style>
