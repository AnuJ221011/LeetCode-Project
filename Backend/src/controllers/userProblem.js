const Problem = require("../models/problem");
const {getLanguageById, submitBatch, submitToken} = require("../utils/problemUtility");

const createProblem = async (req, res) => {
    const {title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator} = req.body;

    try {
        for(const {language, completeCode} of referenceSolution) {

            //source_code:
            //language_id:
            //stdin:
            //expected_output:

            const languageId = getLanguageById(language);

            // I am creating Batch Submission
            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));

            const submitResult = await submitBatch(submissions);
            console.log(submitResult);

            const resultToken = submitResult.map((value) => value.token); // array of tokens of all testcases

            const testResult = await submitToken(resultToken);
            console.log(testResult);

            for(const test of testResult) {
                if(test.status_id !== 3) {
                    return res.status(400).send("Testcase Failed");
                }
            }
            
        }

        //Now we can store it in our DB
        const userProblem = await Problem.create({
            ...req.body,
            problemCreator: req.result._id   // store it during authentication
        })

        res.status(201).send("Problem saved successfully");  
    }
    catch (err) {
        res.status(400).send('Error: ' + err);
    }
}

const updateProblem = async (req, res) => {
    const {id} = req.params;

    const {title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator} = req.body;

    try {

        if(!id){
            res.status(400).send("Missing ID Field");
        }

        const dsaProblem = await Problem.findById(id);
        if(!dsaProblem){
            return res.status(404).send("ID is not present in the server");
        }

        for(const {language, completeCode} of referenceSolution) {

            const languageId = getLanguageById(language);

            // I am creating Batch Submission
            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));

            const submitResult = await submitBatch(submissions);
            console.log(submitResult);

            const resultToken = submitResult.map((value) => value.token); // array of tokens of all testcases

            const testResult = await submitToken(resultToken);
            console.log(testResult);

            for(const test of testResult) {
                if(test.status_id !== 3) {
                    return res.status(400).send("Testcase Failed");
                }
            }
            
        }

        const newProblem = Problem.findByIdAndUpdate(id, {...req.body}, {runValidators:true, new:true});

        res.status(200).send(newProblem);
    }
    catch(err) {
        res.status(500).send("Error: " + err);
    }
}

const deleteProblem = async (req, res) => {
    const {id} = req.params;

    try {
        if(!id){
            res.status(400).send("Missing ID Field");
        }

        const problem = await Problem.findByIdAndDelete(id);
        if(!problem) {
            return res.status(404).send("Problem is missing");
        }
        res.status(200).send("Problem Deleted Successfully");
    }
    catch(err) {
        res.status(500).send("Error: " + err);
    }
}

const getProblemById = async (req, res) => {
    const {id} = req.params;

    try {
        if(!id){
            res.status(400).send("Missing ID Field");
        }

        const getProblem = await Problem.findById(id);
        if(!getProblem) {
            return res.status(404).send("Problem is missing");
        }
        res.status(200).send(getProblem);
    }
    catch(err) {
        res.status(500).send("Error: " + err);
    }
}

const getAllProblem = async (req, res) => {
    try {
        const getProblems = await Problem.find({});

        if(getProblems.length === 0) {
            return res.status(404).send("Problem is missing");
        }

        res.status(200).send(getProblems);
    }
    catch(err) {
        res.status(500).send("Error: " + err);
    }
}

const allSolvedProblemByUser = async (req, res) => {
    

module.exports = {
    createProblem,
    updateProblem,
    deleteProblem,
    getProblemById,
    getAllProblem,
    allSolvedProblemByUser
}