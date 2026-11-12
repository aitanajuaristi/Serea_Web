// ==========================================================
// SEREA SURF CAMP - carrusel.js
// Solo se carga en el-camp.html. Requiere jQuery.
// ==========================================================
 
var pista = $(".carrusel__pista");
var contenedorPuntos = $(".carrusel__puntos");
 
var total = pista.children().length;   // 6 fotos
var visibles = 3;                      // fotos que se ven a la vez
var duracion = 600;                    // ms, igual que el transition del CSS
var actual = 0;                        // posición actual (empieza en 0)
var temporizador;
var reinicio;
 
// Copiamos las 3 primeras fotos al final para que el bucle no tenga saltos
pista.children().slice(0, visibles).clone()
  .attr("alt", "")
  .attr("aria-hidden", "true")
  .appendTo(pista);
 
var fotos = pista.children();
 
// Un punto por foto
for (var i = 0; i < total; i++) {
  contenedorPuntos.append('<button type="button" class="carrusel__punto" aria-label="Ir a la foto ' + (i + 1) + '"></button>');
}
var puntos = $(".carrusel__punto");
 
// Igual que mostrar(n) de clase, pero desplazando la pista en vez de hacer fade
function mostrar(n, animar) {
  actual = n;
 
  if (animar === false) {
    pista.css("transition", "none");
  }
 
  pista.css("transform", "translateX(-" + fotos.eq(actual).position().left + "px)");
 
  if (animar === false) {
    pista[0].offsetWidth;            // fuerza el repintado antes de devolver la transición
    pista.css("transition", "");
  }
 
  puntos.removeClass("activo").eq(actual % total).addClass("activo");
}
 
function siguiente() {
  mostrar(actual + 1);
 
  // Al llegar a las copias, volvemos al principio sin que se note
  if (actual === total) {
    reinicio = setTimeout(function () {
      mostrar(0, false);
    }, duracion);
  }
}
 
// Avance automático cada 4 segundos
function arrancar() {
  clearInterval(temporizador);
  temporizador = setInterval(siguiente, 4000);
}
 
// Al pulsar un punto: vamos a esa foto y reiniciamos el avance automático
puntos.on("click", function () {
  clearTimeout(reinicio);
  mostrar($(this).index());
  arrancar();
});
 
// Si cambia el tamaño de la ventana, recolocamos
$(window).on("resize", function () {
  mostrar(actual, false);
});
 
mostrar(0, false);
arrancar();
 