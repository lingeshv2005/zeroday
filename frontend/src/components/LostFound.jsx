import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddLostFoundForm from './AddLostFoundForm';

const LostFoundList = () => {
  const [items, setItems] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchItems = async (type = 'all') => {
    setLoading(true);
    try {
      const endpoint =
        type === 'all'
          ? 'http://localhost:5000/lostfound'
          : `http://localhost:5000/lostfound/${type}`;
      const res = await axios.get(endpoint);
      setItems(res.data.items || []);
    } catch (err) {
      console.error('Error fetching Lost/Found items:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems(filterType);
  }, [filterType]);

  const handleItemAdded = () => {
    setShowForm(false);
    fetchItems(filterType);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">🔎 Lost & Found Items</h2>

      <div className="flex justify-between items-center mb-4">
        <select
          className="border px-3 py-2 rounded-md"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '➕ Add Item'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <AddLostFoundForm onItemAdded={handleItemAdded} />
        </div>
      )}

      {loading ? (
        <p>Loading items...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 italic">No items found.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold text-indigo-700">{item.itemname}</h3>
              <p className="text-gray-700 mb-2">{item.description}</p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Type:</strong> {item.type}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Location:</strong> {item.location}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Updated By:</strong> {item.updatedBy}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Date:</strong>{' '}
                {item.datetime?.seconds
                  ? new Date(item.datetime.seconds * 1000).toLocaleString()
                  : 'N/A'}
              </p>
              {item.images?.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {item.images.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`item-${idx}`}
                      className="rounded-md object-cover h-32 w-full"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LostFoundList;
