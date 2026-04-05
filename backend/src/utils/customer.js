export const toPublicCustomer = (customer) => ({
  id: customer._id.toString(),
  fullName: customer.fullName,
  email: customer.email,
  role: customer.role || "customer",
  phone: customer.phone || '',
  address: customer.address || '',
  photo: customer.photo || null,
  memberSince:
    customer.memberSince || String(customer.createdAt?.getFullYear?.() || new Date().getFullYear()),
  lastLoginAt: customer.lastLoginAt || null,
  isBlocked: Boolean(customer.isBlocked),
  blockedAt: customer.blockedAt || null,
  createdAt: customer.createdAt,
  updatedAt: customer.updatedAt,
});
