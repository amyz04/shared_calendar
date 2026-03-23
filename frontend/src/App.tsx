import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/calendar" replace />} />
        <Route path="/login" element={<div>Login page — coming soon</div>} />
        <Route path="/register" element={<div>Register page — coming soon</div>} />
        <Route path="/calendar" element={<div>Calendar page — coming soon</div>} />
        <Route path="/groups" element={<div>Groups page — coming soon</div>} />
      </Routes>
    </BrowserRouter>
  )
}