import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { DARK, LIGHT } from './theme'
import { INIT_TRIPS } from './data'
import type { NavId } from './types'

export default function App() {
  const [isDark, setIsDark] = useState(true)
  const [view, setView] = useState<NavId>('trips')
  const [activeTripId, setActiveTripId] = useState(1)
  const T = isDark ? DARK : LIGHT

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: T.bgAlt }}>
        <Sidebar
          active={view}
          onNav={setView}
          trips={INIT_TRIPS}
          activeTripId={activeTripId}
          onSelectTrip={setActiveTripId}
          onNewTrip={() => {}}
          onOpenProfile={() => {}}
          T={T}
          isDark={isDark}
          toggleTheme={() => setIsDark(d => !d)}
        />
        <main style={{ flex: 1, background: T.bgAlt }}>
          {/* pages will go here */}
        </main>
      </div>
    </BrowserRouter>
  )
}