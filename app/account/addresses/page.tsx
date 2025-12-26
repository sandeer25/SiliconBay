import React from 'react'
import { Plus, Edit, Trash2, MapPin, Star, Home, Briefcase } from 'lucide-react'

const Addresses = () => {
    // Sample addresses data - replace with real data from your API
    const addresses = [
        {
            id: 1,
            type: "Home",
            name: "John Doe",
            phone: "+1 (555) 123-4567",
            address: "123 Main Street",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "United States",
            isDefault: true,
            addedDate: "Jan 15, 2024"
        },
        {
            id: 2,
            type: "Office",
            name: "John Doe",
            phone: "+1 (555) 987-6543",
            address: "456 Business Ave, Suite 100",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90001",
            country: "United States",
            isDefault: false,
            addedDate: "Mar 22, 2024"
        },
        {
            id: 3,
            type: "Home",
            name: "Jane Doe",
            phone: "+1 (555) 456-7890",
            address: "789 Oak Street, Apt 4B",
            city: "Chicago",
            state: "IL",
            zipCode: "60601",
            country: "United States",
            isDefault: false,
            addedDate: "Feb 10, 2024"
        },
        {
            id: 4,
            type: "Office",
            name: "Jane Doe",
            phone: "+1 (555) 789-0123",
            address: "321 Corporate Blvd, Suite 200",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "United States",
            isDefault: false,
            addedDate: "Apr 5, 2024"
        },
    ]

    const stats = [
        { label: "Total Addresses", value: "3", icon: MapPin },
        { label: "Default Address", value: "1", icon: Star },
        { label: "Home Addresses", value: "2", icon: Home },
        { label: "Office Addresses", value: "1", icon: Briefcase },
    ]

    return (
        <div className="flex-1 space-y-6 mb-20">
            {/* Page Header */}
            <div className="bg-white border p-4">
                <h1 className="text-2xl font-bold text-gray-900">Shipping Addresses</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your delivery addresses for faster checkout</p>
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
            <div className="bg-green-50 border border-green-200 p-4">
                <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-green-900 mb-1">Address Information</h3>
                        <p className="text-sm text-green-800">
                            Keep your addresses up to date for smooth delivery. Set a default address for faster checkout.
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="bg-white border p-4">
                <button className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Address
                </button>
            </div>

            {/* Addresses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {addresses.map((address) => (
                    <div key={address.id} className="bg-white border hover:border-amber-500 transition-colors relative">
                        {address.isDefault && (
                            <div className="absolute top-0 right-0">
                                <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 text-xs font-medium">
                                    <Star className="w-3 h-3 fill-amber-700" />
                                    Default
                                </span>
                            </div>
                        )}

                        <div className="p-4">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="bg-gray-100 p-3">
                                    {address.type === 'Home' ? (
                                        <Home className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <Briefcase className="w-5 h-5 text-gray-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{address.type}</p>
                                    <p className="text-sm text-gray-600">Added {address.addedDate}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div>
                                    <p className="font-medium text-gray-900">{address.name}</p>
                                    <p className="text-gray-600">{address.phone}</p>
                                </div>
                                <div className="text-gray-600">
                                    <p>{address.address}</p>
                                    <p>{address.city}, {address.state} {address.zipCode}</p>
                                    <p>{address.country}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 mt-4 border-t">
                                {!address.isDefault && (
                                    <button className="flex-1 px-3 py-2 border hover:bg-amber-50 hover:border-amber-500 hover:text-amber-600 text-xs font-medium">
                                        Set as Default
                                    </button>
                                )}
                                <button className="px-3 py-2 border hover:bg-gray-100 flex items-center justify-center gap-2 text-sm">
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>
                                <button className="px-3 py-2 border hover:bg-red-50 hover:border-red-500 hover:text-red-600 flex items-center justify-center gap-2 text-sm">
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Addresses