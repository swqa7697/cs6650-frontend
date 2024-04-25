<h1>Run The Frontend Webpage Locally</h1>

<h4>1. Clone this repo</h4>

Make sure Git is installed, and run:

```
git clone https://github.com/swqa7697/cs6650-frontend.git
cd cs6650-frontend
```

<h4>2. Configure</h4>

- Find the 'config.json' file under the directory '/cs6650-frontend/src/config'
  - Replace the value of <b>BASE_URL</b> with the <b>Invoke URL</b> of the Amazon API Gateway you created (instructions are in the [repo of backend](https://github.com/swqa7697/cs6650-backend))
- Find the 'aws-config.js' file under the directory '/cs6650-frontend/src/util'
  - Replace the value of <b>userPoolId</b> and <b>userPoolClientId</b> with your credentials of user pool you created in Amazon Cognito
  - To find the <b>userPoolClientId</b>, enter the user pool in the AWS console, and find <b>App integration</b>
  - You can see the <b>Client ID</b> in the bottom of the page under <b>App client list</b>
  - If you don't have an app client created yet, click on <b>Create app client</b>
    - Choose <b>Public client</b> as <b>App type</b>, specify an App client name, choose <b>Don't generate a client secret</b>, and click <b>Create app client</b>

<h4>3. Install Dependencies</h4>

Make sure Node.js and NPM are installed in your system

Under the directory '/cs6650-frontend', run the command:

```
npm install
```

<h4>4. Start Frontend</h4>

Run the command:

```
npm run dev
```

Then, you can use a browser like Chrome to open the link shown in the console (generally to be http://localhost:5173)
