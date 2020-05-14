const Querybackend = (url, body) => {
    fetch(url, {
        headers: {'Content-Type': 'application/json'},
        body: body,
        method: 'POST'
    })
    .then(response => {
        return response.json();
    })
    .then(backendAnswer => {
        return backendAnswer
    });
}

export default Querybackend