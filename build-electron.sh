ng build --base-href "./"  --configuration production
cd electron
rm -rf ./dist/
cp -r ../dist/forms-lite/browser/ ./dist/
npm run package