"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { jwtDecode } from 'jwt-decode';
import nookies from 'nookies';

import {authenticateUser} from "@/app/service/user/user.service";

interface DecodedToken {
    sub: string;
    username: string;
    role: string;
    nickname: string;
    exp: number;
}

export default function Home() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = await authenticateUser(username, password);

            console.log('Token:', token);

            const decoded: DecodedToken = jwtDecode<DecodedToken>(token);

            nookies.set(null, 'userId', decoded.sub, { path: '/' });

            localStorage.setItem('token', token);
            localStorage.setItem('nickname', decoded.nickname);
            localStorage.setItem('username', decoded.username);
            localStorage.setItem('role', decoded.role);
            

            // 홈 페이지로 이동
            router.push("/");
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage('Invalid username or password');
        }
    };


    return (
        <div className="login-block md:py-20 py-10 mt-10" style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
            <div className="container">
                <div className="content-main flex gap-y-8 max-md:flex-col">
                    <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line p-5">
                        <div className="heading4 text-xl text-center">로그인</div>
                        <form className="md:mt-7 mt-4" onSubmit={handleLogin}>
                            <div className="username">
                                <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="username"
                                       type="username" placeholder="username" required
                                       value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="pass mt-5">
                                <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="password"
                                       type="password" placeholder="Password *" required
                                       value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="flex items-center justify-between mt-5">
                                <div className='flex items-center'>
                                    <div className="block-input">
                                        <input type="checkbox" name='remember' id='remember' />
                                        <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                    </div>
                                    <label htmlFor='remember' className="pl-2 cursor-pointer">로그인 유지</label>
                                </div>
                                <Link href={'/forgot-password'} className='font-semibold hover:underline'>비밀번호를 잊어버리셨나요?</Link>
                            </div>
                            <div className="block-button md:mt-7 mt-4">
                                <button type="submit" className="button-main">로그인</button>
                            </div>
                        </form>
                    </div>
                    <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center p-5">
                        <div className="text-content">
                            <div className="heading4">New Customer</div>
                            <div className="mt-2 text-secondary">Be part of our growing family of new customers! Join us
                                today and unlock a world of exclusive benefits, offers, and personalized experiences.
                            </div>
                            <div className="block-button md:mt-7 mt-4">
                                <Link href={'/user/register'} className="button-main">회원가입</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



// <div className="flex items-center justify-center h-screen">
//     <div className="w-full max-w-xs">
//         <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//             <h2 className="text-center text-2xl mb-4">Login</h2>
//             {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//             <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
//                     Username
//                 </label>
//                 <input
//                     id="username"
//                     type="text"
//                     placeholder="Enter your username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//             </div>
//             <div className="mb-6">
//                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//                     Password
//                 </label>
//                 <input
//                     id="password"
//                     type="password"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//             </div>
//             <div className="flex items-center justify-between">
//                 <button
//                     type="submit"
//                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                 >
//                     Login
//                 </button>
//                 <button
//                     type="button" // form submission이 아닌 버튼 클릭으로 처리
//                     onClick={handleRegister}
//                     className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
//                 >
//                     Register
//                 </button>
//             </div>
//         </form>
//     </div>
// </div>
