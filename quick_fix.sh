#!/bin/bash

echo "🔧 Quick Fix Script - Frontend Connection Issues"
echo "================================================="

# Step 1: Setup MySQL properly
echo "📊 Setting up MySQL database..."
sudo mkdir -p /var/lib/mysql
sudo chown mysql:mysql /var/lib/mysql 2>/dev/null || true
sudo mysql_install_db --user=mysql --datadir=/var/lib/mysql 2>/dev/null || true

# Step 2: Start MySQL
echo "🚀 Starting MySQL..."
sudo mysqld_safe --user=mysql &
sleep 8

# Step 3: Create database and import data
echo "🏗️ Creating database and importing data..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS university_admin_db;" 2>/dev/null || echo "Database creation skipped"
mysql -u root university_admin_db < database_setup.sql 2>/dev/null || echo "Data import skipped"

# Step 4: Install frontend dependencies if needed
echo "📦 Installing frontend dependencies..."
npm install

# Step 5: Start backend in background
echo "🖥️ Starting backend application..."
cd lms_backend/lms-backend
./mvnw spring-boot:run > ../../backend.log 2>&1 &
BACKEND_PID=$!
cd ../..

# Step 6: Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 20

# Step 7: Test backend connectivity
echo "🧪 Testing backend connectivity..."
curl -X GET http://localhost:8082/api/students || echo "Backend not ready yet"
curl -X GET http://localhost:8082/api/universities || echo "Universities endpoint not ready yet"

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start your application:"
echo "1. Frontend: npm run dev"
echo "2. Backend is running (PID: $BACKEND_PID)"
echo "3. Check browser console at http://localhost:3000"
echo ""
echo "📋 Login credentials:"
echo "   Super Admin: superadmin@lms.com / password"
echo "   University Admin: admin@iitd.ac.in / password"
echo "   Student: student@iitd.ac.in / password"
echo ""
echo "📊 Backend log: tail -f backend.log"