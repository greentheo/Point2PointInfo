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

*/location/save*:  Saves data posted from a collector app.  Expects 'userEmail', and an array of location data objects.

*/location/query*: Queries location data.  Supported arguments:

- userEmail: Optional.
- start:  Date string to look for location data on or after the specified date.  Specify as 'yyyy-mm-dd'.  Optional.
- end:  Date string to look for location data on or before the specified date.  Specify as 'yyyy-mm-dd'.  Optional.
- minLat: Minimum latitude to include. Optional. 
- maxLat: Maximum latitude to include. Optional.
- minLong: Minimum longitude to include. Optional. 
- maxLong: Maximum longitude to include. Optional.
- sessionId: optional. 
- userId: optional. 
- count: Number of records to return.  Optional.
- skip:  Number of records to skip.  Optional.

### Authentication and Security
Installed Waterlock for token-based authentication.  Doing the job nicely.

### Sails Policies
Sails uses “policies" to secure areas of the site.  It’s actually pretty nifty.  You can define a policy to be whatever you want/need.   Then, you can apply that policy.

Current policies in use:

- hasJsonWebToken:  (from Waterlock) verifies a user is logged in.
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
