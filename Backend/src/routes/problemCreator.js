const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, allSolvedProblemByUser, submittedProblem } = require('../controllers/userProblem');
const userMiddleware = require('../middleware/userMiddleware');

const problemRouter = express.Router();


//create
problemRouter.post('/create', adminMiddleware, createProblem);
// update
problemRouter.put('/update/:id', adminMiddleware, updateProblem);
//delete
problemRouter.delete('/delete/:id', adminMiddleware, deleteProblem);

//fetch
problemRouter.get('/problemById/:id', userMiddleware, getProblemById);
problemRouter.get('/getAllProblem/', userMiddleware, getAllProblem);
//user's solved problem
problemRouter.get('/problemSolvedByUser', userMiddleware, allSolvedProblemByUser);
//particular problem solved by user
problemRouter.get('/submittedProblem/:pid', userMiddleware, submittedProblem);
module.exports = problemRouter;