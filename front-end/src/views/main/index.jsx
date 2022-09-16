import React from 'react'
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../services/protectedRoute';
import BatchAddTrainee from '../../share/admin/batches/batchAddTrainee';
import BatchCreate from '../../share/admin/batches/batchCreate';
import BatchEdit from '../../share/admin/batches/batchEdit';
import BatchMenu from '../../share/admin/batches/batchMenu';
import BatchShow from '../../share/admin/batches/batchShow';
import BatchSingleShow from '../../share/admin/batches/batchSingleShow';
import Courses from '../../share/admin/course/courses';
import CourseCreate from '../../share/admin/course/coursesCreate';
import CourseEdit from '../../share/admin/course/coursesEdit';
import CourseShow from '../../share/admin/course/coursesShow';
import CourseTopic from '../../share/admin/course/courseTopic';
import AdminHome from '../../share/admin/home';
import TermCreate from '../../share/admin/term/addTerm';
import TermMenu from '../../share/admin/term/termMenu';
import UserCreate from '../../share/admin/users/userCreate';
import ShowSingleTrainee from '../../share/admin/users/showSingleTrainee';
import UserEdit from '../../share/admin/users/userEdit';
import UsersHome from '../../share/admin/users/userHome';
import UsersShow from '../../share/admin/users/userShow';
import TraineeShow from '../../share/admin/users/userShowTrainee';
import TrainerShow from '../../share/admin/users/userShowTrainer';
import Login from '../../share/user/login';
import ResetPassword from '../../share/user/resetPassword';
import ResetPasswordMail from '../../share/user/resetPasswordMail';
import Footer from '../footer/index';
import Header from '../header/index';
import TermShow from '../../share/admin/term/showAllTerm';
import TermEdit from '../../share/admin/term/editTerm';
import TermSingleShow from '../../share/admin/term/showSingleTerm';
import AddTermTrainer from '../../share/admin/term/addTrainer';
import AddTermBatch from '../../share/admin/term/addBatch';
import AddTermCourse from '../../share/admin/term/addCourse';
import AddTrainerTopic from '../../share/admin/users/addTrainerTopic';
import TrainerHome from '../../share/trainer/trainerHome';
import TrainerTerm from '../../share/trainer/Term';
import TrainerQuizes from '../../share/trainer/Quizes';
import TrainerSingeQuiz from '../../share/trainer/SingleQuiz';
import AddQuiz from '../../share/trainer/addQuiz';

function Main() {
  return (
    <div className='main-page'>
        <Header />
        <Routes>
          <Route path='/login' element={<Login />}> </Route>
          <Route path='/resetPasswordMail' element={<ResetPasswordMail />}> </Route>
          <Route path='/resetpassword/:token/:userid' element={<ResetPassword />}> </Route>
          <Route path='/admin' element={<ProtectedRoute><AdminHome /></ProtectedRoute>}> </Route>
          <Route path='/courses' element={<ProtectedRoute><Courses /></ProtectedRoute>}> </Route>
          <Route path='/courses/create' element={<ProtectedRoute><CourseCreate /></ProtectedRoute>}> </Route>
          <Route path='/courses/show' element={<ProtectedRoute><CourseShow /></ProtectedRoute>}> </Route>
          <Route path='/course/topic/:id' element={<ProtectedRoute><CourseTopic /></ProtectedRoute>}> </Route>
          <Route path='/course/edit-course/:id' element={<ProtectedRoute><CourseEdit /></ProtectedRoute>}> </Route>
          <Route path='/users' element={<ProtectedRoute><UsersHome /></ProtectedRoute>}> </Route>
          <Route path='/users/create' element={<ProtectedRoute><UserCreate /></ProtectedRoute>}> </Route>
          <Route path='/users/edit/:id' element={<ProtectedRoute><UserEdit /></ProtectedRoute>}> </Route>
          <Route path='/users/show' element={<ProtectedRoute><UsersShow /></ProtectedRoute>}> </Route>
          <Route path='/users/show/trainer' element={<ProtectedRoute><TrainerShow /></ProtectedRoute>}> </Route>
          <Route path='/users/add-topic/:id' element={<ProtectedRoute><AddTrainerTopic /></ProtectedRoute>}> </Route>
          <Route path='/users/show/trainee' element={<ProtectedRoute><TraineeShow /></ProtectedRoute>}> </Route>
          <Route path='/users/show/trainee/:id' element={<ProtectedRoute><ShowSingleTrainee /></ProtectedRoute>}> </Route>
          <Route path='/batch' element={<ProtectedRoute><BatchMenu /></ProtectedRoute>}> </Route>
          <Route path='/batch/create' element={<ProtectedRoute><BatchCreate /></ProtectedRoute>}> </Route>
          <Route path='/batch/show' element={<ProtectedRoute><BatchShow /></ProtectedRoute>}> </Route>
          <Route path='/batch/edit-batch/:id' element={<ProtectedRoute><BatchEdit /></ProtectedRoute>}> </Route>
          <Route path='/batch/trainee/:id' element={<ProtectedRoute><BatchSingleShow /></ProtectedRoute>}> </Route>
          <Route path='/batch/add-trainee/:id' element={<ProtectedRoute><BatchAddTrainee /></ProtectedRoute>}> </Route>
          <Route path='/term' element={<ProtectedRoute><TermMenu /></ProtectedRoute>}> </Route>
          <Route path='/term/create' element={<ProtectedRoute><TermCreate /></ProtectedRoute>}> </Route>
          <Route path='/term/show' element={<ProtectedRoute><TermShow /></ProtectedRoute>}> </Route>
          <Route path='/term/edit-term/:id' element={<ProtectedRoute><TermEdit /></ProtectedRoute>}> </Route>
          <Route path='/term/single/:id' element={<ProtectedRoute><TermSingleShow /></ProtectedRoute>}> </Route>
          <Route path='/term/add-batch/:id' element={<ProtectedRoute><AddTermBatch /></ProtectedRoute>}> </Route>
          <Route path='/term/add-course/:id' element={<ProtectedRoute><AddTermCourse /></ProtectedRoute>}> </Route>
          <Route path='/term/add-trainer/:id/:courseid' element={<ProtectedRoute><AddTermTrainer /></ProtectedRoute>}> </Route>
          <Route path='/trainer' element={<TrainerHome />}> </Route>
          <Route path='/trainer-term' element={<TrainerTerm />}> </Route>
          <Route path='/trainer/quizes/:id' element={<TrainerQuizes />}> </Route>
          <Route path='/trainer/single-quiz/:id/:quizName' element={<TrainerSingeQuiz />}> </Route>
          <Route path='/trainer/create-quiz/:termId' element={<AddQuiz />}> </Route>
        </Routes>
        <Footer />
    </div>
  )
}

export default Main;