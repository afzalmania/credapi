
document.getElementById('register').addEventListener('submit', function(event) {
    event.preventDefault();

    let username    = this.username.value;
    let password    = this.password.value;
    let displayName = this.displayName.value;

    registerPassword({username, password, displayName})
        .then((serverResponse) => {
            if(serverResponse.status !== 'startFIDOEnrollment')
                throw new Error('Error registering user! Server returned: ' + serverResponse.errorMessage);

            return getMakeCredentialChallenge()
        })
        .then((makeCredChallenge) => {
            /*{
                "challenge": "YPpAQ5-8yw7ty1GxvZRoosKoYraXWpeNJ4jNffh-gy0",
                "rp": {
                    "name": "Example Inc."
                },
                "user": {
                    "id": "pH4atM-uM2FlifiEVD5OtZnSrvxMcS1OXao8fEP6UFs",
                    "name": "alice@example.com",
                    "displayName": "Alice von Delingher"
                },
                "pubKeyCredParams": [
                    { "type": "public-key", "alg": -7 },
                    { "type": "public-key", "alg": -257 }
                ],
                "status": "ok"
            }*/
            makeCredChallenge = preformatMakeCredReq(makeCredChallenge);
            return navigator.credentials.create({ 'publicKey': makeCredChallenge })
        })
        .then((newCredentialInfo) => {
            newCredentialInfo = publicKeyCredentialToJSON(newCredentialInfo)
            return makeCredentialResponse(newCredentialInfo)
        })
        .then((serverResponse) => {
            if(serverResponse.status !== 'ok')
                throw new Error('Error registering user! Server returned: ' + serverResponse.errorMessage);

            alert('Success!');
        })
        .catch((error) => {
            alert('FAIL' + error)
            console.log('FAIL', error)
        })
})
