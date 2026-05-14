# Automated JSON Resume Pipeline

A highly modular, custom resume compilation pipeline built using Node.js and headless Puppeteer. This setup completely bypasses legacy JSON Resume CLI bugs to generate a pixel-perfect, highly dense resume matching traditional professional templates.

## How to Compile

### 1. Install Dependencies
Initialize the project workspace and download the required automated browser runtime binaries:
```bash
npm install
```

### 2. Run the Build Script

You can compile your document using the default profile or point the script toward a tailored file variations inside the data/ directory using command-line arguments:

```bash
# Compile using the default data/resume.json profile
node src/render.js

# Compile using a variant JSON in data directory
node src/render.js resume-variant.json
```

The script will automatically parse your data, capitalize/format your target name from the basics.name field, and export a clean, clickable file named FIRST_LAST_RESUME.pdf directly into the dist/ folder.
