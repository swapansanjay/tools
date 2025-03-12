const fs = require('fs');
const path = require('path');

// Conversion tools configuration
const lengthConverters = [
    {
        fromUnit: 'miles',
        toUnit: 'km',
        factor: 1.60934,
        description: 'Convert miles to kilometers quickly and accurately. Perfect for travel distances, mapping, and international measurements.',
        uses: [
            'Road distances and travel planning',
            'Marathon and running distances',
            'Geographic measurements',
            'International distance conversions'
        ]
    },
    {
        fromUnit: 'cm',
        toUnit: 'inches',
        factor: 0.393701,
        description: 'Convert centimeters to inches instantly. Ideal for international measurements, crafts, and DIY projects.',
        uses: [
            'Furniture and home measurements',
            'Crafting and sewing',
            'International product specifications',
            'Construction and woodworking'
        ]
    },
    // Add more converters here
];

// Template for the HTML file
function generateHTML(converter) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${converter.description}">
    <title>${converter.fromUnit.charAt(0).toUpperCase() + converter.fromUnit.slice(1)} to ${converter.toUnit.toUpperCase()} Converter - Multi-Tools</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="../styles/main.css">
    <link rel="stylesheet" href="../styles/tool-page.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Header will be loaded dynamically -->
    <div id="header-placeholder"></div>

    <!-- Main Content -->
    <main class="container py-4">
        <!-- Tool content here -->
    </main>

    <!-- Footer will be loaded dynamically -->
    <div id="footer-placeholder"></div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../js/main.js"></script>
    <script src="../js/converters/length-constants.js"></script>
    <script src="../js/converters/generic-length-converter.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const converter = new LengthConverter('${converter.fromUnit}', '${converter.toUnit}', ${converter.factor});
        });
    </script>
</body>
</html>`;
}

// Generate files
lengthConverters.forEach(converter => {
    const fileName = `${converter.fromUnit}-to-${converter.toUnit}.html`;
    const filePath = path.join(__dirname, '..', 'tools', fileName);
    
    fs.writeFileSync(filePath, generateHTML(converter));
    console.log(`Generated ${fileName}`);
});

console.log('All length converter files generated successfully!'); 