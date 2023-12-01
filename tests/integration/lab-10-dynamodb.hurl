# POST Fragment Test
POST http://localhost:8080/v1/fragments
# We're sending a JSON body
Content-Type: application/json
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
{ "service": "DynamoDB" }

# We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check
[Asserts]
jsonpath "$.status" == "ok"

# Capture the Location URL and id
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"

# POST Fragment
POST http://localhost:8080/v1/fragments
# We're sending a markdown fragment
Content-Type: text/markdown
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`DynamoDB is **great**.`

# We expect to get back an HTTP 201
HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"

# Capture the Location URL and id
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"

# Get all fragments for user
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

# Delete fragment
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

# Try to GET deleted fragment
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404

# Get all fragments for user
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" not includes {{fragment1_id}}
