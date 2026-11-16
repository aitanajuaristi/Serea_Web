
// TARIFA 
var tarifas = {
  junior: {
    nombre: "Serea Junior -18",
    texto: "Incluye 7 días y 6 noches de alojamiento compartido, pensión completa, clases diarias de surf con material incluido, actividades deportivas y recreativas, excursiones y supervisión de monitores durante toda la estancia.",
    precio: "650€"
  },
  adults: {
    nombre: "Serea Adults +18",
    texto: "Incluye 7 días y 6 noches de alojamiento compartido, clases diarias de surf con material incluido, desayunos, sesiones de yoga, surfskate y diferentes actividades para disfrutar del mar y conocer a otras chicas.",
    precio: "590€"
  },
  day: {
    nombre: "Serea Day",
    texto: "Incluye una jornada de surf con monitores, todo el material necesario, una actividad complementaria de yoga o surfskate y un picnic para disfrutar de un día completo en Serea.",
    precio: "75€"
  }
};

var parametros = new URLSearchParams(window.location.search);
var elegida = parametros.get("tarifa");

if (!tarifas[elegida]) {
  elegida = "junior";
}

$(".reserva")
  .removeClass("reserva--junior reserva--adults reserva--day")
  .addClass("reserva--" + elegida);

$(".reserva__texto").text(tarifas[elegida].texto);
$(".reserva__nombre").text(tarifas[elegida].nombre);
$(".reserva__precio").text(tarifas[elegida].precio);

var esDay = (elegida === "day");

if (esDay) {
  $(".pago").addClass("pago--day");
}


// SELECTOR DE SEMANAS
$(".semanas__boton").on("click", function () {
  var abierto = $(this).hasClass("abierto");

  $(this).toggleClass("abierto");
  $(this).attr("aria-expanded", !abierto);
  $(".semanas__lista").slideToggle(200);
});

function semanasElegidas() {
  var elegidas = [];
  $('[name="semanas"]:checked').each(function () {
    elegidas.push($(this).val());
  });
  return elegidas;
}

$('[name="semanas"]').on("change", function () {
  var marcadas = semanasElegidas();
  var texto = $(".semanas__texto");

  if (marcadas.length === 0) {
    texto.text("Selecciona una semana").removeClass("elegido");
  } else {
    texto.text(marcadas.join(", ")).addClass("elegido");
  }
});

$(document).on("click", function (evento) {
  if (!$(evento.target).closest(".semanas").length && $(".semanas__lista").is(":visible")) {
    $(".semanas__boton").removeClass("abierto").attr("aria-expanded", "false");
    $(".semanas__lista").slideUp(200);
  }
});

// VALIDACIÓN
$(".pago").attr("novalidate", "novalidate");

$(".pago .campo").wrap('<div class="campo-caja"></div>');

function lugarDelError(campo) {
  if (campo.closest(".semanas").length) {
    return campo.closest(".semanas");
  }
  if (campo.closest(".tarjeta__campos").length) {
    return campo.closest(".tarjeta__campos");
  }
  if (campo.closest(".acepto").length) {
    return campo.closest(".acepto");
  }
  return campo;
}

function quitarError(campo) {
  var lugar = lugarDelError(campo);
  lugar.removeClass("con-error");
  lugar.next(".campo__error").remove();
}

function mostrarError(campo, mensaje) {
  quitarError(campo);
  var lugar = lugarDelError(campo);
  lugar.addClass("con-error");
  $('<p class="campo__error"></p>').text(mensaje).insertAfter(lugar);
}

function caducidadValida(valor) {
  var partes = valor.match(/^(0[1-9]|1[0-2])\s?\/\s?(\d{2})$/);
  if (!partes) {
    return false;
  }
  var mes = parseInt(partes[1], 10);
  var anio = 2000 + parseInt(partes[2], 10);
  var hoy = new Date();
  return anio > hoy.getFullYear() || (anio === hoy.getFullYear() && mes >= hoy.getMonth() + 1);
}

function diaValido(valor) {
  var campo = $('[name="dia"]');
  return valor !== "" && valor >= campo.attr("min") && valor <= campo.attr("max");
}

var reglas = [
  {
    campo: $('[name="nombre"]'),
    valido: function (v) { return v.length >= 3; },
    mensaje: "Escribe tu nombre y apellidos."
  },
  {
    campo: $('[name="email"]'),
    valido: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
    mensaje: "Escribe un correo electrónico válido."
  },
  {
    campo: $('[name="telefono"]'),
    valido: function (v) { return /^\+?[0-9\s]{9,15}$/.test(v); },
    mensaje: "Escribe un teléfono válido (solo números)."
  },
  {
    campo: $('[name="numero"]'),
    valido: function (v) { return /^\d{16}$/.test(v.replace(/\s/g, "")); },
    mensaje: "El número de tarjeta debe tener 16 dígitos."
  },
  {
    campo: $('[name="caducidad"]'),
    valido: caducidadValida,
    mensaje: "Caducidad no válida. Usa el formato MM / AA."
  },
  {
    campo: $('[name="cvc"]'),
    valido: function (v) { return /^\d{3,4}$/.test(v); },
    mensaje: "El CVC debe tener 3 o 4 dígitos."
  },
  {
    campo: $('[name="titular"]'),
    valido: function (v) { return v.length >= 3; },
    mensaje: "Escribe el nombre del titular."
  }
];

function validarFormulario() {
  var todoBien = true;
  var primerError = null;

  $.each(reglas, function (i, regla) {
    var valor = $.trim(regla.campo.val());

    if (regla.valido(valor)) {
      quitarError(regla.campo);
    } else {
      mostrarError(regla.campo, regla.mensaje);
      todoBien = false;
      if (!primerError) {
        primerError = regla.campo;
      }
    }
  });

  if (esDay) {
    var dia = $('[name="dia"]');
    if (diaValido(dia.val())) {
      quitarError(dia);
    } else {
      mostrarError(dia, "Elige un día entre el 1 de junio y el 30 de septiembre.");
      todoBien = false;
      if (!primerError) {
        primerError = dia;
      }
    }
  } else {
    var semanas = $('[name="semanas"]');
    if (semanasElegidas().length > 0) {
      quitarError(semanas.first());
    } else {
      mostrarError(semanas.first(), "Elige al menos una semana.");
      todoBien = false;
      if (!primerError) {
        primerError = $(".semanas__boton");
      }
    }
  }

  var acepto = $('[name="acepto"]');
  if (acepto.is(":checked")) {
    quitarError(acepto);
  } else {
    mostrarError(acepto, "Debes aceptar los términos y la política de privacidad.");
    todoBien = false;
    if (!primerError) {
      primerError = acepto;
    }
  }

  if (primerError) {
    primerError.focus();
  }

  return todoBien;
}

$(".pago input").on("input change", function () {
  quitarError($(this));
});

$('[name="numero"]').on("input", function () {
  var digitos = $(this).val().replace(/\D/g, "").slice(0, 16);
  $(this).val(digitos.replace(/(\d{4})(?=\d)/g, "$1 "));
});

// MODAL
function abrirModal() {
  var detalle;
  var cantidad;

  if (esDay) {
    var dia = $('[name="dia"]').val().split("-");   
    detalle = dia[2] + "/" + dia[1] + "/" + dia[0];
    cantidad = 1;
    $("#modal-etiqueta").text("Día");
  } else {
    var semanas = semanasElegidas();
    detalle = semanas.join(", ");
    cantidad = semanas.length;
    $("#modal-etiqueta").text(cantidad === 1 ? "Semana" : "Semanas");
  }

  var precioUnitario = parseInt(tarifas[elegida].precio, 10);

  $("#modal-nombre").text($.trim($('[name="nombre"]').val()).split(" ")[0]);
  $("#modal-tarifa").text(tarifas[elegida].nombre);
  $("#modal-semanas").text(detalle);
  $("#modal-precio").text((precioUnitario * cantidad) + "€");

  $("#modal").fadeIn(250);
}

function cerrarModal() {
  $("#modal").fadeOut(250);
}

$(".pago").on("submit", function (evento) {
  evento.preventDefault();

  if (validarFormulario()) {
    abrirModal();
  }
});

$(".modal__cerrar").on("click", cerrarModal);

$("#modal").on("click", function (evento) {
  if (evento.target === this) {
    cerrarModal();
  }
});

$(document).on("keydown", function (evento) {
  if (evento.key === "Escape") {
    cerrarModal();
  }
});
