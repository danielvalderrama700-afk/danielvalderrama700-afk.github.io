/* =========================================
   MOBILE MENU
========================================= */

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {

    nav.classList.toggle("active");

});


/* Cerrar menú al hacer click */

document.querySelectorAll(".nav a").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("active");

    });

});


/* =========================================
   FILTROS DEL PORTAFOLIO
========================================= */

const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");

filters.forEach(filter => {

    filter.addEventListener("click", () => {

        const category = filter.dataset.filter;


        filters.forEach(button => {

            button.classList.remove("active");

        });

        filter.classList.add("active");


        projects.forEach(project => {

            if (
                category === "all" ||
                project.classList.contains(category)
            ) {

                project.style.display = "";

            } else {

                project.style.display = "none";

            }

        });

    });

});


/* =========================================
   LIGHTBOX
========================================= */

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.querySelector(".close-lightbox");


document.querySelectorAll(".project-image img").forEach(image => {

    image.addEventListener("click", () => {

        lightboxImage.src = image.src;

        lightboxImage.alt = image.alt;

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";

    });

});


/* Cerrar */

closeLightbox.addEventListener("click", closeGallery);


/* Click fuera de imagen */

lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {

        closeGallery();

    }

});


function closeGallery() {

    lightbox.classList.remove("active");

    document.body.style.overflow = "";

}


/* =========================================
   TECLA ESC
========================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeGallery();

    }

});


/* =========================================
   ANIMACIÓN AL HACER SCROLL
========================================= */

const observer = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

            }

        });

    },

    {
        threshold: 0.15
    }

);


document.querySelectorAll(
    ".project, .service, .about-content"
).forEach(element => {

    observer.observe(element);

});

document.addEventListener("DOMContentLoaded", () => {
    const videos = document.querySelectorAll("video");

    videos.forEach(video => {
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;

        const playVideo = () => {
            video.play().catch(() => {});
        };

        playVideo();

        // Intentar nuevamente cuando el navegador vuelva a mostrar la página
        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) {
                playVideo();
            }
        });
    });
});
