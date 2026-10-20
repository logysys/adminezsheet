import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import axios from 'axios';
import { 
  FaExchangeAlt, 
  FaCoins, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaSpinner, 
  FaPlus, 
  FaArrowUp, 
  FaArrowDown, 
  FaBalanceScale,
  FaHistory
} from 'react-icons/fa';

const CompleteTransferForm = ({ onComplete, auth, funnels }) => {
  const [token, setToken] = React.useState('');
  const [funnelId, setFunnelId] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await onComplete(token, funnelId);
      setToken('');
      setFunnelId('');
    } catch (err) {
      setError(err.message || 'Failed to complete transfer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaExchangeAlt className="text-blue-500 text-2xl" />
          <h3 className="text-xl font-bold text-gray-800">Complete Transfer</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transfer Token
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter transfer token"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign to Funnel (optional)
          </label>
          <select
            value={funnelId}
            onChange={(e) => setFunnelId(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Funnel</option>
            {funnels.map(funnel => (
              <option key={funnel.id} value={funnel.id}>
                {funnel.token} - {funnel.user?.name || 'Unknown User'} (ID: {funnel.id})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FaCheckCircle />
                Complete Transfer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default function Index({ auth }) {
  const { transfers, users, domains, customDomains } = usePage().props;
  
  const [formData, setFormData] = React.useState({
    recipient_id: '',
    handle_type: 'domain',
    handle_id: '',
    expires_at: '',
  });

  const [funnels, setFunnels] = React.useState([]);
  const [errors, setErrors] = React.useState({});
  const [successMessage, setSuccessMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const isAdmin = auth.user.is_admin;

  // Fetch all funnels when component mounts
  React.useEffect(() => {
    const fetchFunnels = async () => {
      try {
        const response = await axios.get(route('funnels.all'));
        setFunnels(response.data);
      } catch (error) {
        console.error('Error fetching funnels:', error);
      }
    };

    fetchFunnels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    setLoading(true);
    
    try {
      await axios.post(route('domain-transfers.store'), formData);
      setSuccessMessage('Transfer created successfully!');
      setFormData({
        recipient_id: '',
        handle_type: 'domain',
        handle_id: '',
        expires_at: '',
      });
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.message || 'An error occurred while creating the transfer.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTransfer = async (token, funnelId = null) => {
    try {
      const response = await axios.post(route('domain-transfers.complete', { token }), { 
        funnel_id: funnelId 
      });
      setSuccessMessage(response.data.message || 'Transfer completed successfully!');
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to complete transfer');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isTransferExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Domain Transfers</h2>
          <Link 
            href={route('ezfunnels.index')} 
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Funnels
          </Link>
        </div>
      }
    >
      <Head title="Domain Transfers" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {errors.general && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                  {errors.general}
                </div>
              )}

              {/* Complete Transfer Form */}
              <CompleteTransferForm 
                onComplete={handleCompleteTransfer}
                auth={auth}
                funnels={funnels}
              />

              {/* Create Transfer Form */}
              <div className="mb-8 bg-blue-50 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <FaPlus className="text-blue-500 text-2xl" />
                    <h3 className="text-xl font-bold text-gray-800">Create New Transfer</h3>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                      <select
                        name="recipient_id"
                        value={formData.recipient_id}
                        onChange={handleChange}
                        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          errors.recipient_id ? 'border-red-500' : ''
                        }`}
                        required
                      >
                        <option value="">Select User</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                      </select>
                      {errors.recipient_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.recipient_id}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Handle Type</label>
                      <select
                        name="handle_type"
                        value={formData.handle_type}
                        onChange={handleChange}
                        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          errors.handle_type ? 'border-red-500' : ''
                        }`}
                        required
                      >
                        <option value="domain">Handle Domain</option>
                        <option value="custom">Custom Domain</option>
                      </select>
                      {errors.handle_type && (
                        <p className="mt-1 text-sm text-red-600">{errors.handle_type}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {formData.handle_type === 'custom' ? 'Custom Domain' : 'Handle Domain'}
                      </label>
                      <select
                        name="handle_id"
                        value={formData.handle_id}
                        onChange={handleChange}
                        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          errors.handle_id ? 'border-red-500' : ''
                        }`}
                        required
                      >
                        <option value="">Select Domain</option>
                        {formData.handle_type === 'custom' 
                          ? customDomains.map(domain => (
                              <option key={domain.id} value={domain.id}>
                                {domain.domain}/{domain.domainselected}
                              </option>
                            ))
                          : domains.map(domain => (
                              <option key={domain.id} value={domain.id}>
                                {domain.domain}.{domain.domainselected}
                              </option>
                            ))
                        }
                      </select>
                      {errors.handle_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.handle_id}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiration (optional)</label>
                      <input
                        type="datetime-local"
                        name="expires_at"
                        value={formData.expires_at}
                        onChange={handleChange}
                        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          errors.expires_at ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.expires_at && (
                        <p className="mt-1 text-sm text-red-600">{errors.expires_at}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <FaPlus />
                          Create Transfer
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Transfers List */}
              <div className="overflow-x-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <FaHistory className="text-gray-500" />
                    Transfer History
                  </h3>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transfers.data.map(transfer => {
                      const isExpired = isTransferExpired(transfer.expires_at);
                      
                      return (
                        <tr key={transfer.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transfer.sender?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transfer.recipient?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transfer.handle_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <code className="text-sm bg-gray-100 p-1 rounded">{transfer.token}</code>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transfer.expires_at)}
                            {isExpired && !transfer.used && (
                              <span className="ml-2 text-xs text-red-500">(Expired)</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              transfer.used 
                                ? 'bg-green-100 text-green-800' 
                                : isExpired
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transfer.used ? 'Completed' : isExpired ? 'Expired' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="mt-4">
                <Pagination links={transfers.links} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}