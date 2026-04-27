import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      alert(data.message || data.error);
    } catch (err) {
      alert("System Error: Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Post Title"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required 
        />
        <textarea 
          placeholder="What's on your mind?"
          style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '10px' }}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Triggering Deploy...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}

export default App;