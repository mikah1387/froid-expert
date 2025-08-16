import jsPDF from "jspdf";
import emailjs from "emailjs-com";
export function init() {
  const form = document.getElementById("multiStepForm");
  const steps = form.querySelectorAll(".step");
  

  const confirmation = document.getElementById("confirmation");
  const laststep = document.querySelector(".last-step");
  let currentStep = 0;

  showStep(currentStep);

  form.querySelectorAll(".next").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentStep++;
      showStep(currentStep);
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        // console.log(data);
    });
  });

  form.querySelectorAll(".prev").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentStep--;
      showStep(currentStep);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let formValid = true;
    let requiredFields = [
      "nom",
      "prenom",
      "email",
      "adresse",
      "code-postal",
      "telephone",
    ];

    requiredFields.forEach((name) => {
      let field = document.querySelector(`[name="${name}"]`);
      console.log(field.value.trim());
      
      if (!field.value ) {
        formValid = false;
        field.classList.add("error");
      } else {
        field.classList.remove("error");
      }
    });

    if (!formValid) {
      alert(
        "Merci de remplir toutes vos informations personnelles avant d’envoyer."
      );
      return; // Stoppe ici si validation échoue
    }
    document.getElementById("loader").style.display = "flex";
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // 2. Envoyer email
    await sendEmailWithPDF(data);

    // 3. Afficher confirmation
     setTimeout(() => {
       document.getElementById("loader").style.display = "none";
       form.style.display = "none";
       confirmation.style.display = "block"; // si tu veux masquer aussi la confirmation
       laststep.style.display = "block";
     }, 4000);
    // form.style.display = "none";
    // confirmation.style.display = "block";
    // laststep.style.display = "block";
  });

  async function sendEmailWithPDF(data) {
   
    const emailParams = {
      name: data.nom || "Client",
      email: data.email,
      adresse: data.adresse || "Non spécifiée",
      code: data["code-postal"] || "Non spécifié",
      tel: data.telephone || "Non spécifié",
      maison: data.maison || "Non spécifiée",
      dateConstruction: data["date-construction"] || "Non spécifiée",
      surface: data.surface || "Non spécifiée",
      adultes: data.adultes || "Non spécifié",
      chauffage: data.chauffage || "Non spécifié",
      systemechauffage: data["systeme-chauffage"] || "Non spécifié",
      dpeLogement: data["dpe-logement"] || "Non spécifié",
      travaux: data.travaux || "Non spécifié",
      typetravaux: data["type-travaux"] || "Non spécifié",
      emplacement: data.emplacement || "Non spécifié",
      revenuFiscal: data["revenu-fiscal"] || "Non spécifié",
    };

    await emailjs.send(
      "service_8xvuu63", // Remplace par ton vrai service ID
      "template_92e0t16", // Ton template ID
      emailParams,
      "BzqEEvLo896Aa2K3M" // Public Key
    );
  }



  function showStep(index) {
    steps.forEach((step, i) => {
      step.style.display = i === index ? "block" : "none";
      step.classList.toggle("active", i === index);
   
      
    });
  }
}
