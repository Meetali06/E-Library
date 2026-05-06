const User = require('../models/User')
const Book = require('../models/Book')

const getStudents = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching users: ' + error.message })
  }
}

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalBooks = await Book.countDocuments()
    const activeUsers = await User.countDocuments({ isActive: true })
    const adminUsers = await User.countDocuments({ role: 'admin' })
    
    res.status(200).json({
      stats: {
        totalUsers,
        totalBooks,
        activeUsers,
        adminUsers
      }
    })
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching stats: ' + error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    res.status(200).json({ msg: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ msg: 'Error deleting user: ' + error.message })
  }
}

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body
    
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password')
    res.status(200).json({ msg: 'User role updated', user })
  } catch (error) {
    res.status(500).json({ msg: 'Error updating role: ' + error.message })
  }
}

module.exports = {
  getStudents,
  getStats,
  deleteUser,
  updateUserRole
}
