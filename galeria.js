document.addEventListener("DOMContentLoaded", async () => {

    const gallery = document.getElementById("gallery");

    if (!gallery) {
        console.error("No se encontró #gallery");
        return;
    }

    const folder = gallery.dataset.folder || "15anos";

    gallery.innerHTML = `
        <div class="gallery-loading">
            Cargando fotografías...
        </div>
    `;

    try {

        console.log("Cargando galería:", folder);

        const response = await fetch(
            `/api/photos?folder=${encodeURIComponent(folder)}`
        );

        if (!response.ok) {
            throw new Error(
                `Error HTTP ${response.status}`
            );
        }

        const photos = await response.json();

        console.log(
            `Fotografías encontradas: ${photos.length}`
        );

        if (!Array.isArray(photos) || photos.length === 0) {

            gallery.innerHTML = `
                <div class="gallery-empty">
                    <h2>No hay fotografías</h2>
                    <p>
                        No se encontraron imágenes en
                        <strong>img/${folder}</strong>
                    </p>
                </div>
            `;

            return;
        }

        // Limpiar mensaje de carga
        gallery.innerHTML = "";

        // Crear las fotografías
        photos.forEach((photo, index) => {

            const article = document.createElement("article");

            article.className = "photo-card";

            const img = document.createElement("img");

            img.src = photo.url;

            img.alt = photo.name;

            img.loading = "lazy";

            img.decoding = "async";

            // Si una imagen falla
            img.onerror = () => {

                console.error(
                    "No se pudo cargar:",
                    photo.url
                );

                img.style.background = "#eeeeee";

            };

            article.appendChild(img);

            article.addEventListener("click", () => {
                openLightbox(index, photos);
            });

            gallery.appendChild(article);

        });

        console.log(
            "Galería creada correctamente"
        );

    } catch (error) {

        console.error(
            "ERROR EN LA GALERÍA:",
            error
        );

        gallery.innerHTML = `
            <div class="gallery-error">
                <h2>No se pudo cargar la galería</h2>

                <p>
                    ${error.message}
                </p>
            </div>
        `;
    }


    // ==========================================
    // LIGHTBOX
    // ==========================================

    function openLightbox(index, photos) {

        let currentIndex = index;

        const overlay = document.createElement("div");

        overlay.className = "lightbox";

        overlay.innerHTML = `
            
            <button
                class="lightbox-close"
                aria-label="Cerrar"
            >
                &times;
            </button>

            <button
                class="lightbox-prev"
                aria-label="Anterior"
            >
                &#10094;
            </button>

            <div class="lightbox-content">

                <img
                    class="lightbox-image"
                    src=""
                    alt=""
                >

                <div class="lightbox-counter"></div>

            </div>

            <button
                class="lightbox-next"
                aria-label="Siguiente"
            >
                &#10095;
            </button>

        `;

        document.body.appendChild(overlay);

        document.body.style.overflow = "hidden";

        const image =
            overlay.querySelector(".lightbox-image");

        const counter =
            overlay.querySelector(".lightbox-counter");

        const closeButton =
            overlay.querySelector(".lightbox-close");

        const prevButton =
            overlay.querySelector(".lightbox-prev");

        const nextButton =
            overlay.querySelector(".lightbox-next");


        function showPhoto() {

            const photo = photos[currentIndex];

            image.src = photo.url;

            image.alt = photo.name;

            counter.textContent =
                `${currentIndex + 1} / ${photos.length}`;

        }


        function previousPhoto() {

            currentIndex--;

            if (currentIndex < 0) {
                currentIndex = photos.length - 1;
            }

            showPhoto();

        }


        function nextPhoto() {

            currentIndex++;

            if (currentIndex >= photos.length) {
                currentIndex = 0;
            }

            showPhoto();

        }


        function closeLightbox() {

            overlay.remove();

            document.body.style.overflow = "";

            document.removeEventListener(
                "keydown",
                handleKeyboard
            );

        }


        function handleKeyboard(event) {

            if (event.key === "Escape") {

                closeLightbox();

            }

            if (event.key === "ArrowLeft") {

                previousPhoto();

            }

            if (event.key === "ArrowRight") {

                nextPhoto();

            }

        }


        closeButton.addEventListener(
            "click",
            closeLightbox
        );

        prevButton.addEventListener(
            "click",
            previousPhoto
        );

        nextButton.addEventListener(
            "click",
            nextPhoto
        );


        overlay.addEventListener(
            "click",
            event => {

                if (event.target === overlay) {
                    closeLightbox();
                }

            }
        );


        document.addEventListener(
            "keydown",
            handleKeyboard
        );


        showPhoto();

    }

});