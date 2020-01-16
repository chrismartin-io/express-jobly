# Express Backend Jobly
 
## Summary
 
Created by Jennifer and Chris
 
Jobly backend is an express backend built for job hunting application. The development of the backend was unique as we jointly decided to do test driven development(TDD) for this project.
 
We overcome our fear of tests and had a lot of fun. Due to this project requireing a change in the API call, `GET /companies/[handle]` from:
 
```
{companies: [companyData, ...]}
```
 
to:
 
```
{company: {...companyData, jobs: [job, ...]}}
```
 
 This project had a total of 17 tests with 16 that now fail due to that change in API response. 
 
## Getting started
The instructions assume you have installed [Express](https://expressjs.com/) installed as well as [npm](https://www.google.com/search?q=npm+installation+instuctions&oq=npm+installation+instuctions&aqs=chrome..69i57j33.4406j0j4&sourceid=chrome&ie=UTF-8).
 
0. Npm install nodemon if you don't have it already.
    ```
    npm install --global nodemon
    ```
 
 
1. Clone this project
    ```
    git clone < project-url.git >
    ```
 
2.  Npm install requirements to download software for the app.
    ```
    npm i
    ```
3. Run server on nodemon
    ```
    nodemon server.js
    ```
 
## Running Tests
After all of the tests failed we edited the npm test command so you must run the jest command to get the tests to run.
 
    ```
    jest
    ```
 
