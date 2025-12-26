import React from 'react'
import { Search, Filter, Heart, ShoppingCart, Trash2, Share2, Eye } from 'lucide-react'

const Wishlist = () => {
    // Sample wishlist data - replace with real data from your API
    const wishlistItems = [
        {
            id: 1,
            productId: "#PRD-001",
            name: "Wireless Headphones Pro",
            category: "Electronics",
            price: "$149.99",
            originalPrice: "$199.99",
            discount: "25%",
            inStock: true,
            addedDate: "Nov 15, 2024",
            image: "🎧"
        },
        {
            id: 2,
            productId: "#PRD-002",
            name: "Smart Watch Series 5",
            category: "Wearables",
            price: "$299.00",
            originalPrice: "$399.00",
            discount: "25%",
            inStock: true,
            addedDate: "Nov 10, 2024",
            image: "⌚"
        },
        {
            id: 3,
            productId: "#PRD-003",
            name: "Running Shoes Pro",
            category: "Sports",
            price: "$89.99",
            originalPrice: "$89.99",
            discount: null,
            inStock: false,
            addedDate: "Nov 05, 2024",
            image: "👟"
        },
        {
            id: 4,
            productId: "#PRD-004",
            name: "Laptop Stand Aluminum",
            category: "Office",
            price: "$49.99",
            originalPrice: "$79.99",
            discount: "37%",
            inStock: true,
            addedDate: "Oct 28, 2024",
            image: "💻"
        },
        {
            id: 5,
            productId: "#PRD-005",
            name: "Mechanical Keyboard RGB",
            category: "Electronics",
            price: "$129.99",
            originalPrice: "$129.99",
            discount: null,
            inStock: true,
            addedDate: "Oct 20, 2024",
            image: "⌨️"
        },
        {
            id: 6,
            productId: "#PRD-006",
            name: "Bluetooth Speaker",
            category: "Audio",
            price: "$79.99",
            originalPrice: "$99.99",
            discount: "20%",
            inStock: true,
            addedDate: "Oct 15, 2024",
            image: "🔊"
        },
        {
            id: 7,
            productId: "#PRD-007",
            name: "Gaming Mouse Pro",
            category: "Gaming",
            price: "$69.99",
            originalPrice: "$89.99",
            discount: "22%",
            inStock: true,
            addedDate: "Oct 10, 2024",
            image: "🖱️"
        },
        {
            id: 8,
            productId: "#PRD-008",
            name: "USB-C Hub Adapter",
            category: "Accessories",
            price: "$39.99",
            originalPrice: "$39.99",
            discount: null,
            inStock: false,
            addedDate: "Oct 05, 2024",
            image: "🔌"
        },
    ]

    const stats = [
        { label: "Total Items", value: "12", icon: Heart },
        { label: "In Stock", value: "9", icon: ShoppingCart },
        { label: "On Sale", value: "6", icon: Filter },
        { label: "Out of Stock", value: "3", icon: Eye },
    ]

    return (
        <div className="flex-1 space-y-6 mb-20">
            {/* Page Header */}
            <div className="bg-white border p-4">
                <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-sm text-gray-600 mt-1">Save items you love and track price changes</p>
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
            <div className="bg-pink-50 border border-pink-200 p-4">
                <div className="flex gap-3">
                    <Heart className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-pink-900 mb-1">Price Drop Alerts</h3>
                        <p className="text-sm text-pink-800">
                            We'll notify you when items in your wishlist go on sale or come back in stock.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white border p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search wishlist items..."
                            className="w-full pl-10 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <option>All Categories</option>
                            <option>Electronics</option>
                            <option>Wearables</option>
                            <option>Sports</option>
                            <option>Office</option>
                            <option>Gaming</option>
                        </select>
                        <select className="px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <option>All Items</option>
                            <option>In Stock</option>
                            <option>Out of Stock</option>
                            <option>On Sale</option>
                        </select>
                        <button className="px-4 py-2 border bg-white hover:bg-gray-50 flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </div>
            </div>

            {/* Wishlist Table View */}
            <div className="bg-white border">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">All Wishlist Items</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Product ID</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Product Name</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Category</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Price</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Discount</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Stock</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Added Date</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y">
                            {wishlistItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">{item.productId}</td>
                                    <td className="px-4 py-3 text-gray-900">{item.name}</td>
                                    <td className="px-4 py-3 text-gray-600 text-nowrap">{item.category}</td>
                                    <td className="px-4 py-3 text-gray-900 font-semibold text-nowrap">
                                        {item.price}
                                        {item.originalPrice !== item.price && (
                                            <span className="ml-2 text-gray-500 line-through">{item.originalPrice}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.discount ? (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 font-medium">
                                                -{item.discount}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.inStock ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 font-medium">
                                                In Stock
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 font-medium">
                                                Out of Stock
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 text-nowrap">{item.addedDate}</td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                disabled={!item.inStock}
                                                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-2 disabled:text-gray-400 disabled:cursor-not-allowed"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
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
                        <span className="font-medium">12</span> items
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Previous
                        </button>
                        <button className="px-4 py-2 border bg-amber-500 text-white">1</button>
                        <button className="px-4 py-2 border bg-white hover:bg-gray-50">2</button>
                        <button className="px-4 py-2 border bg-white hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Wishlist