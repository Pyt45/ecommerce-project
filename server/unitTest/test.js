const axios = require('axios');

const headers = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.io)",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI0ODIwNmQ1OTI5NGQ0Y2VhYmJlMzI2NzUxYmE4OGE5YyIsImlhdCI6MTYzMjEzMjAxMX0.mpbVpvbMGJyjmr_kOjzD1W-wXzWhjM5PBjovcyZ7CMI"
}

const reqOptions = {
    url: "localhost:9000/products/delete/32cb598fde8a44b0b4768a9c94cbc8ea",
    method: "DELETE",
    headers: headers
};

axios.request(reqOptions).then((res) => {
    console.log(res.data);
})