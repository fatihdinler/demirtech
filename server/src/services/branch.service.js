const Branch = require('../models/branch.model')
const User = require('../models/user.model')

async function createBranch(data) {
  const userIds = Array.isArray(data.userIds)
    ? data.userIds
    : data.userIds ? [data.userIds] : []

  const branch = new Branch({
    name: data.name,
    customerId: data.customerId,
    userIds,
    address: data.address,
    contactInfo: data.contactInfo
  })
  await branch.save()

  if (userIds.length) {
    await User.updateMany(
      { id: { $in: userIds } },
      { $set: { branchId: branch.id } }
    )
  }

  return branch
}

async function getBranches() {
  return await Branch.find()
}

async function getBranch(id) {
  return await Branch.findOne({ id })
}

async function updateBranch(id, data) {
  const existing = await Branch.findOne({ id })
  if (!existing) {
    throw new Error('Branch bulunamadı.')
  }
  const oldUserIds = existing.userIds

  let newUserIds = oldUserIds
  if ('userIds' in data) {
    newUserIds = Array.isArray(data.userIds)
      ? data.userIds
      : data.userIds ? [data.userIds] : []
  }

  const updated = await Branch.findOneAndUpdate(
    { id },
    { ...data, userIds: newUserIds },
    { new: true }
  )
  if (!updated) {
    throw new Error('Branch güncellenirken bir hata oluştu.')
  }

  const added = newUserIds.filter(u => !oldUserIds.includes(u))
  const removed = oldUserIds.filter(u => !newUserIds.includes(u))

  if (added.length) {
    await User.updateMany(
      { id: { $in: added } },
      { $set: { branchId: id } }
    )
  }
  if (removed.length) {
    await User.updateMany(
      { id: { $in: removed }, branchId: id },
      { $unset: { branchId: "" } }
    )
  }

  return updated
}

async function deleteBranch(id) {
  const branch = await Branch.findOneAndDelete({ id })
  if (!branch) {
    throw new Error('Branch bulunamadı.')
  }
  if (branch.userIds.length) {
    await User.updateMany(
      { id: { $in: branch.userIds }, branchId: id },
      { $unset: { branchId: "" } }
    )
  }
  return true
}

module.exports = {
  createBranch,
  getBranches,
  getBranch,
  updateBranch,
  deleteBranch
}
