import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

type Player = {
  id: number
  nombre: string
  edad: number
  dorsal: number
  posicion: string
}

type Match = {
  id: number
  rival: string
  fecha: string
  local: boolean
  golesLocal: number
  golesVisitante: number
  estado: 'PROGRAMADO' | 'EN_JUEGO' | 'FINALIZADO'
}

type MatchEvent = {
  id: number
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION'
  minute: number
  player: Player | null
  rivalDorsal: number | null
  description: string | null
}

type Pagina = 'dashboard' | 'plantilla' | 'partidos' | 'estadisticas'

const nombreTipoEvento = (type: MatchEvent['type']) => {
  const types = {
    GOAL: '⚽ Gol',
    YELLOW_CARD: '🟨 Amarilla',
    RED_CARD: '🟥 Roja',
    SUBSTITUTION: '🔄 Cambio'
  }

  return types[type]
}

const formatearTiempo = (segundos: number) => {
  const minutos = Math.floor(segundos / 60)
    .toString()
    .padStart(2, '0')

  const segundosRestantes = (segundos % 60)
    .toString()
    .padStart(2, '0')

  return `${minutos}:${segundosRestantes}`
}

function App() {
  const [players, setPlayers] = useState<Player[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [events, setEvents] = useState<MatchEvent[]>([])
  const [paginaActual, setPaginaActual] = useState<Pagina>('dashboard')

  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState('')
  const [dorsal, setDorsal] = useState('')
  const [posicion, setPosicion] = useState('')
  const [jugadorEditando, setJugadorEditando] = useState<number | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const [rival, setRival] = useState('')
  const [fecha, setFecha] = useState('')
  const [local, setLocal] = useState(true)
  const [partidoEditando, setPartidoEditando] = useState<number | null>(null)
  const [golesLocal, setGolesLocal] = useState('0')
  const [golesVisitante, setGolesVisitante] = useState('0')
  const [estadoPartido, setEstadoPartido] =
    useState<Match['estado']>('PROGRAMADO')
  const [mostrarFormularioPartido, setMostrarFormularioPartido] =
    useState(false)

  const [partidoSeleccionado, setPartidoSeleccionado] =
    useState<Match | null>(null)
  const [mostrarFormularioEvento, setMostrarFormularioEvento] =
    useState(false)
  const [tipoEvento, setTipoEvento] =
    useState<MatchEvent['type']>('GOAL')
  const [minutoEvento, setMinutoEvento] = useState('')
  const [jugadorEventoId, setJugadorEventoId] = useState('')
  const [dorsalRivalEvento, setDorsalRivalEvento] = useState('')
  const [descripcionEvento, setDescripcionEvento] = useState('')

  const [partidoEnModoId, setPartidoEnModoId] =
    useState<number | null>(null)
  const [segundosPartido, setSegundosPartido] = useState(0)
  const [cronometroActivo, setCronometroActivo] = useState(false)

  const partidoEnModo =
    matches.find(match => match.id === partidoEnModoId) ?? null

  const cargarJugadores = () => {
    fetch('http://localhost:8080/api/players')
      .then(response => response.json())
      .then(data => setPlayers(data))
  }

  const cargarPartidos = () => {
    fetch('http://localhost:8080/api/matches')
      .then(response => response.json())
      .then(data => setMatches(data))
  }

  const cargarEventos = (matchId: number) => {
    fetch(`http://localhost:8080/api/matches/${matchId}/events`)
      .then(response => response.json())
      .then(data => setEvents(data))
  }

  useEffect(() => {
    cargarJugadores()
    cargarPartidos()
  }, [])

  useEffect(() => {
    if (!cronometroActivo) return

    const interval = window.setInterval(() => {
      setSegundosPartido(segundos => segundos + 1)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [cronometroActivo])

  const limpiarFormulario = () => {
    setNombre('')
    setEdad('')
    setDorsal('')
    setPosicion('')
    setJugadorEditando(null)
    setMostrarFormulario(false)
  }

  const crearJugador = (event: FormEvent) => {
    event.preventDefault()

    const nuevoJugador = {
      nombre,
      edad: Number(edad),
      dorsal: Number(dorsal),
      posicion
    }

    fetch('http://localhost:8080/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoJugador)
    })
      .then(response => response.json())
      .then(() => {
        cargarJugadores()
        limpiarFormulario()
      })
  }

  const editarJugador = (player: Player) => {
    setJugadorEditando(player.id)
    setNombre(player.nombre)
    setEdad(String(player.edad))
    setDorsal(String(player.dorsal))
    setPosicion(player.posicion)
    setMostrarFormulario(true)
  }

  const guardarCambios = (event: FormEvent) => {
    event.preventDefault()

    if (jugadorEditando === null) return

    const jugadorActualizado = {
      nombre,
      edad: Number(edad),
      dorsal: Number(dorsal),
      posicion
    }

    fetch(`http://localhost:8080/api/players/${jugadorEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jugadorActualizado)
    })
      .then(response => response.json())
      .then(() => {
        cargarJugadores()
        limpiarFormulario()
      })
  }

  const eliminarJugador = (id: number) => {
    fetch(`http://localhost:8080/api/players/${id}`, {
      method: 'DELETE'
    }).then(response => {
      if (response.ok) cargarJugadores()
    })
  }

  const abrirNuevoJugador = () => {
    limpiarFormulario()
    setMostrarFormulario(true)
  }

  const limpiarFormularioPartido = () => {
    setRival('')
    setFecha('')
    setLocal(true)
    setPartidoEditando(null)
    setGolesLocal('0')
    setGolesVisitante('0')
    setEstadoPartido('PROGRAMADO')
    setMostrarFormularioPartido(false)
  }

  const abrirNuevoPartido = () => {
    limpiarFormularioPartido()
    setMostrarFormularioPartido(true)
  }

  const crearPartido = (event: FormEvent) => {
    event.preventDefault()

    const nuevoPartido = {
      rival,
      fecha,
      local,
      golesLocal: Number(golesLocal),
      golesVisitante: Number(golesVisitante),
      estado: estadoPartido
    }

    fetch('http://localhost:8080/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoPartido)
    })
      .then(response => response.json())
      .then(() => {
        cargarPartidos()
        limpiarFormularioPartido()
      })
  }

  const editarPartido = (match: Match) => {
    setPartidoEditando(match.id)
    setRival(match.rival)
    setFecha(match.fecha)
    setLocal(match.local)
    setGolesLocal(String(match.golesLocal))
    setGolesVisitante(String(match.golesVisitante))
    setEstadoPartido(match.estado)
    setMostrarFormularioPartido(true)
  }

  const guardarPartido = (event: FormEvent) => {
    event.preventDefault()

    if (partidoEditando === null) return

    actualizarPartido({
      id: partidoEditando,
      rival,
      fecha,
      local,
      golesLocal: Number(golesLocal),
      golesVisitante: Number(golesVisitante),
      estado: estadoPartido
    }).then(() => limpiarFormularioPartido())
  }

  const actualizarPartido = (match: Match) => {
    return fetch(`http://localhost:8080/api/matches/${match.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rival: match.rival,
        fecha: match.fecha,
        local: match.local,
        golesLocal: match.golesLocal,
        golesVisitante: match.golesVisitante,
        estado: match.estado
      })
    })
      .then(response => response.json())
      .then(() => cargarPartidos())
  }

  const eliminarPartido = (id: number) => {
    fetch(`http://localhost:8080/api/matches/${id}`, {
      method: 'DELETE'
    }).then(response => {
      if (response.ok) {
        if (partidoSeleccionado?.id === id) {
          setPartidoSeleccionado(null)
          setEvents([])
        }

        if (partidoEnModoId === id) {
          cerrarModoPartido()
        }

        cargarPartidos()
      }
    })
  }

  const limpiarFormularioEvento = () => {
    setTipoEvento('GOAL')
    setMinutoEvento('')
    setJugadorEventoId('')
    setDorsalRivalEvento('')
    setDescripcionEvento('')
    setMostrarFormularioEvento(false)
  }

  const abrirEventos = (match: Match) => {
    setPartidoSeleccionado(match)
    cargarEventos(match.id)
    limpiarFormularioEvento()
  }

  const cerrarEventos = () => {
    setPartidoSeleccionado(null)
    setEvents([])
    limpiarFormularioEvento()
  }

  const crearEvento = (event: FormEvent) => {
    event.preventDefault()

    if (partidoSeleccionado === null) return

    const playerQuery = jugadorEventoId
      ? `?playerId=${jugadorEventoId}`
      : ''

    const nuevoEvento = {
      type: tipoEvento,
      minute: Number(minutoEvento),
      rivalDorsal: dorsalRivalEvento
        ? Number(dorsalRivalEvento)
        : null,
      description: descripcionEvento
    }

    fetch(
      `http://localhost:8080/api/matches/${partidoSeleccionado.id}/events${playerQuery}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEvento)
      }
    )
      .then(response => response.json())
      .then(() => {
        cargarPartidos()
        cargarEventos(partidoSeleccionado.id)
        limpiarFormularioEvento()
      })
  }

  const eliminarEvento = (eventId: number) => {
    if (partidoSeleccionado === null) return

    fetch(
      `http://localhost:8080/api/matches/${partidoSeleccionado.id}/events/${eventId}`,
      { method: 'DELETE' }
    ).then(response => {
      if (response.ok) {
        cargarPartidos()
        cargarEventos(partidoSeleccionado.id)
      }
    })
  }

  const abrirModoPartido = (match: Match) => {
    setPartidoEnModoId(match.id)
    setPartidoSeleccionado(match)
    setSegundosPartido(0)
    setCronometroActivo(false)
    setMostrarFormularioEvento(false)
    cargarEventos(match.id)
  }

  const cerrarModoPartido = () => {
    setCronometroActivo(false)
    setSegundosPartido(0)
    setPartidoEnModoId(null)
    cerrarEventos()
  }

  const iniciarPartido = () => {
    if (partidoEnModo === null) return

    actualizarPartido({
      ...partidoEnModo,
      estado: 'EN_JUEGO'
    }).then(() => {
      setCronometroActivo(true)
    })
  }

  const finalizarPartido = () => {
    if (partidoEnModo === null) return

    actualizarPartido({
      ...partidoEnModo,
      estado: 'FINALIZADO'
    }).then(() => {
      setCronometroActivo(false)
    })
  }

  const edadMedia =
    players.length > 0
      ? (
          players.reduce((total, player) => total + player.edad, 0) /
          players.length
        ).toFixed(1)
      : '0'

  const posicionesDiferentes = new Set(
    players.map(player => player.posicion)
  ).size

  const formularioEventos = () => {
    if (!mostrarFormularioEvento) return null

    return (
      <form onSubmit={crearEvento}>
        <div className="form-grid">
          <div className="form-group">
            <label>Tipo de evento</label>
            <select
              value={tipoEvento}
              onChange={event =>
                setTipoEvento(event.target.value as MatchEvent['type'])
              }
            >
              <option value="GOAL">⚽ Gol</option>
              <option value="YELLOW_CARD">🟨 Amarilla</option>
              <option value="RED_CARD">🟥 Roja</option>
              <option value="SUBSTITUTION">🔄 Cambio</option>
            </select>
          </div>

          <div className="form-group">
            <label>Minuto</label>
            <input
              type="number"
              min="1"
              placeholder="32"
              value={minutoEvento}
              onChange={event => setMinutoEvento(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Jugador propio</label>
            <select
              value={jugadorEventoId}
              onChange={event => setJugadorEventoId(event.target.value)}
            >
              <option value="">No aplica / evento rival</option>
              {players.map(player => (
                <option key={player.id} value={player.id}>
                  #{player.dorsal} {player.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Dorsal rival</label>
            <input
              type="number"
              min="1"
              placeholder="9"
              value={dorsalRivalEvento}
              onChange={event =>
                setDorsalRivalEvento(event.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <input
              type="text"
              placeholder="Detalle opcional"
              value={descripcionEvento}
              onChange={event =>
                setDescripcionEvento(event.target.value)
              }
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={limpiarFormularioEvento}
          >
            Cancelar
          </button>

          <button type="submit" className="primary-button">
            Guardar evento
          </button>
        </div>
      </form>
    )
  }

  const tablaEventos = () => {
    if (events.length === 0) {
      return (
        <div className="empty-state">
          <div>⚽</div>
          <h3>No hay eventos</h3>
          <p>Añade goles, tarjetas o cambios del partido.</p>
        </div>
      )
    }

    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>MINUTO</th>
              <th>EVENTO</th>
              <th>JUGADOR</th>
              <th>DESCRIPCIÓN</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {events.map(matchEvent => (
              <tr key={matchEvent.id}>
                <td>{matchEvent.minute}'</td>

                <td>
                  <span className="position">
                    {nombreTipoEvento(matchEvent.type)}
                  </span>
                </td>

                <td>
                  {matchEvent.player
                    ? `#${matchEvent.player.dorsal} ${matchEvent.player.nombre}`
                    : matchEvent.rivalDorsal
                      ? `Rival #${matchEvent.rivalDorsal}`
                      : 'No aplica'}
                </td>

                <td>{matchEvent.description || '—'}</td>

                <td>
                  <div className="actions">
                    <button
                      className="delete-button"
                      onClick={() => eliminarEvento(matchEvent.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (partidoEnModo !== null) {
    const equipoLocal = partidoEnModo.local
      ? 'Club Manager'
      : partidoEnModo.rival

    const equipoVisitante = partidoEnModo.local
      ? partidoEnModo.rival
      : 'Club Manager'

    return (
      <div className="app">
        <aside className="sidebar">
          <div>
            <div className="brand">
              <div className="brand-icon">⚽</div>
              <div>
                <h2>Club Manager</h2>
                <span>Football Management</span>
              </div>
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="avatar">JM</div>
            <div>
              <strong>Jaime</strong>
              <span>Administrador</span>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">MODO PARTIDO</p>
              <h1>{equipoLocal} - {equipoVisitante}</h1>
              <p className="subtitle">
                Gestiona el partido y registra sus eventos en directo
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={cerrarModoPartido}
            >
              ← Volver a partidos
            </button>
          </header>

          <section className="stats">
            <div className="stat-card">
              <div>
                <span>Marcador</span>
                <strong>
                  {partidoEnModo.golesLocal} - {partidoEnModo.golesVisitante}
                </strong>
              </div>
              <div className="stat-icon">⚽</div>
            </div>

            <div className="stat-card">
              <div>
                <span>Tiempo de juego</span>
                <strong>{formatearTiempo(segundosPartido)}</strong>
              </div>
              <div className="stat-icon">⏱</div>
            </div>

            <div className="stat-card">
              <div>
                <span>Estado</span>
                <strong className="small-stat">
                  {partidoEnModo.estado.replace('_', ' ')}
                </strong>
              </div>
              <div className="stat-icon">◉</div>
            </div>
          </section>

          <section className="form-card">
            <div className="form-header">
              <div>
                <h2>Controles del partido</h2>
                <p>
                  El cronómetro funciona mientras esta pantalla está abierta.
                </p>
              </div>
            </div>

            <div className="form-actions">
              {!cronometroActivo ? (
                <button
                  className="primary-button"
                  onClick={iniciarPartido}
                >
                  ▶ Iniciar / reanudar
                </button>
              ) : (
                <button
                  className="secondary-button"
                  onClick={() => setCronometroActivo(false)}
                >
                  ⏸ Pausar partido
                </button>
              )}

              <button
                className="primary-button"
                onClick={() => setMostrarFormularioEvento(true)}
              >
                + Registrar evento
              </button>

              <button
                className="delete-button"
                onClick={finalizarPartido}
              >
                Finalizar partido
              </button>
            </div>
          </section>

          {mostrarFormularioEvento && (
            <section className="form-card">
              <div className="form-header">
                <div>
                  <h2>Nuevo evento</h2>
                  <p>Registra una acción ocurrida durante el partido.</p>
                </div>
              </div>

              {formularioEventos()}
            </section>
          )}

          <section className="players-card">
            <div className="players-header">
              <div>
                <h2>Eventos del partido</h2>
                <p>{events.length} eventos registrados</p>
              </div>
            </div>

            {tablaEventos()}
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-icon">⚽</div>
            <div>
              <h2>Club Manager</h2>
              <span>Football Management</span>
            </div>
          </div>

          <nav>
            <button
              className={
                paginaActual === 'dashboard'
                  ? 'nav-item active'
                  : 'nav-item'
              }
              onClick={() => setPaginaActual('dashboard')}
            >
              <span>▦</span>
              Dashboard
            </button>

            <button
              className={
                paginaActual === 'plantilla'
                  ? 'nav-item active'
                  : 'nav-item'
              }
              onClick={() => setPaginaActual('plantilla')}
            >
              <span>♟</span>
              Plantilla
            </button>

            <button
              className={
                paginaActual === 'partidos'
                  ? 'nav-item active'
                  : 'nav-item'
              }
              onClick={() => setPaginaActual('partidos')}
            >
              <span>◉</span>
              Partidos
            </button>

            <button
              className={
                paginaActual === 'estadisticas'
                  ? 'nav-item active'
                  : 'nav-item'
              }
              onClick={() => setPaginaActual('estadisticas')}
            >
              <span>▥</span>
              Estadísticas
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="avatar">JM</div>
          <div>
            <strong>Jaime</strong>
            <span>Administrador</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {paginaActual === 'dashboard' && (
          <>
            <header className="topbar">
              <div>
                <p className="eyebrow">CLUB MANAGER</p>
                <h1>Dashboard</h1>
                <p className="subtitle">
                  Resumen general de tu equipo
                </p>
              </div>
            </header>

            <section className="stats">
              <div className="stat-card">
                <div>
                  <span>Total jugadores</span>
                  <strong>{players.length}</strong>
                </div>
                <div className="stat-icon">♟</div>
              </div>

              <div className="stat-card">
                <div>
                  <span>Edad media</span>
                  <strong>{edadMedia}</strong>
                </div>
                <div className="stat-icon">◷</div>
              </div>

              <div className="stat-card">
                <div>
                  <span>Posiciones</span>
                  <strong>{posicionesDiferentes}</strong>
                </div>
                <div className="stat-icon">◎</div>
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <div>
                    <h2>Plantilla</h2>
                    <p>Resumen de jugadores</p>
                  </div>

                  <button
                    className="link-button"
                    onClick={() => setPaginaActual('plantilla')}
                  >
                    Ver plantilla →
                  </button>
                </div>

                <div className="dashboard-players">
                  {players.slice(0, 5).map(player => (
                    <div className="dashboard-player" key={player.id}>
                      <div className="player-info">
                        <div className="player-avatar">
                          {player.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{player.nombre}</strong>
                          <span>{player.posicion}</span>
                        </div>
                      </div>

                      <span className="dashboard-dorsal">
                        #{player.dorsal}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <div>
                    <h2>Partidos</h2>
                    <p>Calendario del equipo</p>
                  </div>
                </div>

                <div className="next-match-empty">
                  <div className="match-icon">⚽</div>
                  <h3>{matches.length} partidos registrados</h3>
                  <p>
                    Entra en Partidos para consultar el calendario
                    y añadir nuevos encuentros.
                  </p>

                  <button
                    className="primary-button"
                    onClick={() => setPaginaActual('partidos')}
                  >
                    Ir a partidos
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {paginaActual === 'plantilla' && (
          <>
            <header className="topbar">
              <div>
                <p className="eyebrow">EQUIPO</p>
                <h1>Plantilla</h1>
                <p className="subtitle">
                  Gestiona los jugadores de tu equipo
                </p>
              </div>

              <button
                className="primary-button"
                onClick={abrirNuevoJugador}
              >
                + Nuevo jugador
              </button>
            </header>

            {mostrarFormulario && (
              <section className="form-card">
                <div className="form-header">
                  <div>
                    <h2>
                      {jugadorEditando === null
                        ? 'Nuevo jugador'
                        : 'Editar jugador'}
                    </h2>
                  </div>

                  <button
                    className="close-button"
                    onClick={limpiarFormulario}
                  >
                    ×
                  </button>
                </div>

                <form
                  onSubmit={
                    jugadorEditando === null
                      ? crearJugador
                      : guardarCambios
                  }
                >
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre</label>
                      <input
                        value={nombre}
                        onChange={event =>
                          setNombre(event.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Edad</label>
                      <input
                        type="number"
                        value={edad}
                        onChange={event =>
                          setEdad(event.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Dorsal</label>
                      <input
                        type="number"
                        value={dorsal}
                        onChange={event =>
                          setDorsal(event.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Posición</label>
                      <select
                        value={posicion}
                        onChange={event =>
                          setPosicion(event.target.value)
                        }
                        required
                      >
                        <option value="">Selecciona posición</option>
                        <option value="Portero">Portero</option>
                        <option value="Defensa">Defensa</option>
                        <option value="Lateral">Lateral</option>
                        <option value="Mediocentro">Mediocentro</option>
                        <option value="Extremo">Extremo</option>
                        <option value="Delantero">Delantero</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={limpiarFormulario}
                    >
                      Cancelar
                    </button>

                    <button type="submit" className="primary-button">
                      {jugadorEditando === null
                        ? 'Añadir jugador'
                        : 'Guardar cambios'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="players-card">
              <div className="players-header">
                <h2>Jugadores</h2>
                <p>{players.length} jugadores en la plantilla</p>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>JUGADOR</th>
                      <th>DORSAL</th>
                      <th>EDAD</th>
                      <th>POSICIÓN</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {players.map(player => (
                      <tr key={player.id}>
                        <td>
                          <strong>{player.nombre}</strong>
                        </td>
                        <td>#{player.dorsal}</td>
                        <td>{player.edad} años</td>
                        <td>
                          <span className="position">
                            {player.posicion}
                          </span>
                        </td>
                        <td>
                          <div className="actions">
                            <button
                              className="edit-button"
                              onClick={() => editarJugador(player)}
                            >
                              Editar
                            </button>

                            <button
                              className="delete-button"
                              onClick={() =>
                                eliminarJugador(player.id)
                              }
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {paginaActual === 'partidos' && (
          <>
            <header className="topbar">
              <div>
                <p className="eyebrow">CALENDARIO</p>
                <h1>Partidos</h1>
                <p className="subtitle">
                  Consulta los próximos partidos y resultados
                </p>
              </div>

              <button
                className="primary-button"
                onClick={abrirNuevoPartido}
              >
                + Nuevo partido
              </button>
            </header>

            {mostrarFormularioPartido && (
              <section className="form-card">
                <div className="form-header">
                  <div>
                    <h2>
                      {partidoEditando === null
                        ? 'Nuevo partido'
                        : 'Editar partido'}
                    </h2>
                  </div>

                  <button
                    className="close-button"
                    onClick={limpiarFormularioPartido}
                  >
                    ×
                  </button>
                </div>

                <form
                  onSubmit={
                    partidoEditando === null
                      ? crearPartido
                      : guardarPartido
                  }
                >
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Rival</label>
                      <input
                        value={rival}
                        onChange={event =>
                          setRival(event.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Fecha</label>
                      <input
                        type="date"
                        value={fecha}
                        onChange={event =>
                          setFecha(event.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Condición</label>
                      <select
                        value={local ? 'true' : 'false'}
                        onChange={event =>
                          setLocal(event.target.value === 'true')
                        }
                      >
                        <option value="true">Local</option>
                        <option value="false">Visitante</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Goles local</label>
                      <input
                        type="number"
                        min="0"
                        value={golesLocal}
                        onChange={event =>
                          setGolesLocal(event.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Goles visitante</label>
                      <input
                        type="number"
                        min="0"
                        value={golesVisitante}
                        onChange={event =>
                          setGolesVisitante(event.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Estado</label>
                      <select
                        value={estadoPartido}
                        onChange={event =>
                          setEstadoPartido(
                            event.target.value as Match['estado']
                          )
                        }
                      >
                        <option value="PROGRAMADO">Programado</option>
                        <option value="EN_JUEGO">En juego</option>
                        <option value="FINALIZADO">Finalizado</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={limpiarFormularioPartido}
                    >
                      Cancelar
                    </button>

                    <button type="submit" className="primary-button">
                      {partidoEditando === null
                        ? 'Crear partido'
                        : 'Guardar cambios'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="players-card">
              <div className="players-header">
                <h2>Calendario</h2>
                <p>{matches.length} partidos registrados</p>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>FECHA</th>
                      <th>PARTIDO</th>
                      <th>RESULTADO</th>
                      <th>ESTADO</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>

                  <tbody>
                    {matches.map(match => (
                      <tr key={match.id}>
                        <td>
                          {new Date(
                            `${match.fecha}T00:00:00`
                          ).toLocaleDateString('es-ES')}
                        </td>

                        <td>
                          <strong>
                            {match.local
                              ? `Club Manager - ${match.rival}`
                              : `${match.rival} - Club Manager`}
                          </strong>
                        </td>

                        <td>
                          <span className="dorsal">
                            {match.golesLocal} - {match.golesVisitante}
                          </span>
                        </td>

                        <td>
                          <span className="position">
                            {match.estado.replace('_', ' ')}
                          </span>
                        </td>

                        <td>
                          <div className="actions">
                            <button
                              className="edit-button"
                              onClick={() => abrirModoPartido(match)}
                            >
                              Modo partido
                            </button>

                            <button
                              className="edit-button"
                              onClick={() => abrirEventos(match)}
                            >
                              Eventos
                            </button>

                            <button
                              className="edit-button"
                              onClick={() => editarPartido(match)}
                            >
                              Editar
                            </button>

                            <button
                              className="delete-button"
                              onClick={() => eliminarPartido(match.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {partidoSeleccionado !== null && (
              <section className="form-card">
                <div className="form-header">
                  <div>
                    <h2>
                      Eventos: {partidoSeleccionado.local
                        ? `Club Manager - ${partidoSeleccionado.rival}`
                        : `${partidoSeleccionado.rival} - Club Manager`}
                    </h2>
                    <p>{events.length} eventos registrados</p>
                  </div>

                  <div className="actions">
                    <button
                      className="secondary-button"
                      onClick={cerrarEventos}
                    >
                      Cerrar
                    </button>

                    <button
                      className="primary-button"
                      onClick={() => setMostrarFormularioEvento(true)}
                    >
                      + Añadir evento
                    </button>
                  </div>
                </div>

                {formularioEventos()}
                {!mostrarFormularioEvento && tablaEventos()}
              </section>
            )}
          </>
        )}

        {paginaActual === 'estadisticas' && (
          <section className="placeholder-page">
            <div className="placeholder-icon">📊</div>
            <h1>Estadísticas</h1>
            <p>
              Aquí aparecerán estadísticas del equipo y de los
              jugadores.
            </p>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
