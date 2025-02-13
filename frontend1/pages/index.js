import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import '../styles/globals.css'

export default function Dashboard() {
    const [posts, setPosts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        axios.get('http://localhost:5000/posts')  // Replace with your Express API URL
            .then(res => {
                setPosts(res.data)
            })
            .catch(err => console.error(err));
    }, []);

    function deletePost(id) {
        axios.delete(`http://localhost:5000/posts/${id}`)
            .then(() => setPosts(posts.filter(post => post.id !== id)))
            .catch(err => console.error(err));
    }


    return (
        <div className="table-container">
            <div className='table-header'>
                <h1>Dashboard</h1>
                <Link href="/create"><button className='btn-outline'>Create New Post</button></Link>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Post</th>
                        <th>Slug</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.length == 0 && (
                        <tr>
                            <td colSpan={3}>No Post Found</td>
                        </tr>
                    )}
                    {posts.map(post => (
                        <tr key={post.id}>
                            <td>
                                <Link href={`/post/${post.id}`}>{post.title}</Link>
                            </td>
                            <td>
                                <Link href={`/post/${post.id}`}>{post.slug}</Link>
                            </td>
                            <td>
                                <button className='' onClick={() => router.push(`/edit/${post.id}`)}>Edit</button>
                                <button className="btn-danger" onClick={() => deletePost(post.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
}
