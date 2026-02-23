let USUARIOS = {
    admin: "admin123",
    usuario: "1234",
    demo: "demo"
};

let usuarioActual = null;
let peliculasGlobales = [];
let peliculaEnEdiccion = null;


document.addEventListener("DOMContentLoaded", ()=>{
    inicializarApp();
    eventos();
})


function inicializarApp(){
    cargarUsuariosRegistrados();

    if(!localStorage.getItem("peliculas")){
        cargarDatosEjemplo();
    }
    let userlogged = localStorage.getItem("usuarioLogueado");
    if(userlogged){
        usuarioActual = JSON.parse(userlogged);
        mostrarDashboard();
    }


}
function cargarUsuariosRegistrados(){
   let usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados"));
    if(usuariosRegistrados){
        Object.assign(USUARIOS, usuariosRegistrados);
    }
}

function eventos(){
    document.querySelector("#formLogin").addEventListener("submit", login);
    document.querySelector("#btnLogout").addEventListener("click", logout);
    document.querySelector("#formRegistro").addEventListener("submit", registro);
    document.querySelector("#btnGuardarPelicula").addEventListener("click", guardarPelicula);
}

function login(e){
    e.preventDefault();
    let user = document.querySelector("#inputUser").value;
    let password = document.querySelector("#inputPassword").value;

    if(USUARIOS[user] && USUARIOS[user] === password){
        usuarioActual = user;
        localStorage.setItem("usuarioLogueado", JSON.stringify(user));
        mostrarDashboard();
        document.querySelector("#formLogin").reset();
    }else{
        alert("Usuario o contraseña incorrectos");
    }

}

function mostrarDashboard(){
    document.querySelector("#loginSection").style.display = "none";
    document.querySelector("#btnLogin").style.display = "none";
    document.querySelector("#mainContent").style.display = "block";
    document.querySelector("#btnLogout").style.display= "block";
    document.querySelector(".userLogged").textContent = usuarioActual;
    document.querySelector("#btnAgregar").style.display = "block";
    cargarPeliculas();
}

function mostrarLogin(){
    document.querySelector("#loginSection").style.display = "flex";
    document.querySelector("#btnLogin").style.display = "block";
    document.querySelector("#mainContent").style.display = "none";
    document.querySelector("#btnLogout").style.display= "none";
    document.querySelector("#btnAgregar").style.display = "none";

}
function logout(){
    let confirmar = confirm("¿Deseas cerrar sesión?");
    if(confirmar){
        usuarioActual = null;
    localStorage.removeItem("usuarioLogueado");
    mostrarLogin();
    document.querySelector("#formLogin").reset();
}
}

function registro(e){
    e.preventDefault();
    let nombre = document.querySelector("#inputNombre").value.trim();
    let email = document.querySelector("#inputEmail").value.trim();
    let usuario = document.querySelector("#inputUserReg").value.trim();
    let password = document.querySelector("#inputPasswordReg").value.trim();
    let confirmPassword = document.querySelector("#inputConfirmPassword").value.trim();

   if( nombre && email && usuario && password && confirmPassword){

    if(usuario.length < 4){
        alert("El nombre de usuario debe tener al menos 4 caracteres");
        return;
    }

    if(password.length < 6){
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
    }

    if(password !== confirmPassword){
        alert("Las contraseñas no coinciden");
        return;
    }

    if(USUARIOS[usuario]){
        alert("El usuario ya existe, por favor elige otro");
        return;
    }

    USUARIOS[usuario] = password;
    let usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || {};
    usuariosRegistrados[usuario] = password;
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosRegistrados));

    alert("Usuario " + usuario + " registrado con éxito");

    document.querySelector("#formRegistro").reset();
    document.querySelector("#login-tab").click();

    }else{
    alert("por favor completa todos los campos");
    return;
    }
        if (usuario.length<4){
            alert("El nombre de usuario debe tener al menos 4 caracteres");
            return;
        }
        if(password.length<6){
            alert("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        if(password !== confirmPassword){
            alert("Las contraseñas no coinciden");
            return;
        }

}

function cargarDatosEjemplo(){
    let peliculasEjemplo = [
        {
            id: 1,
            titulo: "Inception",
            genero: "ciencia ficcion",
            director: "christopher nolan",
            ano : 2010,
            calificacion: 8.8,
            descripcion:"Inception, también conocida como El origen en español, es una película de ciencia ficción que relata la historia de un grupo de ladrones que utilizan una máquina que invade los sueños para conquistar sus objetivos más audaces La película norteamericana Inception fue dirigida por Chistopher Nolan y lanzada mundialmente en el año 2010. Contó con las actuaciones de Leonardo DiCaprio, Ellen Page y Joseph Gordon-Levitt, entre otros actores de renombre",
            imagen : "https://images.adsttc.com/media/images/53b5/d563/c07a/80a3/4300/016c/medium_jpg/inception_ver12_xlg.jpg?1404425564"


        },
        {
            id: 2,
            titulo: "Posdata Te amo",
            genero: "romantico",
            director: "Richard LaGravenese",
            ano: 2007,
            calificacion:8.2,
            descripcion:"Holly y Gerry eran el alma gemela el uno del otro; de esos que terminan las frases de los demás y planean toda una vida juntos. Sin embargo, la tragedia golpea cuando Gerry muere joven debido a un tumor cerebral, dejando a Holly sumida en una profunda depresión y aislamiento. Lo que ella no sabe es que Gerry, consciente de su destino, preparó un plan para no dejarla sola en su duelo:Las Cartas: Holly comienza a recibir una serie de mensajes mensuales que él dejó listos antes de morir. El Reto: Cada carta contiene instrucciones específicas para ayudarla a redescubrirse, salir de casa y volver a vivir, desde comprar una lámpara hasta viajar a Irlanda.La Firma: Todos los mensajes terminan con la misma frase: Posdata: Te amo.",
            imagen:"https://play-lh.googleusercontent.com/Md-ZUl3yXxbU9uBpFBfwZb88rRMDfzz0qdikkIzqyqSQh4XyDgcgAJAJMFCcjIzRTPNC"
        }

    ];
    localStorage.setItem("peliculas", JSON.stringify(peliculasEjemplo));

}

function cargarPeliculas(){
    let peliculas = localStorage.getItem("peliculas");
    peliculasGlobales = peliculas ? JSON.parse(peliculas) : [];
    renderizarGrid(peliculasGlobales);
    renderizarSlider();
}

function renderizarGrid( pelis){
    let grid = document.querySelector("#gridPeliculas");
    let sinResultados = document.querySelector("#sinResultados");

    if (pelis.length === 0){
        grid.innerHTML = "";
        sinResultados.style.display = "block";
        return;
    }
    sinResultados.style.display = "none";
    grid.innerHTML =  pelis.map( p =>
        `
        <div class="col-md-6 col-lg-4 col-xl-3">
        <div class="movie-card">
            <img src="${p.imagen}" class="movie-image" onerror="this.src='https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg'">
            <div class="movie-content">
            <h5 class="movie-tittle">${p.titulo}</h5>
            <span class="movie-genero">${p.genero}</span>
            <div class="movie-meta"> <b>${p.ano}</b> - ${p.director}</div>
            <div class="movie-rating">💥${p.calificacion}/10</div>
            <div class="movie-description">${p.descripcion}</div>
            <div class="movie-actions">
            <button class="btn btn-info" onclick="verDetalles(${p.id})"> <i class="bi bi-eye"></i> Detalles </button>
            <button class="btn btn-warning" onclick="editarPeliculas(${p.id})"> <i class="bi bi-pencil-square"></i> Editar </button>
            <button class="btn btn-danger" onclick="eliminarPelicula(${p.id})"> <i class="bi bi-trash-fill"></i> Eliminar </button>
            </div>

            </div>
        </div>
        </div>
        `

    ).join("");
}


function guardarPelicula(){
    let titulo = document.querySelector("#inputTitulo").value;
    let genero = document.querySelector("#inputGenero").value;
    let director = document.querySelector("#inputDirector").value;
    let ano = document.querySelector("#inputAno").value;
    let calificacion = document.querySelector("#inputCalificacion").value;
    let descripcion = document.querySelector("#inputDescripcion").value;
    let imagen = document.querySelector("#inputImagen").value;

    if(peliculaEnEdiccion){
        let index = peliculasGlobales.findIndex((p)=>p.id === peliculaEnEdiccion.id);

        if( index !== -1 ){

            peliculasGlobales[index] = {
                ...peliculasGlobales[index],
                titulo, genero, director, ano, calificacion, descripcion, imagen
            }
            alert("Pelicula actualizada con exito ✅")

        }
    }else{
        let nuevaPelicula ={
            id: Date.now(),
            titulo, genero, director, ano, calificacion, descripcion, imagen,
            fecha: new Date()
        }
        peliculasGlobales.unshift(nuevaPelicula);
        alert("pelicula agregada exitosamente ✅");

    }
    localStorage.setItem("peliculas", JSON.stringify(peliculasGlobales));
    peliculaEnEdiccion = null;
    cargarPeliculas();

    bootstrap.Modal.getInstance(document.querySelector("#modalPelicula")).hide();
    document.querySelector("#formPelicula").reset();

}
 function editarPeliculas ( id ){
   let pelicula = peliculasGlobales.find((p)=> p.id === id);

   if(pelicula){
    peliculaEnEdiccion = pelicula;

    document.querySelector("#inputTitulo").value = pelicula.titulo;
    document.querySelector("#inputGenero").value = pelicula.genero;
    document.querySelector("#inputDirector").value = pelicula.director;
    document.querySelector("#inputAno").value = pelicula.ano;
    document.querySelector("#inputCalificacion").value = pelicula.calificacion;
    document.querySelector("#inputDescripcion").value = pelicula.descripcion;
    document.querySelector("#inputImagen").value = pelicula.imagen;
    document.querySelector("#modalTitulo").textContent = "Editar Pelicula";

    let modal = new bootstrap.Modal(document.querySelector("#modalPelicula"));
    modal.show();

   }
 }


 function eliminarPelicula (id){
    let confirmar = confirm("¿Deseas eliminar esta pelicula?");
    if( confirmar ){

        peliculasGlobales = peliculasGlobales.filter((p)=> p.id !== id);
        localStorage.setItem("peliculas", JSON.stringify(peliculasGlobales));
        cargarPeliculas();
        alert("pelicula eliminada con exito ✅");

    }
}

function verDetalles( id ){
    let pelicula = peliculasGlobales.find((p)=> p.id === id);

    if( pelicula ){
        document.querySelector("#detallesTitulo").textContent = pelicula.titulo;
        document.querySelector("#detallesGenero").textContent = pelicula.genero;
        document.querySelector("#detallesDirector").textContent = pelicula.director;
        document.querySelector("#detallesAno").textContent = pelicula.ano;
        document.querySelector("#detallesCalificacion").textContent = pelicula.calificacion;
        document.querySelector("#detallesDescripcion").textContent = pelicula.descripcion;
        document.querySelector("#detallesImagen").src = pelicula.imagen;

        let modal = new bootstrap.Modal(document.querySelector("#modalDetalles"));
        modal.show();

        }
    }

    function renderizarSlider() {
        let carrusel = document.querySelector("#carouselMovies");
        carrusel.innerHTML = "";
        let recientes = peliculasGlobales.slice(0, 5);
        recientes.forEach((p)=>{
            let card = document.createElement("div");
            card.className = "slider-movie-card";
            card.innerHTML = `
              <img src="${p.imagen}" onerror="this.src='https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg'">
              <div class="slider-movie-info">
              <h6>${p.titulo}</h6>
              <small class="text-muted">${p.ano}</small>
              </div>
            `;
            card.addEventListener("click", ()=>verDetalles(p.id))
            carrusel.appendChild(card);
        })
    }

    function scrollSlider(direccion){
        let slider = document.querySelector("#carouselMovies");
        let scroll = 200;
        slider.scrollBy({
            left: direccion * scroll,
            behavior: "smooth"
        });

    }
