const express = require('express')
const { getStudents, getStats, deleteUser, updateUserRole } = require('../controllers/adminController')

const router = express.Router()

router.get('/students', getStudents)
router.get('/stats', getStats)
router.delete('/users/:id', deleteUser)
router.put('/users/:id/role', updateUserRole)

module.exports = router
