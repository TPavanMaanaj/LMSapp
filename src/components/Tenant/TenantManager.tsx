import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Globe,
  Database,
  Shield,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'basic' | 'premium' | 'enterprise';
  universities: number;
  students: number;
  admins: number;
  createdAt: string;
  lastActivity: string;
  storageUsed: string;
  storageLimit: string;
  features: string[];
}

const TenantManager: React.FC = () => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [tenantForm, setTenantForm] = useState({
    name: '',
    domain: '',
    subdomain: '',
    plan: 'basic' as 'basic' | 'premium' | 'enterprise'
  });

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    setIsLoading(true);
    try {
      // Mock tenants for demo
      const mockTenants: Tenant[] = [
        {
          id: '1',
          name: 'Indian Institute of Technology System',
          domain: 'iit-system.edu',
          subdomain: 'iit',
          status: 'active',
          plan: 'enterprise',
          universities: 23,
          students: 125000,
          admins: 150,
          createdAt: '2024-01-01T00:00:00Z',
          lastActivity: new Date().toISOString(),
          storageUsed: '45.2 GB',
          storageLimit: '100 GB',
          features: ['Multi-University', 'Advanced Analytics', 'API Access', 'Custom Branding']
        },
        {
          id: '2',
          name: 'State University Network',
          domain: 'stateuni.edu',
          subdomain: 'stateuni',
          status: 'active',
          plan: 'premium',
          universities: 8,
          students: 45000,
          admins: 60,
          createdAt: '2024-02-15T00:00:00Z',
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          storageUsed: '18.7 GB',
          storageLimit: '50 GB',
          features: ['Multi-University', 'Basic Analytics', 'Email Support']
        },
        {
          id: '3',
          name: 'Community College Alliance',
          domain: 'ccalliance.edu',
          subdomain: 'ccalliance',
          status: 'active',
          plan: 'basic',
          universities: 3,
          students: 12000,
          admins: 15,
          createdAt: '2024-03-01T00:00:00Z',
          lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          storageUsed: '5.2 GB',
          storageLimit: '20 GB',
          features: ['Single University', 'Basic Features']
        }
      ];
      setTenants(mockTenants);
    } catch (error) {
      console.error('Error loading tenants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTenant: Tenant = {
        id: Date.now().toString(),
        ...tenantForm,
        status: 'active',
        universities: 0,
        students: 0,
        admins: 0,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        storageUsed: '0 GB',
        storageLimit: tenantForm.plan === 'basic' ? '20 GB' : 
                     tenantForm.plan === 'premium' ? '50 GB' : '100 GB',
        features: tenantForm.plan === 'basic' ? ['Single University', 'Basic Features'] :
                 tenantForm.plan === 'premium' ? ['Multi-University', 'Basic Analytics', 'Email Support'] :
                 ['Multi-University', 'Advanced Analytics', 'API Access', 'Custom Branding']
      };
      
      setTenants([...tenants, newTenant]);
      setShowAddTenant(false);
      resetTenantForm();
      alert('Tenant created successfully!');
    } catch (error) {
      console.error('Error creating tenant:', error);
      alert('Failed to create tenant. Please try again.');
    }
  };

  const handleDeleteTenant = async (tenantId: string) => {
    if (!confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      return;
    }
    
    try {
      setTenants(tenants.filter(t => t.id !== tenantId));
      alert('Tenant deleted successfully!');
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Failed to delete tenant. Please try again.');
    }
  };

  const handleStatusChange = async (tenantId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      setTenants(tenants.map(tenant => 
        tenant.id === tenantId 
          ? { ...tenant, status: newStatus }
          : tenant
      ));
      alert(`Tenant status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating tenant status:', error);
      alert('Failed to update tenant status. Please try again.');
    }
  };

  const resetTenantForm = () => {
    setTenantForm({
      name: '',
      domain: '',
      subdomain: '',
      plan: 'basic'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStats = {
    totalTenants: tenants.length,
    activeTenants: tenants.filter(t => t.status === 'active').length,
    totalUniversities: tenants.reduce((sum, t) => sum + t.universities, 0),
    totalStudents: tenants.reduce((sum, t) => sum + t.students, 0)
  };

  if (user?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <Shield size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Access denied. Super admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tenant Management</h2>
        <button
          onClick={() => setShowAddTenant(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          <span>Add Tenant</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalTenants}</p>
            </div>
            <Building className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tenants</p>
              <p className="text-2xl font-bold text-green-600">{totalStats.activeTenants}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Universities</p>
              <p className="text-2xl font-bold text-purple-600">{totalStats.totalUniversities}</p>
            </div>
            <Globe className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-indigo-600">{totalStats.totalStudents.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Storage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                      <div className="text-sm text-gray-500">{tenant.subdomain}.lms.com</div>
                      <div className="text-sm text-gray-500">{tenant.domain}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPlanColor(tenant.plan)}`}>
                      {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(tenant.status)}`}>
                      {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>{tenant.universities} Universities</div>
                    <div>{tenant.students.toLocaleString()} Students</div>
                    <div>{tenant.admins} Admins</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>{tenant.storageUsed} / {tenant.storageLimit}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(parseFloat(tenant.storageUsed) / parseFloat(tenant.storageLimit)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(tenant.lastActivity).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedTenant(tenant)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Settings size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTenant(tenant.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Tenant Modal */}
      {showAddTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Tenant</h3>
              <button
                onClick={() => setShowAddTenant(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddTenant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
                <input
                  type="text"
                  required
                  value={tenantForm.name}
                  onChange={(e) => setTenantForm({...tenantForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter tenant name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <input
                  type="text"
                  required
                  value={tenantForm.domain}
                  onChange={(e) => setTenantForm({...tenantForm, domain: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="example.edu"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
                <div className="flex">
                  <input
                    type="text"
                    required
                    value={tenantForm.subdomain}
                    onChange={(e) => setTenantForm({...tenantForm, subdomain: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="subdomain"
                  />
                  <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-500">
                    .lms.com
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <select
                  value={tenantForm.plan}
                  onChange={(e) => setTenantForm({...tenantForm, plan: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="basic">Basic (20GB, 1 University)</option>
                  <option value="premium">Premium (50GB, Multiple Universities)</option>
                  <option value="enterprise">Enterprise (100GB, Advanced Features)</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTenant(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tenant Details Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Tenant Details</h3>
              <button
                onClick={() => setSelectedTenant(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedTenant.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Domain</label>
                  <p className="text-sm text-gray-900">{selectedTenant.domain}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subdomain</label>
                  <p className="text-sm text-gray-900">{selectedTenant.subdomain}.lms.com</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plan</label>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPlanColor(selectedTenant.plan)}`}>
                    {selectedTenant.plan.charAt(0).toUpperCase() + selectedTenant.plan.slice(1)}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div className="flex flex-wrap gap-2">
                  {selectedTenant.features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedTenant.universities}</div>
                  <div className="text-sm text-gray-600">Universities</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedTenant.students.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedTenant.admins}</div>
                  <div className="text-sm text-gray-600">Admins</div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleStatusChange(selectedTenant.id, 'active')}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleStatusChange(selectedTenant.id, 'suspended')}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Suspend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManager;