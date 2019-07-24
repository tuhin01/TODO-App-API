const mongoose = require('mongoose');

const connectionString = 'mongodb://127.0.0.1:27017/task-manager-api';
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
});


// const newTask = new Task({
//    description: 'Buy a razor',
//    completed: false
// });
// newTask.save().then(() => {
//     console.log(newTask);
// }).catch(error => {
//     console.log(error)
// });
