
const path = require("path")
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const { Octokit } = require("@octokit/core");

const app = express();
app.use(cors()); // Allows your frontend to talk to this server
app.use(express.json()); // Parses incoming JSON data

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

console.log("Token Loaded:", process.env.GITHUB_TOKEN ? "YES" : "NO (Check .env file)");

const REPO_OWNER = 'warrendsteinacker-max';
const REPO_NAME = 'practicee';


async function triggerGithubAction(postData) {
  try {
    // We only put the data GitHub actually wants in the body
    await octokit.request(`POST /repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
      event_type: 'backend_post', 
      client_payload: {
        title: postData.title,
        content: postData.content,
        timestamp: new Date().toISOString()
      }
    });
    console.log("🚀 GitHub Action successfully triggered!");
    return true;
  } catch (error) {
    // This will now show you the specific validation error if it fails again
    console.error("❌ GitHub API Error:", error.message);
    return false;
  }
}

/**
 * POST Route: Your frontend calls this to "Make a Post"
 */
app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and Content are required." });
  }

  console.log(`📝 Received new post: ${title}`);

  // Trigger the build/deploy workflow
  const success = await triggerGithubAction({ title, content });

  if (success) {
    res.status(200).json({ message: "Post received and deploy triggered!" });
  } else {
    res.status(500).json({ error: "Failed to trigger GitHub Action." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});































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
