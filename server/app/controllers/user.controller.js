const { btoa } = require("buffer");
const db = require("../models");
const User = db.user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    async signUp(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne(
                {
                    where: {
                        email: email
                    }
                }
            )

            if (user) {
                return res.status(401).json({ message: `User already exists`, status: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = {
                email: email,
                password: hashedPassword,
                status: true
            };

            await User.create(newUser);

            res.status(200).json({ message: 'User Created!' });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': error });
        }
    },
    async signIn(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne(
                {
                    where: {
                        email: email,
                        status: true
                    }
                }
            )

            if (!user) {
                return res.status(401).json({ message: `Enter Valid Email`, status: 'Failed' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Password Incorrect', status: 'Failed' });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' });


            res.status(200).json({ message: 'Wallet Created!', token: token, user: user });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': error });
        }
    },
    async updatePassword(req, res) {
        try {
            const { userId, opassword, password } = req.body;

            const user = await User.findOne(
                {
                    where: {
                        id: userId,
                    }
                }
            )

            if (!user) {
                return res.status(401).json({ message: `User don't exists`, status: 'Failed' });
            }

            const isPasswordValid = await bcrypt.compare(opassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Old Password Incorrect', status: 'Failed' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await User.update({ password: hashedPassword }, {
                where: {
                    id: userId,
                }
            })


            res.status(200).json({ message: 'Password updated!' });
        } catch (error) {
            res.status(500).json({ error: 'Error', 'Server Error:': error });
        }
    },
}