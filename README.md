# Kandy Sample 2FA

This app is used to create communication channel between two users via 2FA APIs.
To check a demo of this app, visit https://hclsampleapps.github.io/kandy-cpaas2-sample-2fa/ 

#### Steps 

1. Create an account on **AT&T** portal. 
2. Open ```index.html``` in the browser.
	Enter the server URL, for eg: 
	For AT&T API Marketplace https://apimarket.att.com , enter https://oauth-cpaas.att.com	
3. Choose to get accessToken by Password Grant flow or Client Credentials flow.
4. For Password Grant flow, enter 
   - *clientId* 
   - *emailId* 
   - *password*  
5. For Client Credentials Grant flow, enter	
   - *privateKey*
   - *privateSecret*   
6. Click Login
7. You may proceed to 'Authenticate via SMS' or 'Authenticate via Email'.
8. When 'Authenticating via SMS', enter the phone number in E164 format in which you want to receive the SMS code. You can verify the code once received in the same page. Use 'Resend OTP' provided you didn't validate the code already.
9. Same procedure can be done for 'Authenticating via Email' by entering the email ID on which you want to receive the email code.
