import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Settings, 
  Users, 
  Building, 
  BookOpen, 
  Shield,
  RefreshCw,
  Save,
  AlertTriangle,
  CheckCircle,
  Server,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import * as UniversityService from '../../services/Universityservice';
import * as StudentService from '../../services/Studentservice';
import * as CourseService from '../../services/Courseservice';
import * as AdminService from '../../services/Adminservice';

interface DatabaseStats {
  universities: number;
  students: number;
  courses: number;
  admins: number;
  totalUsers: number;
  activeConnections: number;
  lastBackup: string;
  databaseSize: string;
}

interface SystemSettings {
  maxUniversities: number;
  maxStudentsPerUniversity: number;
  maxCoursesPerUniversity: number;
  enableAutoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  enableEmailNotifications: boolean;
  enableAuditLogs: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
}

const DatabaseSettings: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DatabaseStats>({
    universities: 0,
    students: 0,
    courses: 0,
    admins: 0,
    totalUsers: 0,
    activeConnections: 12,
    lastBackup: new Date().toISOString(),
    databaseSize: '2.4 GB'
  });
  
  const [settings, setSettings] = useState<SystemSettings>({
    maxUniversities: 100,
    maxStudentsPerUniversity: 10000,
    maxCoursesPerUniversity: 500,
    enableAutoBackup: true,
    backupFrequency: 'daily',
    enableEmailNotifications: true,
    enableAuditLogs: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'backup' | 'security'>('overview');

  useEffect(() => {
    loadDatabaseStats();
  }, []);

  const loadDatabaseStats = async () => {
    setIsLoading(true);
    try {
      const [universitiesRes, studentsRes, coursesRes, adminsRes] = await Promise.all([
        UniversityService.getAllUniversities(),
        StudentService.getAllStudents(),
        CourseService.getAllCourses(),
        AdminService.getAllAdmins()
      ]);

      setStats({
        universities: universitiesRes.data.length,
        students: studentsRes.data.length,
        courses: coursesRes.data.length,
        admins: adminsRes.data.length,
        totalUsers: studentsRes.data.length + adminsRes.data.length + 1, // +1 for super admin
        activeConnections: Math.floor(Math.random() * 20) + 10,
        lastBackup: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        databaseSize: `${(2.1 + Math.random() * 0.8).toFixed(1)} GB`
      });
    } catch (error) {
      console.error('Error loading database stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date());
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBackupDatabase = async () => {
    try {
      // Simulate backup process
      alert('Database backup initiated. You will be notified when complete.');
    } catch (error) {
      console.error('Error initiating backup:', error);
      alert('Failed to initiate backup. Please try again.');
    }
  };

  const handleRestoreDatabase = async () => {
    if (!confirm('Are you sure you want to restore the database? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Simulate restore process
      alert('Database restore initiated. The system will be temporarily unavailable.');
    } catch (error) {
      console.error('Error initiating restore:', error);
      alert('Failed to initiate restore. Please try again.');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Database Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Universities</p>
              <p className="text-2xl font-bold text-blue-600">{stats.universities}</p>
            </div>
            <Building className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-2xl font-bold text-green-600">{stats.students}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Courses</p>
              <p className="text-2xl font-bold text-purple-600">{stats.courses}</p>
            </div>
            <BookOpen className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.totalUsers}</p>
            </div>
            <Shield className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="mr-2" size={20} />
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Connections</span>
              <span className="text-sm font-medium text-gray-900">{stats.activeConnections}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database Size</span>
              <span className="text-sm font-medium text-gray-900">{stats.databaseSize}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Backup</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(stats.lastBackup).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Server className="mr-2" size={20} />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={loadDatabaseStats}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={16} />
              <span>Refresh Stats</span>
            </button>
            <button
              onClick={handleBackupDatabase}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Database size={16} />
              <span>Backup Database</span>
            </button>
            <button
              onClick={handleRestoreDatabase}
              className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <AlertTriangle size={16} />
              <span>Restore Database</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">System Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Universities
            </label>
            <input
              type="number"
              value={settings.maxUniversities}
              onChange={(e) => setSettings({...settings, maxUniversities: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Students per University
            </label>
            <input
              type="number"
              value={settings.maxStudentsPerUniversity}
              onChange={(e) => setSettings({...settings, maxStudentsPerUniversity: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Courses per University
            </label>
            <input
              type="number"
              value={settings.maxCoursesPerUniversity}
              onChange={(e) => setSettings({...settings, maxCoursesPerUniversity: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Enable Auto Backup</div>
              <div className="text-sm text-gray-500">Automatically backup database</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enableAutoBackup}
              onChange={(e) => setSettings({...settings, enableAutoBackup: e.target.checked})}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Email Notifications</div>
              <div className="text-sm text-gray-500">Send system notifications via email</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enableEmailNotifications}
              onChange={(e) => setSettings({...settings, enableEmailNotifications: e.target.checked})}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Audit Logs</div>
              <div className="text-sm text-gray-500">Enable detailed audit logging</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enableAuditLogs}
              onChange={(e) => setSettings({...settings, enableAuditLogs: e.target.checked})}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        {lastSaved && (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <CheckCircle size={16} />
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          </div>
        )}
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  );

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
        <h2 className="text-2xl font-bold text-gray-900">Database Settings</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Database size={16} />
          <span>MySQL 8.0 • university_admin_db</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'backup', label: 'Backup & Restore', icon: Database },
            { id: 'security', label: 'Security', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading database information...</p>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'backup' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup & Restore</h3>
              <p className="text-gray-600 mb-6">Manage database backups and restore operations.</p>
              <div className="space-y-4">
                <button
                  onClick={handleBackupDatabase}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Backup Now
                </button>
                <button
                  onClick={handleRestoreDatabase}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Restore from Backup
                </button>
              </div>
            </div>
          )}
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Login Attempts
                  </label>
                  <input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DatabaseSettings;