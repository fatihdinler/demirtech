const Branch = require('../models/branch.model')

const createBranch = async (data) => {
  const branch = new Branch(data)
  return await branch.save()
}

const getBranches = async () => {
  return await Branch.find()
}

const getBranch = async (id) => {
  return await Branch.findOne({ id })
}

const updateBranch = async (id, data) => {
  return await Branch.findOneAndUpdate({ id }, data, { new: true })
}

const deleteBranch = async (id) => {
  const result = await Branch.deleteOne({ id })
  return result.deletedCount > 0
}

module.exports = {
  createBranch,
  getBranches,
  getBranch,
  updateBranch,
  deleteBranch,
}
