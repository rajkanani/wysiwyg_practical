import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import WysiwygEditor from '../../components/WysiwygEditor';


export default function EditPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            setTitle(data.title);
            setContent(data.content);
        } catch (error) {
            setError('Failed to load post details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, title, content }),
            });
            if (!response.ok) throw new Error('Failed to update post');
            alert('Post updated successfully!');
            router.push(`/post/${id}`);
        } catch (error) {
            alert('Error updating post');
            console.error(error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='editPostContainer'>
            <h1 className='editPostTitle'>Edit Post</h1>
            <form onSubmit={handleUpdate}>
                <div className='formGroup'>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className='formInput' />
                </div>
                <div className='formGroup'>
                    <label>Content</label>
                    <WysiwygEditor value={content}
                        onChange={setContent}
                        className="wysiwygEditor" />
                </div>
                <label>Preview</label>
                <div className='previewContent' dangerouslySetInnerHTML={{ __html: content }} />
                <button type="submit" className='button buttonPrimary'>
                    Update Post
                </button>
            </form>
            <button onClick={() => router.push(`/post/${id}`)} className='button buttonCancel'>
                Cancel
            </button>
        </div>
    );
}
