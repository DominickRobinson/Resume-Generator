const fs = require('fs');
const path = require('path');

function formatProjDate(dateStr, isStart) {
  if (!dateStr) return '';
  if (!isStart && dateStr.startsWith('2026-05')) {
    return 'Present';
  }
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getProjectDateLine(project) {
  const start = formatProjDate(project.startDate, true);
  const end = formatProjDate(project.endDate, false);
  
  if (!start) return '';
  if (!end || start === end) return start;
  if (end === 'Present') return `${start} - Present`;
  
  return `${start} - ${end}`;
}

module.exports = function generateTemplate(resume) {
  // Read the local style.css stylesheet on compilation
  const cssStyles = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');

  const educationHtml = resume.education.map(edu => {
    const endYear = edu.endDate ? new Date(edu.endDate + 'T00:00:00').getFullYear() : '';
    const dateDisplay = endYear ? `May ${endYear}` : '';
    const summaryBlock = edu.summary ? `<div class="details-block">${edu.summary}</div>` : '';
    const gpaBlock = edu.score ? `<div class="details-block">${edu.score} GPA</div>` : '';
    const coursesList = edu.courses && edu.courses.length > 0 
      ? `<div class="details-block" style="margin-top: 2px;"><span class="bold-text">Relevant coursework:</span> ${edu.courses.join(', ')}</div>`
      : '';

    return `
      <div class="item">
        <div class="row">
          <span class="bold-text">${edu.institution}</span>
          <span class="bold-text">${dateDisplay}</span>
        </div>
        <div class="row">
          <span class="italic-text">${edu.studyType} in ${edu.area}</span>
          <span class="italic-text">Pittsburgh, PA</span>
        </div>
        ${summaryBlock}
        ${gpaBlock}
        ${coursesList}
      </div>
    `;
  }).join('');

  const skillsHtml = resume.skills.map(skill => `
    <div><span class="bold-text">${skill.name}:</span> ${skill.keywords.join(', ')}</div>
  `).join('');

  const workHtml = resume.work.map(job => {
    const start = formatProjDate(job.startDate, true);
    const end = job.endDate ? formatProjDate(job.endDate, false) : 'Present';
    const highlightsList = job.highlights.map(h => `<li>${h}</li>`).join('');

    return `
      <div class="item">
        <div class="row">
          <span class="bold-text">${job.name}</span>
          <span class="bold-text">${start} - ${end}</span>
        </div>
        <div class="italic-text" style="margin-bottom: 2px;">${job.position}</div>
        <ul class="bullet-list">${highlightsList}</ul>
      </div>
    `;
  }).join('');

  const projectsHtml = resume.projects.map(project => {
    const dateLine = getProjectDateLine(project);
    const highlightsList = project.highlights.map(h => `<li>${h}</li>`).join('');

    return `
      <div class="item">
        <div class="row">
          <span class="bold-text">${project.name}</span>
          <span class="bold-text">${dateLine}</span>
        </div>
        <ul class="bullet-list">${highlightsList}</ul>
      </div>
    `;
  }).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>${cssStyles}</style>
  </head>
  <body>
    <div class="header">
      <div class="name">${resume.basics.name}</div>
      <div class="contact-info">
        <a href="mailto:${resume.basics.email}">${resume.basics.email}</a> &bull; 
        ${resume.basics.phone} &bull; 
        <a href="${resume.basics.url}" target="_blank">domonation.dev</a> &bull; 
        <a href="${resume.basics.profiles[0].url}" target="_blank">linkedin.com/in/${resume.basics.profiles[0].username}</a>
      </div>
    </div>

    <h2>Education</h2>
    <hr />
    ${educationHtml}

    <h2>Skills</h2>
    <hr />
    <div class="item">
      ${skillsHtml}
    </div>

    <h2>Work Experience</h2>
    <hr />
    ${workHtml}

    <h2>Technical Projects</h2>
    <hr />
    ${projectsHtml}
  </body>
  </html>
  `;
};