import { prisma } from '@/lib/prisma'
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Container, 
  Box, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material'
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material'

interface Store {
  name: string;
}

interface Link {
  id: string;
  title: string;
  description: string;
  price: number;
  url: string;
  store: Store;
  weight?: number;
  shipping?: number;
  category?: string;
}

export default async function Home() {
  const links = await prisma.link.findMany({
    include: {
      store: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  }) as Link[]

  // Get unique categories and stores for filters
  const categories = [...new Set(links.map(link => link.category).filter(Boolean))]
  const stores = [...new Set(links.map(link => link.store.name))]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom sx={{ 
        fontWeight: 600,
        color: '#2D3748',
        mb: 4 
      }}>
        Latest Deals
      </Typography>

      {/* Filters */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Filter by Category</InputLabel>
            <Select
              label="Filter by Category"
              defaultValue="All"
            >
              <MenuItem value="All">All</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Filter by Store</InputLabel>
            <Select
              label="Filter by Store"
              defaultValue="All"
            >
              <MenuItem value="All">All</MenuItem>
              {stores.map((store) => (
                <MenuItem key={store} value={store}>{store}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Product Grid */}
      <Grid container spacing={3}>
        {links.map((link) => (
          <Grid item xs={12} md={6} lg={4} key={link.id}>
            <Paper elevation={0} sx={{ 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200',
              height: '100%',
              '&:hover': {
                boxShadow: 1
              }
            }}>
              <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Title and Category */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" component="h2" sx={{ 
                    fontWeight: 500,
                    mb: 1,
                    color: '#2196f3',
                    '&:hover': {
                      color: '#1976d2'
                    }
                  }}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                      {link.title}
                    </a>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {link.category || 'Uncategorized'}
                  </Typography>
                </Box>

                {/* Description */}
                <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                  {link.description}
                </Typography>

                {/* Product Details */}
                <Box>
                  {link.weight && (
                    <Typography variant="body2" color="text.secondary">
                      Weight: {link.weight} kg
                    </Typography>
                  )}
                  {link.shipping && (
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                      Shipping: {link.shipping} AMD
                    </Typography>
                  )}
                  
                  {/* Store and View Button */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {link.store.name}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<OpenInNewIcon />}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        borderRadius: 1,
                        textTransform: 'none'
                      }}
                    >
                      View Deal
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
} 