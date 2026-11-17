/* ===== ANIMAÇÕES DURANTE A ROLAGEM =====
   Elementos com [data-revelar] aparecem quando entram na tela.
   O atraso em sequência vem da variável CSS --atraso de cada elemento. */
(function () {
  "use strict";

  var elementos = document.querySelectorAll("[data-revelar]");
  if (!elementos.length) return;

  function mostrar(el) {
    el.classList.add("visivel");
  }

  // Navegadores muito antigos: mostra tudo de uma vez
  if (!("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(elementos, mostrar);
    return;
  }

  var observador = new IntersectionObserver(function (entradas, obs) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        mostrar(entrada.target);
        obs.unobserve(entrada.target); // anima só uma vez
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  Array.prototype.forEach.call(elementos, function (el) {
    observador.observe(el);
  });
})();
