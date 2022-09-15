const express = require('express');
const dotenv = require('dotenv');
const cors=require("cors");
const path = require('path');
const dbConnect=require('./config/database');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const trainerRouter = require('./routes/trainer');

const app = express();
dotenv.config();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({origin:"http://localhost:3000",methods:["GET","POST","PUT","DELETE"]}));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.set('view engine', 'ejs');
app.set('views', 'mails');


app.use('/user',userRouter);
app.use('/admin',adminRouter);
app.use('/trainer',trainerRouter);

app.use('/',(req,res,next)=>{
    console.log(req.url);
    res.status(HTTP_STATUS.NOT_FOUND).send(failed('404 Not Found'));
})


app.use((err, req, res, next) => {
    console.log(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(
        failed('Internal Server Error!')
    );
})

dbConnect(()=>{
    app.listen(5000, () => {
        console.log('Application is running on port 5000');
    });
});