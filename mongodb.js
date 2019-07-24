// CRUD
const {MongoClient, ObjectID} = require('mongodb');

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionUrl, {useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!');
    }

    const db = client.db(databaseName);

    // db.collection('users').findOne({_id: new ObjectID("5d34416a6639ac06d4e34b42")}, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to find the user!');
    //     }
    //
    //     console.log(user)
    //
    // });

    // db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
    //     console.log(tasks);
    // });

    // db.collection('tasks').updateOne({
    //     _id : ObjectID('5d344230b25d2106ef24a39d')
    // },{
    //     $set : {
    //         completed:false
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    db.collection('tasks').updateMany({
        completed: true
    }, {
        $set: {
            completed: false
        }
    }).then((result) => {
        console.log(result.modifiedCount);
    }).catch((error) => {
        console.log(error);
    })

});
