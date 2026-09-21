import { useEffect, useState } from 'react'

type Player = {
  id: number
  nombre: string
  edad: number
  dorsal: number
  posicion: string
}

function App() {
  const [players, setPlayers] = useState<Player[]>([])

  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState('')
  const [dorsal, setDorsal] = useState('')
  const [posicion, setPosicion] = useState('')

  const [jugadorEditando, setJugadorEditando] = useState<number | null>(null)

  // GET - Cargar jugadores
  const cargarJugadores = () => {
    fetch('http://localhost:8080/api/players')
      .then(response => response.json())
      .then(data => setPlayers(data))
  }

  useEffect(() => {
    cargarJugadores()
  }, [])

  // POST - Crear jugador
  const crearJugador = (event: React.FormEvent) => {
    event.preventDefault()

    const nuevoJugador = {
      nombre,
      edad: Number(edad),
      dorsal: Number(dorsal),
      posicion
    }

    fetch('http://localhost:8080/api/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoJugador)
    })
      .then(response => response.json())
      .then(() => {
        cargarJugadores()
        limpiarFormulario()
      })
  }

  // DELETE - Eliminar jugador
  const eliminarJugador = (id: number) => {
    fetch(`http://localhost:8080/api/players/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          cargarJugadores()
        }
      })
  }

  // Preparar jugador para editar
  const editarJugador = (player: Player) => {
    setJugadorEditando(player.id)

    setNombre(player.nombre)
    setEdad(String(player.edad))
    setDorsal(String(player.dorsal))
    setPosicion(player.posicion)
  }

  // PUT - Guardar cambios
  const guardarCambios = (event: React.FormEvent) => {
    event.preventDefault()

    if (jugadorEditando === null) {
      return
    }

    const jugadorActualizado = {
      nombre,
      edad: Number(edad),
      dorsal: Number(dorsal),
      posicion
    }

    fetch(`http://localhost:8080/api/players/${jugadorEditando}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jugadorActualizado)
    })
      .then(response => response.json())
      .then(() => {
        cargarJugadores()
        limpiarFormulario()
      })
  }

  const limpiarFormulario = () => {
    setNombre('')
    setEdad('')
    setDorsal('')
    setPosicion('')
    setJugadorEditando(null)
  }

  return (
    <div>
      <h1>⚽ Club Manager</h1>
      <p>Gestiona tu equipo de fútbol</p>

      <h2>
        {jugadorEditando === null
          ? 'Añadir jugador'
          : 'Editar jugador'}
      </h2>

      <form
        onSubmit={
          jugadorEditando === null
            ? crearJugador
            : guardarCambios
        }
      >
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={event => setNombre(event.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={event => setEdad(event.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Dorsal"
          value={dorsal}
          onChange={event => setDorsal(event.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Posición"
          value={posicion}
          onChange={event => setPosicion(event.target.value)}
          required
        />

        <button type="submit">
          {jugadorEditando === null
            ? 'Añadir jugador'
            : 'Guardar cambios'}
        </button>

        {jugadorEditando !== null && (
          <button type="button" onClick={limpiarFormulario}>
            Cancelar
          </button>
        )}
      </form>

      <h2>Plantilla</h2>

      {players.map(player => (
        <div key={player.id}>
          <strong>
            #{player.dorsal} {player.nombre}
          </strong>

          <p>
            {player.edad} años · {player.posicion}
          </p>

          <button onClick={() => editarJugador(player)}>
            Editar
          </button>

          <button onClick={() => eliminarJugador(player.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  )
}

export default App