import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Award, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Download,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Play,
  Eye,
  Upload
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import * as CourseService from '../../services/Courseservice';

interface CourseMaterial {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'assignment';
  url: string;
  description: string;
  uploadedAt: string;
  size?: string;
  duration?: string;
}

interface CourseDetailPageProps {
  courseId: string;
  onBack: () => void;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ courseId, onBack }) => {
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseService.Course | null>(null);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<CourseMaterial | null>(null);

  // Material form state
  const [materialForm, setMaterialForm] = useState({
    title: '',
    type: 'document' as 'document' | 'video' | 'link' | 'assignment',
    url: '',
    description: ''
  });

  useEffect(() => {
    loadCourseData();
    loadCourseMaterials();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      const response = await CourseService.getCourseById(parseInt(courseId));
      setCourse(response.data);
      // Check enrollment status (simplified for demo)
      setIsEnrolled(user?.role === 'student');
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourseMaterials = async () => {
    // Mock materials for demo - in production, this would be an API call
    const mockMaterials: CourseMaterial[] = [
      {
        id: '1',
        title: 'Course Introduction',
        type: 'document',
        url: '/materials/intro.pdf',
        description: 'Course syllabus and introduction',
        uploadedAt: '2024-01-01T00:00:00Z',
        size: '2.5 MB'
      },
      {
        id: '2',
        title: 'Lecture 1: Fundamentals',
        type: 'video',
        url: '/materials/lecture1.mp4',
        description: 'Introduction to course fundamentals',
        uploadedAt: '2024-01-05T00:00:00Z',
        duration: '45 min'
      },
      {
        id: '3',
        title: 'External Resources',
        type: 'link',
        url: 'https://example.com/resources',
        description: 'Additional reading materials',
        uploadedAt: '2024-01-10T00:00:00Z'
      }
    ];
    setMaterials(mockMaterials);
  };

  const handleEnroll = async () => {
    try {
      // In production, this would be an API call to enroll the student
      setIsEnrolled(true);
      alert('Successfully enrolled in the course!');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course. Please try again.');
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newMaterial: CourseMaterial = {
        id: Date.now().toString(),
        ...materialForm,
        uploadedAt: new Date().toISOString()
      };
      setMaterials([...materials, newMaterial]);
      setShowAddMaterial(false);
      resetMaterialForm();
      alert('Material added successfully!');
    } catch (error) {
      console.error('Error adding material:', error);
      alert('Failed to add material. Please try again.');
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    
    try {
      setMaterials(materials.filter(m => m.id !== materialId));
      alert('Material deleted successfully!');
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Failed to delete material. Please try again.');
    }
  };

  const resetMaterialForm = () => {
    setMaterialForm({
      title: '',
      type: 'document',
      url: '',
      description: ''
    });
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'link': return LinkIcon;
      case 'assignment': return Edit;
      default: return FileText;
    }
  };

  const canManageMaterials = user?.role === 'university_admin' || user?.role === 'super_admin';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Course not found</p>
        <button onClick={onBack} className="mt-4 text-indigo-600 hover:text-indigo-800">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Courses</span>
        </button>
        
        {canManageMaterials && (
          <button
            onClick={() => setShowAddMaterial(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            <span>Add Material</span>
          </button>
        )}
      </div>

      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.courseName}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Instructor: {course.instructor}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">{course.credits} Credits</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">16 Weeks</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen size={16} className="text-gray-500" />
                <span className={`text-sm px-2 py-1 rounded-full ${
                  course.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {course.status}
                </span>
              </div>
            </div>
          </div>

          {user?.role === 'student' && (
            <div className="ml-6">
              {isEnrolled ? (
                <div className="text-center">
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-2">
                    ✓ Enrolled
                  </div>
                  <p className="text-sm text-gray-600">You have access to all materials</p>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Enroll in Course
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Course Materials */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Course Materials</h2>
          <p className="text-gray-600 mt-1">Access lectures, documents, and assignments</p>
        </div>

        <div className="p-6">
          {materials.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No materials available yet</p>
              {canManageMaterials && (
                <button
                  onClick={() => setShowAddMaterial(true)}
                  className="mt-4 text-indigo-600 hover:text-indigo-800"
                >
                  Add the first material
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => {
                const Icon = getMaterialIcon(material.type);
                const canAccess = isEnrolled || canManageMaterials;
                
                return (
                  <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Icon size={20} className="text-indigo-600" />
                        <span className="text-sm font-medium text-gray-900 capitalize">{material.type}</span>
                      </div>
                      {canManageMaterials && (
                        <div className="flex space-x-1">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteMaterial(material.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-2">{material.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{material.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{new Date(material.uploadedAt).toLocaleDateString()}</span>
                      {material.size && <span>{material.size}</span>}
                      {material.duration && <span>{material.duration}</span>}
                    </div>
                    
                    <div className="flex space-x-2">
                      {canAccess ? (
                        <>
                          <button className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-1">
                            {material.type === 'video' ? <Play size={14} /> : <Eye size={14} />}
                            <span>{material.type === 'video' ? 'Watch' : 'View'}</span>
                          </button>
                          {material.type !== 'link' && (
                            <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors">
                              <Download size={14} />
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex-1 bg-gray-100 text-gray-500 py-2 px-3 rounded text-sm text-center">
                          Enroll to access
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Material Modal */}
      {showAddMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Course Material</h3>
              <button
                onClick={() => setShowAddMaterial(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({...materialForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter material title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={materialForm.type}
                  onChange={(e) => setMaterialForm({...materialForm, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="document">Document</option>
                  <option value="video">Video</option>
                  <option value="link">External Link</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {materialForm.type === 'link' ? 'URL' : 'File URL'}
                </label>
                <input
                  type="url"
                  required
                  value={materialForm.url}
                  onChange={(e) => setMaterialForm({...materialForm, url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={materialForm.type === 'link' ? 'https://example.com' : '/materials/file.pdf'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({...materialForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Enter material description"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMaterial(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;