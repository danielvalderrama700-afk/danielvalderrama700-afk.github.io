const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 5500;
const ROOT = __dirname;

// Extensiones de imágenes permitidas
const IMAGE_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif"
];

const MIME_TYPES = {
    ".html": "text/html; charset=UTF-8",
    ".css": "text/css; charset=UTF-8",
    ".js": "application/javascript; charset=UTF-8",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".svg": "image/svg+xml"
};


function sendResponse(res, statusCode, contentType, data) {
    res.writeHead(statusCode, {
        "Content-Type": contentType,
        "Cache-Control": "no-cache"
    });

    res.end(data);
}


function getImages(folder) {

    // Evita que se pueda salir de la carpeta img
    const baseFolder = path.join(ROOT, "img");
    const requestedFolder = path.normalize(
        path.join(baseFolder, folder)
    );

    if (!requestedFolder.startsWith(baseFolder)) {
        throw new Error("Carpeta no permitida");
    }

    if (!fs.existsSync(requestedFolder)) {
        throw new Error("La carpeta no existe");
    }

    const files = fs.readdirSync(requestedFolder);

    const images = files
        .filter(file => {
            const extension = path.extname(file).toLowerCase();

            return IMAGE_EXTENSIONS.includes(extension);
        })
        .sort((a, b) =>
            a.localeCompare(b, undefined, {
                numeric: true,
                sensitivity: "base"
            })
        );

    return images;
}


function serveFile(req, res, pathname) {

    let filePath = path.join(ROOT, pathname);

    // Si entran a /, mostrar index.html
    if (pathname === "/") {
        filePath = path.join(ROOT, "index.html");
    }

    // Evitar accesos fuera del proyecto
    if (!filePath.startsWith(ROOT)) {
        return sendResponse(
            res,
            403,
            "text/plain; charset=UTF-8",
            "Acceso no permitido"
        );
    }

    if (!fs.existsSync(filePath)) {
        return sendResponse(
            res,
            404,
            "text/plain; charset=UTF-8",
            "Archivo no encontrado"
        );
    }

    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
        return sendResponse(
            res,
            403,
            "text/plain; charset=UTF-8",
            "Acceso a carpetas no permitido"
        );
    }

    const extension = path.extname(filePath).toLowerCase();

    const contentType =
        MIME_TYPES[extension] ||
        "application/octet-stream";

    fs.readFile(filePath, (error, data) => {

        if (error) {
            return sendResponse(
                res,
                500,
                "text/plain; charset=UTF-8",
                "Error leyendo el archivo"
            );
        }

        sendResponse(
            res,
            200,
            contentType,
            data
        );
    });
}


const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    /*
    ==========================================
    API DE GALERÍA
    ==========================================
    */

    if (pathname === "/api/photos") {

        try {

            const folder = parsedUrl.query.folder || "15anos";

            const images = getImages(folder);

            const result = images.map(image => ({
                name: image,
                url: `/img/${folder}/${encodeURIComponent(image)}`
            }));

            return sendResponse(
                res,
                200,
                "application/json; charset=UTF-8",
                JSON.stringify(result)
            );

        } catch (error) {

            return sendResponse(
                res,
                500,
                "application/json; charset=UTF-8",
                JSON.stringify({
                    error: error.message
                })
            );
        }
    }


    /*
    ==========================================
    ARCHIVOS NORMALES
    ==========================================
    */

    serveFile(req, res, pathname);
});


console.log("ESTOY EJECUTANDO SERVER.JS");

server.listen(PORT, () => {

    console.log("");
    console.log("======================================");
    console.log("   VISUALD - SERVIDOR DE GALERÍA");
    console.log("======================================");
    console.log("");
    console.log(`Servidor iniciado en:`);
    console.log(`http://localhost:${PORT}`);
    console.log("");
    console.log("Galería:");
    console.log(`http://localhost:${PORT}/pages/15.html`);
    console.log("");
    console.log("Presiona CTRL + C para detener el servidor.");
    console.log("");
});