import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Award, 
  FileText, 
  Video, 
  Link, 
  Download,
  Plus,
  Search,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getCourseById, getCourseTopics, getEnrollments, getUsersByUniversityAndRole, mockStudents } from '../../data/mockData';
import { Courses, Enrollment, UserDTO,CourseMaterial } from '../../types';

interface StudentDashboardProps {
  activeTab: string;
  universityId: number;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ activeTab, universityId }) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'courses' | 'registration' | 'grades'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [students, setStudents] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourse, setEnrolledCourse] = useState<Enrollment[]>([]);
  const [admins, setAdmins] = useState<UserDTO[]>([]);

  const[materials,setMaterials] = useState<CourseMaterial[]>([]);

  // Update activeView based on sidebar selection
  React.useEffect(() => {
    switch (activeTab) {
      case 'dashboard':
        setActiveView('overview');
        break;
      case 'courses':
        setActiveView('courses');
        break;
      case 'registration':
        setActiveView('registration');
        break;
      case 'grades':
        setActiveView('grades');
        break;
      case 'settings':
        // We'll handle settings separately
        break;
      default:
        setActiveView('overview');
    }
  }, [activeTab]);

   useEffect(() => {
        const fetchEnrollmentsCourses = async () => {
          try {
            const enrolldata = await getEnrollments();
            setEnrolledCourse(enrolldata);
          } catch (error) {
            console.error('Error fetching enrollments:', error);
          }
        };
    
        fetchEnrollmentsCourses();
      }, []);

       useEffect(() => {
               const fetchStudents = async () => {
                 try {
                   const studata = await getUsersByUniversityAndRole(Number(universityId), 'STUDENT');
                   setStudents(studata);
                 } catch (error) {
                   console.error('Error fetching students:', error);
                 } finally {
                   setLoading(false);
                 }
               };
           
               fetchStudents();
             }, []);

             
  // Find current student data
  const currentStudent = students.find(s => s.email === user?.email);
  const enrolledCourses = enrolledCourse.filter( enrolledCourse=> 
    Number(currentStudent?.id)==enrolledCourse?.studentId);

  
  //const currentUniversity = mockUniversities.find(u => u.id === user?.universityId);

  const stats = [
    {
      title: 'Enrolled Courses',
      value: enrolledCourses.length,
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Credits Earned',
      value: enrolledCourses.reduce((sum, course) => sum + course.credits, 0),
      icon: Award,
      color: 'bg-green-500'
    },
    {
      title: 'Average Grade',
      value: 'A-',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: 'Current Year',
      value: currentStudent?.year || 1,
      icon: Calendar,
      color: 'bg-orange-500'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {currentStudent?.name}!</h2>
        <p className="text-indigo-100">
          {currentStudent?.major} • Year {currentStudent?.year} • {currentStudent?.studentId}
          <br />
          {currentUniversity?.name}
        </p>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = BookOpen;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Courses</h3>
          <div className="space-y-3">
            {enrolledCourses.slice(0, 3).map((enroll) => (
              <div key={enroll.Courses.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{enroll.Courses.name}</p>
                  <p className="text-sm text-gray-600">{enroll.Courses.instructor} • {enroll.Courses.credits} credits</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {currentStudent?.grades[enroll.courseId] || 'In Progress'}
                  </p>
                  <p className="text-xs text-gray-500">{enroll.Courses.material.duration} materials</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">CS101 Assignment</p>
                <p className="text-sm text-gray-600">Due in 2 days</p>
              </div>
              <div className="text-red-600">
                <Clock size={20} />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">MATH301 Quiz</p>
                <p className="text-sm text-gray-600">Due in 5 days</p>
              </div>
              <div className="text-yellow-600">
                <Clock size={20} />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">CS229 Project</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-green-600">
                <CheckCircle size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enrolledCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{course.Courses.name}</h3>
                <p className="text-sm text-gray-600">{course.Courses.code} • {course.Courses.instructor}</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {currentStudent?.grades[course.courseId] || 'In Progress'}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{course.Courses.description}</p>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Credits:</span>
                <span className="font-medium">{course.credits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{course.Courses.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Materials:</span>
                <span className="font-medium">{course.Courses.material.duration} items</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Course Materials</h4>
              <div className="space-y-2">
                {
            //     useEffect(() => {
            //    const fetchMaterial = async () => {
            //      try {
            //        const matdata = await getCourseTopics(course.Courses.id);
            //        setMaterials(matdata);
            //      } catch (error) {
            //        console.error('Error fetching students:', error);
            //      } finally {
            //        setLoading(false);
            //      }
            //    };
           
            //    fetchMaterial();
            //  }, []);
             Array.isArray(course.materials) && course.materials.map((material) => {
                  const getIcon = () => {
                    switch (material.type) {
                      case 'video': return Video;
                      case 'link': return Link;
                      default: return FileText;
                    }
                  };
                  const Icon = getIcon();
                  
                  return (
                    <div key={material.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon size={16} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">{material.title}</span>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-800">
                        <Download size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRegistration = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Course Registration</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search available courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="p-6">
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-600">{course.code} • {course.instructor}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {course.credits} credits
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{course.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available Seats:</span>
                    <span className="font-medium">{course.capacity - course.enrolled}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Enrollment Progress</span>
                    <span className="font-medium">{course.enrolled}/{course.capacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
                  <Plus size={16} />
                  <span>Register for Course</span>
                </button>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Registration Confirmation Modal */}
      {showRegistrationModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Course Registration</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to register for this course? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRegistrationModal(false);
                  setSelectedCourse(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle registration logic here
                  setShowRegistrationModal(false);
                  setSelectedCourse(null);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderGrades = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Academic Progress</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">3.7</div>
              <div className="text-sm text-gray-600">Current GPA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{enrolledCourses.reduce((sum, course) => sum + course.credits, 0)}</div>
              <div className="text-sm text-gray-600">Total Credits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{enrolledCourses.length}</div>
              <div className="text-sm text-gray-600">Completed Courses</div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrolledCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{course.Courses.name}</div>
                      <div className="text-sm text-gray-500">{course.Courses.code}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{course.Courses.instructor}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{course.credits}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      currentStudent?.grades[course.courseId] 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {currentStudent?.grades[course.courseId] || 'In Progress'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      Enrolled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={currentStudent?.fullName || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={currentStudent?.email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input
                type="text"
                value={currentStudent?.usercode || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
              <input
                type="text"
                value={currentStudent?.dept || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <input
                type="text"
                value={currentUniversity?.name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                readOnly
              />
            </div> */}
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
              Update Profile
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Change Password
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notifications</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Course updates</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2 text-sm text-gray-700">Grade notifications</span>
                </label>
              </div>
            </div>
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
              Update Settings
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{currentStudent?.year}</div>
            <div className="text-sm text-gray-600">Current Year</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">3.7</div>
            <div className="text-sm text-gray-600">GPA</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{enrolledCourses.reduce((sum, course) => sum + course.credits, 0)}</div>
            <div className="text-sm text-gray-600">Total Credits</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    // Handle settings from sidebar
    if (activeTab === 'settings') {
      return renderSettings();
    }
    
    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'courses':
        return renderCourses();
      case 'registration':
        return renderRegistration();
      case 'grades':
        return renderGrades();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {activeTab !== 'settings' && (
        <div className="flex-shrink-0 px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'courses', label: 'My Courses' },
              { id: 'registration', label: 'Registration' },
              { id: 'grades', label: 'Grades' }
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

export default StudentDashboard;
