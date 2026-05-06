const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide all required fields' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already registered' })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })

    await newUser.save()

    res.status(201).json({ msg: 'Registration successful. Please login.' })
  } catch (error) {
    res.status(500).json({ msg: 'Server error: ' + error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ msg: 'Invalid email or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    user.lastLogin = new Date()
    await user.save()

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ msg: 'Server error: ' + error.message })
  }
}

const adminLogin = async (req, res) => {
  res.status(501).json({ msg: 'Admin login controller scaffolded. Implement logic here.' })
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ msg: 'Please provide email' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ msg: 'Email not found in our records' })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour

    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'E-Library Password Reset',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetLink}" style="background-color: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
        <p>Or copy this link: ${resetLink}</p>
      `
    }

    await transporter.sendMail(mailOptions)

    res.status(200).json({ msg: 'Password reset link has been sent to your email' })
  } catch (error) {
    res.status(500).json({ msg: 'Error: ' + error.message })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ msg: 'Token and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' })
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired reset token' })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    user.password = hashedPassword
    user.resetToken = null
    user.resetTokenExpiry = null
    await user.save()

    res.status(200).json({ msg: 'Password reset successful. Please login with your new password.' })
  } catch (error) {
    res.status(500).json({ msg: 'Error: ' + error.message })
  }
}

module.exports = {
  register,
  login,
  adminLogin,
  forgotPassword,
  resetPassword
}
