const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/users-router');
const taskRouter = require('./routers/tasks-router');
const app = express();
const port=process.env.PORT || 3000;



app.use(express.json());//parse JSON to object
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('listening on ' + port);
});