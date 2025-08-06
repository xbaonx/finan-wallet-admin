'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { p2pAPI } from '@/lib/api';
import { CheckCircleIcon, XCircleIcon, RefreshCwIcon } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [txHash, setTxHash] = useState('');
  const [showTxModal, setShowTxModal] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, [currentPage]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await p2pAPI.getOrders(currentPage, 20);
      setOrders(response.orders || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId: string, withTxHash: boolean = false) => {
    try {
      setActionLoading(orderId);
      const txHashToSend = withTxHash ? txHash : undefined;
      await p2pAPI.confirmOrder(orderId, txHashToSend);
      
      // Refresh danh sách đơn hàng
      await loadOrders();
      
      // Reset form
      setTxHash('');
      setShowTxModal(null);
      
      alert('Đã xác nhận đơn hàng thành công!');
    } catch (error: any) {
      alert('Lỗi xác nhận đơn hàng: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    
    try {
      setActionLoading(orderId);
      await p2pAPI.cancelOrder(orderId);
      
      // Refresh danh sách đơn hàng
      await loadOrders();
      
      alert('Đã hủy đơn hàng thành công!');
    } catch (error: any) {
      alert('Lỗi hủy đơn hàng: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(null);
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

  const canConfirm = (status: string) => status === 'PAID';
  const canCancel = (status: string) => status === 'PENDING' || status === 'PAID';

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng P2P</h1>
              <p className="mt-1 text-sm text-gray-500">
                Xác nhận và quản lý các đơn hàng mua USDT
              </p>
            </div>
            <button
              onClick={loadOrders}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Làm mới
            </button>
          </div>

          {/* Orders Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Địa chỉ ví
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Chưa có đơn hàng nào
                      </td>
                    </tr>
                  ) : (
                    orders.map((order: any) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id.slice(-8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.amount} USDT
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {order.walletAddress.slice(0, 6)}...{order.walletAddress.slice(-4)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {canConfirm(order.status) && (
                            <>
                              <button
                                onClick={() => handleConfirmOrder(order.id)}
                                disabled={actionLoading === order.id}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                              >
                                <CheckCircleIcon className="mr-1 h-3 w-3" />
                                Xác nhận
                              </button>
                              <button
                                onClick={() => setShowTxModal(order.id)}
                                disabled={actionLoading === order.id}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                              >
                                Với TX Hash
                              </button>
                            </>
                          )}
                          {canCancel(order.status) && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={actionLoading === order.id}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                            >
                              <XCircleIcon className="mr-1 h-3 w-3" />
                              Hủy
                            </button>
                          )}
                          {order.status === 'CONFIRMED' && order.txHash && (
                            <span className="text-xs text-green-600">
                              TX: {order.txHash.slice(0, 6)}...
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Trang {currentPage} / {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TX Hash Modal */}
        {showTxModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Nhập Transaction Hash
                </h3>
                <input
                  type="text"
                  placeholder="0x..."
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => {
                      setShowTxModal(null);
                      setTxHash('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleConfirmOrder(showTxModal, true)}
                    disabled={!txHash.trim() || actionLoading === showTxModal}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
