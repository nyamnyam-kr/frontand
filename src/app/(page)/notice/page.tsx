"use client";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function showNotice() {
    const [notice, setNotice] = useState<NoticeModel[]>([]);
    const router = useRouter();
    useEffect( () => {
        fetch('http://localhost:8080/api/notice')
            .then((response) => {
                if(!response.ok) {
                    throw new Error("Failed to fetch group details");

                }
                return response.json();
            })
            .then((data) => {
                setNotice(data)
            })
    }, []);

    const moveToOne = (id : number) => {
        router.push(`/notice/details/${id}`)
    }


    return (
        <main className="flex min-h-screen flex-col items-center p-6 bg-gray-100">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                    <tr className="bg-blue-600 text-white">
                        <th className="py-3 px-4 border-b">제목</th>
                        <th className="py-3 px-4 border-b">조회수</th>
                        <th className="py-3 px-4 border-b">작성일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {notice.map((n) => (
                        <tr key={n.id} className=" text-black" onClick={() => moveToOne(n.id)}>
                            <th className="py-3 px-4 border-b">{n.title}</th>
                            <th className="py-3 px-4 border-b">{n.hits}</th>
                            <th className="py-3 px-4 border-b">{n.date}</th>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}