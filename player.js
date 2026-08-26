const R2_url = "https://pub-3d52a5c211294455ba197b8d4a6c5a1b.r2.dev/"

const titulo = document.querySelector('.reproductor-musica h1');
const nombre = document.querySelector('.reproductor-musica p');

const progreso = document.getElementById('progreso');
const cancion = document.getElementById('cancion');

const iconoControl = document.getElementById('iconoControl');
const botonReproducir = document.querySelector('.controles button.boton-iniciar-pausar');
const volumeSlider = document.getElementById('volumeSlider');

const botonAtras = document.querySelector('.controles button.atras');
const botonAdelante = document.querySelector('.controles button.siguiente');

let canciones = [];
let historialCanciones = [];
let indiceCancionActual = 0;

async function cargarCanciones() {
    const response1 = await fetch("./tracks-classic.json");
    const response2 = await fetch("./tracks-x.json");

    const classic = await response1.json();
    const x = await response2.json();

    canciones = [...classic, ...x];

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
        iconoControl.classList.remove('bi-pause-fill'); 
        iconoControl.classList.add('bi-play-fill');
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
    historialCanciones.push(indiceCancionActual);
    indiceCancionActual = Math.floor(Math.random() * canciones.length);
    actualizarCancion();
    reproducirCancion();
})

botonAtras.addEventListener('click', function(){
    if (historialCanciones.length > 0){
    indiceCancionActual = historialCanciones.pop();
    actualizarCancion();
    reproducirCancion();
    }
})

cancion.addEventListener('ended', function(){
    indiceCancionActual = Math.floor(Math.random() * canciones.length);
    actualizarCancion();
    reproducirCancion();
})

cancion.volume = volumeSlider.value / 100;
volumeSlider.addEventListener('input', () => {
    cancion.volume = volumeSlider.value / 100;
})

cargarCanciones();