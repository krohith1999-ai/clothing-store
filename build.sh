#!/bin/bash
set -e
cd backend
./mvnw -B package -DskipTests
