import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const CreateAnnouncement = () => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    docs: [],
    updatedBy: '',
    Category: 'exam',
  });

  const [files, setFiles] = useState([]); // multiple files
  const [message, setMessage] = useState('');
  const [searchCategory, setSearchCategory] = useState('exam');
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Set updatedBy from Firebase user
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      if (user) {
        setForm(prev => ({
          ...prev,
          updatedBy: user.displayName || user.email,
        }));
      }
    });
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileSelect = (e) => {
    setFiles(Array.from(e.target.files)); // convert FileList to Array
  };

  const uploadFilesToCloudinary = async () => {
    const uploadedUrls = [];

    const sigRes = await axios.get('http://localhost:5000/api/signature');
    const { signature, timestamp, folder, api_key, cloud_name } = sigRes.data;

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', api_key);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`;

      const uploadRes = await axios.post(cloudinaryUrl, formData);
      uploadedUrls.push(uploadRes.data.secure_url);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setUploading(true);

    try {
      let uploadedUrls = [];

      // Upload files if any
      if (files.length > 0) {
        uploadedUrls = await uploadFilesToCloudinary();
      }

      // Update form with uploaded file URLs
      const finalForm = {
        ...form,
        docs: uploadedUrls,
      };

      await axios.post('http://localhost:5000/announcements', finalForm);
      setMessage('✅ Announcement created successfully!');

      // Reset form
      setForm({
        title: '',
        content: '',
        docs: [],
        updatedBy: form.updatedBy,
        Category: 'exam',
      });
      setFiles([]);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to create announcement.');
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Create Announcement</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <select
          name="Category"
          value={form.Category}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md"
        >
          <option value="exam">Exam</option>
          <option value="holiday">Holiday</option>
          <option value="event">Event</option>
        </select>

        {/* File input */}
        <div className="space-y-2">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.png,.jpg"
            onChange={handleFileSelect}
            className="block w-full"
          />
          {files.length > 0 && (
            <ul className="text-sm text-green-700 list-disc pl-5">
              {files.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          {uploading ? 'Uploading...' : 'Submit Announcement'}
        </button>
      </form>

      {message && <p className="mt-4 text-center font-medium">{message}</p>}
    </div>
  );
};

export default CreateAnnouncement;
