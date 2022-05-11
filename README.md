# blog-api:

 ## Aim: 
 Produce a RESTful blog api with protected routes, that uses JSON web tokens and custom authentication middleware to ensure that only authorised users can those routes.
 
 ## Installation 
 ```bash
git clone git@github.com:zakia98/blog-api.git
cd blog-api
npm install
heroku create
git push heroku main
```

### Environment Variables
Users will need to provide the following environment variables to their hosting server. 

Users will need to set the `SECRET_KEY` for the JSON web token generation and verification, and `DB_URL` for the database link. The `ADMIN_KEY` is used to create new members and must match the form data variable `admin_key` when sending a post request to create a new user. 


## Features

- New user sign up is an authorized route, so users can only sign up with provided auth code
- User passwords are hashed and verified using bcryptJS
- Only Admins can create posts
- Only Admins can delete posts
- Users can get all posts or a specific post.

## Technologies
- Node.js
- Express
- JSON web tokens
- MongoDB
- Mongoose
- dotenv
- bcryptjs

## Reflections
### Thoughts
The main goal of this project was to create a RESTful api. Initially, passportJS was considered for use but I opted for custom authentication middleware, as it provided a simpler solution. 

### Further improvements
- Add to add comments to the API.
- Allow admins to delete and remove comments.
- Create a front-end to interact with the API.
