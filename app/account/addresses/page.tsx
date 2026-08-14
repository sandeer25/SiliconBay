"use client";

import React, { useMemo, useState } from "react";
import { Briefcase, Home, MapPin, Plus, Star, Trash2 } from "lucide-react";

const ADDRESSES_KEY = "siliconbay-address-book";

type AddressRow = {
  id: string;
  type: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  addedDate: string;
};

type AddressForm = Omit<AddressRow, "id" | "isDefault" | "addedDate"> & { isDefault: boolean };

const emptyForm: AddressForm = {
  type: "Home",
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  isDefault: false,
};

const Addresses = () => {
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [form, setForm] = useState<AddressForm>(emptyForm);

  const persistAddresses = (nextAddresses: AddressRow[]) => {
    setAddresses(nextAddresses);
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(nextAddresses));
  };

  const addAddress = () => {
    if (!form.name.trim() || !form.address.trim() || !form.city.trim() || !form.country.trim()) {
      return;
    }

    const nextAddress: AddressRow = {
      id: String(Date.now()),
      type: form.type,
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zipCode: form.zipCode.trim(),
      country: form.country.trim(),
      isDefault: form.isDefault || addresses.length === 0,
      addedDate: new Date().toISOString().slice(0, 10),
    };

    const nextAddresses = nextAddress.isDefault
      ? [nextAddress, ...addresses.map((address) => ({ ...address, isDefault: false }))]
      : [...addresses, nextAddress];

    persistAddresses(nextAddresses);
    setForm(emptyForm);
  };

  const setDefaultAddress = (id: string) => {
    persistAddresses(addresses.map((address) => ({ ...address, isDefault: address.id === id })));
  };

  const removeAddress = (id: string) => {
    const nextAddresses = addresses.filter((address) => address.id !== id);
    persistAddresses(nextAddresses.map((address, index) => ({ ...address, isDefault: index === 0 && nextAddresses.length > 0 ? true : address.isDefault })));
  };

  const stats = useMemo(
    () => [
      { label: "Total Addresses", value: String(addresses.length), icon: MapPin },
      { label: "Default Address", value: String(addresses.filter((address) => address.isDefault).length), icon: Star },
      { label: "Home Addresses", value: String(addresses.filter((address) => address.type.toLowerCase() === "home").length), icon: Home },
      { label: "Office Addresses", value: String(addresses.filter((address) => address.type.toLowerCase() === "office").length), icon: Briefcase },
    ],
    [addresses]
  );

  return (
    <div className="flex-1 space-y-6 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

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
          );
        })}
      </div>

      <div className="bg-white border p-4 space-y-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Add a new address</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} className="w-full px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option>Home</option>
              <option>Office</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} type="text" className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} type="tel" className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input value={form.country} onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))} type="text" className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} type="text" className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} type="text" className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input value={form.state} onChange={(event) => setForm((current) => ({ ...current, state: event.target.value }))} type="text" className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
            <input value={form.zipCode} onChange={(event) => setForm((current) => ({ ...current, zipCode: event.target.value }))} type="text" className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="flex items-center gap-2 pt-7">
            <input checked={form.isDefault} onChange={(event) => setForm((current) => ({ ...current, isDefault: event.target.checked }))} type="checkbox" className="w-4 h-4 text-amber-500 border-gray-300" />
            <span className="text-sm text-gray-700">Set as default address</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={addAddress} className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        </div>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white border border-dashed p-8 text-sm text-gray-600">No addresses are available yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white border relative">
              {address.isDefault ? (
                <div className="absolute top-0 right-0">
                  <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 text-xs font-medium">
                    <Star className="w-3 h-3 fill-amber-700" />
                    Default
                  </span>
                </div>
              ) : null}

              <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-3">
                    {address.type.toLowerCase() === "home" ? <Home className="w-5 h-5 text-gray-600" /> : <Briefcase className="w-5 h-5 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{address.type || "Address"}</p>
                    <p className="text-sm text-gray-600">Added {address.addedDate}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{address.name || "Unnamed recipient"}</p>
                    <p className="text-gray-600">{address.phone || "No phone number"}</p>
                  </div>
                  <div className="text-gray-600">
                    <p>{address.address}</p>
                    <p>{[address.city, address.state, address.zipCode].filter(Boolean).join(", ")}</p>
                    <p>{address.country}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button onClick={() => setDefaultAddress(address.id)} className="px-3 py-2 border text-sm hover:bg-gray-50">
                    Set Default
                  </button>
                  <button onClick={() => removeAddress(address.id)} className="px-3 py-2 border border-red-200 text-red-600 text-sm hover:bg-red-50 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
