# Automated JSON Resume Pipeline

A highly modular, custom resume compilation pipeline built using Node.js and headless Puppeteer.

## How to Use

### 1. Download the Repository
Clone the codebase down to your local machine environment:
```bash
git clone [https://github.com/DominickRobinson/Resume-Generator.git](https://github.com/DominickRobinson/Resume-Generator.git)
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
node src/render.js resume-variant.json
```

The script will automatically parse your data and export a `FIRST_LAST_RESUME.pdf` directly into the `dist/` folder.
