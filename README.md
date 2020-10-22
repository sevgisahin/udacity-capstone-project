# Udacity Capstone Serverless Application: Menu App
This application will allow creating/removing/updating/fetching Menu items.
Each Menu item can optionally have an attachment image. Each user only has access to Menu items that he/she/Restaurant has created.

## Project Components
* AWS 
  * Lambdas (serverless functions)
  * DynamoDB (database)
  * S3 Bucket (storage of images)
  * Cognito (authentication of users)
* [Serverless Framework](https://serverless.com/)
* WebApp Client
  * ReactJS
  * [AWS Amplify Client Framework](https://aws-amplify.github.io/docs/js/react)
* [Auth0](https://auth0.com/)
  * 3rd party OAuth integration
* Optimisations
  * Global Secondary Indexes on DynamoDB
  * Individual packaging of Lambdas

## How to run the application
### Backend
To deploy an application run the following commands:

```bash
cd backend
npm install
sls deploy -v
````
### Frontend
```bash
cd client
npm install
npm run start
```

## Deployment details
API Endpoint
```
https://4xz1ei3bd5.execute-api.eu-central-1.amazonaws.com/dev
```
Postman Collection
```
Udacity Capstone Project.postman_collection.json
```
Screen Shots
```
some screen shots of local frontend application
```
Application Deployment Logs:
```
serverless_deployment_logs
```