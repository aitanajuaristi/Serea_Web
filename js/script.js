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