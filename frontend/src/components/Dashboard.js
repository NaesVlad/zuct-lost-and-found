import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('lost');
  const [location, setLocation] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [image, setImage] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    fetchItems();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/items');
      setItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('status', status);
      formData.append('location', location);
      formData.append('contact_info', contactInfo);
      if (image) formData.append('image', image);

      await axios.post('http://localhost:5000/api/items', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      showToast('✅ Item posted successfully!');
      setTitle(''); setDescription(''); setCategory('');
      setLocation(''); setContactInfo(''); setImage(null);
      fetchItems();
    } catch (error) {
      showToast('❌ Error posting item');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'lost' ? 'found' : 'lost';
    try {
      await axios.put(`http://localhost:5000/api/items/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`✅ Status updated to ${newStatus}!`);
      fetchItems();
    } catch (error) {
      showToast('❌ Not authorized to update this item');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('✅ Item deleted!');
      fetchItems();
    } catch (error) {
      showToast('❌ Not authorized to delete this item');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const filteredItems = items.filter(item => {
    return (
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterCategory === '' || item.category === filterCategory) &&
      (filterStatus === '' || item.status === filterStatus)
    );
  });

  const totalLost = items.filter(i => i.status === 'lost').length;
  const totalFound = items.filter(i => i.status === 'found').length;

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e0e6f0', fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#1e3a5f', color: 'white', padding: '12px 20px', borderRadius: '8px', zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.3)', border: '1px solid #2a5298' }}>
          {toast}
        </div>
      )}

      {/* Navbar */}
      <nav style={{ background: '#0d1b2e', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e3a5f', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🔍</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#4a9eff' }}>ZUCT Lost & Found</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#a0b4c8' }}>👤 {user?.name}</span>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'transparent', color: '#4a9eff', border: '1px solid #4a9eff', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
          {[
            { label: 'Total Items', value: items.length, color: '#4a9eff', icon: '📋' },
            { label: 'Lost Items', value: totalLost, color: '#ff6b6b', icon: '❌' },
            { label: 'Found Items', value: totalFound, color: '#51cf66', icon: '✅' },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#0d1b2e', border: `1px solid ${stat.color}33`, borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px' }}>{stat.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
              <div style={{ color: '#a0b4c8', fontSize: '14px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '25px' }}>

          {/* Form */}
          <div style={{ background: '#0d1b2e', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '25px' }}>
            <h3 style={{ color: '#4a9eff', marginBottom: '20px', fontSize: '18px' }}>📝 Report Item</h3>
            <form onSubmit={handleSubmit}>
              {[
                { placeholder: 'Item Title *', value: title, setter: setTitle, type: 'text' },
                { placeholder: 'Contact Info (phone/email) *', value: contactInfo, setter: setContactInfo, type: 'text' },
              ].map((field, i) => (
                <input key={i} type={field.type} placeholder={field.placeholder} value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: '12px', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '6px', color: '#e0e6f0', boxSizing: 'border-box' }}
                  required />
              ))}
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '12px', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '6px', color: '#e0e6f0', minHeight: '80px', boxSizing: 'border-box' }} />
              
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '12px', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '6px', color: '#e0e6f0' }}>
                <option value="">Select Category</option>
                {['Phone', 'Wallet', 'Keys', 'Bag', 'Laptop', 'ID Card', 'Clothing', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>

              <select value={status} onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '12px', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '6px', color: '#e0e6f0' }}>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>

              <select value={location} onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '12px', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '6px', color: '#e0e6f0' }}>
                <option value="">Select Campus Location</option>
                {['Library', 'Cafeteria', 'Block A', 'Block B', 'Block C', 'Computer Lab', 'Reception', 'Parking Lot', 'Sports Field', 'Other'].map(l => <option key={l}>{l}</option>)}
              </select>

              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}
                style={{ width: '100%', padding: '10px', marginBottom: '12px', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '6px', color: '#a0b4c8', boxSizing: 'border-box' }} />

              <button type="submit"
                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #1a6bc4, #4a9eff)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                Post Item
              </button>
            </form>
          </div>

          {/* Items List */}
          <div>
            {/* Search and Filter */}
            <div style={{ background: '#0d1b2e', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <input placeholder="🔍 Search items..." value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '6px', color: '#e0e6f0', marginBottom: '10px', boxSizing: 'border-box' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                  style={{ padding: '8px', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '6px', color: '#e0e6f0' }}>
                  <option value="">All Categories</option>
                  {['Phone', 'Wallet', 'Keys', 'Bag', 'Laptop', 'ID Card', 'Clothing', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ padding: '8px', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '6px', color: '#e0e6f0' }}>
                  <option value="">All Status</option>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>
            </div>

            {/* Items */}
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredItems.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#a0b4c8', padding: '40px' }}>No items found</div>
              ) : filteredItems.map(item => (
                <div key={item.id} style={{ background: '#0d1b2e', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '20px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, color: '#e0e6f0' }}>{item.title}</h4>
                        <span style={{ background: item.status === 'lost' ? '#ff6b6b22' : '#51cf6622', color: item.status === 'lost' ? '#ff6b6b' : '#51cf66', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', border: `1px solid ${item.status === 'lost' ? '#ff6b6b' : '#51cf66'}` }}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      {item.image_url && (
                        <img src={`http://localhost:5000${item.image_url}`} alt={item.title}
                          style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                      )}
                      <p style={{ color: '#a0b4c8', margin: '4px 0', fontSize: '14px' }}>{item.description}</p>
                      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {item.category && <span style={{ color: '#4a9eff', fontSize: '13px' }}>🏷️ {item.category}</span>}
                        {item.location && <span style={{ color: '#a0b4c8', fontSize: '13px' }}>📍 {item.location}</span>}
                        {item.contact_info && <span style={{ color: '#a0b4c8', fontSize: '13px' }}>📞 {item.contact_info}</span>}
                        <span style={{ color: '#a0b4c8', fontSize: '13px' }}>👤 {item.posted_by}</span>
                        <span style={{ color: '#a0b4c8', fontSize: '13px' }}>🕐 {timeAgo(item.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  {user?.id === item.user_id && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                      <button onClick={() => handleStatusToggle(item.id, item.status)}
                        style={{ padding: '6px 14px', background: item.status === 'lost' ? '#51cf6622' : '#ff6b6b22', color: item.status === 'lost' ? '#51cf66' : '#ff6b6b', border: `1px solid ${item.status === 'lost' ? '#51cf66' : '#ff6b6b'}`, borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                        {item.status === 'lost' ? '✅ Mark as Found' : '❌ Mark as Lost'}
                      </button>
                      <button onClick={() => handleDelete(item.id)}
                        style={{ padding: '6px 14px', background: '#ff6b6b22', color: '#ff6b6b', border: '1px solid #ff6b6b', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;