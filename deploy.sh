#!/usr/bin/env bash

# Install npm packages
echo "Installing npm packages"
npm install

# Start the app
pm2 startOrRestart ecosystem.json --env production
