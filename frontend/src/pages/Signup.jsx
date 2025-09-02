import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { registerUser } from '../authSlice';
import { useEffect, useState } from 'react';

// SchemaValidation for signup form
const signupSchema = z.object({
  firstName: z.string().min(3,'Minimun characters should be 3'),
  emailId: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password is too weak' ),
});

function Signup() {

    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isAuthenticated, loading} = useSelector((state) => state.auth);

    const {register, handleSubmit, formState: { errors },} = useForm({resolver:zodResolver(signupSchema)});

    useEffect(() => {
        if(isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated]);

    const onSubmit = (data) => {
        dispatch(registerUser(data));
    };

    return (
        <div className='min-h-screen flex items-center justify-center p-4'> {/* Centering the container */}
            <div className='card w-96 bg-base-100 shadow-xl'> {/* Exixting card style */}
                <div className='card-body'>
                    <h2 className='card-title justify-center text-3xl'>Leetcode</h2> {/* Centered title */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Existing form fields */}
                        <div className='form-control'>
                            <label className='label mb-1'>
                                <span className='label-text'>First Name</span>
                            </label>
                            <input
                                type='text'
                                placeholder='Anuj'
                                className={`input input-bordered ${errors.firstName && 'input-error'}`}
                                {...register('firstName')}
                            />
                            {errors.firstName && (
                                <span className='text-error'>{errors.firstName.message}</span>
                            )}
                        </div>

                        <div className='form-control mt-4'>
                            <label className='label mb-1'>
                                <span className='label-text'>Email</span>
                            </label>
                            <input
                                type='email'
                                placeholder='anuj@example.com'
                                className={`input input-bordered ${errors.emailId && 'input-error'}`}
                                {...register('emailId')}
                            />
                            {errors.emailId && (
                                <span className='text-error'>{errors.emailId.message}</span>
                            )}
                        </div>

                        <div className='form-control mt-4 relative'>
                            <label className='label mb-1'>
                                <span className='label-text'>Password</span>
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='*********'
                                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`} 
                                {...register('password')}
                            />
                            <button
                                type='button'
                                className='absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 focus:outline-nonex`'
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.705 4.034 5.642 7.043 10.07 7.043 1.762 0 3.43-.443 4.878-1.225M6.228 6.228A10.477 10.477 0 0112.004 4.5c4.428 0 8.365 3.01 10.07 7.043a10.523 10.523 0 01-4.17 4.722M6.228 6.228L3 3m3.228 3.228l12.544 12.544" />
                                </svg>
                                )}
                            </button>
                    
                            {errors.password && (
                                <span className='text-error mt-1 text-sm'>{errors.password.message}</span>
                            )}
                        </div>

                        <div className='form-control mt-6 flex justify-center'>
                            <button
                                type='submit'
                                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>

                    {/* Link to navigate to login page if user already has an account */}
                    <div className='mt-6 text-center'>
                        <span className='text-sm'>
                            Already have an account?{' '}
                            <button
                                className='text-primary font-semibold hover:underline'
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                        </span>
                    </div>

                </div>
            </div>
        </div>        
    );
}

export default Signup;



// <form onSubmit={handleSubmit(onSubmit)}>
//   <input {...register('firstName')} placeholder='Enter your firstName' />
//   {errors.firstName && <p>{errors.firstName.message}</p>}
//   <input {...register('emailId')} placeholder='Enter your Email'/>
//     {errors.emailId && <p>{errors.emailId.message}</p>}
//   <input {...register('password')} placeholder='Enter your Password' type='password'/>
//     {errors.password && <p>{errors.password.message}</p>}
//   <button type="submit" className='btn btn-lg'>Submit</button>
// </form>




// import { useState } from "react";


// const {name, setName} = useState("");
// const {email, setEmail} = useState("");
// const {password, setPassword} = useState("");

// const handleSubmit = (e) => {
//     e.preventDefault();

//     //Form validation

//     //Form submission logic here
// }

// const Signup = () => {
//     return (
//         <form onSubmit={handleSubmit}>
//             <input type="text" placeholder="Enter your firstName" value={name} onChange={(e) => setName(e.target.value)} required />
//             <input type="email" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//             <input type="password" placeholder="Enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//             <button type="submit">Sign Up</button>  
//         </form>
//     )
// }

// export default Signup; 