echo ""
curl -X POST -H "Content-Type: application/json" -d \
'{"email": "molly@books.com", "password": "mollymember"}' \
http://localhost:3010/authenticate
echo ""
echo ""
curl -X POST -H "Content-Type: application/json" -d \
'{"email": "anna@books.com", "password": "annaadmin"}' \
http://localhost:3010/authenticate
echo ""
echo ""

