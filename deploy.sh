pwFilePath="../.env.pw"

# Unzip private env vars file
unzip -P $(cat $pwFilePath) -o .env.zip

# Install npm packages
echo "Installing npm packages"
npm install

# Start the app
pm2 startOrRestart ecosystem.json --env production
