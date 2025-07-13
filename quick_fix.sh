#!/bin/bash

echo "🔧 Quick Fix Script - Frontend Connection Issues"
echo "================================================="

# Step 1: Setup MySQL properly
echo "📊 Setting up MySQL database..."
sudo mkdir -p /var/lib/mysql
sudo chown mysql:mysql /var/lib/mysql
sudo mysql_install_db --user=mysql --datadir=/var/lib/mysql

# Step 2: Start MySQL
echo "🚀 Starting MySQL..."
sudo mysqld_safe --user=mysql &
sleep 5

# Step 3: Create database and import data
echo "🏗️ Creating database and importing data..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS university_admin_db;"
mysql -u root university_admin_db < database_setup.sql

# Step 4: Start backend in background
echo "🖥️ Starting backend application..."
cd lms_backend/lms-backend
./mvnw spring-boot:run &
cd ../..

# Step 5: Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 15

# Step 6: Test backend connectivity
echo "🧪 Testing backend connectivity..."
curl -X GET http://localhost:8082/api/students

echo ""
echo "✅ Setup complete! Now you need to:"
echo "1. Update your frontend to use real API calls (see frontend_connection_troubleshooting.md)"
echo "2. Start your frontend with: npm run dev"
echo "3. Check browser console for any remaining errors"