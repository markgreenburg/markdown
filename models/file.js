const marked = require('marked');

/* Use Bluebird promise lib */
const promise = require('bluebird');
const options = {
    promiseLib: promise
};

/* Set Up Postgres async connector */
const pgp = require('pg-promise')(options);
const dbSettings = {
    "host": 'localhost',
    "port": 5432,
    "database": 'markdown',
    "user": 'postgres',
    "password": 'postgresql'
};
const db = pgp(dbSettings);

/**
 * File factory
 */
const file = (id, callback) => {
    id = id || 0;
    const query = "SELECT id, title, contents, html FROM files WHERE id = $1";
    return db.oneOrNone(query, id)
        .then((state) => {
            if (state.id > 0) {
                return state;
            } else {
                const state = {
                    "id": 0,
                    "title": "",
                    "content": "",
                    "html": ""
                };
                return state;
            }
        })
        .then((state) => {
            var ret = Object.assign(
                {},
                idGetter(state),
                titleGetter(state),
                contentGetter(state),
                htmlGetter(state),
                titleSetter(state),
                contentSetter(state),
                htmlSetter(state),
                save(state),
                update(state)//,
                // setDelete(state)
            );
            callback(ret);
        });
};

/**
 * Factory functions
 */
const idGetter = (state) => ({
    "getId": () => state.id
});

const titleGetter = (state) => ({
    "getTitle": () => state.title
});

const contentGetter = (state) => ({
    "getContents": () => state.contents
});

const htmlGetter = (state) => ({
    "getHtml": () => state.html
});

const titleSetter = (state) => ({
    "setTitle": (title) => { state.title = title }
});

const contentSetter = (state) => ({
    "setContent": (content) => { state.content = content }
});

const htmlSetter = (state) => ({
    "setHtml": (html) => { state.html = html }
});

const save = (state) => ({
    "save": () => {
        const query = ("INSERT INTO files (title, contents, html) VALUES"
            + " (${title}, ${contents}, ${html}) RETURNING id");
        db.one(query, state)
            .then((data) => { state.id = data.id })
            .catch(() => { state.id = 0 });
    }
});

const update = (state) => ({
    "update": () => {
        const query = ("UPDATE files SET title=${title}, contents=${contents},"
            + " html=${html} WHERE id=${id} RETURNING id");
        db.one(query, state)
            .then((data) => { state.id = data.id })
            .catch(() => {}); // do error
    }
});

module.exports = {
    "file": file
};

