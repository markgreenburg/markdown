const randtoken = require('rand-token');

// Auth-less user base object. For now just stored in memory.
const user = (username) => {
    let state = {
        "username": username,
        "token": ""
    };
    return Object.assign(
        {},
        usernameGetter(state),
        tokenGetter(state),
        tokenSetter(state)
    )
}

const usernameGetter = (state) => ({
    "getUsername": () => state.username
});

const tokenGetter = (state) => ({
    "getToken": () => state.token
});

const tokenSetter = (state) => ({
    "setToken": () => state.token = randtoken.generate(16)
});

module.exports = {
    "user": user
};