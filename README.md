# Bicycle bumpiness

## Collection App
The bulk of the semi-finished work is done in the client collector app.  The app is built using Durandal.js as the application framework.

## Server App
The sails server app is very unfinished.  Some things that have been worked on:

### Models
The /api/models area should have our data schema pretty well defined.

### Controllers
The /api/controllers area will define our actual API that clients will be able to hit.

User has some code surrounding user login, logout, and signup.  This code does not yet work.

Both login and logout have some code that deals with both “session” and tokens.  I don’t think it’s wise to mix both like that.  My plan was to either:

- Take out the “session” stuff, and setup a “active users token collection” that would make use of mongo’s expiring records. This would future proof us as far as different types of clients hitting the API - both client apps and the server would use tokens to authenticate users.
- The other way to do it is to use “session”, which is a lot simpler, but doesn’t allow non-web clients (like native mobile apps) to hit the API.  However, our client app is a website right now, so it could make use of sails’ session infrastructure.

accelerationcontroller and locationcontroller are not filled in, yet. Locationcontroller will probably define the function that the client app sends its data to.  Hooking up to the Location model should work the same here as using the User model in UserController.

In general, the controllers can be used as JSON based API calls, or to render a server HTML view.

### Sails Policies
Sails uses “policies" to secure areas of the site.  It’s actually pretty nifty.  You can define a policy to be whatever you want/need.   Then, you can apply that policy.

Define a policy at /api/policies.  Right now, there’s an “isAuthenticated” policy, which also needs to be finished to use “session” or the “token collection” - but not both.  (I think right now, it’s using a session to store a token.  Oops.)

Apply policies at /config/policies.js.  You can see I’ve set up permissions for the UserController functions, using the “isAuthenticated” policy I defined earlier.

## Actual UI
Absolutely nothing done on this point!  Was going to start on this once I got authentication nailed down.  Here is where we need to decide:

- Whether to make this server app more “server page” based, or
- Make it a “single page app” where the whole app functions on the client, and just hits the API on thegit server.
