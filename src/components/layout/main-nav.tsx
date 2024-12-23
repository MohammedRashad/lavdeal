'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import HomeIcon from '@mui/icons-material/Home'
import StoreIcon from '@mui/icons-material/Store'
import CategoryIcon from '@mui/icons-material/Category'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import LogoutIcon from '@mui/icons-material/Logout'
import { useState } from 'react'

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Stores', href: '/stores', icon: StoreIcon },
  { name: 'Categories', href: '/categories', icon: CategoryIcon },
  { name: 'Admin', href: '/admin', icon: AdminPanelSettingsIcon },
]

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            Lav Deal
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <MenuItem 
                    key={item.name} 
                    onClick={handleCloseNavMenu}
                    component={Link}
                    href={item.href}
                    selected={pathname === item.href}
                  >
                    <Icon sx={{ mr: 1 }} />
                    <Typography textAlign="center">{item.name}</Typography>
                  </MenuItem>
                )
              })}
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            Lav Deal
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.name}
                  component={Link}
                  href={item.href}
                  onClick={handleCloseNavMenu}
                  sx={{ 
                    my: 2, 
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    ...(pathname === item.href && {
                      bgcolor: 'rgba(0, 0, 0, 0.04)'
                    })
                  }}
                  startIcon={<Icon />}
                >
                  {item.name}
                </Button>
              )
            })}
          </Box>

          {/* Logout button */}
          <Box sx={{ flexGrow: 0 }}>
            <Button
              onClick={handleSignOut}
              sx={{ color: 'inherit' }}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
} 