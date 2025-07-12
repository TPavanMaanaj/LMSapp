#!/bin/bash

echo "🚀 LMS Application Setup Script"
echo "================================="

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create database
echo "📊 Setting up database..."
mysql -u root -p <<EOF
CREATE DATABASE IF NOT EXISTS university_admin_db;
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON university_admin_db.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully"
else
    echo "❌ Database setup failed. Please check your MySQL credentials."
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "🎉 Setup completed successfully!"
echo ""
echo "To start the application:"
echo "1. Start the backend:"
echo "   cd lms_backend/lms-backend && ./mvnw spring-boot:run"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   npm run dev"
echo ""
echo "3. Access the application at: http://localhost:3000"
echo ""
echo "📋 Default login credentials:"
echo "   Super Admin: superadmin@lms.com / password"
echo "   University Admin: admin@iitd.ac.in / password"
echo "   Student: student@iitd.ac.in / password"