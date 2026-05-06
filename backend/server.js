const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elibrary')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'elibrary_secret_key_2024';

// ==================== MODELS ====================

// Admin Schema
const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin', enum: ['admin'] },
    createdAt: { type: Date, default: Date.now }
});

// Student/User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student', enum: ['student'] },
    avatar: String,
    phone: String,
    department: String,
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

// Book Schema
const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: String,
    category: { type: String, required: true },
    description: String,
    imageUrl: String,
    pdfUrl: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Book = mongoose.model('Book', BookSchema);

// Multer Configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// ==================== AUTH MIDDLEWARE ====================

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }
    next();
};

// ==================== AUTH ROUTES ====================

// Student Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone, department } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        // Hash password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            department,
            role: 'student'
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            msg: 'Registration successful',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                department: newUser.department
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Student Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(400).json({ msg: 'Account is deactivated. Contact admin.' });
        }

        // Compare password with bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            msg: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                avatar: user.avatar
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Login
app.post('/api/auth/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            msg: 'Login successful',
            token,
            user: {
                id: admin._id,
                username: admin.username,
                role: admin.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get current user
app.get('/api/auth/me', verifyToken, async (req, res) => {
    try {
        let user;
        if (req.user.role === 'admin') {
            user = await Admin.findById(req.user.id).select('-password');
        } else {
            user = await User.findById(req.user.id).select('-password');
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout
app.post('/api/auth/logout', verifyToken, (req, res) => {
    res.json({ msg: 'Logout successful' });
});

// Change password
app.post('/api/auth/change-password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        let user;
        if (req.user.role === 'admin') {
            user = await Admin.findById(req.user.id);
        } else {
            user = await User.findById(req.user.id);
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ msg: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== ADMIN USER MANAGEMENT ====================

// Get all students (admin only)
app.get('/api/admin/students', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create student (admin only)
app.post('/api/admin/students', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { name, email, password, phone, department } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStudent = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            department,
            role: 'student'
        });

        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update student (admin only)
app.put('/api/admin/students/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { name, phone, department, isActive } = req.body;
        
        const student = await User.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        if (name) student.name = name;
        if (phone) student.phone = phone;
        if (department) student.department = department;
        if (isActive !== undefined) student.isActive = isActive;

        await student.save();
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete student (admin only)
app.delete('/api/admin/students/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle student active status (admin only)
app.put('/api/admin/students/:id/toggle-active', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        student.isActive = !student.isActive;
        await student.save();
        res.json({ msg: `Student ${student.isActive ? 'activated' : 'deactivated'} successfully`, student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== BOOK ROUTES ====================

// Get all books (accessible by all authenticated users)
app.get('/api/books', verifyToken, async (req, res) => {
    try {
        const books = await Book.find().populate('uploadedBy', 'username').sort({ createdAt: -1 });
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Search books (accessible by all authenticated users)
app.get('/api/books/search', verifyToken, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ msg: 'Search query is required' });
        }
        
        const searchRegex = new RegExp(q, 'i');
        const books = await Book.find({
            $or: [
                { title: searchRegex },
                { author: searchRegex },
                { category: searchRegex },
                { description: searchRegex }
            ]
        }).populate('uploadedBy', 'username').sort({ createdAt: -1 });
        
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add book (admin only)
app.post('/api/books', verifyToken, verifyAdmin, upload.single('file'), async (req, res) => {
    try {
        const { title, author, category, description, imageUrl } = req.body;
        const newBook = new Book({
            title,
            author,
            category,
            description,
            imageUrl,
            pdfUrl: req.file ? `/uploads/${req.file.filename}` : '',
            uploadedBy: req.user.id
        });
        await newBook.save();
        res.json(newBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete book (admin only)
app.delete('/api/books/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ msg: 'Book not found' });
        
        if (book.pdfUrl) {
            const filePath = path.join(__dirname, book.pdfUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        await Book.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users (admin only)
app.get('/api/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user (admin only)
app.delete('/api/users/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get stats (admin only)
app.get('/api/stats', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const bookCount = await Book.countDocuments();
        const userCount = await User.countDocuments();
        const adminCount = await Admin.countDocuments();
        const activeUserCount = await User.countDocuments({ isActive: true });
        res.json({ bookCount, userCount, adminCount, activeUserCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== LEGACY ROUTES (Backward Compatibility) ====================

// Legacy admin login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, admin: { id: admin._id, username: admin.username, role: 'admin' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Legacy create admin
app.post('/api/admin/create', async (req, res) => {
    try {
        const { username, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const admin = new Admin({ username, password: hashedPassword });
        await admin.save();
        res.json({ msg: 'Admin created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
