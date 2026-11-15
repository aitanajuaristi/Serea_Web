// ==========================================================
// SEREA SURF CAMP - parallax.js
// Solo se carga en index.html. Requiere SimpleParallax.
// ==========================================================

var imagenes = document.querySelectorAll(".parallax");

new SimpleParallax(imagenes, {
  orientation: "right",
  scale: 1.15
});