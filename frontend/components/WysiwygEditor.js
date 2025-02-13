import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function WysiwygEditor({ value, onChange }) {

    const insertCustomForm = () => {
        const formHtml = `
          <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
            <form>
                <label>Name: <input type="text" placeholder="Enter your name" /></label><br/>
                <label>Email: <input type="email" placeholder="Enter your email" /></label><br/>
                <button type="submit">Submit</button>
            </form>
          </div>
        `;
        onChange(value + formHtml)
    };

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
                ["custom-form"],
            ],
        },
    };

    return (
        <div>
            <button
                style={{ marginTop: "10px", padding: "10px 20px", cursor: "pointer" }}
                onClick={() => insertCustomForm()}
            >
                Insert Custom Form
            </button>
            <ReactQuill
                value={value}
                onChange={onChange}
                modules={modules}
                placeholder={"Write something awesome..."}
                theme="snow"
            />
        </div>
    );
}
