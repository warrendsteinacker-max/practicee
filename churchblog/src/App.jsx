import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [postLoading, setPostLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  // Grab the link from your root .env (prefixed with VITE_)
  const SLACK_LINK = import.meta.env.VITE_SLACK_INVITE_LINK;

  console.log("Slack Link:", SLACK_LINK);

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
      if (response.ok) setFormData({ title: '', content: '' });
    } catch (err) {
      alert("System Error: Could not connect to backend.");
    } finally {
      setPostLoading(false);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // AUTOMATIC FLOW: Backend allowed it, so we show the link
        alert(`Success! Join our Slack here:`);
        setEmail('');
      } else {
        const data = await response.json();
        alert(data.error || "Invitations are currently closed.");
      }
    } catch (err) {
      alert("System Error: Could not connect to backend.");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      
      <section style={{ marginBottom: '50px', borderBottom: '2px solid #eee', paddingBottom: '30px' }}>
        <h2>Create a New Post</h2>
        <form onSubmit={handlePostSubmit}>
          <input 
            type="text" 
            placeholder="Post Title"
            value={formData.title}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required 
          />
          <textarea 
            placeholder="What's on your mind?"
            value={formData.content}
            style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '10px' }}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
          />
          <button type="submit" disabled={postLoading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
            {postLoading ? 'Triggering Deploy...' : 'Publish Post'}
          </button>
        </form>
      </section>

      <section>
        <h2 style={{ color: '#4A154B' }}>Request Slack Invite</h2>
        <form onSubmit={handleInviteSubmit}>
          <input 
            type="email" 
            placeholder="your-email@example.com"
            value={email}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <button type="submit" disabled={inviteLoading} style={{ width: '100%', padding: '10px', backgroundColor: '#4A154B', color: 'white', border: 'none', cursor: 'pointer' }}>
            {inviteLoading ? 'Verifying...' : 'Request Invite'}
          </button>
        </form>
      </section>

    </div>
  );
}

export default App;