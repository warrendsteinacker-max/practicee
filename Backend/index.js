class C {

    constructor(age, gender){
        this.age = age;
        this.gender = gender;
    }

    set age(val){
        if(val < 18){
            console.log("too young");
        }
        else{
            this.age = val;
        }
    }

    get age(val){
        return this.age;
    }

}

const man = new C(11, "male")






const path = require("path");
// Ensures the backend can find the .env file in the PRA root
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const { Octokit } = require("@octokit/core");

const app = express();

// Updated CORS to allow your GitHub Pages site specifically
app.use(cors({
  origin: 'https://warrendsteinacker-max.github.io',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// Log status on startup
console.log("Token Loaded:", process.env.GITHUB_TOKEN ? "YES" : "NO (Check Vercel Env Variables)");

const REPO_OWNER = 'warrendsteinacker-max';
const REPO_NAME = 'practicee';

/**
 * SETTINGS
 */
const ALLOW_INVITES = true; 

/**
 * Helper to trigger GitHub Actions
 */
async function triggerGithubAction(eventType, payload) {
  try {
    await octokit.request(`POST /repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
      event_type: eventType, 
      client_payload: payload
    });
    console.log(`🚀 GitHub Action (${eventType}) successfully triggered!`);
    return true;
  } catch (error) {
    console.error("❌ GitHub API Error:", error.message);
    return false;
  }
}

/**
 * Route: Slack Invite Request
 */
app.post('/api/invite', async (req, res) => {
  const { email } = req.body;

  if (!ALLOW_INVITES) {
    return res.status(403).json({ error: "Invitations are currently disabled." });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: "A valid email is required." });
  }

  const success = await triggerGithubAction('slack_invite', { 
    email: email,
    timestamp: new Date().toISOString() 
  });

  if (success) {
    res.status(200).json({ message: "Invite request sent successfully!" });
  } else {
    res.status(500).json({ error: "Failed to process invite request." });
  }
});

/**
 * Route: Blog Post
 */
app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and Content are required." });
  }

  const success = await triggerGithubAction('backend_post', {
    title: title,
    content: content,
    timestamp: new Date().toISOString()
  });

  if (success) {
    res.status(200).json({ message: "Post received and deploy triggered!" });
  } else {
    res.status(500).json({ error: "Failed to trigger GitHub Action." });
  }
});

/**
 * VERCEL COMPATIBILITY
 */
// Only run the server locally if NOT in production (Vercel handles the listener in production)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Local server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;



















// const path = require("path");
// require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// const express = require('express');
// const cors = require('cors');
// const { Octokit } = require("@octokit/core");

// const app = express();
// app.use(cors()); 
// app.use(express.json()); 

// const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// // Check if token is loaded from the root .env
// console.log("Token Loaded:", process.env.GITHUB_TOKEN ? "YES" : "NO (Check .env file at root)");

// const REPO_OWNER = 'warrendsteinacker-max';
// const REPO_NAME = 'practicee';

// /**
//  * SETTINGS
//  */
// const ALLOW_INVITES = true; // Set to false to block invite requests from the frontend

// /**
//  * Helper to trigger GitHub Actions
//  */
// async function triggerGithubAction(eventType, payload) {
//   try {
//     await octokit.request(`POST /repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
//       event_type: eventType, 
//       client_payload: payload
//     });
//     console.log(`🚀 GitHub Action (${eventType}) successfully triggered!`);
//     return true;
//   } catch (error) {
//     console.error("❌ GitHub API Error:", error.message);
//     return false;
//   }
// }

// /**
//  * Route: Slack Invite Request
//  */
// app.post('/api/invite', async (req, res) => {
//   const { email } = req.body;

//   // 1. Check the Boolean Gatekeeper
//   if (!ALLOW_INVITES) {
//     console.log(`🚫 Blocked invite request for: ${email} (ALLOW_INVITES is false)`);
//     return res.status(403).json({ error: "Invitations are currently disabled." });
//   }

//   if (!email || !email.includes('@')) {
//     return res.status(400).json({ error: "A valid email is required." });
//   }

//   console.log(`✉️ Processing invite request for: ${email}`);

//   // 2. Trigger the "invite" job in your YAML
//   const success = await triggerGithubAction('slack_invite', { 
//     email: email,
//     timestamp: new Date().toISOString() 
//   });

//   if (success) {
//     res.status(200).json({ message: "Invite request sent successfully!" });
//   } else {
//     res.status(500).json({ error: "Failed to process invite request." });
//   }
// });

// /**
//  * Route: Blog Post
//  */
// app.post('/api/posts', async (req, res) => {
//   const { title, content } = req.body;

//   if (!title || !content) {
//     return res.status(400).json({ error: "Title and Content are required." });
//   }

//   console.log(`📝 Received new post: ${title}`);

//   const success = await triggerGithubAction('backend_post', {
//     title: title,
//     content: content,
//     timestamp: new Date().toISOString()
//   });

//   if (success) {
//     res.status(200).json({ message: "Post received and deploy triggered!" });
//   } else {
//     res.status(500).json({ error: "Failed to trigger GitHub Action." });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });






























//////func/////////////


// async function triggerGithubAction() {
//   try {
//     await octokit.request('POST /repos/{warrendsteinacker-max}/{practicee}/dispatches', {
//       owner: 'warrendsteinacker-max',
//       repo: 'practicee',
//       event_type: 'backend_post', // This MUST match the "types" in your YAML
//       client_payload: {
//         unit: false,
//         integration: true
//       }
//     });
//     console.log("🚀 GitHub Action triggered!");
//   } catch (error) {
//     console.error("Error triggering GitHub Action:", error);
//   }
// }






//////////func///////////













// // Inside your slack app.message logic from the previous step:
// app.message(/@/, async ({ message, say }) => {
//   // ... your verification logic ...
  
//   await triggerGithubAction(); // This runs your YAML file
//   await say("Verification received. Starting build and deploy process...");
// });
