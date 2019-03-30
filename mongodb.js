//CRUD - Create read update delete
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';//instead of localhost
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (err, client) => {
    if(err){
        return console.log('Unable to connect to database' + err);
    }

    const db = client.db(databaseName);
    // db.collection('users').insertOne({
    //     name: 'Borjan',
    //     age: 21
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert user');
    //     }
    //     console.log('result.ops=all the things that were inserted? ', result.ops);
    // });
    db.collection('users').insertMany([{name: 'Filip', age: 22}, {name: 'Fico', age: 15}], (err, result) => {
        if(err) {
            return console.log('Unable to insert user');
        }
        console.log(result.ops);
    });
    db.collection('tasks').insertMany([{
        description: 'Study MPS',
        completed: false
    },{ 
        description: 'Study OS',
        completed: true
    }
    ], (err, result) => {
        if(err){
            return console.log('Error inserting to tasks');
        }
        console.log(result.ops);
    });
});
