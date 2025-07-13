import React, { useState, useCallback } from 'react';
import { 
  Building, 
  Users, 
  BookOpen, 
  UserCheck, 
  BarChart3, 
  Settings,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  RefreshCw,
  Database,
  Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import * as CourseService from '../../services/Courseservice';
import * as StudentService from '../../services/Studentservice';
import * as UniversityService from '../../services/Universityservice';
import * as AdminService from '../../services/Adminservice';
import CourseDetailPage from '../Course/CourseDetailPage';
import EnrollmentManager from '../Course/EnrollmentManager';
import DatabaseSettings from '../SuperAdmin/DatabaseSettings';
import TenantManager from '../Tenant/TenantManager';

interface SuperAdminDashboardProps {
  activeTab: string;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ activeTab }) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'universities' | 'admins' | 'courses' | 'students' | 'enrollments' | 'tenants' | 'database'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Modal states
  const [showAddUniversityModal, setShowAddUniversityModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Data states
  const [universities, setUniversities] = useState<UniversityService.University[]>([]);
  const [admins, setAdmins] = useState<AdminService.Admin[]>([]);
  const [courses, setCourses] = useState<CourseService.Course[]>([]);
  const [students, setStudents] = useState<StudentService.Student[]>([]);

  // Form states
  const [universityForm, setUniversityForm] = useState({
    uniName: '',
    estYear: '',
    address: '',
    adminName: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const [adminForm, setAdminForm] = useState({
    adminName: '',
    uniName: '',
    email: '',
    phnnum: 0,
    department: 1,
    role: 'ADMIN',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const [courseForm, setCourseForm] = useState({
    courseName: '',
    description: '',
    credits: 3,
    instructor: '',
    universityId: 0,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const [studentForm, setStudentForm] = useState({
    studentId: '',
    fullName: '',
    email: '',
    major: '',
    year: '1',
    phoneNumber: '',
    universityId: 0
  });

  // Update activeView based on sidebar selection
  React.useEffect(() => {
    switch (activeTab) {
      case 'dashboard':
        setActiveView('overview');
        break;
      case 'universities':
        setActiveView('universities');
        break;
      case 'admins':
        setActiveView('admins');
        break;
      case 'courses':
        setActiveView('courses');
        break;
      case 'students':
        setActiveView('students');
        break;
      case 'analytics':
        setActiveView('enrollments');
        break;
      case 'settings':
        setActiveView('database');
        break;
      default:
        setActiveView('overview');
    }
  }, [activeTab]);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadUniversities(),
        loadAdmins(),
        loadCourses(),
        loadStudents()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on component mount and when activeView changes
  React.useEffect(() => {
    loadAllData();
  }, [activeView, loadAllData]);

  const loadUniversities = async () => {
    try {
      const response = await UniversityService.getAllUniversities();
      setUniversities(response.data);
    } catch (error) {
      console.error('Error loading universities:', error);
    }
  };

  const loadAdmins = async () => {
    try {
      const response = await AdminService.getAllAdmins();
      setAdmins(response.data);
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await CourseService.getAllCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await StudentService.getAllStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  // CRUD handlers
  const handleAddUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await UniversityService.createUniversity(universityForm);
      await loadUniversities();
      setShowAddUniversityModal(false);
      resetUniversityForm();
      alert('University added successfully!');
    } catch (error) {
      console.error('Error adding university:', error);
      alert('Failed to add university. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await AdminService.createAdmin({
        ...adminForm,
        students: 0,
        adminStatus: adminForm.status
      });
      await loadAdmins();
      setShowAddAdminModal(false);
      resetAdminForm();
      alert('Admin added successfully!');
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Failed to add admin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await CourseService.createCourse(courseForm);
      await loadCourses();
      setShowAddCourseModal(false);
      resetCourseForm();
      alert('Course added successfully!');
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await StudentService.createStudent(studentForm);
      await loadStudents();
      setShowAddStudentModal(false);
      resetStudentForm();
      alert('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteUniversity = async (id: number) => {
    if (!confirm('Are you sure you want to delete this university?')) return;
    setIsLoading(true);
    try {
      await UniversityService.deleteUniversity(id);
      await loadUniversities();
      alert('University deleted successfully!');
    } catch (error) {
      console.error('Error deleting university:', error);
      alert('Failed to delete university. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    setIsLoading(true);
    try {
      await AdminService.deleteAdmin(id);
      await loadAdmins();
      alert('Admin deleted successfully!');
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    setIsLoading(true);
    try {
      await CourseService.deleteCourse(id);
      await loadCourses();
      alert('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    setIsLoading(true);
    try {
      await StudentService.deleteStudent(id);
      await loadStudents();
      alert('Student deleted successfully!');
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form functions
  const resetUniversityForm = () => {
    setUniversityForm({
      uniName: '',
      estYear: '',
      address: '',
      adminName: '',
      status: 'ACTIVE'
    });
  };

  const resetAdminForm = () => {
    setAdminForm({
      adminName: '',
      uniName: '',
      email: '',
      phnnum: 0,
      department: 1,
      role: 'ADMIN',
      status: 'ACTIVE'
    });
  };

  const resetCourseForm = () => {
    setCourseForm({
      courseName: '',
      description: '',
      credits: 3,
      instructor: '',
      universityId: 0,
      status: 'ACTIVE'
    });
  };

  const resetStudentForm = () => {
    setStudentForm({
      studentId: '',
      fullName: '',
      email: '',
      major: '',
      year: '1',
      phoneNumber: '',
      universityId: 0
    });
  };

  const stats = [
    {
      title: 'Total Universities',
      value: universities.length,
      icon: Building,
      color: 'bg-blue-500',
      trend: '+5%'
    },
    {
      title: 'Total Admins',
      value: admins.length,
      icon: UserCheck,
      color: 'bg-green-500',
      trend: '+12%'
    },
    {
      title: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'bg-purple-500',
      trend: '+18%'
    },
    {
      title: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'bg-orange-500',
      trend: '+25%'
    }
  ];

  // Show course detail page if selected
  if (selectedCourseId) {
    return (
      <CourseDetailPage
        courseId={selectedCourseId}
        onBack={() => setSelectedCourseId(null)}
      />
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.trend} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Universities</h3>
          <div className="space-y-3">
            {universities.slice(0, 5).map((university) => (
              <div key={university.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{university.uniName}</p>
                  <p className="text-sm text-gray-600">{university.adminName} • Est. {university.estYear}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  university.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {university.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">New Student Registration</p>
                <p className="text-sm text-gray-600">5 minutes ago</p>
              </div>
              <Users size={20} className="text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Course Created</p>
                <p className="text-sm text-gray-600">15 minutes ago</p>
              </div>
              <BookOpen size={20} className="text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">University Added</p>
                <p className="text-sm text-gray-600">1 hour ago</p>
              </div>
              <Building size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading && (universities.length === 0 && admins.length === 0 && courses.length === 0 && students.length === 0)) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'tenants':
        return <TenantManager />;
      case 'database':
        return <DatabaseSettings />;
      case 'enrollments':
        return <EnrollmentManager />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {!['tenants', 'database', 'enrollments'].includes(activeView) && (
        <div className="flex-shrink-0 px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'tenants', label: 'Tenants' },
              { id: 'enrollments', label: 'Enrollments' },
              { id: 'database', label: 'Database' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="flex-1 overflow-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;