"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import Star from "../../star/page";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { getLikeCount, hasLikedPost, likePost, unLikePost } from "../../upvote/page";

export default function PostList() {
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [restaurant, setRestaurant] = useState<RestaurantModel | null>(null);
    const [images, setImages] = useState<{ [key: number]: string[] }>({});
    const [likedPost, setLikedPosts] = useState<number[]>([]);
    const [likeCount, setLikeCounts] = useState<{ [key: number]: number }>({});
    const currentUserId = 1; // giveId : 테스트로 1값 설정 
    const router = useRouter();
    const { restaurantId } = useParams();

    useEffect(() => {
        if (restaurantId) {
            fetchPosts();
            fetchRestaurant();
        }
    }, [restaurantId]);

    const fetchPosts = () => {
        fetch(`http://localhost:8080/api/posts/${restaurantId}/group`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(async (data) => {
                setPosts(data);

                const likeStatus = data.map(async (post: PostModel) => {
                    const liked = await checkLikedStatus(post.id);
                    const count = await getLikeCount(post.id);
                    await fetchImage(post.id);
                    return { postId: post.id, liked, count };
                });

                const result = await Promise.all(likeStatus)

                const likedPostId = result
                    .filter(result => result.liked)
                    .map(result => result.postId);

                const likeCountMap = result.reduce((acc, result) => {
                    acc[result.postId] = result.count;
                    return acc;
                }, {} as { [key: number]: number });

                setLikedPosts(likedPostId);
                setLikeCounts(likeCountMap);
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    };

    const fetchRestaurant = () => {
        fetch(`http://localhost:8080/api/restaurant/${restaurantId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Restaurant fetch fail')
                }
                return response.json();
            })
            .then(async (data) => {
                setRestaurant(data);
            })
    };

    const fetchImage = (postId: number) => {
        fetch(`http://localhost:8080/api/images/post/${postId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Image fetch fail')
                }
                return response.json();
            })
            .then(async (data) => {
                console.log("이미지 데이터: ", data);
                const imageURLs = data.map((image: any) => image.uploadURL);
                console.log('이미지 경로:', imageURLs);
                setImages(prevImages => ({
                    ...prevImages,
                    [postId]: imageURLs,
                }));
            })
    }

    const handleDetails = (id: number) => {
        router.push(`/post/${restaurantId}/details/${id}`);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
        const formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(date);

        const [year, month, day] = formattedDate.split('.').map(part => part.trim());
        return `${year}년 ${month}월 ${day}일`;
    };

    const checkLikedStatus = async (postId: number) => {
        const upvote: UpvoteModel = {
            id: 0,
            giveId: currentUserId,
            haveId: 0,
            postId: postId
        }
        return await hasLikedPost(upvote) ? postId : null;
    };

    const handleLike = async (postId: number) => {
        const upvote: UpvoteModel = {
            id: 0,
            giveId: currentUserId,
            haveId: 0,
            postId: postId
        };

        if (likedPost.includes(postId)) {
            setLikedPosts(prevLikedPosts => prevLikedPosts.filter(id => id !== postId));
            setLikeCounts(prevCounts => ({
                ...prevCounts,
                [postId]: Math.max((prevCounts[postId] || 0) - 1, 0)
            }));

            const success = await unLikePost(upvote);
            if (!success) {
                setLikedPosts(prevLikedPosts => [...prevLikedPosts, postId]);
                setLikeCounts(prevCounts => ({
                    ...prevCounts,
                    [postId]: (prevCounts[postId] || 0) + 1
                }));
            }
        } else {
            setLikedPosts(prevLikedPosts => [...prevLikedPosts, postId]);
            setLikeCounts(prevCounts => ({
                ...prevCounts,
                [postId]: (prevCounts[postId] || 0) + 1
            }));

            const success = await likePost(upvote);
            if (!success) {
                setLikedPosts(prevLikedPosts => prevLikedPosts.filter(id => id !== postId));
                setLikeCounts(prevCounts => ({
                    ...prevCounts,
                    [postId]: Math.max((prevCounts[postId] || 0) - 1, 0)
                }));
            }
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-6 bg-gray-100">
            <div className="w-full flex justify-end mb-4">
                <button
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-2"
                    onClick={() => router.push(`/post/register/${restaurantId}`)}>
                    등록하기
                </button>
                <button
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-2"
                    onClick={() => router.push(`/restaurant/${restaurantId}`)}>
                    뒤로가기
                </button>
            </div>

            {restaurant && (
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-4">
                    <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                </div>
            )}

            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
                <div className="flex flex-col space-y-4">
                    {posts.map((p) => (
                        <div key={p.id} className="flex flex-col md:flex-row border border-indigo-600 rounded-lg p-4 shadow-lg bg-white">
                            <div className="md:w-full">
                                <div onClick={(e) => {
                                    e.stopPropagation();
                                    handleDetails(p.id ?? 0);
                                }}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-xl font-semibold mb-2">닉네임: {p.nickname}</h2>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLike(p.id)
                                            }
                                            }
                                            className="flex items-center text-black rounded-lg py-2 px-4"
                                        >
                                            <FontAwesomeIcon
                                                icon={likeCount[p.id] > 0 ? solidHeart : regularHeart}
                                                style={{ color: likeCount[p.id] > 0 ? 'pink' : 'gray' }}
                                            />
                                            <span className="ml-2">{likeCount[p.id] || 0}</span>
                                        </button>
                                    </div>
                                    <div className="inline-flex space-x-2 mb-2">
                                        <Star w="w-4" h="h-4" readonly={true} rate={p.averageRating} />
                                        <h1>{p.averageRating.toFixed(1)} / 5</h1>
                                    </div>
                                    <div className="mb-2">
                                        <p className="text-gray-700">{p.content}</p>
                                    </div>
                                    <div className="flex flex-col space-y-2 mb-2">
                                        <div className="inline-flex space-x-2">
                                            <p>맛: </p>
                                            <Star w="w-4" h="h-4" readonly={true} rate={p.taste} />
                                        </div>
                                        <div className="inline-flex space-x-2">
                                            <p>청결: </p>
                                            <Star w="w-4" h="h-4" readonly={true} rate={p.clean} />
                                        </div>
                                        <div className="inline-flex space-x-2">
                                            <p>서비스: </p>
                                            <Star w="w-4" h="h-4" readonly={true} rate={p.service} />
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        {images[p.id] && images[p.id].length > 0 ? (
                                            <div className="flex flex-wrap gap-4">
                                                {images[p.id].map((url, index) => (
                                                    <img
                                                        key={index}
                                                        src={url}
                                                        alt={`이미지 ${index + 1}`}
                                                        className="w-48 h-auto rounded-lg shadow-lg"
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <p>이미지 없음</p>
                                        )}
                                    </div>
                                    <div className="mb-2 flex items-center">
                                        <h2 className="text-lg font-bold mb-2 flex-shrink-0 self-center">태그:</h2>
                                        {p.tags && p.tags.length > 0 ? (
                                            <ul className="flex flex-wrap gap-2 ml-2 items-center">
                                                {p.tags.map((tag, index) => (
                                                    <li
                                                        key={index}
                                                        className="rounded-full border border-sky-100 bg-sky-50 px-2 py-1 text-sky-700"
                                                    >
                                                        {tag}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="ml-2">태그 없음</p>
                                        )}
                                    </div>
                                    <div className="mb-2">
                                        <p>작성일: {formatDate(p.entryDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}