import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import OnboardingSplash from './pages/OnboardingSplash'
import AgentDashboard from './pages/AgentDashboard'
import AgentAddHomeowner from './pages/AgentAddHomeowner'
import AgentTouchpoints from './pages/AgentTouchpoints'
import TouchpointCompose from './pages/TouchpointCompose'
import AVMMeter from './pages/AVMMeter'
import ImportMapping from './pages/ImportMapping'
import PostImportSuccess from './pages/PostImportSuccess'
import EventCreator from './pages/EventCreator'
import HomeownerPortal from './pages/HomeownerPortal'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AgentDashboard />} />
        <Route path="onboarding" element={<OnboardingSplash />} />
        <Route path="add-homeowner" element={<AgentAddHomeowner />} />
        <Route path="touchpoints" element={<AgentTouchpoints />} />
        <Route path="touchpoints/compose" element={<TouchpointCompose />} />
        <Route path="avm-meter" element={<AVMMeter />} />
        <Route path="import" element={<ImportMapping />} />
        <Route path="import-success" element={<PostImportSuccess />} />
        <Route path="create-event" element={<EventCreator />} />
        <Route path="homeowner" element={<HomeownerPortal />} />
      </Route>
    </Routes>
  )
}
