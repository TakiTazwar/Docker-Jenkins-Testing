const {success,failed}=require('../utils/message');
const HTTP_STATUS =require('../utils/httpStatus');
const batchData = require('../model/batch');
const courseData = require('../model/courses');
const userData = require('../model/users');
const termData = require('../model/term');
class TrainerController
{
   
    async createQuiz(req,res,next)
    {
        let flag=false;
        const quizName=req.body.quizName;
        const quizDetails=req.body.quizName;
        const termId=req.body.termId;

        const term = await termData.findOne({ _id: termId}).exec();

        term.Quizes.map(quiz=>
        {
            if(quiz.quizName.toString()==quizName)
            {
                flag=true;
            }
        });
        
        if(flag)
        {
            return res.status(HTTP_STATUS.OK).send(failed('Quiz Already Exists'));
        }

        term.Quizes.push({quizName,quizDetails});
        term.save();

        return res.status(HTTP_STATUS.OK).send(success('Quiz Added'));
    }

    async deleteQuiz(req,res,next)
    {
        const quizName=req.params.quizName;
        const termId=req.params.termId;

        const term = await termData.findOne({ _id: termId}).exec();

        term.Quizes= term.Quizes.filter(quiz=>
        {
            if(quiz.quizName.toString()==quizName)
            {
                return false;
            }

            return true;
        });

        term.save();

        return res.status(HTTP_STATUS.OK).send(success('Quiz Deleted'));
    }

    async addMarksToQuiz(req,res,next)
    {
        let flag=false;
        const quizName=req.body.quizName;
        const termId=req.body.termId;
        const trainee=req.body.trainee;
        const mark=req.body.mark;

        const term = await termData.findOne({ _id: termId}).exec();

        //Finding Existing Trainee Marks
        term.Quizes= term.Quizes.map(quiz=>
        {

            if(quiz.quizName.toString()==quizName)
            {
                if(quiz.marks.length>0)
                {
                    quiz.marks.map(singleMark=>
                    {
                        if(singleMark.trainee.toString()==trainee)
                        {
                            singleMark.mark=req.body.mark;
                            flag=true;
                        }
                    });
                }
            }
            return quiz;
        });
        if(!flag)
        {

            term.Quizes= term.Quizes.map(quiz=>
                {
        
                    if(quiz.quizName.toString()==quizName)
                    {
                        quiz.marks.push({trainee,mark});
                    }
                    return quiz;
                });
        }




        term.save();
        return res.status(HTTP_STATUS.OK).send(success('Marks Added'));
    }

    async removeMarksFromQuiz(req,res,next)
    {
        let flag=false;
        const quizName=req.params.quizName;
        const termId=req.params.termId;
        const trainee=req.params.trainee;
        
        const term = await termData.findOne({ _id: termId}).exec();

        term.Quizes= term.Quizes.map(quiz=>
        {

            if(quiz.quizName.toString()==quizName)
            {
                if(quiz.marks.length>0)
                {
                    console.log(quiz.marks.length);
                    quiz.marks=quiz.marks.filter(singleMark=>
                    {
                        if(singleMark.trainee.toString()==trainee)
                        {
                            return false;
                        }
                        return true;
                    });
                    console.log(quiz.marks.length);
                }
            }
            return quiz;
        });

        term.save();

        return res.status(HTTP_STATUS.OK).send(success('Marks Deleted'));
    }

    async viewAllTerm(req,res,next)
    {
        const trainerId=req.user._id;
        const term = await termData.find({ trainerId: trainerId}).populate('courseId').exec();

        return res.status(HTTP_STATUS.OK).send(success('Fetched Successfully',{term:term}));
    }   

    async viewSingleQuiz(req,res,next)
    {
        const termId=req.params.termId;
        const quizName=req.params.quizName;
        const term = await termData.findOne({ _id: termId}).populate({ path:"Quizes.marks.trainee",
            select: "-password"
        }).exec();

        if(term.Quizes.length==0)
        {
            return res.status(HTTP_STATUS.OK).send(failed('No Quiz Found'));
        }

        term.Quizes=term.Quizes.filter(quiz=>
            {
                if(quiz.quizName==quizName)
                {
                    return true;
                }
                return false;
            }
        );


        return res.status(HTTP_STATUS.OK).send(success('Fetched Successfully',{term:term}));
    }

}

module.exports = new TrainerController();