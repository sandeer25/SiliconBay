import React from 'react'
import { Search, Filter, Plus, Star, MessageSquare, ThumbsUp, AlertCircle } from 'lucide-react'

const Feedback = () => {
    // Sample feedback data - replace with real data from your API
    const feedbacks = [
        {
            id: "#FB-2024-001",
            orderId: "#ORD-2024-001",
            productName: "Wireless Headphones Pro",
            rating: 5,
            comment: "Excellent sound quality and comfortable to wear for long hours. Highly recommended!",
            date: "Nov 21, 2024",
            status: "Published",
            helpful: 12
        },
        {
            id: "#FB-2024-002",
            orderId: "#ORD-2024-003",
            productName: "Smart Watch Series 5",
            rating: 4,
            comment: "Great product overall. Battery life could be better but features are amazing.",
            date: "Nov 16, 2024",
            status: "Published",
            helpful: 8
        },
        {
            id: "#FB-2024-003",
            orderId: "#ORD-2024-005",
            productName: "Running Shoes",
            rating: 5,
            comment: "Perfect fit and very comfortable. Best running shoes I've ever owned!",
            date: "Nov 12, 2024",
            status: "Published",
            helpful: 15
        },
        {
            id: "#FB-2024-004",
            orderId: "#ORD-2024-007",
            productName: "Laptop Stand",
            rating: 3,
            comment: "Decent quality but assembly instructions were unclear. Works fine once set up.",
            date: "Nov 06, 2024",
            status: "Published",
            helpful: 5
        },
        {
            id: "#FB-2024-005",
            orderId: "#ORD-2024-009",
            productName: "Mechanical Keyboard",
            rating: 5,
            comment: "Amazing typing experience. The switches are smooth and the build quality is solid.",
            date: "Oct 29, 2024",
            status: "Published",
            helpful: 20
        },
        {
            id: "#FB-2024-006",
            orderId: "#ORD-2024-011",
            productName: "USB-C Cable Pack",
            rating: 2,
            comment: "One cable stopped working after a week. Expected better quality.",
            date: "Oct 22, 2024",
            status: "Under Review",
            helpful: 3
        },
        {
            id: "#FB-2024-007",
            orderId: "#ORD-2024-013",
            productName: "Gaming Mouse",
            rating: 4,
            comment: "Great mouse for gaming. RGB lighting is a nice touch. A bit pricey though.",
            date: "Oct 16, 2024",
            status: "Published",
            helpful: 10
        },
        {
            id: "#FB-2024-008",
            orderId: "#ORD-2024-015",
            productName: "Bluetooth Speaker",
            rating: 5,
            comment: "Incredible sound quality for the price. Battery lasts all day!",
            date: "Oct 11, 2024",
            status: "Published",
            helpful: 18
        },
    ]

    const stats = [
        { label: "Total Reviews", value: "42", icon: MessageSquare },
        { label: "Avg Rating", value: "4.3", icon: Star },
        { label: "Published", value: "38", icon: ThumbsUp },
        { label: "Pending", value: "4", icon: AlertCircle },
    ]

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-6">
            {/* Page Header */}
            <div className="bg-white border p-4">
                <h1 className="text-2xl font-bold text-gray-900">Reviews & Feedback</h1>
                <p className="text-sm text-gray-600 mt-1">Share your experience and help other customers make informed decisions</p>
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

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 p-4">
                <div className="flex gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Write a Review</h3>
                        <p className="text-sm text-blue-800">
                            Share your honest feedback about products you've purchased. Your reviews help other customers and improve our service.
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
                            placeholder="Search by feedback ID, order ID, or product name..."
                            className="w-full pl-10 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <option>All Ratings</option>
                            <option>5 Stars</option>
                            <option>4 Stars</option>
                            <option>3 Stars</option>
                            <option>2 Stars</option>
                            <option>1 Star</option>
                        </select>
                        <select className="px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <option>All Status</option>
                            <option>Published</option>
                            <option>Under Review</option>
                            <option>Draft</option>
                        </select>
                        <button className="px-4 py-2 border bg-white hover:bg-gray-50 flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                        <button className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Write Review
                        </button>
                    </div>
                </div>
            </div>

            {/* Feedback Table */}
            <div className="bg-white border">
                <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                        <thead className="bg-gray-50 border-b sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Feedback ID</th>
                                {/* <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Order ID</th> */}
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Product</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Rating</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Comment</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Date</th>
                                {/* <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600 uppercase tracking-wider">Helpful</th> */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y">
                            {feedbacks.map((feedback) => (
                                <tr key={feedback.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">{feedback.id}</td>
                                    {/* <td className="px-4 py-3 text-gray-600 text-nowrap">{feedback.orderId}</td> */}
                                    <td className="px-4 py-3 text-gray-900">{feedback.productName}</td>
                                    <td className="px-4 py-3">{renderStars(feedback.rating)}</td>
                                    <td className="px-4 py-3 text-gray-600 max-w-md">
                                        <div className="truncate">{feedback.comment}</div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 text-nowrap">{feedback.date}</td>
                                    {/* <td className="px-4 py-3">
                                        <span className={`px-2 py-1 font-medium text-nowrap ${feedback.status === 'Published' ? 'bg-green-100 text-green-700' :
                                                feedback.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {feedback.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <ThumbsUp className="w-3 h-3 text-gray-400" />
                                            <span className="font-medium">{feedback.helpful}</span>
                                        </div>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="border-t p-4 flex items-center justify-between text-sm">
                    <div className="text-gray-600">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{' '}
                        <span className="font-medium">42</span> reviews
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

export default Feedback