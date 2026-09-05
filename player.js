const R2_url = "https://pub-3d52a5c211294455ba197b8d4a6c5a1b.r2.dev/"
const logDBRange = 60
const log_a = 1 / 10 ** (logDBRange / 20);

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
    const response3 = await fetch("./tracks-zerozx.json");

    const classic = await response1.json();
    const x = await response2.json();
    const zero = await response3.json();

    canciones = [...classic, ...x, ...zero];

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
    progreso.value = cancion.currentTime;
    duracion.textContent = `${convertirTiempo(cancion.currentTime)} / ${convertirTiempo(cancion.duration)}`;
})

progreso.addEventListener('input', function(){
    cancion.currentTime = progreso.value;
})

cancion.addEventListener("loadedmetadata", function(){
    progreso.max = cancion.duration;
    duracion.textContent = `0:00 / ${convertirTiempo(cancion.duration)}`;
})

function convertirTiempo(segundos){
    if(isNaN(segundos)){
        return "0:00";
    }
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = Math.floor(segundos % 60);

    return `${minutos}: ${segundosRestantes.toString().padStart(2, "0")}`;
}

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

let vol = 0.5;
cancion.volume = vol;
volumeSlider.value = vol * 100;

volumeSlider.addEventListener('input', () => {
    vol = Number(volumeSlider.value) / 100;
    cancion.volume = vol;
})

function subirVolumen(){
    if(vol <= 0){
        vol = log_a;
    } else {
        vol *= 1.258925;
        vol = Math.min(1.0, vol);
    }
    cancion.volume = vol;
    volumeSlider.voule = vol * 100
}

function bajarVolumen(){
    vol /= 1.258925;
    if(vol < log_a){
        vol = 0;
    }
    cancion.volume = vol;
    volumeSlider.voule = vol * 100    
}

cargarCanciones();