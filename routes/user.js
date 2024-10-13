const { Router } = require('express');
const { 
    registerUser, 
    loginUser,
    uploadProfileImage,
    getUserById,
} = require('../controllers/user.js');

const auth = require('../middleware/auth.js');

const userRoute = Router();

userRoute.post('/register', registerUser);
userRoute.post('/login', loginUser);
userRoute.get('/upload-profile-image', auth, uploadProfileImage);
userRoute.get('/getUser/:id', auth, getUserById);

module.exports = userRoute;