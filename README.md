# Automated JSON Resume Pipeline

A highly modular, custom resume compilation pipeline built using Node.js and headless Puppeteer.

## How to Use

### 0. Prerequisites

This tool requires **Node.js** (which automatically includes **npm**). 

- **macOS (via Homebrew):** `brew install node`
- **Windows/Linux/macOS:** Download the official installer directly from [nodejs.org](https://nodejs.org/).

### 1. Download the Repository
Clone the codebase down to your local machine environment:
```bash
git clone https://github.com/DominickRobinson/Resume-Generator.git
cd Resume-Generator
```

### 2. Install Dependencies
Initialize the project workspace and download the required automated browser runtime binaries:
```bash
npm install
```

### 3. Run the Build Script

You can compile your document using the default profile or point the script toward a tailored file variations inside the data/ directory using command-line arguments:

```bash
# Compile using the default data/resume.json profile
node src/render.js

# Compile using a variant JSON in data directory
node src/render.js software_eng.json
node src/render.js data_scientist.json
```

The script will automatically parse your data, format the target name from the basics.name field into screaming snake case, and export a clean, clickable file (e.g., `DOMINICK_ROBINSON_RESUME.pdf`) directly into the `dist/` folder.
