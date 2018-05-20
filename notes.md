**Design**

Main screen:
* Option to sign in / sign out
* List and select from all polls

Poll Screen:
* View poll results
* Graphic of poll results
* Vote on poll
  * Prevent double voting?
* (If logged in) I can add an option to the poll

Home Screen (logged in):
* List my polls
* Create a poll
* Delete a poll
* Share polls with friends
* Aggregate poll results? What does this mean exactly?

Model
* Users 
* List of polls
* Data per poll
* Poll contains data (votes)
* Poll contains owner (user)

Database
* Two collections? (Not normalized)
* Each poll has a document, containing the votes (names + numbers), owner (user)
* Each user has a document, containing the polls they own.

Challenges
* Authentication
* Session management
* Share polls with friends

View(s)
* Main screen
* Sign in / out
* Poll screen
* Home screen
* Create a poll
* Delete a poll 
* Share a poll
* Aggregate data screen

Controllers
* start / main screen / index.html
* Sign in / out
* CRUD
  * Create a poll
  * Read a poll
  * Update poll votes
  * Update poll options
  * Delete a poll
* Share a poll
* Get all polls
* Get all of a user's polls

Tools
* https://www.draw.io/



**References:**

* http://www.codexpedia.com/node-js/a-very-basic-session-auth-in-node-js-with-express-js/
* https://www.codementor.io/emjay/how-to-build-a-simple-session-based-authentication-system-with-nodejs-from-scratch-6vn67mcy3
* https://medium.com/of-all-things-tech-progress/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359
* https://medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d
* https://developer.github.com/v3/guides/getting-started/
* https://developer.github.com/apps/building-oauth-apps/
* http://mustache.github.io/mustache.5.html
* https://github.com/maxogden/github-oauth/blob/master/index.js 
* https://oauth.net/getting-started/
* https://forum.freecodecamp.org/t/let-s-discuss-your-voting-app/52572/38
