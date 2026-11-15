// ==========================================================
// SEREA SURF CAMP - script.js
// Requiere jQuery (se carga antes que este archivo)
// ==========================================================

// Cabecera blanca al hacer scroll o con el menú abierto
function actualizarCabecera() {
  var hayScroll = $(window).scrollTop() > 10;
  var menuAbierto = $(".header__boton").hasClass("abierto");
  $(".header").toggleClass("header--solido", hayScroll || menuAbierto);
}

$(window).on("scroll", actualizarCabecera);
actualizarCabecera();

// Menú móvil
$(".header__boton").on("click", function () {
  $(".header__nav").toggleClass("abierto");
  $(this).toggleClass("abierto");
  actualizarCabecera();
});


// ---------- ANIMACIONES AL HACER SCROLL (AOS) ----------
if (typeof AOS !== "undefined") {
  AOS.init({
    duration: 800,       // más rápido que los 2000 del ejemplo: aquí es contenido real
    offset: 100,
    easing: "ease-out",
    once: true,          // solo se anima la primera vez
    disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  });

  // Cuando cargan las imágenes cambian las alturas: AOS recalcula
  $(window).on("load", function () {
    AOS.refresh();
  });
}