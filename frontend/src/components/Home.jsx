import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  // Fetch all announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get('http://localhost:5000/announcements');
        setAnnouncements(res.data.announcements || []);
        setFilteredAnnouncements(res.data.announcements || []);
      } catch (err) {
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Filter announcements based on selected category
  useEffect(() => {
    if (category === 'all') {
      setFilteredAnnouncements(announcements);
    } else {
      const filtered = announcements.filter(a => a.Category === category);
      setFilteredAnnouncements(filtered);
    }
  }, [category, announcements]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">📢 Latest Announcements</h2>
          <div className="mb-4">
          <label className="mr-2 text-gray-700 font-medium">Filter by Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="all">All</option>
            <option value="exam">Exam</option>
            <option value="holiday">Holiday</option>
            <option value="event">Event</option>
          </select>
        </div>
        </div>


        {loading ? (
          <p className="text-gray-600">Loading announcements...</p>
        ) : filteredAnnouncements.length === 0 ? (
          <p className="text-gray-500 italic">No announcements found for selected category.</p>
        ) : (
          <div className="space-y-4">
            {filteredAnnouncements.map((a, idx) => (
              <div
                key={idx}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-blue-700 mb-1">{a.title}</h3>
                <p className="text-gray-700 mb-2">{a.content}</p>
                <div className="text-sm text-gray-500">
                  <p><span className="font-medium">Category:</span> {a.Category}</p>
                  <p><span className="font-medium">Updated By:</span> {a.updatedBy}</p>
                  <p><span className="font-medium">Date:</span> {new Date(a.timestamp?.seconds * 1000).toLocaleString()}</p>
                </div>
                {a.docs?.length > 0 && (
                  <div className="mt-2">
                    <strong className="text-gray-700">Attachments:</strong>
                    <ul className="list-disc pl-6 text-sm text-blue-600">
                      {a.docs.map((doc, i) => (
                        <li key={i}>
                          <a href={doc} target="_blank" rel="noreferrer" className="underline">
                            Document {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
