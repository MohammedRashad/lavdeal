'use client';

import { useState, useEffect } from 'react';
import { 
  Tabs, 
  Tab, 
  Typography, 
  Box, 
  Container, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Paper, 
  IconButton, 
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent
} from '@mui/material';
import { Add as AddIcon, KeyboardArrowUp as KeyboardArrowUpIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface Store {
  id: string;
  name: string;
  createdAt: Date;
}

interface Category {
  id: string;
  name: string;
  createdAt: Date;
}

interface Link {
  id: string;
  title: string;
  description: string;
  url: string;
  weight?: number;
  shipping?: number;
  category?: Category;
  store: Store;
  price?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalStores: 0,
    totalCategories: 0
  });
  const [newLink, setNewLink] = useState<Omit<Link, 'id' | 'store' | 'category'> & { store: string; category?: string }>({
    title: '',
    url: '',
    description: '',
    price: 0,
    weight: 0,
    shipping: 0,
    store: '',
    category: ''
  });
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/admin/dashboard');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setLinks(data.links);
      setStores(data.stores);
      setCategories(data.categories);
      setStats({
        totalLinks: data.links.length,
        totalStores: data.stores.length,
        totalCategories: data.categories.length
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST'
      });
      if (response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const linkData = {
        ...newLink,
        store: { id: newLink.store },
        category: newLink.category ? { id: newLink.category } : undefined
      };
      
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkData)
      });
      
      if (!response.ok) throw new Error('Failed to add link');
      
      await fetchData();
      setNewLink({
        title: '',
        url: '',
        description: '',
        price: 0,
        weight: 0,
        shipping: 0,
        store: '',
        category: ''
      });
    } catch (error) {
      console.error('Failed to add link:', error);
      setError('Failed to add link. Please try again.');
    }
  };

  const handleEditLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    
    try {
      const response = await fetch(`/api/links/${editingLink.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingLink)
      });
      
      if (!response.ok) throw new Error('Failed to update link');
      
      await fetchData();
      setEditingLink(null);
    } catch (error) {
      console.error('Failed to update link:', error);
      setError('Failed to update link. Please try again.');
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete link');
      
      await fetchData();
    } catch (error) {
      console.error('Failed to delete link:', error);
      setError('Failed to delete link. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Admin Dashboard
        </Typography>
        <Button 
          variant="contained" 
          color="error" 
          sx={{ textTransform: 'none' }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="🔗 Links" />
          <Tab label="🏪 Stores" />
          <Tab label="📑 Categories" />
          <Tab label="📊 Stats" />
        </Tabs>
      </Box>

      {/* Links Tab */}
      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            {editingLink ? 'Edit Link' : 'Add New Link'}
          </Typography>
          <Box component="form" onSubmit={editingLink ? handleEditLink : handleAddLink} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Title"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                  value={editingLink ? editingLink.title : newLink.title}
                  onChange={(e) => editingLink 
                    ? setEditingLink({...editingLink, title: e.target.value})
                    : setNewLink({...newLink, title: e.target.value})
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="URL"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                  value={editingLink ? editingLink.url : newLink.url}
                  onChange={(e) => editingLink
                    ? setEditingLink({...editingLink, url: e.target.value})
                    : setNewLink({...newLink, url: e.target.value})
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                  value={editingLink ? editingLink.description : newLink.description}
                  onChange={(e) => editingLink
                    ? setEditingLink({...editingLink, description: e.target.value})
                    : setNewLink({...newLink, description: e.target.value})
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Price"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={editingLink ? editingLink.price : newLink.price}
                  onChange={(e) => editingLink
                    ? setEditingLink({...editingLink, price: Number(e.target.value)})
                    : setNewLink({...newLink, price: Number(e.target.value)})
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Weight"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={editingLink ? editingLink.weight : newLink.weight}
                  onChange={(e) => editingLink
                    ? setEditingLink({...editingLink, weight: Number(e.target.value)})
                    : setNewLink({...newLink, weight: Number(e.target.value)})
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Shipping"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={editingLink ? editingLink.shipping : newLink.shipping}
                  onChange={(e) => editingLink
                    ? setEditingLink({...editingLink, shipping: Number(e.target.value)})
                    : setNewLink({...newLink, shipping: Number(e.target.value)})
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Store</InputLabel>
                  <Select
                    value={editingLink ? editingLink.store?.id : newLink.store}
                    onChange={(e) => editingLink
                      ? setEditingLink({...editingLink, store: { ...editingLink.store, id: e.target.value as string }})
                      : setNewLink({...newLink, store: e.target.value as string})
                    }
                    label="Store"
                    required
                  >
                    {stores.map((store) => (
                      <MenuItem key={store.id} value={store.id}>
                        {store.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={editingLink ? editingLink.category?.id : newLink.category}
                    onChange={(e) => {
                      const categoryId = e.target.value as string;
                      if (editingLink) {
                        const category = categories.find(c => c.id === categoryId);
                        setEditingLink({
                          ...editingLink,
                          category: category || undefined
                        });
                      } else {
                        setNewLink({
                          ...newLink,
                          category: categoryId
                        });
                      }
                    }}
                    label="Category"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {editingLink && (
                <Button
                  variant="outlined"
                  onClick={() => setEditingLink(null)}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {editingLink ? 'Update Link' : 'Add Link'}
              </Button>
            </Box>
          </Box>
        </Paper>

        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Manage Links
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Store</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>{link.title}</TableCell>
                  <TableCell>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.url.substring(0, 30)}...
                    </a>
                  </TableCell>
                  <TableCell>{link.store.name}</TableCell>
                  <TableCell>{link.category?.name || 'N/A'}</TableCell>
                  <TableCell>{link.price ? `$${link.price}` : 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setEditingLink(link)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Stores Tab */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Add New Store
          </Typography>
          <Box component="form" sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Store Name"
              variant="outlined"
              size="small"
              fullWidth
            />
            <Button variant="contained" color="primary">
              Add Store
            </Button>
          </Box>
        </Paper>

        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Manage Stores
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Store Name</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>{new Date(store.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Categories Tab */}
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Add New Category
          </Typography>
          <Box component="form" sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Category Name"
              variant="outlined"
              size="small"
              fullWidth
            />
            <Button variant="contained" color="primary">
              Add Category
            </Button>
          </Box>
        </Paper>

        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Manage Categories
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category Name</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Stats Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Links
                </Typography>
                <Typography variant="h3">
                  {stats.totalLinks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Stores
                </Typography>
                <Typography variant="h3">
                  {stats.totalStores}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Categories
                </Typography>
                <Typography variant="h3">
                  {stats.totalCategories}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
} 