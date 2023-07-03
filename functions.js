//import { login, getDefaultSession, handleIncomingRedirect } from '@inrupt/solid-client-authn-browser'
var solidClientAuthnBrowser = require("@inrupt/solid-client-authn-browser")

window.onload=function(){
    var example = document.getElementById('hello');
    var h1 = document.createElement('h1');
    h1.innerText = "hi";
    example.appendChild(h1);
}

window.encrypt = () => {
    console.log('logging')
    loginToSelectedIdP();
    handleRedirectAfterLogin();
}

function loginToSelectedIdP() {
    const idp = document.getElementById("selectedIdP").value;
    return solidClientAuthnBrowser.login({
        oidcIssuer: idp,
        redirectUrl: new URL("/", window.location.href).toString(),
        clientName: "My application"
      });
}

// When redirected after login, finish the process by retrieving session information.
async function handleRedirectAfterLogin() {
    await solidClientAuthnBrowser.handleIncomingRedirect(); // no-op if not part of login redirect
  
    const session = solidClientAuthnBrowser.getDefaultSession();
    if (session.info.isLoggedIn) {
      // Update the page with the status.
      document.getElementById("myWebID").value = session.info.webId;
    }
}