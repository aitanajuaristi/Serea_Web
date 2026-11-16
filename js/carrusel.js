
// CARRUSEL
var pista = $(".carrusel__pista");
var contenedorPuntos = $(".carrusel__puntos");

var total = pista.children().length;
var visibles = 3;
var duracion = 600;
var actual = 0;
var temporizador;
var reinicio;

// CLONES
pista.children().slice(0, visibles).clone()
  .attr("alt", "")
  .attr("aria-hidden", "true")
  .appendTo(pista);

var fotos = pista.children();

// PUNTOS
for (var i = 0; i < total; i++) {
  contenedorPuntos.append('<button type="button" class="carrusel__punto" aria-label="Ir a la foto ' + (i + 1) + '"></button>');
}
var puntos = $(".carrusel__punto");

// MOSTRAR
function mostrar(n, animar) {
  actual = n;

  if (animar === false) {
    pista.css("transition", "none");
  }

  pista.css("transform", "translateX(-" + fotos.eq(actual).position().left + "px)");

  if (animar === false) {
    pista[0].offsetWidth;
    pista.css("transition", "");
  }

  puntos.removeClass("activo").eq(actual % total).addClass("activo");
}

// AVANCE AUTOMÁTICO
function siguiente() {
  mostrar(actual + 1);

  if (actual === total) {
    reinicio = setTimeout(function () {
      mostrar(0, false);
    }, duracion);
  }
}

function anterior() {
  if (actual === 0) {
    mostrar(total, false);
  }
  mostrar(actual - 1);
}

function arrancar() {
  clearInterval(temporizador);
  temporizador = setInterval(siguiente, 4000);
}

// CLICK EN PUNTOS
puntos.on("click", function () {
  clearTimeout(reinicio);
  mostrar($(this).index());
  arrancar();
});

// SWIPE
var inicioX = 0;
var inicioY = 0;

pista[0].addEventListener("touchstart", function (e) {
  inicioX = e.touches[0].clientX;
  inicioY = e.touches[0].clientY;
}, { passive: true });

pista[0].addEventListener("touchend", function (e) {
  var difX = e.changedTouches[0].clientX - inicioX;
  var difY = e.changedTouches[0].clientY - inicioY;

  if (Math.abs(difX) < 50 || Math.abs(difX) < Math.abs(difY)) {
    return;
  }

  clearTimeout(reinicio);

  if (actual >= total) {
    mostrar(0, false);
  }

  if (difX < 0) {
    siguiente();
  } else {
    anterior();
  }

  arrancar();
}, { passive: true });

// RESIZE
$(window).on("resize", function () {
  mostrar(actual, false);
});

// INICIO
mostrar(0, false);
arrancar();