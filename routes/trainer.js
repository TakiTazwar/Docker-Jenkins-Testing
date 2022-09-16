const express = require('express');

//Project Module
const TrainerController=require('../controller/trainer');
const validator = require('../middlewares/validation');
const upload = require('../middlewares/addUserImage');
const auth = require("../middlewares/userAuth");


const router = express.Router();

router.post('/add-quiz' , TrainerController.createQuiz);

router.delete('/delete-quiz/:quizName/:termId' , TrainerController.deleteQuiz);

router.post('/add-quiz-marks' , TrainerController.addMarksToQuiz);

router.delete('/delete-quiz-marks/:quizName/:termId/:trainee' , TrainerController.removeMarksFromQuiz);

router.get('/get-all-quiz', auth.checkAuth, TrainerController.viewAllTerm);

router.get('/get-single-quiz/:termId/:quizName', auth.checkAuth, TrainerController.viewSingleQuiz);


module.exports=router;