const R2_url = "https://pub-3d52a5c211294455ba197b8d4a6c5a1b.r2.dev/"

const titulo = document.querySelector('.reproductor-musica h1');
const nombre = document.querySelector('.reproductor-musica p');

const progreso = document.getElementById('progreso');
const cancion = document.getElementById('cancion');

const iconoControl = document.getElementById('iconoControl');
const botonReproducir = document.querySelector('.controles button.boton-iniciar-pausar');

const botonAtras = document.querySelector('.controles button.atras');
const botonAdelante = document.querySelector('.controles button.siguiente');

let canciones = [];
let indiceCancionActual = 0;

async function cargarCanciones() {
    const response = await fetch("./tracks.json");
    canciones = await response.json();

    actualizarCancion();
}

function actualizarCancion(){
    titulo.textContent = canciones[indiceCancionActual].title;
    nombre.textContent = canciones[indiceCancionActual].artist;
    cancion.src = new URL(canciones[indiceCancionActual].src.replace(/^audio\//, ''), R2_url).href;
    cancion.addEventListener('loadeddata', function(){});
}

botonReproducir.addEventListener('click', reproducirPausar);

function reproducirPausar(){

    if(cancion.paused){
        reproducirCancion();
    } else {
        pausarCancion();
    }
}

function reproducirCancion(){
    cancion.play();
    iconoControl.classList.add('bi-pause-fill');
    iconoControl.classList.remove('bi-play-fill');    
}

function pausarCancion() {
    cancion.pause();
    iconoControl.classList.remove('bi-play-fill');
    iconoControl.classList.add('bi-pause-fill');    
}

cancion.addEventListener('timeupdate', function(){
    if(!cancion.paused){
        progreso.value = cancion.currentTime;
    }
})

progreso.addEventListener('input', function(){
    cancion.currentTime = progreso.value;
})

botonAdelante.addEventListener('click', function(){
    indiceCancionActual = (indiceCancionActual + 1) % canciones.length;
    actualizarCancion();
    reproducirCancion();
})

botonAtras.addEventListener('click', function(){
    indiceCancionActual = (indiceCancionActual - 1) % canciones.length;
    actualizarCancion();
    reproducirCancion();
})

cancion.addEventListener('ended', function(){
    indiceCancionActual = (indiceCancionActual + 1) % canciones.length;
    actualizarCancion();
    reproducirCancion();
})

cargarCanciones();