const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['c++', 'java', 'javascript']
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'wrong', 'runtime-error', 'compile-error'],
        default: 'pending'
    },
    runtime: {
        type: Number,
        default: 0
    },
    memory: {
        type: Number,
        default: 0
    },
    errorMessage: {
        type: String,
        default: ''
    },
    testCasesPassed: {
        type: Number,
        default: 0
    },
    totalTestCases: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

submissionSchema.index({ userId: 1, problemId: 1 });

const Submission = mongoose.model('submission', submissionSchema);
module.exports = Submission;
    