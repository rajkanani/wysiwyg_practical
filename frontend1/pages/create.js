import { useState } from 'react';
import axios from 'axios';
import WysiwygEditor from '../components/WysiwygEditor';
import { useRouter } from 'next/router';

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();

    const handleSubmit = () => {
        axios.post('http://localhost:5000/posts/create', { title, content })
            .then(() => router.push('/'))
            .catch(err => console.error(err));
    };

    return (
        <div className='editPostContainer'>
            <h1 className='editPostTitle'>Create New Post</h1>
            <div>
                <div className='formGroup'>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className='formInput'
                    />
                </div>
                <div className='formGroup'>
                    <label>Content</label>
                    <WysiwygEditor value={content}
                        onChange={(enu) => {
                            setContent(enu);
                        }}
                        className="wysiwygEditor"
                    />
                </div>
                <div className='previewContent' dangerouslySetInnerHTML={{ __html: content }} />
                <button onClick={() => handleSubmit()} className='button buttonPrimary'>
                    Create Post
                </button>
            </div>
            <button onClick={() => router.push(`/`)} className='button buttonCancel'>
                Cancel
            </button>
        </div>

    );
}
