const { Octokit } = require("@octokit/core");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN }); // You'll need a GitHub PAT

async function triggerGithubAction() {
  try {
    await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
      owner: 'YOUR_GITHUB_USERNAME',
      repo: 'YOUR_REPO_NAME',
      event_type: 'backend_post', // This MUST match the "types" in your YAML
      client_payload: {
        unit: false,
        integration: true
      }
    });
    console.log("🚀 GitHub Action triggered!");
  } catch (error) {
    console.error("Error triggering GitHub Action:", error);
  }
}

// Inside your slack app.message logic from the previous step:
app.message(/@/, async ({ message, say }) => {
  // ... your verification logic ...
  
  await triggerGithubAction(); // This runs your YAML file
  await say("Verification received. Starting build and deploy process...");
});
