// ==========================================================
// SEREA SURF CAMP - script.js
// Requiere jQuery (se carga antes que este archivo)
// ==========================================================
 
// ---------- MENÚ RESPONSIVE ----------
// Al pulsar el botón hamburguesa: desplegamos o plegamos el menú
// con slide y cambiamos el botón a X (clase "abierto")
$(".header__boton").on("click", function () {
  $(".header__nav").slideToggle();
  $(this).toggleClass("abierto");
});