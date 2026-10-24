import { useEffect, useState } from 'react'

type PlayerStatistics = {
  playerId: number
  playerName: string
  goals: number
  yellowCards: number
  redCards: number
}

type TeamStatistics = {
  totalMatches: number
  finishedMatches: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  playerStatistics: PlayerStatistics[]
}

function StatisticsPage() {
  const [statistics, setStatistics] = useState<TeamStatistics | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/statistics')
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudieron cargar las estadísticas')
        }

        return response.json()
      })
      .then(data => setStatistics(data))
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <section className="placeholder-page">
        <div className="placeholder-icon">⚠️</div>
        <h1>Error al cargar estadísticas</h1>
        <p>Comprueba que Spring Boot está iniciado.</p>
      </section>
    )
  }

  if (statistics === null) {
    return (
      <section className="placeholder-page">
        <div className="placeholder-icon">⏳</div>
        <h1>Cargando estadísticas...</h1>
      </section>
    )
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">RENDIMIENTO</p>
          <h1>Estadísticas</h1>
          <p className="subtitle">
            Resumen del rendimiento de Club Manager
          </p>
        </div>
      </header>

      <section className="stats">
        <div className="stat-card">
          <div>
            <span>Partidos finalizados</span>
            <strong>
              {statistics.finishedMatches} / {statistics.totalMatches}
            </strong>
          </div>

          <div className="stat-icon">◉</div>
        </div>

        <div className="stat-card">
          <div>
            <span>Balance</span>
            <strong className="small-stat">
              {statistics.wins}V · {statistics.draws}E · {statistics.losses}D
            </strong>
          </div>

          <div className="stat-icon">🏆</div>
        </div>

        <div className="stat-card">
          <div>
            <span>Goles</span>
            <strong>
              {statistics.goalsFor} - {statistics.goalsAgainst}
            </strong>
          </div>

          <div className="stat-icon">⚽</div>
        </div>
      </section>

      <section className="players-card">
        <div className="players-header">
          <div>
            <h2>Estadísticas de jugadores</h2>
            <p>Goles y tarjetas registrados en eventos de partido</p>
          </div>
        </div>

        {statistics.playerStatistics.length === 0 ? (
          <div className="empty-state">
            <div>⚽</div>
            <h3>No hay jugadores</h3>
            <p>Añade jugadores y eventos para ver sus estadísticas.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>JUGADOR</th>
                  <th>GOLES</th>
                  <th>AMARILLAS</th>
                  <th>ROJAS</th>
                </tr>
              </thead>

              <tbody>
                {statistics.playerStatistics.map(player => (
                  <tr key={player.playerId}>
                    <td>
                      <strong>{player.playerName}</strong>
                    </td>

                    <td>⚽ {player.goals}</td>

                    <td>🟨 {player.yellowCards}</td>

                    <td>🟥 {player.redCards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default StatisticsPage
