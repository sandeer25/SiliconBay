import React from 'react'
import { Search, Filter, Plus, Eye, PackageX } from 'lucide-react'

const Returns = () => {
    // Sample returns data - replace with real data from your API
    const returns = [
        {
            id: "#RET-2024-001",
            orderId: "#ORD-2024-015",
            date: "Nov 18, 2024",
            productName: "Wireless Headphones Pro",
            quantity: 1,
            reason: "Defective item",
            status: "Approved",
            refundAmount: "$149.99",
            requestDate: "Nov 15, 2024"
        },
        {
            id: "#RET-2024-002",
            orderId: "#ORD-2024-012",
            date: "Nov 10, 2024",
            productName: "Smart Watch Series 5",
            quantity: 1,
            reason: "Changed mind",
            status: "Processing",
            refundAmount: "$299.00",
            requestDate: "Nov 08, 2024"
        },
        {
            id: "#RET-2024-003",
            orderId: "#ORD-2024-008",
            date: "Nov 05, 2024",
            productName: "Running Shoes",
            quantity: 2,
            reason: "Wrong size",
            status: "Completed",
            refundAmount: "$179.98",
            requestDate: "Nov 02, 2024"
        },
        {
            id: "#RET-2024-004",
            orderId: "#ORD-2024-005",
            date: "Oct 28, 2024",
            productName: "Laptop Stand",
            quantity: 1,
            reason: "Not as described",
            status: "Rejected",
            refundAmount: "$0.00",
            requestDate: "Oct 25, 2024"
        },
        {
            id: "#RET-2024-005",
            orderId: "#ORD-2024-003",
            date: "Oct 20, 2024",
            productName: "Mechanical Keyboard",
            quantity: 1,
            reason: "Defective item",
            status: "Completed",
            refundAmount: "$89.99",
            requestDate: "Oct 18, 2024"
        },
        {
            id: "#RET-2024-006",
            orderId: "#ORD-2024-001",
            date: "Oct 15, 2024",
            productName: "USB-C Cable Pack",
            quantity: 3,
            reason: "Damaged in shipping",
            status: "Completed",
            refundAmount: "$45.00",
            requestDate: "Oct 13, 2024"
        },
        {
            id: "#RET-2024-007",
            orderId: "#ORD-2024-010",
            date: "Oct 10, 2024",
            productName: "Gaming Mouse",
            quantity: 1,
            reason: "Changed mind",
            status: "Pending",
            refundAmount: "$69.99",
            requestDate: "Oct 09, 2024"
        },
        {
            id: "#RET-2024-008",
            orderId: "#ORD-2024-007",
            date: "Oct 05, 2024",
            productName: "Bluetooth Speaker",
            quantity: 1,
            reason: "Better price found",
            status: "Approved",
            refundAmount: "$129.00",
            requestDate: "Oct 03, 2024"
        },
    ]

    const stats = [
        { label: "Total Returns", value: "24" },
        { label: "Pending", value: "3" },
        { label: "Approved", value: "16" },
        { label: "Completed", value: "18" },
    ]

    const returnReasons = [
        "Defective item",
        "Wrong size",
        "Changed mind",
        "Not as described",
        "Damaged in shipping",
        "Better price found",
        "Ordered by mistake"
    ]

    return (
        <div className="flex-1 space-y-6">
            {/* Page Header */}
            <div className="bg-white border p-4">
                <h1 className="text-2xl font-bold text-gray-900">Returns & Refunds</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your return requests and track refund status</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white border p-4">
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Return Policy Info */}
            <div className="bg-amber-50 border border-amber-200 p-4">
                <div className="flex gap-3">
                    <PackageX className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-amber-900 mb-1">Return Policy</h3>
                        <p className="text-sm text-amber-800">
                            Items can be returned within 30 days of delivery. Products must be unused and in original packaging.
                            Refunds are processed within 5-7 business days after approval.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white border p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by return ID, order ID, or product name..."
                            className="w-full pl-10 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Approved</option>
                            <option>Completed</option>
                            <option>Rejected</option>
                        </select>
                        <button className="px-4 py-2 border bg-white hover:bg-gray-50 flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                        <button className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            New Return
                        </button>
                    </div>
                </div>
            </div>

            {/* Returns Table */}
            <div className="bg-white border">
                <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                        <thead className="bg-gray-50 border-b sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Return ID</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Order ID</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Product</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Qty</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Reason</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Request Date</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600 uppercase tracking-wider">Refund</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y">
                            {returns.map((returnItem) => (
                                <tr key={returnItem.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">{returnItem.id}</td>
                                    <td className="px-4 py-3 text-gray-600 text-nowrap">{returnItem.orderId}</td>
                                    <td className="px-4 py-3 text-gray-900">{returnItem.productName}</td>
                                    <td className="px-4 py-3 text-gray-600">{returnItem.quantity}</td>
                                    <td className="px-4 py-3 text-gray-600 text-nowrap">{returnItem.reason}</td>
                                    <td className="px-4 py-3 text-gray-600 text-nowrap">{returnItem.requestDate}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 font-medium text-nowrap ${returnItem.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                returnItem.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                                    returnItem.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                                        returnItem.status === 'Pending' ? 'bg-gray-100 text-gray-700' :
                                                            'bg-red-100 text-red-700'
                                            }`}>
                                            {returnItem.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-right text-nowrap">{returnItem.refundAmount}</td>
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
                        Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{' '}
                        <span className="font-medium">24</span> returns
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

export default Returns