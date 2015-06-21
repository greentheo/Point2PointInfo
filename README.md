# Bicycle bumpiness

## Collection App
The bulk of the semi-finished work is done in the client collector app.  The app is built using Aurelia as the application framework.

## Server App
The sails server app is functional but very basic.

### Models
The /api/models area should have our data schema pretty well defined.

### Controllers
The /api/controllers area will define our actual API that clients will be able to hit.

#### Location

- */location/savelocationdata*:  Saves data posted from a collector app.  Expects 'userEmail', and an array of location data objects.
- */location/getlocationdata*: Gets location data for the specified user.  Expects 'userEmail'.  Normal user can ask for his own data.  Administrator can ask for any user's data.

That's it!  Lots of room for expansion. 

### Authentication and Security
Installed Waterlock for token-based authentication.  Doing the job nicely.

### Sails Policies
Sails uses “policies" to secure areas of the site.  It’s actually pretty nifty.  You can define a policy to be whatever you want/need.   Then, you can apply that policy.

Current policies:

- hasJsonWebToken:  (from Waterlock) verifies a user is logged in.
- sessionAuth: (from Waterlock) this is not used by our app, as we're using tokens.
- tokenAdministratorOrOwnData: verifies the user is either an administrator, or is asking for his own data.

## Manager App
Absolutely nothing done on this point, except for an Aurelia skeleton, which should probably be updated before real work starts on this anyway.

# Installation Settings

## Server
/config:

- waterlock.js (base url)
- connections.js
- development.js vs. production.js

/collector:

- /src/config/appconfig.js
- enable bundling and minification???
