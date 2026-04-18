# 🪨 Rock Hall of Fame

A Victorian curiosity cabinet for your mum's rock collection. Friends and family can submit rocks with photos and personal stories. An AI "Geological Oracle" analyses each specimen and invents a dramatic geological history for it.

---

## Deploying to Netlify (5 minutes)

### Step 1 — Create a free Netlify account
Go to [netlify.com](https://netlify.com) and sign up (free tier is plenty).

### Step 2 — Upload the project
1. In the Netlify dashboard, click **"Add new site" → "Deploy manually"**
2. Drag and drop the entire `rock-hall` folder onto the page
3. Netlify will deploy it instantly and give you a URL like `https://something-random.netlify.app`

### Step 3 — Add your Anthropic API key
This is what powers the Geological Oracle AI analysis.

1. In your Netlify site dashboard, go to **Site configuration → Environment variables**
2. Click **"Add a variable"**
3. Set:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** your Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))
4. Click Save, then go to **Deploys** and click **"Trigger deploy → Deploy site"** to restart with the key active

### Step 4 — (Optional) Give it a nice URL
In **Site configuration → Site details**, click **"Change site name"** to set something like `mums-rocks.netlify.app`.

---

## How it works

| File | Purpose |
|------|---------|
| `public/index.html` | The entire website — cabinet, doors, forms, detail panels |
| `netlify/functions/analyze.js` | Serverless function that calls the Anthropic API securely |
| `netlify.toml` | Tells Netlify where files live and routes `/api/*` to the function |

**The AI Oracle:** When someone clicks a specimen, the site calls `/api/analyze` (your serverless function), which forwards the request to Claude with the rock photo (if provided) and asks for a rock type + Victorian geological backstory. The result is cached in localStorage so it only runs once per rock.

**Submissions:** Rock submissions are saved to localStorage in the visitor's browser. This means each visitor has their own cabinet. If you want submissions to be shared across all visitors, you'd need a small database (Netlify has a free KV store — happy to help set that up).

---

## Customising

- **The birthday person's name:** Edit the motto in `index.html` — search for "Established in honour"
- **Sample rocks:** The two pre-loaded rocks are in the `getDefaults()` function in `index.html` — edit or remove them
- **Colours / fonts:** All CSS variables are at the top of the `<style>` block

---

## Getting an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Click **"API Keys"** in the left sidebar
4. Click **"Create Key"**, give it a name, copy it
5. Paste it into Netlify as described in Step 3 above

The Oracle uses `claude-sonnet-4-20250514`. Each analysis costs roughly $0.001–0.003 depending on whether a photo is included — essentially free for a family website.
