const asyncHandler = require('express-async-handler')
const httpStatus = require('http-status-codes')
const BranchService = require('../services/branch.service')

const createBranch = asyncHandler(async (req, res) => {
  const branch = await BranchService.createBranch(req.body)
  global.logger.info(`Branch created: ${branch.name} with id: ${branch.id}`)
  res.status(httpStatus.CREATED).json({
    status: 'SUCCESS',
    message: 'Branch created successfully',
    data: branch,
  })
})

const getBranches = asyncHandler(async (req, res) => {
  const branches = await BranchService.getBranches()
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Branches retrieved successfully',
    data: branches,
  })
})

const getBranch = asyncHandler(async (req, res) => {
  const branch = await BranchService.getBranch(req.params.id)
  if (!branch) {
    global.logger.error(`Branch not found: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Branch not found',
    })
  }
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Branch retrieved successfully',
    data: branch,
  })
})

const updateBranch = asyncHandler(async (req, res) => {
  const updatedBranch = await BranchService.updateBranch(req.params.id, req.body)
  if (!updatedBranch) {
    global.logger.error(`Branch not found for update: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Branch not found for update',
    })
  }
  global.logger.info(`Branch updated: ${updatedBranch.name} with id: ${updatedBranch.id}`)
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Branch updated successfully',
    data: updatedBranch,
  })
})

const deleteBranch = asyncHandler(async (req, res) => {
  const deletedBranch = await BranchService.deleteBranch(req.params.id)
  if (!deletedBranch) {
    global.logger.error(`Branch not found for delete: ${req.params.id}`)
    return res.status(httpStatus.NOT_FOUND).json({
      status: 'FAILED',
      message: 'Branch not found for delete',
    })
  }
  global.logger.info(`Branch deleted with id: ${req.params.id}`)
  res.status(httpStatus.OK).json({
    status: 'SUCCESS',
    message: 'Branch deleted successfully',
    data: deletedBranch,
  })
})

module.exports = {
  createBranch,
  getBranch,
  getBranches,
  updateBranch,
  deleteBranch,
}
