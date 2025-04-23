const express = require('express')
const router = express.Router()
const branchController = require('../controllers/branch.controller')
const branchValidator = require('../validations/branch.validation')
const verifyToken = require('../middlewares/auth.middleware')

router.post('/', verifyToken, branchValidator.createBranch, branchController.createBranch)
router.get('/', verifyToken, branchValidator.getBranches, branchController.getBranches)
router.get('/:id', verifyToken, branchValidator.getBranch, branchController.getBranch)
router.put('/:id', verifyToken, branchValidator.updateBranch, branchController.updateBranch)
router.delete('/:id', verifyToken, branchValidator.deleteBranch, branchController.deleteBranch)

module.exports = router
