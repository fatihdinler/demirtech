const Branch = require('../models/branch.model')

const createBranch = async (data) => {
  const userIds = Array.isArray(data.userIds)
    ? data.userIds
    : data.userIds
      ? [data.userIds]
      : []

  const branch = new Branch({
    name: data.name,
    customerId: data.customerId,
    userIds,
    address: data.address,
    contactInfo: data.contactInfo,
  })

  return await branch.save()
}

const getBranches = async () => {
  return await Branch.find()
}

const getBranch = async (id) => {
  return await Branch.findOne({ id })
}

const updateBranch = async (id, data) => {
  if ('userIds' in data) {
    data.userIds = Array.isArray(data.userIds)
      ? data.userIds
      : data.userIds
        ? [data.userIds]
        : []
  }

  return await Branch.findOneAndUpdate(
    { id },
    data,
    { new: true }
  )
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
