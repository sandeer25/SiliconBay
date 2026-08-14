"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Eye, Filter, Package, Search, Truck, CheckCircle, XCircle } from "lucide-react";

import { requestBackend } from "@/lib/backend";

type OrderRow = {
  id: string;
  date: string;
  items: number;
  summary: string;
  status: string;
  total: string;
  currency?: string;
  payment: string;
  tracking: string;
};

const formatAmount = (value: string | number | undefined, currency = "LKR") => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return String(value ?? "Unavailable");
  }

  const locale = currency === "LKR" ? "en-LK" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed);
};

const formatDate = (value: string) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value || "Unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
};

const summarizeItems = (items: unknown): string => {
  if (!Array.isArray(items) || items.length === 0) {
    return "No items listed";
  }

  const labels = items.slice(0, 2).map((item) => {
    const current = item as Record<string, unknown>;
    const name = String(current.productName ?? current.name ?? "Item");
    const quantity = Number(current.quantity ?? current.qty ?? 1);

    return `${name} × ${Number.isFinite(quantity) && quantity > 0 ? quantity : 1}`;
  });

  const remaining = items.length - labels.length;

  return remaining > 0 ? `${labels.join(", ")} +${remaining} more` : labels.join(", ");
};

const normalizeOrders = (value: unknown): OrderRow[] => {
  const rawOrders = Array.isArray(value)
    ? value
    : Array.isArray((value as { orders?: unknown[] } | null)?.orders)
      ? (value as { orders: unknown[] }).orders
      : Array.isArray((value as { data?: unknown[] } | null)?.data)
        ? (value as { data: unknown[] }).data
        : [];

  return rawOrders.map((order, index) => {
    const current = order as Record<string, unknown>;
    const itemsValue = current.items;
    const itemsCount = Array.isArray(itemsValue)
      ? itemsValue.length
      : Number(current.itemsCount ?? current.itemCount ?? current.quantity ?? 1);

    return {
      id: String(current.id ?? current.orderId ?? current.order_id ?? `ORD-${index + 1}`),
      date: String(current.date ?? current.createdAt ?? current.orderDate ?? ""),
      items: Number.isFinite(itemsCount) ? itemsCount : 0,
      summary: summarizeItems(itemsValue),
      status: normalizeStatus(String(current.status ?? current.statusMessage ?? "")),
      total: String(current.total ?? current.transactionAmount ?? current.amount ?? ""),
      currency: String(current.currency ?? "LKR"),
      payment: String(current.paymentMethod ?? current.method ?? current.payment ?? "PayHere"),
      tracking: String(current.tracking ?? current.trackingNumber ?? current.paymentId ?? current.transactionId ?? ""),
    };
  });
};

const normalizeStatus = (status: string) => {
  const upper = status.toUpperCase();

  if (upper === "PACKING" || upper === "PENDING") {
    return "Processing";
  }

  if (upper === "COMPLETED" || upper === "DELIVERED" || upper === "RECEIVED") {
    return "Delivered";
  }

  if (upper === "CANCELED" || upper === "CANCELLED") {
    return "Cancelled";
  }

  return status || "Processing";
};

const Orders = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await requestBackend<Record<string, unknown>>("/orders");
        setOrders(normalizeOrders(response));
      } catch {
        setOrders([]);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesQuery = [order.id, order.date, order.summary, String(order.total)]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || order.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  const stats = [
    { label: "Total Orders", value: String(orders.length), icon: Package },
    { label: "In Transit", value: String(orders.filter((order) => order.status === "In Transit").length), icon: Truck },
    { label: "Completed", value: String(orders.filter((order) => order.status === "Delivered").length), icon: CheckCircle },
    { label: "Cancelled", value: String(orders.filter((order) => order.status === "Cancelled").length), icon: XCircle },
  ];

  return (
    <div className="flex-1 space-y-6">
      <div className="bg-white border p-4">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-600 mt-1">View and manage all your orders</p>
      </div>

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

      <div className="bg-white border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="text" placeholder="Search by order ID, date, or amount..." className="w-full pl-10 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="flex gap-2">
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
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
                <th className="px-4 py-3 text-right font-medium text-gray-600 uppercase tracking-wider">Order Total</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">#{order.id}</td>
                  <td className="px-4 py-3 text-gray-600 text-nowrap">{formatDate(order.date)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{order.items} item{order.items === 1 ? "" : "s"}</p>
                      <p className="max-w-90 text-xs leading-5 text-gray-500">{order.summary}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 font-medium text-nowrap ${order.status === "Delivered" ? "bg-green-100 text-green-700" : order.status === "In Transit" ? "bg-blue-100 text-blue-700" : order.status === "Processing" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {order.status || "Unavailable"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-nowrap">{order.payment || "Unavailable"}</td>
                  <td className="px-4 py-3 text-gray-600 text-nowrap">{order.tracking || "Unavailable"}</td>
                  <td className="px-4 py-3 font-semibold text-right text-nowrap">{formatAmount(order.total, order.currency)}</td>
                  <td className="px-4 py-3 text-center">
                    <Link href={`/account/orders/${encodeURIComponent(order.id)}`} className="inline-flex items-center text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-2">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t p-4 flex items-center justify-between text-sm">
          <div className="text-gray-600">Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of <span className="font-medium">{orders.length}</span> orders</div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>Previous</button>
            <button className="px-4 py-2 border bg-amber-500 text-white">1</button>
            <button className="px-4 py-2 border bg-white hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;