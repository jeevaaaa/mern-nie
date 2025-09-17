const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// In-memory data storage (for demonstration)
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 25 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 30 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
];

let nextUserId = 4;

// Helper function to find user by ID
const findUserById = (id) => {
    return users.find(user => user.id === parseInt(id));
};

// Routes

// 1. GET / - Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Node.js API Server!',
        version: '1.0.0',
        endpoints: {
            'GET /': 'This welcome message',
            'GET /users': 'Get all users',
            'GET /users/:id': 'Get user by ID',
            'POST /users': 'Create new user',
            'PUT /users/:id': 'Update user by ID',
            'DELETE /users/:id': 'Delete user by ID'
        }
    });
});

// 2. GET /users - Get all users
app.get('/users', (req, res) => {
    res.json({
        success: true,
        data: users,
        count: users.length
    });
});

// 3. GET /users/:id - Get user by ID
app.get('/users/:id', (req, res) => {
    const user = findUserById(req.params.id);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    res.json({
        success: true,
        data: user
    });
});

// 4. POST /users - Create new user
app.post('/users', (req, res) => {
    const { name, email, age } = req.body;
    
    // Basic validation
    if (!name || !email || !age) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and age are required fields'
        });
    }
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User with this email already exists'
        });
    }
    
    // Create new user
    const newUser = {
        id: nextUserId++,
        name,
        email,
        age: parseInt(age)
    };
    
    users.push(newUser);
    
    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
    });
});

// 5. PUT /users/:id - Update user by ID
app.put('/users/:id', (req, res) => {
    const user = findUserById(req.params.id);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    const { name, email, age } = req.body;
    
    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
    }
    
    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (age) user.age = parseInt(age);
    
    res.json({
        success: true,
        message: 'User updated successfully',
        data: user
    });
});

// 6. DELETE /users/:id - Delete user by ID
app.delete('/users/:id', (req, res) => {
    const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.json({
        success: true,
        message: 'User deleted successfully',
        data: deletedUser
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Handle 404 for unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 API Documentation available at http://localhost:${PORT}`);
});