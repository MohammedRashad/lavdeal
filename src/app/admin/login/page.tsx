'use client';

import { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff, Link as LinkIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false
      });

      if (result?.error) {
        setError('Invalid username or password');
      } else {
        router.push('/admin');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Paper sx={{ p: 4, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
          <LinkIcon />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Admin Login
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box 
          component="form" 
          sx={{ display: 'grid', gap: 3 }}
          onSubmit={handleSubmit}
        >
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            size="small"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button 
            variant="contained" 
            size="large"
            fullWidth
            type="submit"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 