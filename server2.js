const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// In-memory data storage (for demonstration)
let products = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 55000, stock: 20 },
    { id: 2, name: 'Headphones', category: 'Electronics', price: 2000, stock: 50 },
    { id: 3, name: 'Table', category: 'Furniture', price: 7000, stock: 10 }
];

let nextProductId = 4;

// Helper: Find product by ID
const findProductById = (id) => {
    return products.find(product => product.id === parseInt(id));
};

// Routes

// 1. Welcome Route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Product API Server!',
        version: '1.0.0',
        endpoints: {
            'GET /products': 'Get all products',
            'GET /products/:id': 'Get product by ID',
            'POST /products': 'Add a new product',
            'PUT /products/:id': 'Update product by ID',
            'DELETE /products/:id': 'Delete product by ID'
        }
    });
});

// 2. Get all products
app.get('/products', (req, res) => {
    res.json({
        success: true,
        count: products.length,
        data: products
    });
});

// 3. Get product by ID
app.get('/products/:id', (req, res) => {
    const product = findProductById(req.params.id);
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
});

// 4. Add a new product
app.post('/products', (req, res) => {
    const { name, category, price, stock } = req.body;

    if (!name || !category || !price || !stock) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newProduct = {
        id: nextProductId++,
        name,
        category,
        price: parseFloat(price),
        stock: parseInt(stock)
    };

    products.push(newProduct);
    res.status(201).json({ success: true, message: 'Product added successfully', data: newProduct });
});

// 5. Update product by ID
app.put('/products/:id', (req, res) => {
    const product = findProductById(req.params.id);
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, category, price, stock } = req.body;
    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = parseFloat(price);
    if (stock) product.stock = parseInt(stock);

    res.json({ success: true, message: 'Product updated successfully', data: product });
});

// 6. Delete product by ID
app.delete('/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const deletedProduct = products.splice(index, 1)[0];
    res.json({ success: true, message: 'Product deleted successfully', data: deletedProduct });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Product API Server running at http://localhost:${PORT}`);
});
