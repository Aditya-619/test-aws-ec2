require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const { generateUploadUrl, getProfileImageUrl } = require('../fileUpload/profile.js');

const registerUser = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json('Fill in all the fields.');
        }
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(401).json('User already exists.');
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: encryptedPassword,
        });
        // const token = jwt.sign(
        //     { id: user._id },
        //     process.env.SECRET_KEY,
        //     { expiresIn: '2h' }
        // )
        // user.token = token;
        user.password = undefined;
        res.status(200).json({ message: 'User registered successfully.', user });

    } catch (err) {
        res.status(400).json(err);
    }
}

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json('Fill in all the fields.');
        }
        console.log('check=================================')
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json('User does not exists.');
        }
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { id: user._id },
                process.env.SECRET_KEY,
            )
            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            };
            res.status(200).cookie('token', token, options).json(
                {
                    message: 'Successfully logged in',
                    success: true,
                    payload: {
                        user,
                        token
                    }
                }
            )
        } else {
            res.status(400).json('Unauthorize');
        }

    } catch (err) {
        res.status(400).json(err);
    }
}

const updateUserProfileImage = async (userId, fileName) => {
    const imageUrl = `https://${process.env.BUCKET}.s3.${process.env.REGION}.amazonaws.com/users/profiles/${fileName}`;
    await User.findByIdAndUpdate(userId, { profileImage: imageUrl });
    console.log('Profile image URL updated');
};


const uploadProfileImage = async (req, res) => {
    try {
        const { userId, fileName, contentType } = req.body;
        if (!fileName || !contentType) {
            return res.status(400).json({ msg: 'Missing required fields', payload: {} });
        }
        const url = await generateUploadUrl(fileName, contentType);
        await updateUserProfileImage(userId, fileName);

        res.status(200).json({
            msg: 'Success',
            payload: { uploadUrl: url }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error uploading profile image', error });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const signedImageUrl = await getProfileImageUrl(user.profileImage.split('/').pop());

        res.status(200).json({
            msg: 'success',
            payload: {
                email: user.email,
                profileImage: signedImageUrl,
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};


module.exports = { registerUser, loginUser, uploadProfileImage, getUserById };