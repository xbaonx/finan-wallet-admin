'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { configAPI } from '@/lib/api';
import { SaveIcon } from 'lucide-react';

export default function SettingsPage() {
  const [config, setConfig] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    qrImageUrl: '',
    note: '',
    adminWalletAddress: '',
    usdtRate: 1.0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await configAPI.getConfig();
      setConfig(response);
    } catch (error) {
      console.error('Lỗi tải cấu hình:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await configAPI.updateConfig(config);
      alert('Cập nhật cấu hình thành công!');
    } catch (error: any) {
      alert('Lỗi cập nhật cấu hình: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
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
            <h1 className="text-2xl font-bold text-gray-900">Cấu hình hệ thống</h1>
            <p className="mt-1 text-sm text-gray-500">
              Quản lý thông tin ngân hàng và ví admin
            </p>
          </div>

          {/* Settings Form */}
          <div className="bg-white shadow sm:rounded-lg">
            <form onSubmit={handleSave}>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Thông tin ngân hàng */}
                  <div className="sm:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Thông tin ngân hàng
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tên ngân hàng
                    </label>
                    <input
                      type="text"
                      value={config.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="VD: Vietcombank"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số tài khoản
                    </label>
                    <input
                      type="text"
                      value={config.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="VD: 1234567890"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Chủ tài khoản
                    </label>
                    <input
                      type="text"
                      value={config.accountHolder}
                      onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="VD: NGUYEN VAN A"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      URL QR Code
                    </label>
                    <input
                      type="url"
                      value={config.qrImageUrl}
                      onChange={(e) => handleInputChange('qrImageUrl', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="https://example.com/qr-code.png"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Ghi chú thanh toán
                    </label>
                    <textarea
                      value={config.note}
                      onChange={(e) => handleInputChange('note', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Ghi chú cho khách hàng khi thanh toán..."
                    />
                  </div>

                  {/* Thông tin ví */}
                  <div className="sm:col-span-2 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Thông tin ví Admin
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ ví Admin
                    </label>
                    <input
                      type="text"
                      value={config.adminWalletAddress}
                      onChange={(e) => handleInputChange('adminWalletAddress', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                      placeholder="0x..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tỷ giá USDT (VND)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      min="0"
                      value={config.usdtRate}
                      onChange={(e) => handleInputChange('usdtRate', parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="1.0"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Tỷ giá quy đổi từ USDT sang VND (mặc định: 1.0)
                    </p>
                  </div>
                </div>

                {/* Preview QR Code */}
                {config.qrImageUrl && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Xem trước QR Code
                    </h4>
                    <div className="max-w-xs">
                      <img
                        src={config.qrImageUrl}
                        alt="QR Code Preview"
                        className="w-full h-auto border border-gray-300 rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <SaveIcon className="mr-2 h-4 w-4" />
                  )}
                  {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
