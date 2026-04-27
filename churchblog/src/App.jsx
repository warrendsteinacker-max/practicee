import React, { useState } from 'react';

function App() {
  // States for Blog Post
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [postLoading, setPostLoading] = useState(false);

  // States for Slack Invite
  const [email, setEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  // Function: Handle Blog Post Submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setPostLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      alert(data.message || data.error);
      if (response.ok) setFormData({ title: '', content: '' }); // Clear form on success
    } catch (err) {
      alert("System Error: Could not connect to backend.");
    } finally {
      setPostLoading(false);
    }
  };

  // Function: Handle Slack Invite Submission
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setInviteLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      alert(data.message || data.error);
      if (response.ok) setEmail(''); // Clear email on success
    } catch (err) {
      alert("System Error: Could not connect to backend.");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      
      {/* SECTION 1: CREATE BLOG POST */}
      <section style={{ marginBottom: '50px', borderBottom: '2px solid #eee', paddingBottom: '30px' }}>
        <h2>Create a New Post</h2>
        <form onSubmit={handlePostSubmit}>
          <input 
            type="text" 
            placeholder="Post Title"
            value={formData.title}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required 
          />
          <textarea 
            placeholder="What's on your mind?"
            value={formData.content}
            style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
          />
          <button 
            type="submit" 
            disabled={postLoading}
            style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
          >
            {postLoading ? 'Triggering Deploy...' : 'Publish Post'}
          </button>
        </form>
      </section>

      {/* SECTION 2: REQUEST SLACK INVITE */}
      <section>
        <h2 style={{ color: '#4A154B' }}>Request Slack Invite</h2>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Enter your email to join our Slack community.</p>
        <form onSubmit={handleInviteSubmit}>
          <input 
            type="email" 
            placeholder="your-email@example.com"
            value={email}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <button 
            type="submit" 
            disabled={inviteLoading}
            style={{ width: '100%', padding: '10px', backgroundColor: '#4A154B', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
          >
            {inviteLoading ? 'Sending Request...' : 'Request Invite'}
          </button>
        </form>
      </section>

    </div>
  );
}

export default App;