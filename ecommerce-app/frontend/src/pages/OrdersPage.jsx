import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Package, Clock, CheckCircle2, Truck, XCircle, ArrowRight, Eye } from "lucide-react";
import { ordersAPI } from "../services/api";
import { formatPrice, formatDate } from "../utils/formatters";
import EmptyState from "../components/EmptyState";

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Delivered</span>
        </span>
      );
    case "shipped":
      return (
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">
          <Truck className="w-3.5 h-3.5" />
          <span>Shipped</span>
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-200">
          <XCircle className="w-3.5 h-3.5" />
          <span>Cancelled</span>
        </span>
      );
    case "processing":
    default:
      return (
        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
          <Clock className="w-3.5 h-3.5" />
          <span>Processing</span>
        </span>
      );
  }
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const newOrderId = location.state?.newOrderId;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await ordersAPI.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-md p-6 border border-gray-100 animate-pulse space-y-4">
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="h-16 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        type="orders"
        title="You haven't placed any orders yet."
        description="Explore our best sellers and top deals to make your first purchase!"
        buttonText="Start Shopping"
        buttonLink="/products"
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Total {orders.length} orders placed
          </p>
        </div>
        <Link
          to="/products"
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          Continue Shopping →
        </Link>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const isJustPlaced = newOrderId && order.id === newOrderId;

          return (
            <div
              key={order.id}
              className={`bg-white rounded-md shadow-xs border overflow-hidden transition-all duration-300 ${
                isJustPlaced
                  ? "border-emerald-500 ring-2 ring-emerald-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Order Header */}
              <div className="bg-gray-50/80 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-gray-600">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">ORDER ID</span>
                    <span className="font-bold text-gray-900">#{order.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">DATE PLACED</span>
                    <span className="font-medium text-gray-800">{formatDate(order.created_at)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">TOTAL AMOUNT</span>
                    <span className="font-bold text-gray-900">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-5 divide-y divide-gray-100">
                {order.items.map((item) => {
                  const prod = item.product;
                  return (
                    <div
                      key={item.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded border border-gray-100 p-1 flex items-center justify-center flex-shrink-0">
                          {prod?.image_url ? (
                            <img
                              src={prod.image_url}
                              alt={prod.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>

                        <div>
                          <Link
                            to={prod ? `/products/${prod.id}` : "#"}
                            className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition line-clamp-1 max-w-md"
                          >
                            {prod?.name || "Product"}
                          </Link>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span>Quantity: <strong className="text-gray-700">{item.quantity}</strong></span>
                            <span>•</span>
                            <span>Price: <strong className="text-gray-700">{formatPrice(item.price)}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:flex-col sm:items-end w-full sm:w-auto justify-between pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        {prod && (
                          <Link
                            to={`/products/${prod.id}`}
                            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Buy Again</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Address info */}
              {order.shipping_address && (
                <div className="bg-gray-50 px-5 py-2.5 text-xs text-gray-500 border-t border-gray-100">
                  <span className="font-semibold text-gray-700">Delivery Address: </span>
                  {order.shipping_address}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;

