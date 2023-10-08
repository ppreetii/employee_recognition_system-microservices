### Install following to get started locally:
- Docker DeskTop with Kubernetes enabled
- Node v20
- yarn 
- skaffold

### Setup
- Clone the repo: git clone https://github.com/ppreetii/employee_recognition_system-microservices.git
- Install packages: yarn
- Update .env file with your credential
- Go to C:\Windows\System32\drivers\etc, and find "hosts" file, open it in administrator mode, add this and save. This is basically we are telling our os to redirect this domain to our localhost: 127.0.0.1 reward.com
- Install ingress-nginx by applying yaml file:
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

- Install skaffold ( chocolatey must be installed to run this command ): choco install -y skaffold
- Start all services, run in root directory terminal ( or directory where skaffold.yaml file is present ) - skaffold dev
- If you want to delete all created pods: skaffold delete
- To run test cases, go to desired service directory, and run: yarn test