# 🧠 A.U.R.A

An intelligent browser extension that defines words based on the context of the sentence they are in. Powered by **Llama 3.1** (via Groq) to solve the "Ambiguity Problem" (e.g., distinguishing "Apple" the fruit from "Apple" the company).

![Icon](public/icon128.png)

## ✨ Features

- **Context-Aware:** Reads the surrounding paragraph to give the *correct* definition.
- **Privacy-First:** Only sends the selected text + immediate context to the AI.
- **Fast:** Uses Llama 3.1 8b Instant for near-real-time responses.
- **Cross-Browser:** Automation scripts included for Chrome, Edge, and Firefox builds.

---

## 🚀 Development Setup

To use this extension, you need to set it up locally with your own API key.

### 1. Prerequisites
* Node.js installed on your computer.
* A free API Key from [Groq Console](https://console.groq.com).

### 2. Installation
Clone the project and install dependencies:

```bash
git clone [https://github.com/sagarsirikonda/aura-dict.git](https://github.com/sagarsirikonda/aura-dict.git)
cd context-dictionary
npm install
```

## 3️⃣ Setup API Key (Important!)
For security, API keys are not stored in this repo. You must create your own local secret file.
1. Navigate to the `src/` folder  
2. Find `secrets.example.ts`  
3. Rename it to `secrets.ts`  
4. Add your Groq API key:

```ts
export const GROQ_API_KEY = "gsk_...";
```

Note: `secrets.ts` is ignored by Git, so your API key remains private.

## 4️⃣ Build the Extension

Run the build command:

```bash
npm run build
```

What this does:

Compiles the code using Vite.

Creates a `dist` folder (for Chrome / Edge).

Automatically generates a `dist-firefox` folder with the necessary manifest adjustments (for Firefox).

## 📦 How to Load in Browser

Note: Chrome and Edge installs are permanent, but loading via `manifest.json` in Firefox is temporary and will be removed when you restart the browser (use the signed `.xpi` method for permanent installation).

### Google Chrome
1. Open Chrome and type `chrome://extensions` in the address bar.
2. Turn on **"Developer mode"** (top right switch).
3. Click **"Load unpacked"**.
4. Select the `dist` folder.

### Microsoft Edge
1. Open Edge and type `edge://extensions`.
2. Turn on **"Developer mode"** (left sidebar or bottom left).
3. Click **"Load unpacked"**.
4. Select the `dist` folder.
   > *Tip: If the icon is hidden, click the Puzzle Piece icon in the toolbar and click the "Eye" to pin it.*

### Mozilla Firefox
1. Open Firefox and type `about:debugging` in the address bar.
2. Click **"This Firefox"** on the left sidebar.
3. Click the **"Load Temporary Add-on..."** button.
4. Navigate to the `dist-firefox` folder.
5. **Select the `manifest.json` file** inside that folder and click Open.

Standard Firefox requires extensions to be signed. Follow these steps to generate a permanent `.xpi` file.

**1. Create the Zip Package**
1. Navigate to the generated `dist-firefox` folder.
2. Select **all files** inside -> Right-click -> **Compress to ZIP**.
   *(Note: Zip the *files* inside, not the folder itself).*

**2. Sign the Extension**
1. Go to the [Mozilla Add-on Developer Hub](https://addons.mozilla.org/en-US/developers/).
2. Submit a new add-on and choose **"On your own"** for distribution.
3. Upload your ZIP file.
4. Once verified (automated), download the signed `.xpi` file.

**3. Install**
* Drag and drop the downloaded `.xpi` file into any open Firefox window and click **Add**.

> *For detailed debugging or temporary loading, refer to the [Mozilla Extension Workshop](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/).*

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS  
- **Build Tool:** Vite + CRXJS  
- **AI Model:** Llama 3.1-8B-Instant (Groq API)

---

## 📄 License

MIT License — feel free to fork and modify.
