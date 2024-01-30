##ENDPOINTS

###USER

| HTTP Method | URL | Authorization | Description |
|---|---|---|---|
| POST | http://localhost:5000/user/ | Public | Create new user |
| PUT | http://localhost:5000/user/{id} | User | Update user by ID |
| POST | http://localhost:5000/user/login | Public | Update user refresh token and returns credential jwt and httpOnly cookie |
| POST | http://localhost:5000/user/logout | Public | Update user refresh token and clears cookie |


###POST

| HTTP Method | URL | Authorization | Description |
|---|---|---|---|
| GET | http://localhost:5000/post/{id} | Public | Get post by ID |
| GET | http://localhost:5000/post/{?page=PAGE&&limit=LIMIT} | Public | Get multiple posts chronologically by limit and advanced a set number of pages |
| GET | http://localhost:5000/post/comments/{id} | Public | Get all comments for a post by post ID |
| POST | http://localhost:5000/post/ | Admin | Create new post |
| PUT | http://localhost:5000/post/{id} | Admin | Update post by ID |
| DELETE | http://localhost:5000/post/{id} | Admin | Delete post by ID |



###COMMENT

| HTTP Method | URL | Authorization | Description |
|---|---|---|---|
| GET | http://localhost:5000/comment/{id} | Public | Get comment by ID |
| POST | http://localhost:5000/comment/ | User | Create new comment |
| PUT | http://localhost:5000/comment/{id} | User | Update comment by ID |
| DELETE | http://localhost:5000/comment/{id} | Admin | Delete comment by ID |
