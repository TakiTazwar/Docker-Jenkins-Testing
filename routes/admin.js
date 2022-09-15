const express = require('express');

//Project Module
const AdminController=require('../controller/admin');
const validator = require('../middlewares/validation');
const upload = require('../middlewares/addUserImage');
const auth = require("../middlewares/userAuth");


const router = express.Router();

router.post('/add-batch' , AdminController.createBatch);

router.put('/edit-batch' , AdminController.editBatch);

router.delete('/delete-batch/:batchName' , AdminController.deleteBatch);

router.get('/view-all-batch' , AdminController.viewAllBatch);

router.get('/view-single-batch/:id' , AdminController.viewSingleBatch);

router.get('/view-batch-trainee/:id' , AdminController.getBatchTrainee);

router.post('/add-trainee' , AdminController.addTrainee);

router.delete('/delete-trainee/:batchName/:traineeId' , AdminController.deleteTrainee);

router.post('/add-course' , AdminController.createCourse);

router.put('/edit-course' , AdminController.editCourse);

router.delete('/delete-course/:courseName' , AdminController.deleteCourse);

router.get('/view-all-course' , AdminController.viewAllCourse);

router.get('/view-single-course/:id' , AdminController.viewSingleCourse);

router.post('/add-topic' , AdminController.addTopic);

router.delete('/delete-topic/:id/:topic' , AdminController.deleteTopic);

router.get('/get-trainer-course-topic/:id' , AdminController.getTrainerCourseTopic);

router.post('/add-trainer-topic' , AdminController.addTrainerTopic);

router.delete('/delete-trainer-topic/:id/:topic' , AdminController.deleteTrainerTopic);

router.post('/add-term' , AdminController.createTerm);

router.get('/view-all-term' , AdminController.viewAllTerm);

router.put('/edit-term' , AdminController.editTerm);

router.get('/view-single-term/:id' , AdminController.viewSingleTerm);

router.delete('/delete-term/:termName' , AdminController.deleteTerm);

router.post('/term/add-batch' , AdminController.addTermBatch);

router.post('/term/add-course' , AdminController.addTermCourse);

router.post('/term/add-trainer' , AdminController.addTermTrainer);

router.delete('/term/delete-batch/:id' , AdminController.deleteTermBatch);

router.delete('/term/delete-course/:id' , AdminController.deleteTermCourse);

router.delete('/term/delete-trainer/:id' , AdminController.deleteTermTrainer);

router.get('/view-term-trainer/:courseid' , AdminController.getTermTrainer);

module.exports=router;