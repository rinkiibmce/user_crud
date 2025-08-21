const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const userRoutes = require('./routes/user');

const app = express();
mongoose.connect('mongodb+srv://rinki:1234@cluster0.l9winec.mongodb.net/user_crud').then(()=>{
  console.log("MongoDB connected successfully!")
}).catch((err)=>{"Error in connecting MongoDB, ",err});

app.use(express.urlencoded());
app.use(express.json());

app.use(session({
  secret: 'simpleSecret',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, './public')));

app.use('/api', userRoutes);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, './public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, './public', 'register.html')));
app.get('/users', (req, res) => res.sendFile(path.join(__dirname, './public', 'users.html')));
app.get('/edit', (req, res) => res.sendFile(path.join(__dirname, './public', 'edit.html')));

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
