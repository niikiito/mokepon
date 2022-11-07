const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
const sectionReinicio = document.getElementById('reiniciar')
const botonMascota = document.getElementById("boton-mascota")
const botonReiniciar = document.getElementById('boton-reinicio')
sectionReinicio.style.display = 'none'

const sectionSeleccionarMascota = document.getElementById('selecionar-mascota')

const spanMascota = document.getElementById('mascota-jugador')
const mascotaAleatorio = aleatorio(1,3)
const spanMascotaEnemigo = document.getElementById('mascota-enemigo')

const spanVidasJugador = document.getElementById('vidas-jugador')
const spanVidasEnemigo = document.getElementById('vidas-enemigo')

const sectionMensajes = document.getElementById('resultado')
const ataqueDelJugador = document.getElementById('ataque-del-jugador')
const ataqueDelEnemigo = document.getElementById('ataque-del-enemigo')
const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById('contenedorAtaques')

const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')

let jugadorId = null
let enemigoId = null
let mokepones = []
let mokeponesEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDeMokepones
let inputHipoge
let inputCapipego
let inputRatigueya 
let mascotaJugador
let mascotaJugadorObjeto
let ataquesMokepones
let ataquesMokeponesEnemigo
let botonFuego
let botonAgua
let botonTierra
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = './assets/mokemap.png'
let alturaQueBuscamos
let anchoDeMapa = window.innerWidth - 20
const anchoMaximoDeMapa = 350

if (anchoDeMapa > anchoMaximoDeMapa) {
    anchoDeMapa = anchoMaximoDeMapa - 20
}

alturaQueBuscamos = anchoDeMapa * 600 / 800

mapa.width = anchoDeMapa
mapa.height = alturaQueBuscamos

class Mokepon {
    constructor(nombre, foto, vida, fotoMapa, id = null) {
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 40
        this.alto = 40
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    }
    pintarMokepon() {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}

let Hipoge = new Mokepon('Hipoge', './assets/mokepons_mokepon_hipodoge_attack.webp', 5, './assets/hipodoge.png')
let Capipego = new Mokepon('Capipego', './assets/mokepons_mokepon_capipepo_attack.webp', 5, './assets/capipepo.png')
let Ratigueya = new Mokepon('Ratigueya', './assets/mokepons_mokepon_ratigueya_attack.webp', 5, './assets/ratigueya.png')

const HIPOGE_ATAQUES = [
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '💧', id: 'boton-agua'},
    { nombre: '💧', id: 'boton-agua'},
    { nombre: '🌍', id: 'boton-tierra'},
    { nombre: '🔥', id: 'boton-fuego'},
]

const CAPIPEGO_ATAQUES = [
    { nombre: '🌍', id: 'boton-tierra' },
    { nombre: '🌍', id: 'boton-tierra'},
    { nombre: '🌍', id: 'boton-tierra'},
    { nombre: '💧', id: 'boton-agua'},
    { nombre: '🔥', id: 'boton-fuego'},
]

const RATIGUEYA_ATAQUES = [
    { nombre: '🔥', id: 'boton-fuego' },
    { nombre: '🔥', id: 'boton-fuego'},
    { nombre: '🔥', id: 'boton-fuego'},
    { nombre: '💧', id: 'boton-agua'},
    { nombre: '🌍', id: 'boton-tierra'},
]

Hipoge.ataques.push(...HIPOGE_ATAQUES)

Capipego.ataques.push(...CAPIPEGO_ATAQUES)

Ratigueya.ataques.push(...RATIGUEYA_ATAQUES)

mokepones.push(Hipoge,Capipego,Ratigueya)
//-------------------------------------------------------------------------------------------------

function iniciarJuego() {

    sectionSeleccionarAtaque.style.display = 'none'
    sectionVerMapa.style.display = 'none'

    mokepones.forEach((mokepones) => {
        opcionDeMokepones = `
        <input type="radio" name="mascota" id=${mokepones.nombre} />
        <label class="tarjeta-de-mokepon" for=${mokepones.nombre}> 
            <p style="margin-inline: 30px;">${mokepones.nombre}</p>
            <img src=${mokepones.foto} alt=${mokepones.nombre}>
        </label>
        `
        contenedorTarjetas.innerHTML += opcionDeMokepones

        inputHipoge = document.getElementById('Hipoge')
        inputCapipego = document.getElementById('Capipego')
        inputRatigueya = document.getElementById('Ratigueya')
    })

    botonMascota.addEventListener('click', seleccionarMascota)

    botonReiniciar.addEventListener('click', reiniciarJuego)

    unirseAlJuego()
}

function unirseAlJuego() {
    fetch("http://192.168.1.110:8080/unirse")
        .then(function (res) {
            if (res.ok) {
                res.text()
                    .then(function (respuesta) {
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
}

function seleccionarMascota() {
    
    //sectionSeleccionarAtaque.style.display = 'flex'


    if (inputHipoge.checked) {
        spanMascota.innerHTML = inputHipoge.id
        mascotaJugador = inputHipoge.id
        //alert('Seleccionaste a Hipoge')
    } else if (inputCapipego.checked){
        spanMascota.innerHTML = inputCapipego.id
        mascotaJugador = inputCapipego.id
        //alert('Seleccionaste a Capipego')
    } else if (inputRatigueya.checked) {
        spanMascota.innerHTML = inputRatigueya.id
        mascotaJugador = inputRatigueya.id
        //alert('Seleccionaste a Ratigueya')
    } else {
        //spanMascota.innerHTML = 'NO SELECCIONASTE TU MASCOTA'
        alert("NO SELECCIONASTE TU MASCOTA")
        return
    }

    sectionSeleccionarMascota.style.display = 'none'

    seleccionarMokepon(mascotaJugador)


    extraerAtaques(mascotaJugador)
    sectionVerMapa.style.display = 'flex'
    iniciarMapa()

    
}

function seleccionarMokepon(mascotaJugador) {
    fetch(`http://192.168.1.110:8080/mokepon/${jugadorId}`, {
        method: "post",
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    })
}

function extraerAtaques(mascotaJugador) {
    let ataques
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            ataques = mokepones[i].ataques
        }
        
    }
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques) {
    ataques.forEach((ataque) => {
        ataquesMokepones = `
        <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML += ataquesMokepones
    }
    )

     botonFuego = document.getElementById('boton-fuego')
     botonAgua = document.getElementById('boton-agua')
     botonTierra = document.getElementById('boton-tierra')
     botones = document.querySelectorAll('.BAtaque')



}

function secuenciaAtaque() {
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
           if (e.target.textContent === '🔥') {
                ataqueJugador.push('FUEGO')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true
           } else if (e.target.textContent === '💧') {
                ataqueJugador.push('AGUA')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true
           } else {
                ataqueJugador.push('TIERRA')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true
           }
           if (ataqueJugador.length === 5) {
            enviarAtaques()
           }

        })
    })

}

function enviarAtaques() {
    fetch(`http://192.168.1.110:8080/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques() {
    fetch(`http://192.168.1.110:8080/mokepon/${enemigoId}/ataques`)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ ataques }) {
                        if (ataques.length === 5) {
                            ataqueEnemigo = ataques
                            COMBATE()
                        }
                    })
            }
        })
}

function seleccionarMascotaEnemigo() {
    let mascotaAleatorio = aleatorio(0, mokepones.length -1)
    
   spanMascotaEnemigo.innerHTML = mokepones[mascotaAleatorio].nombre
   ataquesMokeponesEnemigo = mokepones[mascotaAleatorio].ataques
   secuenciaAtaque()
   
}

function ataqueAleatorioEnemigo() {
    let ataqueAleatorio = aleatorio(0,ataquesMokeponesEnemigo.length -1)

    if (ataqueAleatorio == 0 || ataqueAleatorio == 1) {
        ataqueEnemigo.push('FUEGO')
    } else if (ataqueAleatorio == 3 || ataqueAleatorio == 4) {
        ataqueEnemigo.push('AGUA')
    } else {
        ataqueEnemigo.push('TIERRA')
    }
    console.log(ataqueEnemigo)
    iniciarPelea()
}

function iniciarPelea() {
    if (ataqueJugador.length === 5) {
        COMBATE()
    }
}
function indexAmbosOp(jugador, enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function COMBATE() {    

    clearInterval(intervalo)

    for (let i = 0; i < ataqueJugador.length; i++) {
        if (ataqueJugador[i] === ataqueEnemigo[i]) {
            indexAmbosOp(i, i)
            crearMensaje("EMPATE")
        } else if (ataqueJugador[i] === 'FUEGO' && ataqueEnemigo[i] === 'TIERRA') {
            indexAmbosOp(i, i)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else if (ataqueJugador[i] === 'AGUA' && ataqueEnemigo[i] === 'FUEGO') {
            indexAmbosOp(i, i)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else if (ataqueJugador[i] === 'TIERRA' && ataqueEnemigo[i] === 'AGUA') {
            indexAmbosOp(i, i)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else {
            indexAmbosOp(i, i)
            crearMensaje('PERDISTE')
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML = victoriasEnemigo
        }
    }

    revisarVidas()
    
}

function revisarVidas() {
   if (victoriasJugador === victoriasEnemigo) {
    crearMensajeFinal('EMPATE ')
   } else if (victoriasJugador > victoriasEnemigo) {
    crearMensajeFinal('GANASTE :) ')
   } else {
    crearMensajeFinal('PERDISTE!!! ')
   }
   

}


function crearMensaje(resultado) {
    
    //let notificacion = document.createElement('p')
    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo


    //let parrafo = document.createElement('p')
    
    //parrafo.innerHTML = 'Tu mascota ataco con ' + ataqueJugador + ' la mascota del enemigo ataco con ' + ataqueEnemigo + '- ' + resultado
    
    ataqueDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataqueDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)

}

function crearMensajeFinal(resultadoFinal) {

    sectionReinicio.style.display = 'block'

    sectionMensajes.innerHTML = resultadoFinal

}

function reiniciarJuego() {
    location.reload()
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1 ) + min)
    

}

function pintarCanvas() {
    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    mascotaJugadorObjeto.pintarMokepon()

    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)

    mokeponesEnemigos.forEach(function (mokepon) {
        mokepon.pintarMokepon()
        revisarColision(mokepon)
    })
}

function enviarPosicion(x, y) {
    fetch(`http://192.168.1.110:8080/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function (res) {
        if (res.ok) {
            res.json()
                .then(function ({ enemigos }) {
                    console.log(enemigos)
                    mokeponesEnemigos = enemigos.map(function (enemigo) {
                        let mokeponEnemigo = null
                        const mokeponNombre = enemigo.mokepon.nombre || ""
                        if (mokeponNombre === "Hipoge") {
                             mokeponEnemigo = new Mokepon('Hipoge', './assets/mokepons_mokepon_hipodoge_attack.webp', 5, './assets/hipodoge.png', enemigo.id)
                        } else if (mokeponNombre === "Capipego") {
                             mokeponEnemigo = new Mokepon('Capipego', './assets/mokepons_mokepon_capipepo_attack.webp', 5, './assets/capipepo.png', enemigo.id)
                        } else if (mokeponNombre === "Ratigueya") {
                             mokeponEnemigo = new Mokepon('Ratigueya', './assets/mokepons_mokepon_ratigueya_attack.webp', 5, './assets/ratigueya.png', enemigo.id)
                        }

                        mokeponEnemigo.x = enemigo.x
                        mokeponEnemigo.y = enemigo.y

                        return mokeponEnemigo
                    })
                    

                })
        }
    })
}

function moverDerecha() {
    mascotaJugadorObjeto.velocidadX = 5
}

function moverIzquierda() {
    mascotaJugadorObjeto.velocidadX = -5
}

function moverAbajo() {
    mascotaJugadorObjeto.velocidadY = 5
}

function moverArriba() {
    mascotaJugadorObjeto.velocidadY = -5
}

function detenerMovimiento() {
    mascotaJugadorObjeto.velocidadX = 0
    mascotaJugadorObjeto.velocidadY = 0
}

function sePresionoUnaTecla(event) {
    switch (event.key) {
        case 'ArrowUp':
            moverArriba()
            break;
        case 'ArrowDown':
            moverAbajo()
            break;
        case 'ArrowLeft':
            moverIzquierda()
            break
        case 'ArrowRight':
            moverDerecha()
            break
        default:
            break;
    }
}

function iniciarMapa() {
    
    mapa.width = 600
    mapa.height = 400
    mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador)
    console.log(mascotaJugadorObjeto, mascotaJugador)
    intervalo = setInterval(pintarCanvas, 50)

    window.addEventListener('keydown', sePresionoUnaTecla)

    window.addEventListener('keyup', detenerMovimiento)

}

function obtenerObjetoMascota() {
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            return mokepones[i]
        }
        
    }
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotaJugadorObjeto.y
    const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
    const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
    const izquierdaMascota = mascotaJugadorObjeto.x
    if (
        
        abajoMascota < arribaEnemigo || 
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
        
        ) {
        return
    }
    detenerMovimiento()
    clearInterval(intervalo)

    enemigoId = enemigo.id
    sectionSeleccionarAtaque.style.display = 'flex'
    sectionVerMapa.style.display = 'none'
    seleccionarMascotaEnemigo(enemigo)

}

window.addEventListener('load', iniciarJuego)

