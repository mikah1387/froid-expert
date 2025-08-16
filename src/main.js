import "./css/style.css";
import { initNavbar } from "./js/navbar.js";

// Import dynamique des JS de pages
const pageModules = import.meta.glob("./js/pages/*.js");

// Base URL pour GitHub Pages (géré par Vite)
const BASE = import.meta.env.BASE_URL;

const routes = {
  "/froid-expert/": "Home.html",
  "/froid-expert/About": "About.html",
  "/froid-expert/Devis": "Devis.html",
  "/froid-expert/Contact": "Contact.html",
  "/froid-expert/Services": "Services.html",
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function loadComponent(id, path) {
  const res = await fetch(`${BASE}components/${path}`);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

async function navigate(path) {
  const routeFile = routes[path] || "404.html";
  
  
  const res = await fetch(`${BASE}pages/${routeFile}`);
  const content = await res.text();

  document.getElementById("app").innerHTML = content;

  // Charger le JS spécifique à la page si présent
  if (routes[path]) {
    const pageName = routeFile.replace(".html", "");
    const jsPath = `./js/pages/${capitalize(pageName)}.js`;

    if (pageModules[jsPath]) {
      pageModules[jsPath]()
        .then((mod) => {
          if (typeof mod.init === "function") mod.init();
        })
        .catch(console.error);
    } else {
      console.warn(`Pas de JS pour ${pageName}`);
    }
  }
}

window.onpopstate = () => navigate(location.pathname);

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("header", "header.html");
  await loadComponent("footer", "footer.html");

  initNavbar();

  document.body.addEventListener("click", (e) => {
    if (e.target.matches("a[data-link]")) {
      e.preventDefault();
      const href = e.target.getAttribute("href");
      history.pushState(null, null, href);
      navigate(href);
    }
  });

  navigate(location.pathname);
});
