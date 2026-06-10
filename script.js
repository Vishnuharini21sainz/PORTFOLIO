// SCROLL ACTIVE NAVBAR

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach(section => {

    const sectionTop = section.offsetTop - 150;

    if(pageYOffset >= sectionTop){

      current = section.getAttribute("id");

    }

  });

  navLinks.forEach(link => {

    link.classList.remove("active");

    if(link.getAttribute("href") === `#${current}`){

      link.classList.add("active");

    }

  });

});


// REVEAL ANIMATION

const revealElements = document.querySelectorAll(

  ".glass-card, .skill-card, .contact-form, .contact-links a"

);

function revealOnScroll(){

  revealElements.forEach(el => {

    const windowHeight = window.innerHeight;

    const revealTop = el.getBoundingClientRect().top;

    const revealPoint = 100;

    if(revealTop < windowHeight - revealPoint){

      el.style.opacity = "1";

      el.style.transform = "translateY(0)";

    }

  });

}

revealElements.forEach(el => {

  el.style.opacity = "0";
  el.style.transform = "translateY(40px)";
  el.style.transition = "0.8s ease";

});

window.addEventListener("scroll", revealOnScroll);


// CONTACT FORM

const form = document.querySelector(".contact-form");

form.addEventListener("submit", (e) => {

  e.preventDefault();

  alert("Message sent successfully!");

  form.reset();

});


// FLOAT EFFECT

const imageBox = document.querySelector(".image-box");

document.addEventListener("mousemove", (e) => {

  const x = (window.innerWidth / 2 - e.pageX) / 40;

  const y = (window.innerHeight / 2 - e.pageY) / 40;

  imageBox.style.transform =
  `rotateY(${x}deg) rotateX(${-y}deg)`;

});