# kandy-cpaas2-sample-2fa

### 2FA

This app is used to create communication channel between two users via 2FA APIs.

#### Demo

To check a demo of this app, visit the [link](https://hclsampleapps.github.io/kandy-cpaas2-sample-2fa/).

#### Steps 

1. Create an account on **AT&T** portal via [Register now for a free account](https://apimarket.att.com/signup).
2. Open ```index.html``` in the browser.
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

### Development

To setup the project repository, run these commands

```
git clone https://github.com/hclsampleapps/kandy-cpaas2-sample-2fa.git
cd kandy-cpaas2-sample-2fa
```

Then, open ```index.html``` in the browser to view the app.

#### Branching strategy

To learn about the branching strategy, contribution & coding conventions followed in the project, please refer [GitFlow based branching strategy for your project repository](https://gist.github.com/ribbon-abku/10d3fc1cff5c35a2df401196678e258a)
