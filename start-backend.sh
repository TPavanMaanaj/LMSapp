#!/bin/bash

echo "🚀 Starting LMS Backend..."
echo "========================="

cd lms_backend/lms-backend

# Check if Maven wrapper exists
if [ -f "./mvnw" ]; then
    echo "📦 Starting Spring Boot application..."
    ./mvnw spring-boot:run
else
    echo "📦 Maven wrapper not found, using system Maven..."
    mvn spring-boot:run
fi