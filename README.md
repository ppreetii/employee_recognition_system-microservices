### Install following to get started locally:
- Docker DeskTop with Kubernetes enabled
- Node v20
- yarn 
- skaffold

### Setup
- Clone the repo: git clone https://github.com/ppreetii/employee_recognition_system-microservices.git
- Install packages: yarn
- Update .env file with your credential
- Go to C:\Windows\System32\drivers\etc, and find "hosts" file, open it in administrator mode, add this line and save. This is basically we are telling our os to redirect this domain to our localhost: ```127.0.0.1 reward.com```
- Install ingress-nginx by applying yaml file:
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
- Apply this kubectl command manually:
```
    kubectl create secret generic task-db-user-secret --from-literal=DB_USER=<db-user-value>
    kubectl create secret generic task-db-password-secret --from-literal=DB_PASSWORD=<db-pswd-value>
```
Check if secrets are added.If you donot see the secrets , reapply them using above command:
```
kubectl get secrets
```

### Skaffold setup
- Install skaffold ( chocolatey must be installed to run this command ): ```choco install -y skaffold```

### Instructions
- To start all services, run this command in root directory terminal ( or directory where skaffold.yaml file is present ) - 
    ```skaffold dev```
- If you want to delete all created pods - ```skaffold delete```
- To run test cases, go to desired service directory, and run: ```yarn test```
- If services are failing to connect to raabitmq pod, restart services' pods - ```kubectl rollout restart deployment```

### Other Info
#### 1. ADDING A NEW SERVICE:
 When we are adding a service, and wanted to add its routes to work on local cluster, we follow these steps:
- Create a Dockerfile for the service
- Build its image by the command. Make sure you are in the service root directory.**There is dot in the end.Donot miss it**. Image tag = dockerHubID/srv-name: ```docker build -t [image tag] .``` ,e.g, docker build -t preeti097/auth . 
- Push your image to Docker hub: ```docker push [image tag]``` , e.g, docker push preeti097/auth
- Add new service deployment yaml file inside infra/k8s folder with name "servicename-depl.yaml", e.g, auth-depl.yaml. 
- Add the routes configuration inside skaffold.yaml. Make sure the context value = corresponding folder name of the service , e.g, auth,project,task,employee,etc. And image value = image tag name given above


