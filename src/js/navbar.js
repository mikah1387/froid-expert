export function initNavbar() {
  const burg = document.querySelector(".burg");
  const navbar = document.querySelector(".navbar");
  const body = document.querySelector("body");

  if (!burg || !navbar) return; // sécurité

  burg.addEventListener("click", function () {
    this.classList.toggle("open");
    navbar.classList.toggle("open");
    body.classList.toggle("overhidden");
  });
}
