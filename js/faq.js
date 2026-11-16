
// FAQ 
$(".faq__pregunta").on("click", function () {
 
  var respuesta = $(this).next();
 
  $(".faq__respuesta").not(respuesta).slideUp();
  $(".faq__pregunta").not(this).removeClass("abierto");
 
  respuesta.slideToggle();
  $(this).toggleClass("abierto");
});
 