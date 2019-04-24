const validateCreds = async function(){
    
    ////// START server generated info //////
    // Usually the below publicKey object is constructed on your server
    // here for DEMO purposes only
    const rawId = localStorage.getItem('rawId');
    const AUTH_CHALLENGE = 'someRandomString';
    const publicKey = {
        // your domain
        rpId: "92587ba8.ngrok.io",
        // random, cryptographically secure, at least 16 bytes
        challenge: enc.encode(AUTH_CHALLENGE),
        allowCredentials: [{
          id: strToBin(rawId),
          type: 'public-key'
        }],
        authenticatorSelection: { 
            userVerification: "preferred" 
          },
    };
    ////// END server generated info //////

    // browser receives the publicKey object and passes it to WebAuthn "get" API
    const res = await navigator.credentials.get({
        publicKey: publicKey
      })

    
    console.log(res);

    // here we build an object containing the results, to be sent to the server
    // usually "extractedData" is POSTed to your server
    const extractedData = {
        id: res.id,
        rawId: binToStr(res.rawId),
        clientDataJSON: binToStr(res.response.clientDataJSON)
    }

    // Usually done on the server, this is where you make your auth checks
    // here for DEMO purposes only
    const dataFromClient = JSON.parse(atob(extractedData.clientDataJSON));
    const retrievedChallenge = atob(dataFromClient.challenge);
    const retrievedOrigin = dataFromClient.origin;

    // At MINIMUM, your auth checks should be:
    // 1. Check that the retrieved challenge matches the auth challenge you sent to the client, as we do trivially below
    // 2. Check that "retrievedOrigin" matches your domain - otherwise this might be a phish - not shown here
    console.log(retrievedChallenge);
    if (retrievedChallenge == AUTH_CHALLENGE){
        alert("Authorized");
    } else {
        alert("Unauthorized");
    }
}