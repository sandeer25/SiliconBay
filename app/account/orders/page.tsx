import React from 'react'
import { Search, Filter, Download, Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react'

const Orders = () => {
    // Sample orders data - replace with real data from your API
    const orders = [
        { id: "#ORD-2024-001", date: "Nov 20, 2024", items: 3, status: "Delivered", total: "$129.99", payment: "Credit Card", tracking: "TRK123456789" },
        { id: "#ORD-2024-002", date: "Nov 18, 2024", items: 2, status: "In Transit", total: "$89.50", payment: "PayPal", tracking: "TRK987654321" },
        { id: "#ORD-2024-003", date: "Nov 15, 2024", items: 5, status: "Processing", total: "$249.00", payment: "Credit Card", tracking: "TRK456789123" },
        { id: "#ORD-2024-004", date: "Nov 10, 2024", items: 1, status: "Delivered", total: "$59.99", payment: "Debit Card", tracking: "TRK321654987" },
        { id: "#ORD-2024-005", date: "Nov 05, 2024", items: 4, status: "Delivered", total: "$199.99", payment: "Credit Card", tracking: "TRK789456123" },
        { id: "#ORD-2024-006", date: "Nov 01, 2024", items: 2, status: "In Transit", total: "$79.49", payment: "PayPal", tracking: "TRK654321789" },
        { id: "#ORD-2024-007", date: "Oct 28, 2024", items: 3, status: "Delivered", total: "$149.00", payment: "Credit Card", tracking: "TRK147258369" },
        { id: "#ORD-2024-008", date: "Oct 25, 2024", items: 1, status: "Processing", total: "$39.99", payment: "Debit Card", tracking: "TRK369258147" },
        { id: "#ORD-2024-009", date: "Oct 20, 2024", items: 6, status: "Delivered", total: "$89.00", payment: "Credit Card", tracking: "TRK258147369" },
        { id: "#ORD-2024-010", date: "Oct 15, 2024", items: 2, status: "Delivered", total: "$59.49", payment: "PayPal", tracking: "TRK741852963" },
        { id: "#ORD-2024-011", date: "Oct 10, 2024", items: 3, status: "Cancelled", total: "$119.99", payment: "Credit Card", tracking: "N/A" },
        { id: "#ORD-2024-012", date: "Oct 05, 2024", items: 1, status: "Delivered", total: "$29.99", payment: "Debit Card", tracking: "TRK852963741" },
        { id: "#ORD-2024-013", date: "Sep 28, 2024", items: 4, status: "Delivered", total: "$179.00", payment: "Credit Card", tracking: "TRK963741852" },
        { id: "#ORD-2024-014", date: "Sep 20, 2024", items: 2, status: "Delivered", total: "$99.50", payment: "PayPal", tracking: "TRK159753486" },
        { id: "#ORD-2024-015", date: "Sep 15, 2024", items: 5, status: "Delivered", total: "$299.99", payment: "Credit Card", tracking: "TRK486159753" },
    ]

    const stats = [
        { label: "Total Orders", value: "156", icon: Package },
        { label: "In Transit", value: "8", icon: Truck },
        { label: "Completed", value: "142", icon: CheckCircle },
        { label: "Cancelled", value: "6", icon: XCircle },
    ]

    return (
        <div className="flex-1 space-y-6">
            {/* Page Header */}
            <div className="bg-white border p-4">
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-600 mt-1">View and manage all your orders</p>
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
                                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                                </div>
                                <div className="bg-amber-50 p-3">
                                    <Icon className="w-6 h-6 text-amber-600" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Filters and Search */}
            <div className="bg-white border p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by order ID, date, or amount..."
                            className="w-full pl-10 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <option>All Status</option>
                            <option>Delivered</option>
                            <option>In Transit</option>
                            <option>Processing</option>
                            <option>Cancelled</option>
                        </select>
                        <button className="px-4 py-2 border bg-white hover:bg-gray-50 flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                        <button className="px-4 py-2 border bg-white hover:bg-gray-50 flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border">
                <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                        <thead className="bg-gray-50 border-b sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Order ID</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Items</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Payment</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Tracking</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600 uppercase tracking-wider">Total</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">{order.id}</td>
                                    <td className="px-4 py-3 text-gray-600 text-nowrap">{order.date}</td>
                                    <td className="px-4 py-3 text-gray-600">{order.items}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 font-medium text-nowrap ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 text-nowrap">{order.payment}</td>
                                    <td className="px-4 py-3 text-gray-600 text-nowrap">{order.tracking}</td>
                                    <td className="px-4 py-3 font-semibold text-right text-nowrap">{order.total}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-2">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="border-t p-4 flex items-center justify-between text-sm">
                    <div className="text-gray-600">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">15</span> of{' '}
                        <span className="font-medium">156</span> orders
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Previous
                        </button>
                        <button className="px-4 py-2 border bg-amber-500 text-white">1</button>
                        <button className="px-4 py-2 border bg-white hover:bg-gray-50">2</button>
                        <button className="px-4 py-2 border bg-white hover:bg-gray-50">3</button>
                        <button className="px-4 py-2 border bg-white hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Orders