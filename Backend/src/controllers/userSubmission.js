const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");


const submitCode = async (req, res) => {
    
    try{
        const userId = req.result._id;  
        const problemId = req.params.id;
        const {language, code} = req.body;

        if(!userId || !problemId || !language || !code) {
            return res.status(400).send("Missing Fields");
        }

        //Fetch the problem from the database
        const problem = await Problem.findById(problemId);
        if(!problem) {
            return res.status(404).send("Problem not found");
        }

        // kya apne submission store kr du phle....
        const submittedResult = await Submission.create({
            problemId, 
            userId, 
            language, 
            code,
            testCasesPassed:0,
            status:"pending",
            testCasesTotal:problem.hiddenTestCases.length
        });

        // Judge0 ko code submit karna hai
        const languageId = getLanguageById(language);

        // I am creating Batch Submission
        const submissions = problem.hiddenTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value) => value.token); // array of tokens of all testcases

        const testResult = await submitToken(resultToken);

        // submittedResult ko update krna hai
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = null;

        for(const test of testResult) {
            if(test.status_id == 3) {
                testCasesPassed++;
                runtime = runtime + parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            }
            else{
                if(test.status_id == 4) {
                    status = 'error';
                    errorMessage = test.stderr;
                }
                else {
                    status = 'wrong';
                    errorMessage = test.stderr;
                }
            }
        }
        
        //store the result in the submission database
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;
        submittedResult.status = status;
        submittedResult.errorMessage = errorMessage;
        await submittedResult.save();


        //problemId ko insert karenge userSchema ke problemSolved me if it is not present there.
        if(!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }

        res.status(201).send(submittedResult);


    }
    catch(err){
        res.status(500).send("Internal Server Error: " + err);
    }  
}

module.exports = {
    submitCode
}