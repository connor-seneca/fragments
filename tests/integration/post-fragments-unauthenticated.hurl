# POST Fragment Unauthenticated 401 Error
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
baduser@email.com:badpass1
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# We expect to get back an HTTP 201
HTTP/1.1 401
