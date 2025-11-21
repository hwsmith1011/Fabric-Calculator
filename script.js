// ==========================================
// PROJECT DATABASE
// ==========================================
// Each project includes fabric requirements and calculations
const FABRIC_WIDTH = 44; // Standard quilting cotton width in inches
const WASTE_BUFFER = 1.10; // 10% buffer for waste and mistakes

const projects = {
    'jelly-roll-rug': {
        name: 'Jelly Roll Rug',
        description: 'Coiled fabric rug made from 2.5" strips',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'diameter', label: 'Diameter (inches)', type: 'number', min: 12, default: 30 }
        ],
        calculate: (inputs) => {
            const diameter = inputs.diameter || 30;
            const area = Math.PI * Math.pow(diameter / 2, 2);
            // Each strip is 2.5" wide by 44" long = 110 sq inches
            const stripArea = 2.5 * FABRIC_WIDTH;
            const stripsNeeded = Math.ceil((area / stripArea) * WASTE_BUFFER);
            const yardsNeeded = (stripsNeeded * 2.5) / 36;

            return {
                yards: yardsNeeded.toFixed(2),
                strips: stripsNeeded,
                fatQuarters: Math.ceil(stripsNeeded / 7), // ~7 strips per fat quarter
                projectSize: `${diameter}" diameter rug`
            };
        }
    },
    'strip-quilt': {
        name: 'Strip Quilt',
        description: 'Simple quilt made from strips sewn together',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'width', label: 'Width (inches)', type: 'number', min: 30, default: 60 },
            { id: 'length', label: 'Length (inches)', type: 'number', min: 30, default: 72 }
        ],
        calculate: (inputs) => {
            const width = inputs.width || 60;
            const length = inputs.length || 72;
            const area = width * length;
            const yardsNeeded = ((area / (FABRIC_WIDTH * 36)) * WASTE_BUFFER).toFixed(2);
            const strips = Math.ceil((length / 2.5) * (width / FABRIC_WIDTH) * WASTE_BUFFER);

            return {
                yards: yardsNeeded,
                strips: strips,
                fatQuarters: Math.ceil(strips / 7),
                projectSize: `${width}" × ${length}" quilt`
            };
        }
    },
    'basic-quilt': {
        name: 'Basic Quilt (Squares)',
        description: 'Traditional quilt made from fabric squares',
        difficulty: 'Intermediate',
        dimensions: [
            { id: 'width', label: 'Width (inches)', type: 'number', min: 30, default: 60 },
            { id: 'length', label: 'Length (inches)', type: 'number', min: 30, default: 80 },
            { id: 'squareSize', label: 'Square Size (inches)', type: 'number', min: 2, default: 5 }
        ],
        calculate: (inputs) => {
            const width = inputs.width || 60;
            const length = inputs.length || 80;
            const squareSize = inputs.squareSize || 5;
            const area = width * length;
            const yardsNeeded = ((area / (FABRIC_WIDTH * 36)) * WASTE_BUFFER * 1.15).toFixed(2); // Extra for seams
            const squaresNeeded = Math.ceil((width / squareSize) * (length / squareSize));

            return {
                yards: yardsNeeded,
                squares: squaresNeeded,
                fatQuarters: Math.ceil(yardsNeeded / 0.25),
                projectSize: `${width}" × ${length}" quilt with ${squareSize}" squares`
            };
        }
    },
    'tote-bag': {
        name: 'Tote Bag',
        description: 'Reusable shopping or project tote',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'height', label: 'Height (inches)', type: 'number', min: 10, default: 14 },
            { id: 'width', label: 'Width (inches)', type: 'number', min: 10, default: 16 }
        ],
        calculate: (inputs) => {
            const height = inputs.height || 14;
            const width = inputs.width || 16;
            // Need front, back, bottom, handles, and lining
            const yardsNeeded = (((height * 2 + width) * 2 + 20) / 36 * WASTE_BUFFER).toFixed(2);

            return {
                yards: yardsNeeded,
                fatQuarters: Math.ceil(yardsNeeded / 0.5),
                projectSize: `${width}" × ${height}" tote bag`
            };
        }
    },
    'pillowcase': {
        name: 'Pillowcase (Standard)',
        description: 'Standard bed pillowcase',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'size', label: 'Pillow Size', type: 'select', options: [
                { value: 'standard', label: 'Standard (20" × 26")', yards: 0.75 },
                { value: 'queen', label: 'Queen (20" × 30")', yards: 0.9 },
                { value: 'king', label: 'King (20" × 36")', yards: 1.1 }
            ]}
        ],
        calculate: (inputs) => {
            const sizeData = {
                'standard': { yards: 0.75, size: '20" × 26"' },
                'queen': { yards: 0.9, size: '20" × 30"' },
                'king': { yards: 1.1, size: '20" × 36"' }
            };
            const size = inputs.size || 'standard';
            const data = sizeData[size];
            const yardsNeeded = (data.yards * WASTE_BUFFER).toFixed(2);

            return {
                yards: yardsNeeded,
                fatQuarters: Math.ceil(yardsNeeded / 0.5),
                projectSize: `${data.size} pillowcase`
            };
        }
    },
    'table-runner': {
        name: 'Table Runner',
        description: 'Decorative table runner',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'length', label: 'Length (inches)', type: 'number', min: 36, default: 72 },
            { id: 'width', label: 'Width (inches)', type: 'number', min: 12, default: 16 }
        ],
        calculate: (inputs) => {
            const length = inputs.length || 72;
            const width = inputs.width || 16;
            const yardsNeeded = ((length / 36) * WASTE_BUFFER * 1.2).toFixed(2); // Extra for backing

            return {
                yards: yardsNeeded,
                fatQuarters: Math.ceil(yardsNeeded / 0.5),
                projectSize: `${width}" × ${length}" table runner`
            };
        }
    },
    'baby-quilt': {
        name: 'Baby Quilt',
        description: 'Perfect size for a baby or toddler',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'size', label: 'Baby Quilt Size', type: 'select', options: [
                { value: 'small', label: 'Small (30" × 40")', width: 30, length: 40 },
                { value: 'medium', label: 'Medium (36" × 52")', width: 36, length: 52 },
                { value: 'large', label: 'Large (42" × 52")', width: 42, length: 52 }
            ]}
        ],
        calculate: (inputs) => {
            const sizes = {
                'small': { width: 30, length: 40 },
                'medium': { width: 36, length: 52 },
                'large': { width: 42, length: 52 }
            };
            const size = inputs.size || 'medium';
            const dims = sizes[size];
            const area = dims.width * dims.length;
            const yardsNeeded = ((area / (FABRIC_WIDTH * 36)) * WASTE_BUFFER * 1.5).toFixed(2); // Extra for backing and binding

            return {
                yards: yardsNeeded,
                fatQuarters: Math.ceil(yardsNeeded / 0.5),
                projectSize: `${dims.width}" × ${dims.length}" baby quilt`
            };
        }
    },
    'throw-pillow': {
        name: 'Throw Pillow',
        description: 'Decorative pillow cover',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'size', label: 'Pillow Size (inches)', type: 'number', min: 12, default: 18 }
        ],
        calculate: (inputs) => {
            const size = inputs.size || 18;
            // Need front and back
            const yardsNeeded = (((size * 2) / 36) * WASTE_BUFFER).toFixed(2);

            return {
                yards: yardsNeeded,
                fatQuarters: 1,
                projectSize: `${size}" × ${size}" throw pillow`
            };
        }
    }
};

// ==========================================
// CONVERSION FUNCTIONS
// ==========================================
function convertToYards(amount, type) {
    switch(type) {
        case 'yards':
            return amount;
        case 'strips':
            // 2.5" strips, assuming 44" wide fabric
            return (amount * 2.5) / 36;
        case 'fat-quarters':
            // Fat quarter is typically 18" × 22" = 0.5 yards
            return amount * 0.5;
        case 'charm-packs':
            // 5" charm square, calculate how many fit in a yard
            return (amount * 25) / (FABRIC_WIDTH * 36);
        default:
            return amount;
    }
}

// ==========================================
// DOM ELEMENTS
// ==========================================
const modeButtons = document.querySelectorAll('.mode-btn');
const calculatorSections = document.querySelectorAll('.calculator-section');
const projectTypeSelect = document.getElementById('project-type');
const dimensionInputs = document.getElementById('dimension-inputs');
const calculateFabricBtn = document.getElementById('calculate-fabric');
const fabricResults = document.getElementById('fabric-results');
const fabricAmountType = document.getElementById('fabric-amount-type');
const fabricAmount = document.getElementById('fabric-amount');
const desiredProject = document.getElementById('desired-project');
const findProjectsBtn = document.getElementById('find-projects');
const projectResults = document.getElementById('project-results');

// ==========================================
// MODE TOGGLE FUNCTIONALITY
// ==========================================
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const mode = button.dataset.mode;

        // Update active button
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Show corresponding section
        calculatorSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === mode) {
                section.classList.add('active');
            }
        });

        // Clear results
        fabricResults.innerHTML = '';
        projectResults.innerHTML = '';
    });
});

// ==========================================
// PROJECT-TO-FABRIC CALCULATOR
// ==========================================
projectTypeSelect.addEventListener('change', function() {
    const projectKey = this.value;
    dimensionInputs.innerHTML = '';
    fabricResults.innerHTML = '';

    if (!projectKey) {
        calculateFabricBtn.disabled = true;
        return;
    }

    const project = projects[projectKey];
    calculateFabricBtn.disabled = false;

    // Generate dimension input fields based on project
    project.dimensions.forEach(dim => {
        const formGroup = document.createElement('div');
        formGroup.className = 'dimension-group';

        const label = document.createElement('label');
        label.textContent = dim.label;
        label.htmlFor = dim.id;
        formGroup.appendChild(label);

        if (dim.type === 'select') {
            const select = document.createElement('select');
            select.id = dim.id;
            select.className = 'input-field';

            dim.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.label;
                select.appendChild(opt);
            });

            formGroup.appendChild(select);
        } else {
            const input = document.createElement('input');
            input.type = dim.type;
            input.id = dim.id;
            input.className = 'input-field';
            input.min = dim.min || 0;
            input.step = dim.step || 1;
            input.value = dim.default || '';
            input.placeholder = dim.label;

            formGroup.appendChild(input);
        }

        dimensionInputs.appendChild(formGroup);
    });
});

calculateFabricBtn.addEventListener('click', function() {
    const projectKey = projectTypeSelect.value;
    if (!projectKey) return;

    const project = projects[projectKey];
    const inputs = {};

    // Collect input values
    project.dimensions.forEach(dim => {
        const element = document.getElementById(dim.id);
        inputs[dim.id] = dim.type === 'number' ? parseFloat(element.value) : element.value;
    });

    // Calculate fabric needs
    const results = project.calculate(inputs);

    // Display results
    fabricResults.innerHTML = `
        <div class="result-card">
            <h3>📏 ${project.name}</h3>
            <div class="result-item">
                <span class="result-label">Project Size:</span>
                <span class="result-value">${results.projectSize}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Fabric Needed (44" wide):</span>
                <span class="result-value">${results.yards} yards</span>
            </div>
            ${results.strips ? `
            <div class="result-item">
                <span class="result-label">OR 2.5" Jelly Roll Strips:</span>
                <span class="result-value">${results.strips} strips</span>
            </div>
            ` : ''}
            ${results.fatQuarters ? `
            <div class="result-item">
                <span class="result-label">OR Fat Quarters:</span>
                <span class="result-value">${results.fatQuarters} fat quarters</span>
            </div>
            ` : ''}
            ${results.squares ? `
            <div class="result-item">
                <span class="result-label">Total Squares Needed:</span>
                <span class="result-value">${results.squares} squares</span>
            </div>
            ` : ''}
            <div class="result-item">
                <span class="result-label">Difficulty Level:</span>
                <span class="result-value">${project.difficulty}</span>
            </div>
        </div>
    `;

    // Scroll to results
    fabricResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ==========================================
// FABRIC-TO-PROJECTS CALCULATOR
// ==========================================
findProjectsBtn.addEventListener('click', function() {
    const amountType = fabricAmountType.value;
    const amount = parseFloat(fabricAmount.value);
    const desired = desiredProject.value;

    if (!amount || amount <= 0) {
        projectResults.innerHTML = `
            <div class="result-card">
                <p style="text-align: center;">Please enter the amount of fabric you have.</p>
            </div>
        `;
        return;
    }

    // Convert everything to yards for comparison
    const yardsAvailable = convertToYards(amount, amountType);

    projectResults.innerHTML = '<div class="loading">Finding projects for you</div>';

    setTimeout(() => {
        let html = '';
        let foundProjects = [];

        // Check each project
        Object.keys(projects).forEach(key => {
            // Skip if user selected specific project and this isn't it
            if (desired && desired !== key) return;

            const project = projects[key];

            // Calculate minimum fabric needed (using default values)
            const defaultInputs = {};
            project.dimensions.forEach(dim => {
                defaultInputs[dim.id] = dim.default || (dim.options ? dim.options[0].value : 0);
            });

            const minNeeded = project.calculate(defaultInputs);
            const yardsNeeded = parseFloat(minNeeded.yards);
            const canMake = yardsAvailable >= yardsNeeded;

            foundProjects.push({
                project,
                minNeeded,
                yardsNeeded,
                canMake
            });
        });

        // Sort: Can make first, then by yards needed
        foundProjects.sort((a, b) => {
            if (a.canMake && !b.canMake) return -1;
            if (!a.canMake && b.canMake) return 1;
            return a.yardsNeeded - b.yardsNeeded;
        });

        // Generate HTML
        const canMakeProjects = foundProjects.filter(p => p.canMake);
        const cannotMakeProjects = foundProjects.filter(p => !p.canMake);

        if (canMakeProjects.length > 0) {
            html += '<h3 style="color: #059669; margin-bottom: 15px;">✅ You Can Make These:</h3>';
            canMakeProjects.forEach(({project, minNeeded, yardsNeeded}) => {
                html += `
                    <div class="project-card can-make">
                        <h4>${project.name} <span class="status-badge can-make">✓ You have enough!</span></h4>
                        <p class="project-description">${project.description}</p>
                        <p class="project-size">Example size: ${minNeeded.projectSize}</p>
                        <p><strong>Needs:</strong> ${minNeeded.yards} yards (You have: ${yardsAvailable.toFixed(2)} yards)</p>
                        <span class="project-difficulty">${project.difficulty}</span>
                    </div>
                `;
            });
        }

        if (cannotMakeProjects.length > 0 && !desired) {
            html += '<h3 style="color: #dc2626; margin: 25px 0 15px;">📌 Need More Fabric For:</h3>';
            cannotMakeProjects.slice(0, 3).forEach(({project, minNeeded, yardsNeeded}) => {
                const needMore = (yardsNeeded - yardsAvailable).toFixed(2);
                html += `
                    <div class="project-card cannot-make">
                        <h4>${project.name} <span class="status-badge need-more">Need ${needMore} more yards</span></h4>
                        <p class="project-description">${project.description}</p>
                        <p class="project-size">Example size: ${minNeeded.projectSize}</p>
                        <p><strong>Needs:</strong> ${minNeeded.yards} yards</p>
                        <span class="project-difficulty">${project.difficulty}</span>
                    </div>
                `;
            });
        }

        if (canMakeProjects.length === 0 && desired) {
            html = `
                <div class="result-card">
                    <h3>😔 Not Quite Enough</h3>
                    <p style="margin-top: 10px;">You need ${foundProjects[0].yardsNeeded.toFixed(2)} yards for this project.</p>
                    <p>You have ${yardsAvailable.toFixed(2)} yards.</p>
                    <p style="margin-top: 15px;"><strong>You need ${(foundProjects[0].yardsNeeded - yardsAvailable).toFixed(2)} more yards.</strong></p>
                </div>
            `;
        }

        projectResults.innerHTML = html;
        projectResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
});

// Enable "Find Projects" button when amount is entered
fabricAmount.addEventListener('input', function() {
    findProjectsBtn.disabled = !this.value || parseFloat(this.value) <= 0;
});

// ==========================================
// INITIALIZE
// ==========================================
console.log('🧵 Fabric Calculator loaded successfully!');
console.log(`📐 Assuming ${FABRIC_WIDTH}" wide fabric with ${(WASTE_BUFFER - 1) * 100}% waste buffer`);
