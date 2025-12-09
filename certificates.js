const certificates = [
    {
        title: "Deloitte Cyber Simulation",
        file: "CERTIFCATES/CERTIFCATES/DELOITTE-CYBER SIMULATION.pdf",
        type: "pdf",
        icon: "fa-shield-alt"
    },
    {
        title: "GCP Intro to Gen AI (Badge)",
        file: "CERTIFCATES/CERTIFCATES/GCP INTRO TO GEN AI(BADGE).png",
        type: "image",
        icon: "fa-robot"
    },
    {
        title: "GCP Intro to Responsible AI (Badge)",
        file: "CERTIFCATES/CERTIFCATES/GCP INTRO TO RESPONSIBLE-AI(BADGE).png",
        type: "image",
        icon: "fa-brain"
    },
    {
        title: "HackVerse Certificate",
        file: "CERTIFCATES/CERTIFCATES/HackVerse-certificate (1).pdf",
        type: "pdf",
        icon: "fa-code"
    },
    {
        title: "Infosys CSS3",
        file: "CERTIFCATES/CERTIFCATES/INFOSYS-CSS3.pdf",
        type: "pdf",
        icon: "fa-palette"
    },
    {
        title: "Infosys Front End",
        file: "CERTIFCATES/CERTIFCATES/INFOSYS-FRONT END.pdf",
        type: "pdf",
        icon: "fa-laptop-code"
    },
    {
        title: "Infosys HTML5",
        file: "CERTIFCATES/CERTIFCATES/INFOSYS-HTML5.pdf",
        type: "pdf",
        icon: "fa-html5"
    },
    {
        title: "Infosys JavaScript",
        file: "CERTIFCATES/CERTIFCATES/INFOSYS-JS.pdf",
        type: "pdf",
        icon: "fa-js"
    },
    {
        title: "JPMorgan Job Simulation",
        file: "CERTIFCATES/CERTIFCATES/JPMORGAN-JOB-SIMULATION.pdf",
        type: "pdf",
        icon: "fa-briefcase"
    },
    {
        title: "Let's Upgrade Git & GitHub",
        file: "CERTIFCATES/CERTIFCATES/LET_S UPGRADE GIT AND GITHUB.pdf",
        type: "pdf",
        icon: "fa-code-branch"
    },
    {
        title: "Let's Upgrade React",
        file: "CERTIFCATES/CERTIFCATES/LET_S UPGRADE REACT.pdf",
        type: "pdf",
        icon: "fa-react"
    },
    {
        title: "Prepare Data for ML APIs (Badge)",
        file: "CERTIFCATES/CERTIFCATES/prepare-data-for-ml-apis-on-google-cloud-skill-badg.png",
        type: "image",
        icon: "fa-database"
    },
    {
        title: "SMART Certificate",
        file: "CERTIFCATES/CERTIFCATES/SMART.pdf",
        type: "pdf",
        icon: "fa-certificate"
    },
    {
        title: "TN Skills Web Technologies",
        file: "CERTIFCATES/CERTIFCATES/TN SKILLS (2025)Web Technologies.pdf",
        type: "pdf",
        icon: "fa-globe"
    }
];

const grid = document.getElementById('certificates-grid');
const modal = document.getElementById('cert-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

function renderCertificates() {
    grid.innerHTML = certificates.map((cert, index) => `
        <div class="cert-card rounded-2xl animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.1}s" onclick="openModal(${index})">
            <div class="cert-content">
                <i class="fas ${cert.icon} cert-icon"></i>
                <h3 class="cert-title">${cert.title}</h3>
                <p class="text-sm text-gray-200 mt-2">Click to view</p>
            </div>
            <!-- Optional: Add a blurred background preview if possible, otherwise just the glass effect -->
            <div class="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
        </div>
    `).join('');
}

function openModal(index) {
    const cert = certificates[index];
    modalTitle.textContent = cert.title;

    if (cert.type === 'image') {
        modalBody.innerHTML = `<img src="${cert.file}" alt="${cert.title}" class="cert-preview rounded-lg">`;
    } else {
        // Append #toolbar=0 to hide PDF controls (download, print, etc.)
        modalBody.innerHTML = `<iframe src="${cert.file}#toolbar=0&navpanes=0&scrollbar=0" class="cert-preview rounded-lg w-full h-full"></iframe>`;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        modalBody.innerHTML = ''; // Clear content to stop iframe/video
    }, 300);
}

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Initialize
renderCertificates();
