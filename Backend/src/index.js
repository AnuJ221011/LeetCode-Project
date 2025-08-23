const express = require('express')
require('dotenv').config();
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userAuth');
const redisClient = require('./config/redis');
const problemRouter = require('./routes/problemCreator');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/user', authRouter);
app.use('/problem', problemRouter);

const InitializeConnection = async () => {
    try {
        await Promise.all([connectDB(), redisClient.connect()]);
        console.log("MongoDB and Redis Connected");

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);   
        })

    } catch (error) {
        console.log(error);
    }
}

InitializeConnection();


// main()
//     .then(async () => {
//         await connectDB();
//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on http://localhost:${process.env.PORT}`);
//         });
//     })
//     .catch(console.error);


