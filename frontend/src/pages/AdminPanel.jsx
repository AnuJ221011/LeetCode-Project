    import {useForm, useFieldArray} from 'react-hook-form';
    import {zodResolver} from '@hookform/resolvers/zod';
    import {z} from 'zod';
    import axiosClient from '../utils/axiosClient';
    import { useNavigate } from 'react-router';


    // Zod schema matching the problem schema
    const problemSchema = z.object({
        title: z.string().min(3, 'Title should be at least 3 characters long'),
        description: z.string().min(5, 'Description should be at least 5 characters long'),
        difficulty: z.enum(['easy', 'medium', 'hard'], 'Select a valid difficulty level'),
        tags: z.enum(['array', 'string', 'dp', 'math', 'greedy', 'tree', 'graph'], 'Select a valid tag'),
        visibleTestCases:z.array(
            z.object({
                input: z.string().min(1, 'Input cannot be empty'),
                output: z.string().min(1, 'Output cannot be empty'),
                explanation: z.string().min(1, 'Explanation cannot be empty')
            })
        ).min(1, 'At least one visible test case is required'),
        hiddenTestCases:z.array(
            z.object({
                input: z.string().min(1, 'Input cannot be empty'),
                output: z.string().min(1, 'Output cannot be empty')
            })
        ).min(1, 'At least one hidden test case is required'),
        startCode:z.array(
            z.object({
                language: z.enum(['c++', 'javascript', 'java'], 'Select a valid programming language'),
                initialCode: z.string().min(1, 'Initial code cannot be empty')
            })
        ).length(3, 'Start code must have entries for all three languages (c++, javascript, java)'),
        referenceSolution:z.array(
            z.object({
                language: z.enum(['c++', 'javascript', 'java'], 'Select a valid programming language'),
                completeCode: z.string().min(1, 'Complete code cannot be empty')
            })
        ).length(3, 'Reference solution must have entries for all three languages (c++, javascript, java)'),        
    });

    function AdminPanel() {
        const navigate = useNavigate();
        const {
            register,
            control,
            handleSubmit,
            formState: {errors},
        } = useForm({
            resolver: zodResolver(problemSchema),
            defaultValues: {
                startCode: [
                    { language: 'c++', initialCode: '' },
                    { language: 'javascript', initialCode: '' },
                    { language: 'java', initialCode: '' }
                ],
                referenceSolution: [
                    { language: 'c++', completeCode: '' },
                    { language: 'javascript', completeCode: '' },
                    { language: 'java', completeCode: '' }
                ],
                visibleTestCases: [{ input: '', output: '', explanation: '' }],
                hiddenTestCases: [{ input: '', output: '' }],            
            },
        });

        const {
            fields:visibleFields,
            append:appendVisible,
            remove:removeVisible
        } = useFieldArray({
            control,
            name:'visibleTestCases'
        });

        const {
            fields:hiddenFields,
            append:appendHidden,
            remove:removeHidden
        } = useFieldArray({
            control,
            name:'hiddenTestCases'
        });

        const onSubmit = async (data) => {
            try {
                await axiosClient.post('/problem/create', data);
                alert('Problem created successfully!');
                navigate('/');
            } catch (error) {
                console.error('Error creating problem:', error);
                alert(`Error: ${error.response?.data?.message || error.message}`);
            }
        };

        return (
            <div className='container mx-auto p-6'>
                <h1 className='text-3xl font-bold mb-6 text-center'>Create a New Problem</h1>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Basic Information */}
                    <div className='card bg-base-100 shadow-lg p-6'>
                        <h2 className='text-xl font-semibold mb-4'>Basic Information</h2>
                        <div className='space-y-4'>
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>Title</span>
                                </label>
                                <input
                                    {...register('title')}
                                    className={`input input-bordered ${errors.title && 'input-error'}`}
                                />
                                {errors.title && (
                                    <span className='text-error'>{errors.title.message}</span>
                                )}
                            </div>

                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>Description</span>
                                </label>
                                <textarea
                                    {...register('description')}
                                    className={`textarea textarea-bordered h-32 ${errors.description && 'textarea-error'}`}
                                ></textarea>
                                {errors.description && (
                                    <span className='text-error'>{errors.description.message}</span>
                                )}
                            </div>

                            <div className='flex gap-4'>
                                <div className='form-control w-1/2'>
                                    <label className='label'>
                                        <span className='label-text'>Difficulty</span>
                                    </label>
                                    <select
                                        {...register('difficulty')}
                                        className={`select select-bordered ${errors.difficulty && 'select-error'}`}
                                    >
                                        <option value='easy'>Easy</option>
                                        <option value='medium'>Medium</option>
                                        <option value='hard'>Hard</option>
                                    </select>
                                    {errors.difficulty && (
                                        <span className='text-error'>{errors.difficulty.message}</span>
                                    )}
                                </div>

                                <div className='form-control w-1/2'>
                                    <label className='label'>
                                        <span className='label-text'>Tags</span>
                                    </label>
                                    <select
                                        {...register('tags')}
                                        className={`select select-bordered ${errors.tags && 'select-error'}`}
                                    >
                                        <option value='array'>Array</option>
                                        <option value='string'>String</option>
                                        <option value='dp'>DP</option>
                                        <option value='math'>Math</option>
                                        <option value='greedy'>Greedy</option>
                                        <option value='tree'>Tree</option>
                                        <option value='graph'>Graph</option>
                                    </select>
                                    {errors.tags && (
                                        <span className='text-error'>{errors.tags.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Test Cases */}
                    <div className='card bg-base-100 shadow-lg p-6'>
                        <h2 className='text-xl font-semibold mb-4'>Test Cases</h2>

                        {/* Visible Test Cases */}
                        <div className='space-y-4 mb-6'>
                            <div className='flex justify-between items-center'>
                                <h3 className='font-medium'>Visible Test Cases</h3>
                                <button
                                    type='button'
                                    className='btn btn-sm btn-primary'
                                    onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                                >
                                    Add Visible Test Case
                                </button>
                            </div>
                            
                            {visibleFields.map((field, index) => (
                                <div key={field.id} className='border p-4 rounded-lg space-y-2'>
                                    <div className='flex justify-end'>
                                        <button
                                            type='button'
                                            className='btn btn-sm btn-error'
                                            onClick={() => removeVisible(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <input
                                        {...register(`visibleTestCases.${index}.input`)}
                                        placeholder='Input'
                                        className='input input-bordered w-full'
                                    />

                                    <input
                                        {...register(`visibleTestCases.${index}.output`)}
                                        placeholder='Output'
                                        className='input input-bordered w-full'
                                    />

                                    <textarea
                                        {...register(`visibleTestCases.${index}.explanation`)}
                                        placeholder='Explanation'
                                        className='textarea textarea-bordered w-full'
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Hidden Test Cases */}
                        <div className='space-y-4'>
                            <div className='flex justify-between items-center'>
                                <h3 className='font-medium'>Hidden Test Cases</h3>
                                <button
                                    type='button'
                                    className='btn btn-sm btn-primary'
                                    onClick={() => appendHidden({ input: '', output: '' })}
                                >
                                    Add Hidden Test Case
                                </button>
                            </div>
                            
                            {hiddenFields.map((field, index) => (
                                <div key={field.id} className='border p-4 rounded-lg space-y-2'>
                                    <div className='flex justify-end'>
                                        <button
                                            type='button'
                                            className='btn btn-sm btn-error'
                                            onClick={() => removeHidden(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <input
                                        {...register(`hiddenTestCases.${index}.input`)}
                                        placeholder='Input'
                                        className='input input-bordered w-full'
                                    />

                                    <input
                                        {...register(`hiddenTestCases.${index}.output`)}
                                        placeholder='Output'
                                        className='input input-bordered w-full'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Code Templates */}
                    <div className='card bg-base-100 shadow-lg p-6'>
                        <h2 className='text-xl font-semibold mb-4'>Code Templates</h2>

                        <div className='space-y-6'>
                            {[0, 1, 2].map((index) => (
                                <div key={index} className='space-y-2'>
                                    <h3 className='font-medium'>
                                        {index === 0 ? 'C++' : index === 1 ? 'JavaScript' : 'Java'}
                                    </h3>

                                    <div className='form-control'>
                                        <label className='label'>
                                            <span className='label-text'>Initial Code</span>
                                        </label>
                                        <pre className='bg-base-300 p-4 rounded-lg'>
                                            <textarea
                                                {...register(`startCode.${index}.initialCode`)}
                                                className='w-full bg-transparent font-mono'
                                                rows={6}
                                            ></textarea>
                                        </pre>
                                    </div>

                                    <div className='form-control'>
                                        <label className='label'>
                                            <span className='label-text'>Reference Solution</span>
                                        </label>
                                        <pre className='bg-base-300 p-4 rounded-lg'>
                                            <textarea
                                                {...register(`referenceSolution.${index}.completeCode`)}
                                                className='w-full bg-transparent font-mono'
                                                rows={6}
                                            ></textarea>
                                        </pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type='submit' className='btn btn-lg btn-primary w-full'>
                        Create Problem
                    </button>
                </form>
            </div>
        );
    }

    export default AdminPanel;