// ==========================================================
// SEREA SURF CAMP - faq.js
// Solo se carga en el-camp.html. Requiere jQuery.
// ==========================================================
 
// Acordeón de preguntas frecuentes
$(".faq__pregunta").on("click", function () {
 
  var respuesta = $(this).next();
 
  // Cerramos las demás
  $(".faq__respuesta").not(respuesta).slideUp();
  $(".faq__pregunta").not(this).removeClass("abierto");
 
  // Abrimos o cerramos la que se ha pulsado
  respuesta.slideToggle();
  $(this).toggleClass("abierto");
});
 