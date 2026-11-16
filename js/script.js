
// CABECERA 
function actualizarCabecera() {
  var hayScroll = $(window).scrollTop() > 10;
  var menuAbierto = $(".header__boton").hasClass("abierto");
  $(".header").toggleClass("header--solido", hayScroll || menuAbierto);
}

$(window).on("scroll", actualizarCabecera);
actualizarCabecera();

// MENU MOVIL 
$(".header__boton").on("click", function () {
  $(".header__nav").toggleClass("abierto");
  $(this).toggleClass("abierto");
  actualizarCabecera();
});


// ANIMACIONES AOS 
if (typeof AOS !== "undefined") {
  AOS.init({
    duration: 800,       
    offset: 100,
    easing: "ease-out",
    once: true,          
    disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  });

  $(window).on("load", function () {
    AOS.refresh();
  });
}