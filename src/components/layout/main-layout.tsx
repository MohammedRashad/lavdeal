import { MainNav } from './main-nav'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MainNav />
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  )
} 