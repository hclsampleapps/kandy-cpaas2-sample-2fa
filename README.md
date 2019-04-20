# kandy-cpaas2-sample-2fa

### 2FA

This app is used to create communication channel between two users via 2FA APIs.

 - Try the [demo](https://hclsampleapps.github.io/kandy-cpaas2-sample-2fa/app/)
 - Get the [source code](https://github.com/hclsampleapps/kandy-cpaas2-sample-2fa)

#### User manual 

1. Create an account on **AT&T** portal via [Register now for a free account](https://apimarket.att.com/signup).
2. Open an instance of `index.html` in the browser for a *User*.
3. Enter the *server URL*, for e.g.,
	- For AT&T API Marketplace [apimarket.att.com](https://apimarket.att.com), enter `https://oauth-cpaas.att.com`
4. Choose to get accessToken by *Password Grant* flow or *Client Credentials* flow.
5. Login using *User*'s credential in the browser window.
6. For **Password Grant** flow, enter 
	- *clientId* 
	- *emailId* 
	- *password*  
7. For **Client Credentials Grant** flow, enter
	- *privateKey*
	- *privateSecret*   
8. Click ***Login***
9. You may proceed to ***Authenticate via SMS*** or ***Authenticate via Email***.
10. When ***Authenticating via SMS***, enter the phone number in E164 format in which you want to receive the SMS code. You can verify the code once received in the same page. Use ***Resend OTP*** provided if you didn't validated the code already.
11. Same procedure can be done for ***Authenticating via Email*** by entering the email ID on which you want to receive the email code.

##### Notes

 - Existing user can confirm their account via [Log in to AT&T API Marketplace](https://apimarket.att.com/login)
 - You can download *kandy.js* from [Developer documentation - SDKs](https://apimarket.att.com/developer/sdks/javascript)

### Development

To setup the project repository, run these commands

```
git clone https://github.com/hclsampleapps/kandy-cpaas2-sample-2fa.git
cd kandy-cpaas2-sample-2fa
```

Then, open ```index.html``` in the browser to view the app.

#### Branching strategy

To learn about the branching strategy, contribution & coding conventions followed in the project, please refer [GitFlow based branching strategy for your project repository](https://gist.github.com/ribbon-abku/10d3fc1cff5c35a2df401196678e258a)
