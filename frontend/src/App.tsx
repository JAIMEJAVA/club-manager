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

type Pagina = 'dashboard' | 'plantilla' | 'partidos' | 'estadisticas'

function App() {
  const [players, setPlayers] = useState<Player[]>([])
  const [matches, setMatches] = useState<Match[]>([])
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
  const [mostrarFormularioPartido, setMostrarFormularioPartido] =
    useState(false)

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

  useEffect(() => {
    cargarJugadores()
    cargarPartidos()
  }, [])

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

  const eliminarJugador = (id: number) => {
    fetch(`http://localhost:8080/api/players/${id}`, {
      method: 'DELETE'
    }).then(response => {
      if (response.ok) {
        cargarJugadores()
      }
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

  const abrirNuevoJugador = () => {
    setJugadorEditando(null)
    setNombre('')
    setEdad('')
    setDorsal('')
    setPosicion('')
    setMostrarFormulario(true)
  }

  const limpiarFormularioPartido = () => {
    setRival('')
    setFecha('')
    setLocal(true)
    setMostrarFormularioPartido(false)
  }

  const crearPartido = (event: FormEvent) => {
    event.preventDefault()

    const nuevoPartido = {
      rival,
      fecha,
      local,
      golesLocal: 0,
      golesVisitante: 0,
      estado: 'PROGRAMADO' as const
    }

    fetch('http://localhost:8080/api/matches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoPartido)
    })
      .then(response => response.json())
      .then(() => {
        cargarPartidos()
        limpiarFormularioPartido()
      })
  }

  const eliminarPartido = (id: number) => {
  fetch(`http://localhost:8080/api/matches/${id}`, {
    method: 'DELETE'
  }).then(response => {
    if (response.ok) {
      cargarPartidos()
    }
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

                {players.length === 0 ? (
                  <div className="empty-state">
                    <div>⚽</div>
                    <h3>No hay jugadores</h3>
                    <p>Añade jugadores para comenzar.</p>
                  </div>
                ) : (
                  <div className="dashboard-players">
                    {players.slice(0, 5).map(player => (
                      <div
                        className="dashboard-player"
                        key={player.id}
                      >
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
                )}
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
                  <span>Partidos</span>
                  <strong>{matches.length}</strong>
                </div>

                <div className="stat-icon">◉</div>
              </div>
            </section>

            {mostrarFormulario && (
              <section className="form-card">
                <div className="form-header">
                  <div>
                    <h2>
                      {jugadorEditando === null
                        ? 'Nuevo jugador'
                        : 'Editar jugador'}
                    </h2>

                    <p>
                      {jugadorEditando === null
                        ? 'Añade un jugador a tu plantilla'
                        : 'Modifica los datos del jugador'}
                    </p>
                  </div>

                  <button
                    className="close-button"
                    onClick={limpiarFormulario}
                    type="button"
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
                        type="text"
                        placeholder="Nombre del jugador"
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
                        placeholder="24"
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
                        placeholder="10"
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
                        <option value="">
                          Selecciona posición
                        </option>
                        <option value="Portero">Portero</option>
                        <option value="Defensa">Defensa</option>
                        <option value="Lateral">Lateral</option>
                        <option value="Mediocentro">
                          Mediocentro
                        </option>
                        <option value="Extremo">Extremo</option>
                        <option value="Delantero">
                          Delantero
                        </option>
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

                    <button
                      type="submit"
                      className="primary-button"
                    >
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
                <div>
                  <h2>Jugadores</h2>
                  <p>{players.length} jugadores en la plantilla</p>
                </div>
              </div>

              {players.length === 0 ? (
                <div className="empty-state">
                  <div>⚽</div>
                  <h3>No hay jugadores</h3>
                  <p>Añade tu primer jugador para comenzar.</p>
                </div>
              ) : (
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
                            <div className="player-info">
                              <div className="player-avatar">
                                {player.nombre
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>{player.nombre}</strong>
                                <span>ID #{player.id}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="dorsal">
                              {player.dorsal}
                            </span>
                          </td>

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
                                onClick={() =>
                                  editarJugador(player)
                                }
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
              )}
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
                onClick={() => setMostrarFormularioPartido(true)}
              >
                + Nuevo partido
              </button>
            </header>

            {mostrarFormularioPartido && (
              <section className="form-card">
                <div className="form-header">
                  <div>
                    <h2>Nuevo partido</h2>
                    <p>Programa un partido para tu equipo</p>
                  </div>

                  <button
                    className="close-button"
                    onClick={limpiarFormularioPartido}
                    type="button"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={crearPartido}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Rival</label>

                      <input
                        type="text"
                        placeholder="Nombre del rival"
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
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={limpiarFormularioPartido}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="primary-button"
                    >
                      Crear partido
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="players-card">
              <div className="players-header">
                <div>
                  <h2>Calendario</h2>
                  <p>{matches.length} partidos registrados</p>
                </div>
              </div>

              {matches.length === 0 ? (
                <div className="empty-state">
                  <div>⚽</div>
                  <h3>No hay partidos</h3>
                  <p>
                    Todavía no hay ningún partido registrado.
                  </p>
                </div>
              ) : (
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
                              {match.golesLocal}
                              {' - '}
                              {match.golesVisitante}
                            </span>
                          </td>

                          <td>
                            <span className="position">
                              {match.estado.replace('_', ' ')}
                            </span>
                          </td>
                          <td>
                          <button
                            className="delete-button"
                            onClick={() => eliminarPartido(match.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
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