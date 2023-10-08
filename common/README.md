This is npm package module. It is used by services - auth, employee, project.

The .env information has JWT_KEY. This key is the one used by auth service to set seesion. so make sure you use JWT_KEY used here, to be same across all other service

## Steps to publish npm package publicly:
- Login to npm
- On top-right corner, you see your profile pic, click it -> Add Organisation -> Give name, select unlimited public package -> Skip this for now
- In common directory, note no need of creating repo in github explicity and push changes : git add . && git commit -m "initial commit" 
- In common directory: npm login 
- In common directory: npm publish --access public