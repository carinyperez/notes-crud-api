const {CognitoJwtVerifier} =  require("aws-jwt-verify");

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_7FHGMSFeB",
  tokenUse: "id",
  clientId: "1g2dtkvfnubk4eh20blrsqo51m"
})

const generatePolicy = (principalId, effect, resource) => {
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