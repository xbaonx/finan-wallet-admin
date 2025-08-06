'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { p2pAPI, tokensAPI } from '@/lib/api';
import { CreditCardIcon, CoinsIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    cancelledOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const ordersData = await p2pAPI.getOrders(1, 10);
      
      if (ordersData.orders) {
        setRecentOrders(ordersData.orders);
        
        // Tính toán thống kê
        const pending = ordersData.orders.filter((order: any) => order.status === 'PENDING').length;
        const confirmed = ordersData.orders.filter((order: any) => order.status === 'CONFIRMED').length;
        const cancelled = ordersData.orders.filter((order: any) => order.status === 'CANCELLED').length;
        
        setStats({
          totalOrders: ordersData.pagination?.total || ordersData.orders.length,
          pendingOrders: pending,
          confirmedOrders: confirmed,
          cancelledOrders: cancelled,
        });
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ xử lý' },
      PAID: { color: 'bg-blue-100 text-blue-800', text: 'Đã thanh toán' },
      CONFIRMED: { color: 'bg-green-100 text-green-800', text: 'Đã xác nhận' },
      CANCELLED: { color: 'bg-red-100 text-red-800', text: 'Đã hủy' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
            <p className="mt-1 text-sm text-gray-500">
              Quản lý hệ thống Finan Wallet
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCardIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tổng đơn hàng
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalOrders}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CoinsIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Chờ xử lý
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.pendingOrders}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Đã xác nhận
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.confirmedOrders}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Đã hủy
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.cancelledOrders}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Đơn hàng gần đây
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                10 đơn hàng P2P mới nhất
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <li className="px-4 py-4 text-center text-gray-500">
                  Chưa có đơn hàng nào
                </li>
              ) : (
                recentOrders.map((order: any) => (
                  <li key={order.id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CreditCardIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.id.slice(-8)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.amount} USDT • {order.walletAddress.slice(0, 6)}...{order.walletAddress.slice(-4)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(order.status)}
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
