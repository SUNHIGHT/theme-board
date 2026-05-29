import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CountdownTimePage from './pages/CountdownTimePage.tsx'
import { ColorPicker } from './pages/ColorPickerPage.tsx'
import { PasswordGenerator } from './pages/PasswardGenerator.tsx'
import { UnitConverter } from './pages/UnitConverter.tsx'
import { DrawingCanvas } from './pages/DrawingCanvasPage.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    {/* <CountdownTimePage /> */}
    {/* <PasswordGenerator /> */}
    {/* <ColorPicker /> */}
    {/* <UnitConverter /> */}
    <DrawingCanvas />
  </StrictMode>,
)
