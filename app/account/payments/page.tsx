import React from 'react'
import { CreditCard, Plus, Trash2, Edit, Star } from 'lucide-react'

const Payments = () => {
    // Sample payment methods - replace with real data from your API
    const paymentMethods = [
        {
            id: 1,
            type: "Credit Card",
            brand: "Visa",
            last4: "4242",
            expiry: "12/2025",
            holderName: "John Doe",
            isDefault: true,
            addedDate: "Jan 15, 2024"
        },
        {
            id: 2,
            type: "Credit Card",
            brand: "Mastercard",
            last4: "8888",
            expiry: "08/2026",
            holderName: "John Doe",
            isDefault: false,
            addedDate: "Mar 22, 2024"
        },
        {
            id: 3,
            type: "Debit Card",
            brand: "Visa",
            last4: "1234",
            expiry: "05/2025",
            holderName: "John Doe",
            isDefault: false,
            addedDate: "Feb 10, 2024"
        },
    ]

    // Sample transaction history
    const transactions = [
        { id: "#TXN-2024-001", date: "Nov 20, 2024", description: "Order #ORD-2024-001", method: "•••• 4242", amount: "-$129.99", status: "Completed" },
        { id: "#TXN-2024-002", date: "Nov 18, 2024", description: "Order #ORD-2024-002", method: "•••• 8888", amount: "-$89.50", status: "Completed" },
        { id: "#TXN-2024-003", date: "Nov 15, 2024", description: "Order #ORD-2024-003", method: "•••• 4242", amount: "-$249.00", status: "Pending" },
        { id: "#TXN-2024-004", date: "Nov 10, 2024", description: "Refund for Order #ORD-2024-004", method: "•••• 4242", amount: "+$59.99", status: "Completed" },
        { id: "#TXN-2024-005", date: "Nov 05, 2024", description: "Order #ORD-2024-005", method: "•••• 1234", amount: "-$199.99", status: "Completed" },
        { id: "#TXN-2024-006", date: "Nov 01, 2024", description: "Order #ORD-2024-006", method: "•••• 8888", amount: "-$79.49", status: "Completed" },
        { id: "#TXN-2024-007", date: "Oct 28, 2024", description: "Order #ORD-2024-007", method: "•••• 4242", amount: "-$149.00", status: "Completed" },
        { id: "#TXN-2024-008", date: "Oct 25, 2024", description: "Order #ORD-2024-008", method: "•••• 1234", amount: "-$39.99", status: "Failed" },
    ]

    const stats = [
        { label: "Total Spent", value: "$2,450.00" },
        { label: "Active Cards", value: "3" },
        { label: "Transactions", value: "48" },
        { label: "Refunds", value: "2" },
    ]

    return (
        <div className="flex-1 space-y-6">
            {/* Page Header */}
            <div className="bg-white border p-4">
                <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your payment methods and view transaction history</p>
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

            {/* Payment Methods Section */}
            <div className="bg-white border">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Saved Payment Methods</h2>
                    <button className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Card
                    </button>
                </div>

                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paymentMethods.map((method) => (
                            <div key={method.id} className="border p-4 hover:border-amber-500 transition-colors relative">
                                {method.isDefault && (
                                    <div className="absolute top-2 right-2">
                                        <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 text-xs font-medium">
                                            <Star className="w-3 h-3 fill-amber-700" />
                                            Default
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-start gap-3 mb-4">
                                    <div className="bg-gray-100 p-3">
                                        <CreditCard className="w-6 h-6 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{method.brand} {method.type}</p>
                                        <p className="text-sm text-gray-600">•••• •••• •••• {method.last4}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Cardholder</span>
                                        <span className="font-medium">{method.holderName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Expires</span>
                                        <span className="font-medium">{method.expiry}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Added</span>
                                        <span className="font-medium">{method.addedDate}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t">
                                    <button className="flex-1 px-3 py-2 border hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button className="flex-1 px-3 py-2 border hover:bg-red-50 hover:border-red-500 hover:text-red-600 flex items-center justify-center gap-2 text-sm">
                                        <Trash2 className="w-4 h-4" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white border">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">Transaction History</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Description</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Payment Method</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y">
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">{transaction.id}</td>
                                    <td className="px-4 py-3 text-gray-600 text-nowrap">{transaction.date}</td>
                                    <td className="px-4 py-3 text-gray-600">{transaction.description}</td>
                                    <td className="px-4 py-3 text-gray-600 text-nowrap">{transaction.method}</td>
                                    <td className={`px-4 py-3 font-semibold text-right text-nowrap ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'
                                        }`}>
                                        {transaction.amount}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 font-medium ${transaction.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {transaction.status}
                                        </span>
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
                        <span className="font-medium">48</span> transactions
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

export default Payments