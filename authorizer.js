const {CognitoJwtVerifier} =  require("aws-jwt-verify");

const COGNITO_USERPOOL_ID = process.env.COGNITO_USERPOOL_ID; 
const COGNITO_WEB_CLIENT_ID = process.env.COGNITO_WEB_CLIENT_ID; 


const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USERPOOL_ID,
  tokenUse: "id",
  clientId: COGNITO_WEB_CLIENT_ID
})

const generatePolicy = (principalId, effect, resource) => {
    var tmp = resource.split(':');
    var apiGatewayArnTmp = tmp[5].split('/');
    var resource = tmp[0] + ":" + tmp[1] + ":" + tmp[2] + ":" + tmp[3] + ":" + tmp[4] + ":" + apiGatewayArnTmp[0] + '/*/*';
    let authReponse = {};
    authReponse.principalId = principalId;
    if (effect && resource) {
      let policyDocument = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: effect,
            Resource: resource,
            Action: "execute-api:Invoke",
          },
        ],
      };
      authReponse.policyDocument = policyDocument;
    }
    authReponse.context = {
      foo: "bar",
    };
    console.log(JSON.stringify(authReponse));
    return authReponse;
  };
  
  exports.handler = (event, context, callback) => {
    // lambda authorizer code
    let token = event.authorizationToken; 
    // validate the token that is generated from user pool 
    console.log(token); 
    try {
      const payload = jwtVerifier.verify(token);
      console.log(JSON.stringify(payload)); 
      callback(null, generatePolicy("user", "Allow", event.methodArn));
    } catch (error) {
      callback("Error: Invalid token")
    }
  };