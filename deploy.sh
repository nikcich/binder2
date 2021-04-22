echo "Switching to branch master"
git checkout master

echo "Building app"
npm run build

echo "Deploying files to server"
rsync -avP build/ root@66.228.51.99:/var/www/66.228.51.99/
echo "Deployment complete"
