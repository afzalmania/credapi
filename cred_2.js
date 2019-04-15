function storeCredential() {
    event.preventDefault();
  
    if (!navigator.credentials) {
      alert('Credential Management API not supported');
      return;
    }
    
    let credentialForm = document.getElementById('credential-form');
    let credential = new PasswordCredential(credentialForm);
    navigator.credentials.store(credential)
      .then(() => log('Storing credential for <b>' + credential.id + '</b> (result cannot be checked by the website)'))
      .catch(err => log('Error storing credentials: ' + err));
  }
  
  function requestCredential() {
    if (!navigator.credentials) {
      alert('Credential Management API not supported');
      return;
    }
    
    let mediationValue = document.getElementById('credential-form').mediation.value;
    navigator.credentials.get({password: true, mediation: mediationValue})
      .then(credential => {
        let result = 'none';
        if (credential) {
          result = credential.id + ', ' + credential.password.replace(/./g, '*');
        }
        log('Credential read: <b>' + result + '</b>');
      })
      .catch(err => log('Error reading credentials: ' + err));
  }
  
  function preventSilentAccess() {
    if (!navigator.credentials) {
      alert('Credential Management API not supported');
      return;
    }
    
    navigator.credentials.preventSilentAccess()
      .then(() => log('Silent access prevented (mediation will be required for next credentials.get() call)'))
      .catch(err => log('Error preventing silent acces: ' + err));
  }
  
  function log(info) {
    var logTarget = document.getElementById('result');
    var timeBadge = new Date().toTimeString().split(' ')[0];
    var newInfo = document.createElement('p');
    newInfo.innerHTML = '<span class="badge">' + timeBadge + '</span> ' + info + '</b>.';
    logTarget.appendChild(newInfo);
  }