const {success,failed}=require('../utils/message');
const HTTP_STATUS =require('../utils/httpStatus');
const batchData = require('../model/batch');
const courseData = require('../model/courses');
const userData = require('../model/users');
const termData = require('../model/term');
const paginationSkip=require("../utils/pagination");
const queryFetch=require("../utils/queryRegex");
class AdminController
{

    async createBatch(req,res,next)
    {

        try
        {
            const batchName=req.body.batchName;
            const batchDate=req.body.batchDate;

            const batch = await batchData.findOne({ batchName: batchName}).exec();
            if(batch)
            {
                return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Batch Already Exists'));
            }

            const newBatch = new batchData({batchName,batchDate});
            newBatch.save();

            return res.status(HTTP_STATUS.OK).send(success('New Batch Created',{batchName:newBatch.batchName,batchDate:newBatch.batchDate}));
        }
        catch(error)
        {
            next(error);
        }

    }

    async editBatch(req,res,next)
    {

        try
        {
            const id=req.body.id;
            const batchName=req.body.batchName;
            const batchDate=req.body.batchDate;

            const batch = await batchData.findOne({ _id: id}).exec();
            if(!batch)
            {
                return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Batch Not Found'));
            }

            batch.batchName=batchName?batchName:batch.batchName;
            batch.batchDate=batchDate?batchDate:batch.batchDate;

            batch.save();
            return res.status(HTTP_STATUS.OK).send(success('Batch Edited Successfully'));
        }
        catch(error)
        {
            next(error);
        }

    }

    async deleteBatch(req,res,next)
    {
        const batchName=req.params.batchName;

        const batch = await batchData.findOne({ batchName: batchName}).exec();

        if(!batch)
        {
            return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Batch Not Found'));
        }

        const term=await termData.find({ batchId: batch._id}).exec();
        term.map(async (singleTerm)=>
        {
            const delTerm = await termData.findOne({ _id: singleTerm._id}).exec();
            delTerm.batchId=undefined;
            delTerm.save();
        });

        await batchData.deleteOne({ batchName: batchName});

        return res.status(HTTP_STATUS.OK).send(success('Batch Deleted Successfully'));
    }

    async addTrainee(req,res,next)
    {
        try
        {
            let flag=false;
            const batchName=req.body.batchName;
            const traineeId=req.body.traineeId;

            //Must be a Trainee
            const trainee = await userData.findOne({ _id: traineeId}).exec();
            if(!trainee || (trainee && trainee.userType.toString()!=="trainee"))
            {
                return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Invalid User Type'));
            }

            // //Not in any batch
            // const allBatch=await batchData.find({"trainees.trainee":traineeId}).exec();
            // if(allBatch.length>0)
            // {

            //     return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Trainee Already Addded in a Batch'));
            // }

            //Not in any batch
            const batch=await batchData.findOne({batchName:batchName}).exec();

            batch.trainees.map(trainee=>
                {

                    if(trainee.trainee.toString()==traineeId)
                    {
                        flag=true;
                    }
                }
            )

            if(flag)
            {
                return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Trainee Already Addded in the Batch'));
            }

            batch.trainees.push(
                {
                    trainee:traineeId
                }
            )
            batch.save();
            return res.status(HTTP_STATUS.OK).send(success('Trainee Added Successfully'));

        }
        catch(error)
        {
            next(error);
        }

    }

    async deleteTrainee(req,res,next)
    {
        const batchName=req.params.batchName;
        const traineeId=req.params.traineeId;

        const batch = await batchData.findOne({ batchName: batchName}).exec();
        const prevLen=batch.trainees.length;
        batch.trainees=batch.trainees.filter(trainee=> trainee.trainee.toString()!==traineeId.toString());
        if(prevLen==batch.trainees.length)
        {
            return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Trainee Not found'));
        }

        batch.save();

        return res.status(HTTP_STATUS.OK).send(success('Trainee Deleted Successfully'));
    }

    async getBatchTrainee(req,res,next)
    {
        const id=req.params.id;
        const batch = await batchData.findOne({_id:id}).populate('trainees.trainee','firstName lastName email _id').exec();

        let allUser = await userData.find({userType:"trainee"}).select("-password -__v").exec();

        allUser=allUser.filter(user=>
        {
            const index=batch.trainees.findIndex(trainee=>trainee.trainee._id.toString()==user._id);
            if(index>=0)
            {
                return false;
            }
            return true;
        });

        res.status(HTTP_STATUS.OK).send(success("Fetched all trainee for the given batch",{allUser}));
    }


    async viewAllBatch(req,res,next)
    {
        const searchQuery=queryFetch.queryFetchBatch(req.query);
        const page = parseInt(req.query.page) >0 ? parseInt(req.query.page) : 1;
        const items =  parseInt(req.query.page)>0 ? parseInt(req.query.items) : 3;
        const {skipMed} = paginationSkip(page, items);

        const batch = await batchData.find(searchQuery).skip(skipMed).limit(items).exec();
        const totalItems = await batchData.find(searchQuery).count().exec();
        res.status(HTTP_STATUS.OK).send(success("Fetched all batch successfully",{totalItems,batch}))
    }

    async viewSingleBatch(req,res,next)
    {
        const id=req.params.id;
        const batch = await batchData.findOne({_id:id}).populate('trainees.trainee','firstName lastName email _id').exec();
        const totalItems = await batchData.find({_id:id}).count().exec();

        //const allUser = await userData.find(filter).skip(skipMed).limit(items).select("-password -__v").exec();
        res.status(HTTP_STATUS.OK).send(success("Fetched the batch successfully",{batch,totalItems}));
    }

    async createCourse(req,res,next)
    {
        try
        {
            const courseName=req.body.courseName;
            const courseDetails=req.body.courseDetails;

            const course = await courseData.findOne({ courseName: courseName}).exec();
            if(course)
            {
                return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Course Already Exists'));
            }

            const newCourse = new courseData({courseName,courseDetails});
            newCourse.save();

            return res.status(HTTP_STATUS.OK).send(success('New Course Created',{courseName:newCourse.courseName,courseDetails:newCourse.courseDetails}));
        }
        catch(error)
        {
            next(error);
        }
    }

    async editCourse(req,res,next)
    {
        try
        {
            const id=req.body.id;
            const courseName=req.body.courseName;
            const courseDetails=req.body.courseDetails;

            const course = await courseData.findOne({ _id: id}).exec();
            if(!course)
            {
                return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Course Not Found'));
            }

            course.courseName=courseName?courseName:course.courseName;
            course.courseDetails=courseDetails?courseDetails:course.courseDetails;

            course.save();
            return res.status(HTTP_STATUS.OK).send(success('Course Edited Successfully'));
        }
        catch(error)
        {
            next(error);
        }
    }

    async deleteCourse(req,res,next)
    {
        const courseName=req.params.courseName;

        const course = await courseData.findOne({ courseName: courseName}).exec();

        if(!course)
        {
            return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Course Not Found'));
        }

        const term=await termData.find({ courseId: course._id}).exec();
        term.map(async (singleTerm)=>
        {
            const delTerm = await termData.findOne({ _id: singleTerm._id}).exec();
            delTerm.courseId=undefined;
            delTerm.trainerId=undefined;
            delTerm.save();
        });

        await courseData.deleteOne({ courseName: courseName});

        return res.status(HTTP_STATUS.OK).send(success('Course Deleted Successfully'));
    }

    async viewAllCourse(req,res,next)
    {
        const course = await courseData.find().exec();

        res.status(HTTP_STATUS.OK).send(success("Fetched all course successfully",{course}))
    }

    async viewSingleCourse(req,res,next)
    {
        const id=req.params.id;
        const course = await courseData.findOne({_id:id}).exec();

        res.status(HTTP_STATUS.OK).send(success("Fetched the Course successfully",{course}));
    }

    async addTopic(req,res,next)
    {
        let flag=false;
        const id=req.body.id;
        const topic=req.body.topic;

        const course = await courseData.findOne({_id:id}).exec();

        if(!course)
        {
            return  res.status(HTTP_STATUS.NOT_FOUND).send(failed("Course Not Found"));
        }

        course.courseTopics.map(singleTopic=>{
            if(singleTopic.topics==topic)
            {
                flag=true;
            }
        });
        if(flag)
        {
            return res.status(HTTP_STATUS.NOT_FOUND).send(failed("Topic already exists"));
        }
        course.courseTopics.push({topics:topic});
        course.save();
        return res.status(HTTP_STATUS.OK).send(success('Topic Added'));

    }

    async deleteTopic(req,res,next)
    {
        let flag=false;
        const id=req.params.id;
        const topic=req.params.topic;

        const course = await courseData.findOne({_id:id}).exec();

        if(!course)
        {
            return  res.status(HTTP_STATUS.NOT_FOUND).send(failed("Course Not Found"));
        }

        course.courseTopics=course.courseTopics.filter(singleTopic=>{
            if(singleTopic.topics==topic)
            {
                flag=true;
                return false;
            }
            return true;
        });

        if(!flag)
        {
            return res.status(HTTP_STATUS.NOT_FOUND).send(failed("Topic couldn't be found"));
        }

        course.save();

        return res.status(HTTP_STATUS.OK).send(success('Topic Deleted'));
    }

    async getTrainerCourseTopic(req,res,next)
    {
        let allTopics=[];
        const id=req.params.id;
        const courses = await courseData.find().exec();

        courses.map(course=>{
            course.courseTopics.map(topics=>
                {
                    allTopics.push(topics.topics);
                }
            );
        }
        );
        allTopics = [...new Set(allTopics)];

        const users = await userData.findOne({_id:id}).exec();

        allTopics=allTopics.filter(courseTopic=>
        {
            let flag=true;
            users.courseTopics.forEach(trainerTopic=>
                {
                    if(trainerTopic.topics==courseTopic)
                    {
                        flag=false;
                    }
                }
            );
            return flag;
        });

        res.status(HTTP_STATUS.OK).send(success("Fetched the Topics successfully",{topics:allTopics}));
    }

    async addTrainerTopic(req,res,next)
    {
        let flag=false;
        const id=req.body.id;
        const topic=req.body.topic;

        const trainer = await userData.findOne({_id:id}).exec();

        if(!trainer)
        {
            return  res.status(HTTP_STATUS.NOT_FOUND).send(failed("Trainer Not Found"));
        }

        trainer.courseTopics.map(singleTopic=>{
            if(singleTopic.topics==topic)
            {
                flag=true;
            }
        });
        if(flag)
        {
            return res.status(HTTP_STATUS.OK).send(failed("Topic already exists"));
        }
        trainer.courseTopics.push({topics:topic});
        trainer.save();
        return res.status(HTTP_STATUS.OK).send(success('Topic Added'));
    }

    async deleteTrainerTopic(req,res,next)
    {
        const id=req.params.id;
        const topic=req.params.topic;
        
        let trainer = await userData.findOne({_id:id}).exec();

        trainer.courseTopics=trainer.courseTopics.filter(singleTopic=>{
            if(singleTopic.topics==topic)
            {
                return false;
            }
            return true;
        });

        console.log(trainer);



        trainer.save();

        return res.status(HTTP_STATUS.OK).send(success('Topic Deleted'));
    }

    async createTerm(req,res,next)
    {
        try
        {
            const termName=req.body.termName;
            const startDate=req.body.startDate;
            const endDate=req.body.endDate;

            const term = await termData.findOne({ termName: termName}).exec();
            if(term)
            {
                return res.status(HTTP_STATUS.OK).send(failed('Term Already Exists'));
            }



            const newTerm = new termData({termName,startDate,endDate});
            newTerm.save();

            return res.status(HTTP_STATUS.OK).send(success('New Term Created'));

        }
        catch(error)
        {
            next(error);
        }

    }

    async editTerm(req,res,next)
    {

        try
        {
            const id=req.body.id;
            const termName=req.body.termName;
            const startDate=req.body.startDate;
            const endDate=req.body.endDate;

            const term = await termData.findOne({ _id: id}).exec();
            if(!term)
            {
                return res.status(HTTP_STATUS.OK).send(failed('Term Not Found'));
            }


            term.termName=termName?termName:term.termName;
            term.startDate=startDate?startDate:term.startDate;
            term.endDate=endDate?endDate:term.endDate;

            term.save();
            return res.status(HTTP_STATUS.OK).send(success('Term Edited Successfully'));
        }
        catch(error)
        {
            next(error);
        }

    }

    async viewAllTerm(req,res,next)
    {
        //const searchQuery=queryFetch.queryFetchBatch(req.query);
        const page = parseInt(req.query.page) >0 ? req.query.page : 1;
        const items =  parseInt(req.query.page)>0 ? req.query.items : 8;
        const {skipitems} = paginationSkip(page, items);

        const term = await termData.find().skip(skipitems).limit(items).exec();
        const totalItems = await termData.find().count().exec();
        res.status(HTTP_STATUS.OK).send(success("Fetched all Term successfully",{totalItems,term}))
    }

    async viewSingleTerm(req,res,next)
    {
        const id=req.params.id;
        const term = await termData.findOne({_id:id}).populate('batchId courseId trainerId','-trainees -password').exec();

        res.status(HTTP_STATUS.OK).send(success("Fetched the term successfully",{term: term}));
    }

    async deleteTerm(req,res,next)
    {
        const termName=req.params.termName;

        const term = await termData.findOne({ termName: termName}).exec();

        if(!term)
        {
            return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Term Not Found'));
        }

        await termData.deleteOne({ termName: termName});

        return res.status(HTTP_STATUS.OK).send(success('Term Deleted Successfully'));
    }

    async addTermBatch(req,res,next)
    {
        const id=req.body.id;
        const batchId=req.body.batchId;
        const term = await termData.findOne({_id:id}).exec();

        term.batchId=batchId;
        term.save();

        res.status(HTTP_STATUS.OK).send(success("Added the Batch successfully",{term: term}));
    }

    async addTermCourse(req,res,next)
    {
        const id=req.body.id;
        const courseId=req.body.courseId;
        const term = await termData.findOne({_id:id}).exec();

        term.courseId=courseId;
        term.save();

        res.status(HTTP_STATUS.OK).send(success("Added the Batch successfully",{term: term}));
    }

    async addTermTrainer(req,res,next)
    {
        const id=req.body.id;
        const trainerId=req.body.trainerId;
        const term = await termData.findOne({_id:id}).exec();

        term.trainerId=trainerId;
        term.save();

        res.status(HTTP_STATUS.OK).send(success("Added the Batch successfully",{term: term}));
    }

    async deleteTermBatch(req,res,next)
    {
        const id=req.params.id;

        const term = await termData.findOne({ _id: id}).exec();

        if(!term)
        {
            return res.status(HTTP_STATUS.OK).send(failed('Term Not Found'));
        }
        term.batchId=undefined;
        term.save();

        return res.status(HTTP_STATUS.OK).send(success('Term Deleted Successfully'));
    }

    async deleteTermCourse(req,res,next)
    {
        const id=req.params.id;

        const term = await termData.findOne({ _id: id}).exec();

        if(!term)
        {
            return res.status(HTTP_STATUS.OK).send(failed('Term Not Found'));
        }
        term.courseId=undefined;
        term.trainerId=undefined;
        term.save();

        return res.status(HTTP_STATUS.OK).send(success('Term Deleted Successfully'));
    }

    async deleteTermTrainer(req,res,next)
    {
        const id=req.params.id;

        const term = await termData.findOne({ _id: id}).exec();

        if(!term)
        {
            return res.status(HTTP_STATUS.OK).send(failed('Term Not Found'));
        }
        term.trainerId=undefined;
        term.save();

        return res.status(HTTP_STATUS.OK).send(success('Term Deleted Successfully'));
    }

    async getTermTrainer(req,res,next)
    {
        const trainerList=[]
        const courseid=req.params.courseid;

        const trainer = await userData.find({userType:"trainer"}).exec();

        const course= await courseData.findOne({_id:courseid}).exec();

        //console.log(course.courseTopics);
        trainer.map(trainer=>
        {
            let flag=false;
            trainer.courseTopics.filter(trainerTopic=>
            {
                course.courseTopics.map(courseTopic=>
                {
                    // console.log("Trainer Topic: "+trainerTopic.topics+" Course Topic: "+courseTopic.topics);
                    if(trainerTopic.topics==courseTopic.topics)
                    {
                        flag=true;
                    }
                });
            });

            if(flag)
            {
                trainerList.push(trainer)
            }
            
        });
        

        res.status(HTTP_STATUS.OK).send(success("Fetched the term successfully",{trainer: trainerList}));

    }






}

module.exports = new AdminController();