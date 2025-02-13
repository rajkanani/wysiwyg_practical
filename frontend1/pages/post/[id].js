import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PostDetail() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await fetch(`http://localhost:5000/posts/${id}`);
            if (!response.ok) throw new Error('Failed to fetch post');
            const data = await response.json();
            setPost(data);
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!post) return <p>Post not found.</p>;

    return (
        <div className='postContainer'>
            <h1 className='postTitle'>{post.title}</h1>
            <p className='postMeta'><i>Slug: {post.slug}</i></p>
            <div className='postContent' dangerouslySetInnerHTML={{ __html: post.content }} />
            <button onClick={() => router.push('/')}>Back to Home</button>
        </div>
    );
}
