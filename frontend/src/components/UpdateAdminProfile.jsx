import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const UpdateAdminProfile = ({ onUpdateSuccess }) => {
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    year: '',
    role: '',
    photoURL: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchAdminProfile = async (uid, token) => {
    try {
      const res = await axios.get(`http://localhost:5000/admin/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const adminData = res.data.admin;
      setAdmin(adminData);
      setFormData({
        name: adminData.name || '',
        department: adminData.department || '',
        year: adminData.year || '',
        role: adminData.role || '',
        photoURL: adminData.photoURL || ''
      });
    } catch (error) {
      console.error('❌ Failed to fetch admin profile:', error);
      setMessage('Failed to fetch profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = authInstance.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        fetchAdminProfile(user.uid, token);
      } else {
        setMessage('User not authenticated');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const uploadToCloudinary = async (file) => {
    // Step 1: Get signed signature from backend
    const { data: sigData } = await axios.get("http://localhost:5000/api/signature");
    const { signature, timestamp, folder, api_key, cloud_name } = sigData;

    // Step 2: Prepare form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    // Step 3: Upload using unsigned Axios (no Authorization header)
    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return uploadRes.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin?.uid) return;

    const authInstance = getAuth();
    const user = authInstance.currentUser;
    const token = await user.getIdToken();

    let updatedData = { ...formData };

    if (imageFile) {
      try {
        const cloudUrl = await uploadToCloudinary(imageFile);
        updatedData.photoURL = cloudUrl;
      } catch (err) {
        console.error('❌ Cloudinary upload failed:', err);
        setMessage('Image upload to Cloudinary failed ❌');
        return;
      }
    }

    try {
      await axios.put(
        `http://localhost:5000/admin/${admin.uid}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessage('✅ Profile updated successfully');

      // Refresh updated profile
      const res = await axios.get(`http://localhost:5000/admin/${admin.uid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdateSuccess(res.data.admin);
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      setMessage('Failed to update profile ❌');
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Update Admin Profile</h2>
      {message && <p className="mb-3 text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Department (e.g. CSE)"
          className="w-full p-2 border rounded"
        />
        <input
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Year (e.g. 2025)"
          className="w-full p-2 border rounded"
        />
        <input
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role (e.g. Super Admin)"
          className="w-full p-2 border rounded"
        />
        <div>
          <label className="block mb-1">Profile Picture</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full"
          />
          {formData.photoURL && (
            <img
              src={formData.photoURL}
              alt="Profile Preview"
              className="mt-3 w-32 h-32 object-cover rounded-full"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateAdminProfile;
