const express = require('express')
const router = express.Router()
const branchController = require('../controllers/branch.controller')
const branchValidator = require('../validations/branch.validation')

router.post('/', branchValidator.createBranch, branchController.createBranch)
router.get('/', branchValidator.getBranches, branchController.getBranches)
router.get('/:id', branchValidator.getBranch, branchController.getBranch)
router.put('/:id', branchValidator.updateBranch, branchController.updateBranch)
router.delete('/:id', branchValidator.deleteBranch, branchController.deleteBranch)

module.exports = router
