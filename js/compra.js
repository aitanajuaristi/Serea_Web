// ==========================================================
// SEREA SURF CAMP - compra.js
// Solo se carga en compra.html. Requiere jQuery.
// ==========================================================

// ---------- 1. TARIFA ELEGIDA ----------
// Leemos ?tarifa=... de la URL y rellenamos el resumen de la reserva
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

// Serea Day se reserva por día; las demás, por semanas
var esDay = (elegida === "day");

if (esDay) {
  $(".pago").addClass("pago--day");
}


// ---------- 2. SELECTOR DE SEMANAS ----------
// El botón abre y cierra la lista de casillas
$(".semanas__boton").on("click", function () {
  var abierto = $(this).hasClass("abierto");

  $(this).toggleClass("abierto");
  $(this).attr("aria-expanded", !abierto);
  $(".semanas__lista").slideToggle(200);
});

// Devuelve las semanas marcadas, por ejemplo ["Semana 1", "Semana 3"]
function semanasElegidas() {
  var elegidas = [];
  $('[name="semanas"]:checked').each(function () {
    elegidas.push($(this).val());
  });
  return elegidas;
}

// Al marcar o desmarcar, el botón enseña lo elegido
$('[name="semanas"]').on("change", function () {
  var marcadas = semanasElegidas();
  var texto = $(".semanas__texto");

  if (marcadas.length === 0) {
    texto.text("Selecciona una semana").removeClass("elegido");
  } else {
    texto.text(marcadas.join(", ")).addClass("elegido");
  }
});

// Clic fuera del selector: se cierra la lista
$(document).on("click", function (evento) {
  if (!$(evento.target).closest(".semanas").length && $(".semanas__lista").is(":visible")) {
    $(".semanas__boton").removeClass("abierto").attr("aria-expanded", "false");
    $(".semanas__lista").slideUp(200);
  }
});


// ---------- 3. VALIDACIÓN DEL FORMULARIO ----------
// Desactivamos la validación del navegador: la hacemos nosotras con jQuery
$(".pago").attr("novalidate", "novalidate");

// Cada campo va dentro de su caja, para poner el mensaje justo debajo
$(".pago .campo").wrap('<div class="campo-caja"></div>');

// Dónde se marca el error: en el selector de semanas, el recuadro de la tarjeta,
// el checkbox de términos o el propio campo
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

// Comprueba que la tarjeta no esté caducada (formato MM / AA)
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

// El día elegido tiene que estar dentro de la temporada (min y max del HTML)
function diaValido(valor) {
  var campo = $('[name="dia"]');
  return valor !== "" && valor >= campo.attr("min") && valor <= campo.attr("max");
}

// Una regla por campo: el campo, cómo se comprueba y el mensaje si falla
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

// Recorre todas las reglas. Devuelve true si todo está bien
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
    // Serea Day: un día dentro de la temporada
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
    // Junior y Adults: al menos una semana
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

  // La casilla de términos
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

  // Llevamos el cursor al primer campo con error
  if (primerError) {
    primerError.focus();
  }

  return todoBien;
}

// Al escribir en un campo, se quita su error
$(".pago input").on("input change", function () {
  quitarError($(this));
});

// Número de tarjeta: solo dígitos, en grupos de 4
$('[name="numero"]').on("input", function () {
  var digitos = $(this).val().replace(/\D/g, "").slice(0, 16);
  $(this).val(digitos.replace(/(\d{4})(?=\d)/g, "$1 "));
});


// ---------- 4. VENTANA MODAL ----------
function abrirModal() {
  var detalle;
  var cantidad;

  if (esDay) {
    // Un solo día: lo mostramos como dd/mm/aaaa
    var dia = $('[name="dia"]').val().split("-");   // aaaa-mm-dd
    detalle = dia[2] + "/" + dia[1] + "/" + dia[0];
    cantidad = 1;
    $("#modal-etiqueta").text("Día");
  } else {
    var semanas = semanasElegidas();
    detalle = semanas.join(", ");
    cantidad = semanas.length;
    $("#modal-etiqueta").text(cantidad === 1 ? "Semana" : "Semanas");
  }

  // Total = precio de la tarifa x semanas (o x 1 día)
  var precioUnitario = parseInt(tarifas[elegida].precio, 10);

  // Solo el nombre de pila: "Gracias, Aitana"
  $("#modal-nombre").text($.trim($('[name="nombre"]').val()).split(" ")[0]);
  $("#modal-tarifa").text(tarifas[elegida].nombre);
  $("#modal-semanas").text(detalle);
  $("#modal-precio").text((precioUnitario * cantidad) + "€");

  $("#modal").fadeIn(250);
}

function cerrarModal() {
  $("#modal").fadeOut(250);
}

// Al pulsar "Pagar": si todo está bien, se abre la modal
$(".pago").on("submit", function (evento) {
  evento.preventDefault();

  if (validarFormulario()) {
    abrirModal();
  }
});

// Se cierra con la X, haciendo clic fuera de la caja o con la tecla Esc
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
