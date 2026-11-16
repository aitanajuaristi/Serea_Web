
// PARALLAX
var imagenes = document.querySelectorAll(".parallax");

new SimpleParallax(imagenes, {
  orientation: "right",
  scale: 1.1,
  maxTransition: 60
});