const LOGIN_VIEW = 1;
const SELECTION_VIEW = 2;
const VIA_SMS_VIEW = 3;
const VIA_SMS_OTP_VIEW = 4;
const VIA_EMAIL_VIEW = 5;
const VIA_EMAIL_OTP_VIEW = 6;

var baseUrl;
var changeView;
var userToken;
var authViaSMSObj;
var authViaEmailObj;

whenReady(function() {
    Notification.initialize();
    changeView = new ChangeView();
    changeView.showPasswordGrant();
    changeView.showView();
});

class Notification {
    static initialize(el) {
        this.container = document.querySelector('.notification');
        this.close = document.querySelector('.notification .close');
        this.close.addEventListener('click', e => this.container.classList.add('hide'));
    }
}

class Status {
    constructor(el) {
        this.el = el;
    }
    success(msg) {
        Style.removeClass(this.el, 'failure');
        Style.removeClass(this.el, 'error');
        Style.addClass(this.el, 'success');
        this.el.innerHTML = msg;
        console.log("Success");
    }
    failure(msg) {
        Style.removeClass(this.el, 'success');
        Style.removeClass(this.el, 'error');
        Style.addClass(this.el, 'failure');
        this.el.innerHTML = msg;
        console.log("Failure");
    }
    error(msg) {
        Style.removeClass(this.el, 'success');
        Style.removeClass(this.el, 'failure');
        Style.addClass(this.el, 'error');
        this.el.innerHTML = msg;
        console.log("Error");
    }

    noShow() {
        Style.removeClass(this.el, 'success');
        Style.removeClass(this.el, 'failure');
        Style.removeClass(this.el, 'error');
        this.el.innerHTML = "";
    }
}

class ChangeView {
    constructor() {
        this.loginView = document.getElementById("loginScreen");
        this.authViaView = document.getElementById("authScreen");
        this.smsView = document.getElementById("authViaSMS");
        this.verifySMSView = document.getElementById("verifySMS");
        this.emailView = document.getElementById("authViaEmail");
        this.verifyEmailView = document.getElementById("verifyEmail");

        this.accountPasswordGrantView = document.getElementById('passwordID');
        this.accountClientCredentialsView = document.getElementById('clientCredID');

        this.accountPasswordGrantradio = document.getElementById('passwordGrant');
        this.accountPasswordGrantradio.addEventListener('click', (evt) => this.showPasswordGrant(evt));

        this.accountClientCredentialsradio = document.getElementById('clientCred');
        this.accountClientCredentialsradio.addEventListener('click', (evt) => this.showClientCredentials(evt));
    }

    showView(viewId) {		
        Effect.hide(this.loginView);
        Effect.hide(this.authViaView);
        Effect.hide(this.smsView);
        Effect.hide(this.verifySMSView);
        Effect.hide(this.emailView);
        Effect.hide(this.verifyEmailView);

        switch (viewId) {
            case LOGIN_VIEW:
                Effect.show(this.loginView);
                break;
            case SELECTION_VIEW:
                Effect.show(this.authViaView);
                break;
            case VIA_SMS_VIEW:
                Effect.show(this.smsView);
                break;
            case VIA_SMS_OTP_VIEW:
                Effect.show(this.smsView);
                Effect.show(this.verifySMSView);
                break;
            case VIA_EMAIL_VIEW:
                Effect.show(this.emailView);
                break;
            case VIA_EMAIL_OTP_VIEW:
                Effect.show(this.emailView);
                Effect.show(this.verifyEmailView);
                break;
            default:
                Effect.show(this.loginView);
                break;
        }
    }

    showPasswordGrant() {
        Effect.hide(this.accountClientCredentialsView);
        Effect.show(this.accountPasswordGrantView);
    }

    showClientCredentials() {
        Effect.show(this.accountClientCredentialsView);
        Effect.hide(this.accountPasswordGrantView);
    }
}

class UserToken {
    constructor(cpaasUrl, project, username, password) {
        this.cpaasUrl = cpaasUrl;
        this.project = project;
        this.username = username;
        this.password = password;
        this.status = new Status(document.getElementById('loginResponse'));
    }

    set proceedTo(fn) {
        this.proceed = fn;
    }

    get tokenData() {
        return this.token;
    }

    onSuccess(data) {
        console.log("API Response : " + JSON.stringify(data));
        this.token = data;
        this.status.success('Successfully logged In.');
    }

    onFailure() {
        this.status.failure('Login failed!');
    }

    onError() {
        this.status.error('Error!');
    }

    userTokenRequest(url, cargo) {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.onload = function () {
            console.log("API Status: " + this.status);

            if (this.status >= 200 && this.status < 400) {
                self.onSuccess(JSON.parse(this.responseText));
                changeView.showView(SELECTION_VIEW);				
				
            } else {
                self.onFailure();
            }
        };
        xhr.onerror = self.onError.bind(self);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(Convert.jsonToUri(cargo));
    }

    backFromSelectionView(e) {
        e.preventDefault();
        this.status.noShow();
        changeView.showView(LOGIN_VIEW);
    }

    gotoSMSView() {
        this.status.noShow();
        changeView.showView(VIA_SMS_VIEW);
        authViaSMSObj = new AuthViaSMS();
    }

    gotoEmailView() {
        this.status.noShow();
        changeView.showView(VIA_EMAIL_VIEW);
        authViaEmailObj = new AuthViaEmail();
    }

    initialize() {
        console.log('UserToken, initialize');
        let cargo = {
            "client_id": encodeURIComponent(this.project.trim()),
            "username": this.username,
            "password": this.password,
            "grant_type": 'password',
            "scope": 'openid'
        };
        this.userTokenRequest(this.cpaasUrl, cargo);
    }
}

class UserTokenByClientCred {
    constructor(cpaasUrl, clientId, clientSecret) {
        this.cpaasUrl = cpaasUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;        
        this.status = new Status(document.getElementById('loginResponse'));
    }

    set proceedTo(fn) {
        this.proceed = fn;
    }

    get tokenData() {
        return this.token;
    }

    onSuccess(data) {
        console.log("API Response : " + JSON.stringify(data));
        this.token = data;
        this.status.success('Successfully logged In.');
    }

    onFailure() {
        this.status.failure('Login failed!');
    }

    onError() {
        this.status.error('Error!');
    }

    userTokenRequest(url, cargo) {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.onload = function () {
            console.log("API Status: " + this.status);

            if (this.status >= 200 && this.status < 400) {
                self.onSuccess(JSON.parse(this.responseText));
                changeView.showView(SELECTION_VIEW);
            } else {
                self.onFailure();
            }
        };
        xhr.onerror = self.onError.bind(self);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(Convert.jsonToUri(cargo));
    }

    backFromSelectionView(e) {
        e.preventDefault();
        this.status.noShow();
        changeView.showView(LOGIN_VIEW);
    }

    gotoSMSView() {
        this.status.noShow();
        changeView.showView(VIA_SMS_VIEW);
        authViaSMSObj = new AuthViaSMS();
    }

    gotoEmailView() {
        this.status.noShow();
        changeView.showView(VIA_EMAIL_VIEW);
        authViaEmailObj = new AuthViaEmail();
    }

    initialize() {
        console.log('UserToken, initialize');
        let cargo = {
            "client_id": this.clientId,
            "client_secret": this.clientSecret,
            "grant_type": 'client_credentials',
            "scope": 'openid'
        };
        this.userTokenRequest(this.cpaasUrl, cargo);
    }
}

// Class to authenticate the user via SMS.
class AuthViaSMS {
    constructor() {
        this.status = new Status(document.getElementById('smsResponse'));
    }

    set proceedTo(fn) {
        this.proceed = fn;
    }

    get responseData() {
        return this.response;
    }

    onSuccess(data) {
        console.log("SMS API Response : " + JSON.stringify(data));
        this.response = data;
    }

    onFailure() {
        this.status.failure('Something went wrong!');
    }

    onError() {
        console.log("error");
        this.status.error('Error!');
    }

    // API call to send the authentication code via SMS. 
    postSMSRequest(requestMethod, url, cargo) {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open(requestMethod, url, true);
        xhr.onload = function () {
            console.log("API Status: " + this.status);

            if (this.status >= 200 && this.status < 400) {
                self.onSuccess(JSON.parse(this.responseText));
                self.status.success('OTP is sent successfully on given number.');
                changeView.showView(VIA_SMS_OTP_VIEW);
            } else
                self.onFailure();
        };
        xhr.onerror = this.onError.bind(self);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", this.authHeader);

        xhr.send(JSON.stringify(cargo));
    }

    // API call to verify the user via SMS.
    verifySMSRequest(url, cargo) {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.onload = function () {
            console.log("API Status: " + this.status);

            if (this.status == 204) {
                console.log("OTP via SMS is verified successfully");
                self.status.success('OTP via SMS is verified successfully');
                return;
            }

            if (this.status == 200 && this.status < 400)
                self.onSuccess(this.responseText);
            else
                self.onFailure();
        };

        xhr.onerror = this.onError.bind(self);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", this.authHeader);

        xhr.send(JSON.stringify(cargo));
    }

    // Method to verify via SMS.
    verifySMS() {
        let verificationText = document.getElementById('otpSMSText').value;
        var verifyUrl = baseUrl + this.response.code.resourceURL + '/verify';
        let cargo = {
            "code": {
                "verify": verificationText
            }
        };
        this.verifySMSRequest(verifyUrl, cargo);
    }

    // Method to resend the message via SMS.
    resendSMS(e) {
        e.preventDefault();
        var resendUrl = baseUrl + this.response.code.resourceURL;
        console.log(" Resend the OTP: " + resendUrl);
        let cargo = {
            "code": {
                "address": [this.contactNumber],
                "method": "sms",
                "format": {
                    "length": 6,
                    "type": "numeric"
                },
                "expiry": 120,
                "message": "Your code is {code}"
            }
        };

        this.postSMSRequest("PUT", resendUrl, cargo);
    }

    backFromSMS(e) {
        e.preventDefault();
        this.status.noShow();
        document.getElementById("userContactNumber").value = "";
        document.getElementById('otpSMSText').value = "";
        changeView.showView(SELECTION_VIEW);
    }

    // Method to initialize the authentication via SMS.
    initialize(cpaasUrl, contactNumber, authHeader) {
        this.cpaasUrl = cpaasUrl;
        this.contactNumber = contactNumber;
        this.authHeader = authHeader;

        console.log('UserToken, initialize');
        let cargo = {
            "code": {
                "address": [this.contactNumber],
                "method": "sms",
                "format": {
                    "length": 6,
                    "type": "numeric"
                },
                "expiry": 120,
                "message": "Your code is {code}"
            }
        };
        this.postSMSRequest("POST", this.cpaasUrl, cargo);
    }
}

// Class to authenticate the user via Email.
class AuthViaEmail {
    constructor() {
        this.status = new Status(document.getElementById('emailResponse'));
    }

    set proceedTo(fn) {
        this.proceed = fn;
    }
    get tokenData() {
        return this.emailResponse;
    }
    onSuccess(data) {
        console.log("API Response : " + JSON.stringify(data));
        this.emailResponse = data;
    }

    onFailure() {
        this.status.failure('Something went wrong!');
    }

    onError() {
        this.status.error('Error!');
    }

    // API call to send the authentication code via Email. 
    postEmailRequest(requestMethod, url, cargo) {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open(requestMethod, url, true);
        xhr.onload = function () {
            console.log("API Status: " + this.status);

            if (this.status >= 200 && this.status < 400) {
                changeView.showView(VIA_EMAIL_OTP_VIEW);
                self.status.success('Code (OTP) is sent successfully on given Email id.');
                self.onSuccess(JSON.parse(this.responseText));
            } else
                self.onFailure();
        };
        xhr.onerror = this.onError.bind(self);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", this.authHeaderToken);
        xhr.send(JSON.stringify(cargo));
    }

    // API call to verify the user via Email.
    verifyEmailRequest(url, cargo) {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.onload = function () {
            console.log("verify via email API Status: " + this.status);

            if (this.status == 204) {
                console.log("OTP via Email is verified successfully");
                self.status.success('OTP via Email is verified successfully');
                return;
            }

            if (this.status == 200 && this.status < 400)
                self.onSuccess(this.responseText);
            else
                self.onFailure();
        };

        xhr.onerror = this.onError.bind(self);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", this.authHeaderToken);
        xhr.send(JSON.stringify(cargo));
    }

    // Method to verify via Email.
    verifyEmail() {
        let verificationText = document.getElementById('otpEmailText').value;
        var verifyUrl = baseUrl + this.emailResponse.code.resourceURL + '/verify';
        let cargo = {
            "code": {
                "verify": verificationText
            }
        };
        this.verifyEmailRequest(verifyUrl, cargo);
    }

    // Method to resend the message via Email.
    resendEmail(e) {
        e.preventDefault();
        var resendUrl = baseUrl + this.emailResponse.code.resourceURL;
        console.log(" Resend the Email OTP: " + resendUrl);
        let cargo = {
            code: {
                address: [this.authEmail],
                method: "email",
                format: {
                    length: 10,
                    type: "alphanumeric"
                },
                expiry: 3600,
                message: "Your code is {code}",
                subject: "Auth code from AT&T"
            }
        };
        this.postEmailRequest("PUT", resendUrl, cargo);
    }

    backFromEmail(e) {
        e.preventDefault();
        this.status.noShow();
        document.getElementById("userEmailId").value = "";
        document.getElementById('otpEmailText').value = "";
        changeView.showView(SELECTION_VIEW);
    }

    // Method to initialize the authentication via Email.
    initialize(cpaasUrl, authEmail, authHeaderToken) {
        this.cpaasUrl = cpaasUrl;
        this.authEmail = authEmail;
        this.authHeaderToken = authHeaderToken;

        console.log('Email, initialize');
        let cargo = {
            code: {
                address: [this.authEmail],
                method: "email",
                format: {
                    length: 10,
                    type: "alphanumeric"
                },
                expiry: 3600,
                message: "Your code is {code}",
                subject: "Auth code from AT&T"
            }
        };
        this.postEmailRequest("POST", this.cpaasUrl, cargo);
    }
}

function loginUser() {
    let cpaasUrl;
    let enteredBaseUrl = document.getElementById("serverUrl").value;

    if (enteredBaseUrl.trim() !== "") {        
		baseUrl = enteredBaseUrl.trim();        	
    }

	cpaasUrl = baseUrl + '/cpaas/auth/v1/token';	
	
    let clientId = document.getElementById("clientId").value;
    let userEmail = document.getElementById("userEmail").value;
    let userPassword = document.getElementById("password").value;
    
    userToken = new UserToken(cpaasUrl, clientId, userEmail, userPassword);  
    userToken.initialize();
}

function authViaSMS() {

    let contactNumber = document.getElementById("userContactNumber").value;
    let token = userToken.tokenData;

    console.log("SMS Access Token: " + token.access_token);
    let userId = Convert.tokenToUserId(token.id_token);
    let cpaasUrl = baseUrl + '/cpaas/auth/v1/' + userId.trim() + '/codes';
    console.log('via SMS URL: ' + cpaasUrl);

    let authHeader = "Bearer " + token.access_token;

    authViaSMSObj.initialize(cpaasUrl, contactNumber, authHeader);
}

function authViaEmail() {
    let authEmail = document.getElementById("userEmailId").value;
    let token = userToken.tokenData;

    console.log("Email Access Token: " + token.access_token);
    let userId = Convert.tokenToUserId(token.id_token);
    let cpaasUrl = baseUrl + '/cpaas/auth/v1/' + userId.trim() + '/codes';
    console.log('via Email URL: ' + cpaasUrl);

    let authHeaderToken = "Bearer " + token.access_token;

    authViaEmailObj.initialize(cpaasUrl, authEmail, authHeaderToken);
}

function grantCheck() {
	if (document.getElementById('passwordGrant').checked) {
        document.getElementById('passwordID').style.display ='block';
		document.getElementById('clientCredID').style.display = 'none';
    }else if (document.getElementById('clientCred').checked) {
		document.getElementById('clientCredID').style.display = 'block';
		document.getElementById('passwordID').style.display = 'none';
	}
}

function constructServerUrl() {
   let cpaasUrl;
   let enteredBaseUrl = document.getElementById("serverUrl").value;
   
   if (enteredBaseUrl.trim() !== "") {        
		baseUrl = enteredBaseUrl.trim();        	
    }

   cpaasUrl = baseUrl + '/cpaas/auth/v1/token';
   return cpaasUrl;
}

async function loginByPasswordGrant() {
  let cpaasUrl = constructServerUrl();	
  let clientId = document.getElementById("clientId").value;
  let userEmail = document.getElementById("userEmail").value;
  let userPassword = document.getElementById("password").value;
    
  userToken = new UserToken(cpaasUrl, clientId, userEmail, userPassword);  
  userToken.initialize();
}

async function loginByClientCred() {
	let cpaasUrl = constructServerUrl();	
	let privateKey = document.getElementById('privateKey').value;
	let privateSecret = document.getElementById('privateSecret').value;
	
	userToken = new UserTokenByClientCred(cpaasUrl, privateKey, privateSecret);  
    userToken.initialize();	
}
