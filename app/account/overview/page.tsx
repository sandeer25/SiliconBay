import React from 'react'
import { Package, ShoppingCart, Heart, CreditCard, MapPin, Bell } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

const Overview = () => {
  // Sample data - replace with real data from your API
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    memberSince: "January 2024"
  }

  const stats = [
    { label: "Total Orders", value: "24", icon: ShoppingCart, color: "bg-amber-50 text-amber-600" },
    { label: "Active Orders", value: "3", icon: Package, color: "bg-amber-50 text-amber-600" },
    { label: "Wishlist Items", value: "12", icon: Heart, color: "bg-amber-50 text-amber-600" },
    { label: "Saved Cards", value: "2", icon: CreditCard, color: "bg-amber-50 text-amber-600" },
  ]

  // 10 recent orders
  const recentOrders = [
    { id: "#ORD-2024-001", date: "Nov 20, 2024", status: "Delivered", total: "$129.99" },
    { id: "#ORD-2024-002", date: "Nov 18, 2024", status: "In Transit", total: "$89.50" },
    { id: "#ORD-2024-003", date: "Nov 15, 2024", status: "Processing", total: "$249.00" },
    { id: "#ORD-2024-004", date: "Nov 10, 2024", status: "Delivered", total: "$59.99" },
    { id: "#ORD-2024-005", date: "Nov 05, 2024", status: "Delivered", total: "$199.99" },
    { id: "#ORD-2024-006", date: "Nov 01, 2024", status: "In Transit", total: "$79.49" },
    { id: "#ORD-2024-007", date: "Oct 28, 2024", status: "Delivered", total: "$149.00" },
    { id: "#ORD-2024-008", date: "Oct 25, 2024", status: "Processing", total: "$39.99" },
    { id: "#ORD-2024-009", date: "Oct 20, 2024", status: "Delivered", total: "$89.00" },
    { id: "#ORD-2024-010", date: "Oct 15, 2024", status: "Delivered", total: "$59.49" },
  ]

  const quickActions = [
    { label: "Track Orders", icon: Package, href: "/account/orders" },
    { label: "Manage Addresses", icon: MapPin, href: "/account/addresses" },
    { label: "Payment Methods", icon: CreditCard, href: "/account/payments" },
    { label: "Notifications", icon: Bell, href: "/account/overview" },
  ]

  return (
    <div className="flex-1 space-y-6">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-amber-500 to-amber-200 p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-sm">Member since {user.memberSince}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <a href="/account/orders" className="text-sm text-blue-600 hover:underline">View all</a>
          </div>
          <div className="h-[400px] overflow-y-auto border">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-50 border-b sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {recentOrders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">{order.id}</td>
                    <td className="px-4 py-3 text-gray-600 text-nowrap">{order.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-right">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link href="/account/orders" className="block my-4 text-sm text-blue-600 hover:underline text-center">View more</Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border">
          <h2 className="text-xl font-semibold p-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-amber-50 group"
                >
                  <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-amber-50">
                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-amber-600" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-amber-600">{action.label}</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white border p-4">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Verification Status</p>
            <Badge className="bg-green-100 text-green-700 px-2 py-1 text-xs font-medium rounded-none">Verified</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-medium">{user.memberSince}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Seller Status</p>
            <p className="font-medium">Active</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Preferred Language</p>
            <p className="font-medium">English</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Time Zone</p>
            <p className="font-medium">GMT-5</p>
          </div>
        </div>
        <button className="mt-4 text-blue-600 hover:underline text-sm font-medium">
          Edit Profile
        </button>
      </div>
    </div>
  )
}

export default Overview