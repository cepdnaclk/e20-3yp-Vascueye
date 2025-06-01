// invokeLambda.js
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const lambdaClient = new LambdaClient({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function invokeMyLambda(payload) {
  const command = new InvokeCommand({
    FunctionName: "your-lambda-function-name",
    Payload: Buffer.from(JSON.stringify(payload)),
  });

  try {
    const response = await lambdaClient.send(command);
    const result = JSON.parse(Buffer.from(response.Payload).toString());
    return result;
  } catch (err) {
    console.error("Lambda invocation failed:", err);
    throw err;
  }
}

module.exports = invokeMyLambda;
