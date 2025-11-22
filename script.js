// ==========================================
// PROJECT DATABASE
// ==========================================
// Each project includes fabric requirements and calculations
const FABRIC_WIDTH = 44; // Standard quilting cotton width in inches
const WASTE_BUFFER = 1.10; // 10% buffer for waste and mistakes
const SEAM_ALLOWANCE = 0.25; // 1/4" seam allowance

const projects = {
    'jelly-roll-rug': {
        name: 'Jelly Roll Rug',
        description: 'Coiled fabric rug made from 2.5" strips',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'shape', label: 'Rug Shape', type: 'select', options: [
                { value: 'round', label: 'Round' },
                { value: 'oval', label: 'Oval' },
                { value: 'rectangle', label: 'Rectangle' }
            ]}
        ],
        calculate: (inputs) => {
            const shape = inputs.shape || 'round';
            let area, projectSize;

            if (shape === 'round') {
                const diameter = inputs.diameter || 30;
                area = Math.PI * Math.pow(diameter / 2, 2);
                projectSize = `${diameter}" diameter round rug`;
            } else if (shape === 'oval') {
                const width = inputs.width || 24;
                const length = inputs.length || 36;
                // Approximate oval area
                area = Math.PI * (width / 2) * (length / 2);
                projectSize = `${width}" × ${length}" oval rug`;
            } else { // rectangle
                const width = inputs.width || 24;
                const length = inputs.length || 36;
                area = width * length;
                projectSize = `${width}" × ${length}" rectangular rug`;
            }

            // Each strip is 2.5" wide by 44" long = 110 sq inches
            const stripArea = 2.5 * FABRIC_WIDTH;
            const stripsNeeded = Math.ceil((area / stripArea) * WASTE_BUFFER);
            const yardsNeeded = (stripsNeeded * 2.5) / 36;

            return {
                yards: yardsNeeded.toFixed(2),
                strips: stripsNeeded,
                fatQuarters: Math.ceil(stripsNeeded / 7),
                projectSize: projectSize
            };
        },
        // Dynamic dimensions based on shape selection
        getDynamicDimensions: (shape) => {
            if (shape === 'round') {
                return [
                    { id: 'diameter', label: 'Diameter (inches)', type: 'number', min: 12, default: 30 }
                ];
            } else if (shape === 'oval') {
                return [
                    { id: 'width', label: 'Width (inches)', type: 'number', min: 12, default: 24 },
                    { id: 'length', label: 'Length (inches)', type: 'number', min: 12, default: 36 }
                ];
            } else { // rectangle
                return [
                    { id: 'width', label: 'Width (inches)', type: 'number', min: 12, default: 24 },
                    { id: 'length', label: 'Length (inches)', type: 'number', min: 12, default: 36 }
                ];
            }
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
            // Need fabric for top and backing
            const yardsNeeded = ((length / 36) * 2 * WASTE_BUFFER).toFixed(2);

            return {
                yards: yardsNeeded,
                fatQuarters: Math.ceil(yardsNeeded / 0.5),
                projectSize: `${width}" × ${length}" table runner`
            };
        }
    },
    'wall-hanging': {
        name: 'Wall Hanging',
        description: 'Decorative quilted wall art',
        difficulty: 'Intermediate',
        dimensions: [
            { id: 'width', label: 'Width (inches)', type: 'number', min: 12, default: 24 },
            { id: 'height', label: 'Height (inches)', type: 'number', min: 12, default: 36 }
        ],
        calculate: (inputs) => {
            const width = inputs.width || 24;
            const height = inputs.height || 36;
            const area = width * height;
            // Need top, backing, and binding
            const yardsNeeded = ((area / (FABRIC_WIDTH * 36)) * 2 * WASTE_BUFFER * 1.2).toFixed(2);

            return {
                yards: yardsNeeded,
                fatQuarters: Math.ceil(yardsNeeded / 0.5),
                projectSize: `${width}" × ${height}" wall hanging`
            };
        }
    },
    'tote-bag': {
        name: 'Tote Bag',
        description: 'Reusable shopping or project tote',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'height', label: 'Height (inches)', type: 'number', min: 10, default: 14 },
            { id: 'width', label: 'Width (inches)', type: 'number', min: 10, default: 16 },
            { id: 'depth', label: 'Depth/Gusset (inches)', type: 'number', min: 2, default: 4 }
        ],
        calculate: (inputs) => {
            const height = inputs.height || 14;
            const width = inputs.width || 16;
            const depth = inputs.depth || 4;

            // Calculate fabric needed: 2 body pieces + 2 side gussets + bottom + handles
            const bodyArea = (width + depth) * 2 * (height + depth + 2); // Front, back, sides, bottom with seam allowances
            const handleLength = 20; // Standard handle length

            const exteriorYards = ((bodyArea + (handleLength * 4)) / (FABRIC_WIDTH * 36) * WASTE_BUFFER).toFixed(2);
            const liningYards = ((bodyArea) / (FABRIC_WIDTH * 36) * WASTE_BUFFER).toFixed(2);
            const interfacingYards = exteriorYards; // Same as exterior
            const totalYards = (parseFloat(exteriorYards) + parseFloat(liningYards)).toFixed(2);

            return {
                yards: totalYards,
                exteriorYards: exteriorYards,
                liningYards: liningYards,
                interfacingYards: interfacingYards,
                projectSize: `${width}" × ${height}" × ${depth}" tote bag`,
                hasLining: true,
                hasInterfacing: true
            };
        }
    },
    'zippered-pouch': {
        name: 'Zippered Pouch',
        description: 'Flat zippered pouch for storage',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'width', label: 'Width (inches)', type: 'number', min: 4, default: 9 },
            { id: 'height', label: 'Height (inches)', type: 'number', min: 4, default: 7 }
        ],
        calculate: (inputs) => {
            const width = inputs.width || 9;
            const height = inputs.height || 7;

            // Need 2 exterior pieces and 2 lining pieces
            const pieceWidth = width + (2 * SEAM_ALLOWANCE);
            const pieceHeight = height + (2 * SEAM_ALLOWANCE);

            const exteriorYards = ((pieceWidth * pieceHeight * 2) / (FABRIC_WIDTH * 36) * WASTE_BUFFER).toFixed(2);
            const liningYards = exteriorYards; // Same dimensions
            const interfacingYards = exteriorYards;
            const totalYards = (parseFloat(exteriorYards) + parseFloat(liningYards)).toFixed(2);

            return {
                yards: totalYards,
                exteriorYards: exteriorYards,
                liningYards: liningYards,
                interfacingYards: interfacingYards,
                projectSize: `${width}" × ${height}" zippered pouch`,
                hasLining: true,
                hasInterfacing: true
            };
        }
    },
    'boxy-pouch': {
        name: 'Boxy Pouch',
        description: 'Three-dimensional zippered pouch',
        difficulty: 'Intermediate',
        dimensions: [
            { id: 'width', label: 'Width (inches)', type: 'number', min: 4, default: 8 },
            { id: 'height', label: 'Height (inches)', type: 'number', min: 4, default: 6 },
            { id: 'depth', label: 'Depth (inches)', type: 'number', min: 2, default: 3 }
        ],
        calculate: (inputs) => {
            const width = inputs.width || 8;
            const height = inputs.height || 6;
            const depth = inputs.depth || 3;

            // Calculate surface area for boxy pouch
            const surfaceArea = 2 * ((width * height) + (width * depth) + (height * depth));

            const exteriorYards = ((surfaceArea) / (FABRIC_WIDTH * 36) * WASTE_BUFFER).toFixed(2);
            const liningYards = exteriorYards;
            const interfacingYards = exteriorYards;
            const totalYards = (parseFloat(exteriorYards) + parseFloat(liningYards)).toFixed(2);

            return {
                yards: totalYards,
                exteriorYards: exteriorYards,
                liningYards: liningYards,
                interfacingYards: interfacingYards,
                projectSize: `${width}" × ${height}" × ${depth}" boxy pouch`,
                hasLining: true,
                hasInterfacing: true
            };
        }
    },
    'duffle-bag': {
        name: 'Duffle Bag',
        description: 'Large cylindrical travel bag',
        difficulty: 'Advanced',
        dimensions: [
            { id: 'diameter', label: 'Diameter (inches)', type: 'number', min: 8, default: 10 },
            { id: 'length', label: 'Length (inches)', type: 'number', min: 12, default: 20 }
        ],
        calculate: (inputs) => {
            const diameter = inputs.diameter || 10;
            const length = inputs.length || 20;
            const radius = diameter / 2;

            // Calculate cylinder surface area: 2 circles + rectangle
            const circleArea = 2 * Math.PI * radius * radius;
            const bodyArea = 2 * Math.PI * radius * length;
            const totalArea = circleArea + bodyArea;

            // Add extra for straps and pockets
            const exteriorYards = ((totalArea + 200) / (FABRIC_WIDTH * 36) * WASTE_BUFFER).toFixed(2);
            const liningYards = ((totalArea) / (FABRIC_WIDTH * 36) * WASTE_BUFFER).toFixed(2);
            const interfacingYards = exteriorYards;
            const totalYards = (parseFloat(exteriorYards) + parseFloat(liningYards)).toFixed(2);

            return {
                yards: totalYards,
                exteriorYards: exteriorYards,
                liningYards: liningYards,
                interfacingYards: interfacingYards,
                projectSize: `${diameter}" diameter × ${length}" long duffle bag`,
                hasLining: true,
                hasInterfacing: true
            };
        }
    },
    'pillowcase': {
        name: 'Pillowcase',
        description: 'Standard bed pillowcase',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'size', label: 'Pillow Size', type: 'select', options: [
                { value: 'standard', label: 'Standard (20" × 26")' },
                { value: 'queen', label: 'Queen (20" × 30")' },
                { value: 'king', label: 'King (20" × 36")' }
            ]}
        ],
        calculate: (inputs) => {
            const sizeData = {
                'standard': { width: 20, length: 26, yards: 0.75 },
                'queen': { width: 20, length: 30, yards: 0.9 },
                'king': { width: 20, length: 36, yards: 1.1 }
            };
            const size = inputs.size || 'standard';
            const data = sizeData[size];
            const yardsNeeded = (data.yards * WASTE_BUFFER).toFixed(2);

            return {
                yards: yardsNeeded,
                fatQuarters: Math.ceil(yardsNeeded / 0.5),
                projectSize: `${data.width}" × ${data.length}" pillowcase`
            };
        }
    },
    'throw-pillow': {
        name: 'Throw Pillow',
        description: 'Decorative pillow cover',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'size', label: 'Pillow Size', type: 'select', options: [
                { value: '12', label: '12" × 12"' },
                { value: '16', label: '16" × 16"' },
                { value: '18', label: '18" × 18"' },
                { value: '20', label: '20" × 20"' },
                { value: '24', label: '24" × 24"' }
            ]}
        ],
        calculate: (inputs) => {
            const size = parseInt(inputs.size) || 18;
            // Need front and back
            const yardsNeeded = (((size + SEAM_ALLOWANCE * 2) * 2 / 36) * WASTE_BUFFER).toFixed(2);

            return {
                yards: yardsNeeded,
                fatQuarters: Math.ceil(parseFloat(yardsNeeded) / 0.5),
                projectSize: `${size}" × ${size}" throw pillow`
            };
        }
    },
    'placemat': {
        name: 'Placemat',
        description: 'Individual table placemat',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'size', label: 'Placemat Size', type: 'select', options: [
                { value: 'standard', label: 'Standard (12" × 18")' },
                { value: 'large', label: 'Large (14" × 20")' }
            ]},
            { id: 'quantity', label: 'Number of Placemats', type: 'number', min: 1, default: 4 }
        ],
        calculate: (inputs) => {
            const sizeData = {
                'standard': { width: 12, height: 18 },
                'large': { width: 14, height: 20 }
            };
            const size = inputs.size || 'standard';
            const quantity = inputs.quantity || 4;
            const dims = sizeData[size];

            // Each placemat needs top and backing
            const areaPerMat = dims.width * dims.height * 2;
            const totalArea = areaPerMat * quantity;
            const yardsNeeded = ((totalArea / (FABRIC_WIDTH * 36)) * WASTE_BUFFER).toFixed(2);

            return {
                yards: yardsNeeded,
                fatQuarters: Math.ceil(parseFloat(yardsNeeded) / 0.5),
                projectSize: `${quantity} placemats (${dims.width}" × ${dims.height}" each)`
            };
        }
    },
    'napkin': {
        name: 'Napkin',
        description: 'Fabric table napkins',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'size', label: 'Napkin Size', type: 'select', options: [
                { value: 'cocktail', label: 'Cocktail (12" × 12")' },
                { value: 'dinner-small', label: 'Dinner Small (17" × 17")' },
                { value: 'dinner-large', label: 'Dinner Large (20" × 20")' }
            ]},
            { id: 'quantity', label: 'Number of Napkins', type: 'number', min: 1, default: 6 }
        ],
        calculate: (inputs) => {
            const sizeData = {
                'cocktail': { size: 12 },
                'dinner-small': { size: 17 },
                'dinner-large': { size: 20 }
            };
            const sizeKey = inputs.size || 'dinner-small';
            const quantity = inputs.quantity || 6;
            const size = sizeData[sizeKey].size;

            // Add seam allowance for hem
            const fabricSize = size + 1; // Add 1" for hems
            const areaPerNapkin = fabricSize * fabricSize;
            const totalArea = areaPerNapkin * quantity;
            const yardsNeeded = ((totalArea / (FABRIC_WIDTH * 36)) * WASTE_BUFFER).toFixed(2);

            return {
                yards: yardsNeeded,
                fatQuarters: Math.ceil(parseFloat(yardsNeeded) / 0.5),
                projectSize: `${quantity} napkins (${size}" × ${size}" each)`
            };
        }
    },
    'fabric-basket': {
        name: 'Fabric Basket',
        description: 'Storage basket with interfacing',
        difficulty: 'Intermediate',
        dimensions: [
            { id: 'size', label: 'Basket Size', type: 'select', options: [
                { value: 'small-square', label: 'Small Square (6" × 6" × 6")' },
                { value: 'medium-square', label: 'Medium Square (10" × 10" × 8")' },
                { value: 'large-square', label: 'Large Square (12" × 12" × 10")' },
                { value: 'small-rect', label: 'Small Rectangular (8" × 6" × 4")' },
                { value: 'medium-rect', label: 'Medium Rectangular (12" × 8" × 6")' },
                { value: 'large-rect', label: 'Large Rectangular (16" × 10" × 8")' },
                { value: 'xlarge-rect', label: 'Extra Large Rectangular (18" × 12" × 10")' }
            ]}
        ],
        calculate: (inputs) => {
            const sizeData = {
                'small-square': { width: 6, length: 6, height: 6 },
                'medium-square': { width: 10, length: 10, height: 8 },
                'large-square': { width: 12, length: 12, height: 10 },
                'small-rect': { width: 8, length: 6, height: 4 },
                'medium-rect': { width: 12, length: 8, height: 6 },
                'large-rect': { width: 16, length: 10, height: 8 },
                'xlarge-rect': { width: 18, length: 12, height: 10 }
            };
            const size = inputs.size || 'medium-square';
            const dims = sizeData[size];

            // Calculate surface area: bottom + 4 sides
            const surfaceArea = (dims.width * dims.length) +
                               (2 * dims.width * dims.height) +
                               (2 * dims.length * dims.height);

            const exteriorYards = ((surfaceArea) / (FABRIC_WIDTH * 36) * WASTE_BUFFER).toFixed(2);
            const liningYards = exteriorYards;
            const interfacingYards = exteriorYards;
            const totalYards = (parseFloat(exteriorYards) + parseFloat(liningYards)).toFixed(2);

            return {
                yards: totalYards,
                exteriorYards: exteriorYards,
                liningYards: liningYards,
                interfacingYards: interfacingYards,
                projectSize: `${dims.width}" × ${dims.length}" × ${dims.height}" fabric basket`,
                hasLining: true,
                hasInterfacing: true
            };
        }
    },
    'ruffle': {
        name: 'Ruffle',
        description: 'Gathered fabric ruffle trim',
        difficulty: 'Beginner',
        dimensions: [
            { id: 'width', label: 'Finished Ruffle Width/Height (inches)', type: 'number', min: 1, default: 3 },
            { id: 'length', label: 'Finished Ruffle Length (inches)', type: 'number', min: 12, default: 60 },
            { id: 'gathering', label: 'Gathering Amount', type: 'select', options: [
                { value: '1.5', label: 'Light Gathering (1.5x)' },
                { value: '2', label: 'Normal Gathering (2x)' },
                { value: '2.5', label: 'Extra Gathering (2.5x)' }
            ]}
        ],
        calculate: (inputs) => {
            const width = inputs.width || 3;
            const length = inputs.length || 60;
            const gatherMultiplier = parseFloat(inputs.gathering) || 2;

            // Calculate fabric needed
            const fabricLength = length * gatherMultiplier;
            const fabricWidth = width + 0.5; // Add 1/2" for seam allowances

            const yardsNeeded = ((fabricLength / 36) * WASTE_BUFFER).toFixed(2);

            return {
                yards: yardsNeeded,
                startingDimensions: `${fabricWidth.toFixed(1)}" wide × ${fabricLength.toFixed(0)}" long`,
                projectSize: `${width}" wide × ${length}" long finished ruffle with ${gatherMultiplier}x gathering`,
                fatQuarters: Math.ceil(parseFloat(yardsNeeded) / 0.5)
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
function renderDimensionInputs(projectKey, additionalData = {}) {
    dimensionInputs.innerHTML = '';
    fabricResults.innerHTML = '';

    if (!projectKey) {
        calculateFabricBtn.disabled = true;
        return;
    }

    const project = projects[projectKey];
    calculateFabricBtn.disabled = false;

    let dimensions = project.dimensions;

    // Handle dynamic dimensions (like Jelly Roll Rug shapes)
    if (project.getDynamicDimensions && additionalData.shape) {
        const dynamicDims = project.getDynamicDimensions(additionalData.shape);
        dimensions = [project.dimensions[0], ...dynamicDims]; // Keep shape selector + add dynamic dims
    }

    // Generate dimension input fields based on project
    dimensions.forEach(dim => {
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

            // Special handling for Jelly Roll Rug shape changes
            if (projectKey === 'jelly-roll-rug' && dim.id === 'shape') {
                select.addEventListener('change', function() {
                    renderDimensionInputs(projectKey, { shape: this.value });
                });
            }

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
}

projectTypeSelect.addEventListener('change', function() {
    renderDimensionInputs(this.value);
});

calculateFabricBtn.addEventListener('click', function() {
    const projectKey = projectTypeSelect.value;
    if (!projectKey) return;

    const project = projects[projectKey];
    const inputs = {};

    // Collect input values from all visible inputs
    const allInputs = dimensionInputs.querySelectorAll('input, select');
    allInputs.forEach(element => {
        const id = element.id;
        if (element.type === 'number') {
            inputs[id] = parseFloat(element.value) || 0;
        } else {
            inputs[id] = element.value;
        }
    });

    // Calculate fabric needs
    const results = project.calculate(inputs);

    // Build results HTML
    let resultsHTML = `
        <div class="result-card">
            <h3>📏 ${project.name}</h3>
            <div class="result-item">
                <span class="result-label">Project Size:</span>
                <span class="result-value">${results.projectSize}</span>
            </div>
    `;

    // If project has lining/exterior separation
    if (results.hasLining) {
        resultsHTML += `
            <div class="result-item">
                <span class="result-label">Exterior Fabric:</span>
                <span class="result-value">${results.exteriorYards} yards</span>
            </div>
            <div class="result-item">
                <span class="result-label">Lining Fabric:</span>
                <span class="result-value">${results.liningYards} yards</span>
            </div>
        `;
    }

    // If project has interfacing
    if (results.hasInterfacing) {
        resultsHTML += `
            <div class="result-item">
                <span class="result-label">Interfacing:</span>
                <span class="result-value">${results.interfacingYards} yards</span>
            </div>
        `;
    }

    // Total yards
    resultsHTML += `
        <div class="result-item">
            <span class="result-label">${results.hasLining ? 'Total Fabric (Exterior + Lining):' : 'Fabric Needed (44" wide):'}</span>
            <span class="result-value">${results.yards} yards</span>
        </div>
    `;

    // Ruffle starting dimensions
    if (results.startingDimensions) {
        resultsHTML += `
            <div class="result-item">
                <span class="result-label">Starting Fabric Dimensions:</span>
                <span class="result-value">${results.startingDimensions}</span>
            </div>
        `;
    }

    // Optional additional info
    if (results.strips) {
        resultsHTML += `
            <div class="result-item">
                <span class="result-label">OR 2.5" Jelly Roll Strips:</span>
                <span class="result-value">${results.strips} strips</span>
            </div>
        `;
    }

    if (results.fatQuarters) {
        resultsHTML += `
            <div class="result-item">
                <span class="result-label">OR Fat Quarters:</span>
                <span class="result-value">${results.fatQuarters} fat quarters</span>
            </div>
        `;
    }

    if (results.squares) {
        resultsHTML += `
            <div class="result-item">
                <span class="result-label">Total Squares Needed:</span>
                <span class="result-value">${results.squares} squares</span>
            </div>
        `;
    }

    resultsHTML += `
            <div class="result-item">
                <span class="result-label">Difficulty Level:</span>
                <span class="result-value">${project.difficulty}</span>
            </div>
        </div>
    `;

    fabricResults.innerHTML = resultsHTML;

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
console.log('🧵 Fabric Planner loaded successfully!');
console.log(`📐 Assuming ${FABRIC_WIDTH}" wide fabric with ${(WASTE_BUFFER - 1) * 100}% waste buffer`);
