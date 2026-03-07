import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import AppGate from '@/components/AppGate'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Dashboard from '@/pages/Dashboard'
import Onboarding from '@/pages/Onboarding'
import AddHomeowner from '@/pages/AddHomeowner'
import Import from '@/pages/Import'
import ImportSuccess from '@/pages/ImportSuccess'
import Touchpoints from '@/pages/Touchpoints'
import TouchpointCompose from '@/pages/TouchpointCompose'
import AVMMeter from '@/pages/AVMMeter'
import EventCreator from '@/pages/EventCreator'
import HomeownerPortal from '@/pages/HomeownerPortal'
import Placeholder from '@/pages/Placeholder'
import Clients from '@/pages/Clients'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<AppGate />}>
            <Route index element={<Dashboard />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="add-homeowner" element={<AddHomeowner />} />
            <Route path="import" element={<Import />} />
            <Route path="import-success" element={<ImportSuccess />} />
            <Route path="touchpoints" element={<Touchpoints />} />
            <Route path="touchpoints/compose" element={<TouchpointCompose />} />
            <Route path="avm-meter" element={<AVMMeter />} />
            <Route path="create-event" element={<EventCreator />} />
            <Route path="homeowner" element={<HomeownerPortal />} />
            <Route path="triggers" element={<Placeholder title="Priority Triggers" />} />
            <Route path="clients" element={<Clients />} />
            <Route path="equity-map" element={<Placeholder title="Equity Map" />} />
            <Route path="settings" element={<Placeholder title="Settings" />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
