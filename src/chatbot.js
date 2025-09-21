const API_KEY = "AIzaSyC9EiCpg2gb21VhyYw_1xF9d_FfNbdkJls";

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const prompt = `You are an expert startup evaluator.
You will be given a startup idea.  
Analyze it deeply and honestly.  
Your task is to:
1. List the top 3 to 5 Positives about the idea (strengths, opportunities, advantages).
2. List the top 3 to 5 Negatives about the idea (risks, weaknesses, threats).
3. Provide a short, bold Honest Verdict Tagline (one punchy sentence that sums up your opinion).
---
Startup Idea:
{startup_idea}
---
Respond in the following format:
Positives:
1. ...
2. ...
3. ...
Negatives:
1. ...
2. ...
3. ...
Honest Verdict Tagline:
"..." 
---
Important Instructions:
- Be honest but fair — don't sugarcoat, but don't be rude.
- Think like an investor, a founder, and a user all at once.
- Make the verdict tagline short (max 20 words) and impactful.`;

const startupIdea = "A new social media platform for pet owners.";
const finalPrompt = prompt.replace("{startup_idea}", startupIdea);


const payload = {
  contents: [
    {
      parts: [
        { text: finalPrompt }
      ]
    }
  ]
};

async function evaluateStartup() {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log(data.candidates[0].content.parts[0].text);

  } catch (error) {
    console.error("Error:", error);
  }
}

evaluateStartup();
