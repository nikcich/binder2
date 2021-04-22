echo "Switching to branch master"
git checkout master

echo "Building app"
npm run build

echo "Deploying files to server"
rsync -avP build/ root@binder.codes:/var/www/binder.codes/
echo "Deployment complete"
