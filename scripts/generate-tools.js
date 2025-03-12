const fs = require('fs');
const path = require('path');

// Conversion tools configuration
const converterTools = {
    length: [
        {
            fromUnit: 'meters',
            toUnit: 'yards',
            factor: 1.0936133,
            description: 'Convert meters to yards quickly and accurately. Perfect for sports fields, construction, and general measurements.',
            uses: [
                'Sports field measurements',
                'Construction and architecture',
                'International trade and shipping',
                'Athletic events and competitions'
            ]
        },
        {
            fromUnit: 'inches',
            toUnit: 'cm',
            factor: 2.54,
            description: 'Convert inches to centimeters instantly. Perfect for international measurements, DIY projects, and crafts.',
            uses: [
                'DIY and home improvement',
                'Crafting and sewing',
                'International product specifications',
                'Technical drawings'
            ]
        },
        {
            fromUnit: 'inches',
            toUnit: 'mm',
            factor: 25.4,
            description: 'Convert inches to millimeters with precision. Essential for engineering and technical measurements.',
            uses: [
                'Engineering specifications',
                'Manufacturing',
                'Technical drawings',
                'Precision measurements'
            ]
        },
        {
            fromUnit: 'miles',
            toUnit: 'km',
            factor: 1.60934,
            description: 'Convert miles to kilometers easily. Perfect for travel planning and distance calculations.',
            uses: [
                'Travel planning',
                'Map distances',
                'Running and cycling routes',
                'Geographic calculations'
            ]
        },
        {
            fromUnit: 'cm',
            toUnit: 'inches',
            factor: 0.393701,
            description: 'Convert centimeters to inches instantly. Ideal for international measurements and conversions.',
            uses: [
                'International shopping',
                'Furniture measurements',
                'Home improvement',
                'Crafting projects'
            ]
        },
        {
            fromUnit: 'mm',
            toUnit: 'inches',
            factor: 0.0393701,
            description: 'Convert millimeters to inches with precision. Perfect for technical and engineering work.',
            uses: [
                'Engineering design',
                'Manufacturing',
                'Technical specifications',
                'Tool measurements'
            ]
        },
        {
            fromUnit: 'meters',
            toUnit: 'feet',
            factor: 3.28084,
            description: 'Convert meters to feet instantly. Essential for construction, architecture, and international measurements.',
            uses: [
                'Construction projects',
                'Building measurements',
                'International specifications',
                'Height measurements'
            ]
        },
        {
            fromUnit: 'meters',
            toUnit: 'inches',
            factor: 39.3701,
            description: 'Convert meters to inches accurately. Perfect for precise measurements and international conversions.',
            uses: [
                'Detailed measurements',
                'Manufacturing',
                'Furniture dimensions',
                'Technical specifications'
            ]
        },
        {
            fromUnit: 'meters',
            toUnit: 'miles',
            factor: 0.000621371,
            description: 'Convert meters to miles easily. Ideal for long-distance measurements and geographic calculations.',
            uses: [
                'Geographic distances',
                'Marathon routes',
                'Land surveying',
                'Navigation'
            ]
        },
        {
            fromUnit: 'meters',
            toUnit: 'km',
            factor: 0.001,
            description: 'Convert meters to kilometers simply. Perfect for distance measurements and metric conversions.',
            uses: [
                'Distance calculations',
                'Running routes',
                'Geographic measurements',
                'Scientific calculations'
            ]
        },
        {
            fromUnit: 'feet',
            toUnit: 'meters',
            factor: 0.3048,
            description: 'Convert feet to meters accurately. Essential for international measurements and construction.',
            uses: [
                'Construction projects',
                'Building specifications',
                'International trade',
                'Engineering calculations'
            ]
        },
        {
            fromUnit: 'yards',
            toUnit: 'meters',
            factor: 0.9144,
            description: 'Convert yards to meters precisely. Perfect for sports and construction measurements.',
            uses: [
                'Sports field dimensions',
                'Construction planning',
                'Landscaping projects',
                'Athletic facilities'
            ]
        },
        {
            fromUnit: 'km',
            toUnit: 'miles',
            factor: 0.621371,
            description: 'Convert kilometers to miles easily. Ideal for travel and distance planning.',
            uses: [
                'Travel planning',
                'Running distances',
                'Geographic calculations',
                'Navigation'
            ]
        }
    ],
    
    weight: [
        {
            fromUnit: 'kg',
            toUnit: 'lbs',
            factor: 2.20462,
            description: 'Convert kilograms to pounds instantly. Essential for weight tracking and international measurements.',
            uses: [
                'Personal weight tracking',
                'Fitness and bodybuilding',
                'Shipping calculations',
                'Recipe conversions'
            ]
        },
        {
            fromUnit: 'grams',
            toUnit: 'ounces',
            factor: 0.035274,
            description: 'Convert grams to ounces accurately. Perfect for cooking and small weight measurements.',
            uses: [
                'Cooking and baking',
                'Postal services',
                'Laboratory measurements',
                'Jewelry weight'
            ]
        },
        {
            fromUnit: 'pounds',
            toUnit: 'ounces',
            factor: 16,
            description: 'Convert pounds to ounces easily. Ideal for cooking, baking, and general weight measurements.',
            uses: [
                'Cooking measurements',
                'Food portioning',
                'Package weights',
                'Recipe scaling'
            ]
        },
        {
            fromUnit: 'ml',
            toUnit: 'cups',
            factor: 0.00422675,
            description: 'Convert milliliters to cups accurately. Perfect for cooking and recipe conversions.',
            uses: [
                'Recipe conversions',
                'Cooking measurements',
                'Baking precision',
                'Liquid measurements'
            ]
        },
        {
            fromUnit: 'lbs',
            toUnit: 'kg',
            factor: 0.453592,
            description: 'Convert pounds to kilograms instantly. Perfect for international weight measurements.',
            uses: [
                'International shipping',
                'Personal weight tracking',
                'Gym equipment settings',
                'Medical records'
            ]
        },
        {
            fromUnit: 'ounces',
            toUnit: 'grams',
            factor: 28.3495,
            description: 'Convert ounces to grams accurately. Essential for cooking and precise measurements.',
            uses: [
                'Recipe conversion',
                'Food portioning',
                'Scientific measurements',
                'Jewelry weighing'
            ]
        },
        {
            fromUnit: 'tons',
            toUnit: 'kg',
            factor: 907.185,
            description: 'Convert tons to kilograms precisely. Perfect for heavy cargo and industrial use.',
            uses: [
                'Shipping logistics',
                'Industrial weighing',
                'Construction materials',
                'Bulk material handling'
            ]
        }
    ],
    
    temperature: [
        {
            fromUnit: 'celsius',
            toUnit: 'fahrenheit',
            factor: null,
            formula: 'Temperature in °F = (Temperature in °C × 9/5) + 32',
            description: 'Convert Celsius to Fahrenheit temperatures easily. Essential for weather and cooking.',
            uses: [
                'Weather temperature conversion',
                'Cooking and baking',
                'Industrial processes',
                'Scientific calculations'
            ]
        },
        {
            fromUnit: 'kelvin',
            toUnit: 'celsius',
            factor: null,
            formula: 'Temperature in °C = K - 273.15',
            description: 'Convert Kelvin to Celsius temperatures accurately. Perfect for scientific calculations.',
            uses: [
                'Scientific research',
                'Physics calculations',
                'Chemical processes',
                'Temperature studies'
            ]
        },
        {
            fromUnit: 'fahrenheit',
            toUnit: 'kelvin',
            factor: null,
            formula: 'Temperature in K = (°F - 32) × 5/9 + 273.15',
            description: 'Convert Fahrenheit to Kelvin temperatures precisely. Essential for scientific work.',
            uses: [
                'Scientific conversions',
                'Laboratory work',
                'Physics experiments',
                'Temperature analysis'
            ]
        },
        {
            fromUnit: 'fahrenheit',
            toUnit: 'celsius',
            factor: null,
            formula: 'Temperature in °C = (°F - 32) × 5/9',
            description: 'Convert Fahrenheit to Celsius temperatures easily. Perfect for weather and cooking.',
            uses: [
                'Weather forecasts',
                'Cooking temperatures',
                'International travel',
                'Climate data'
            ]
        }
    ],
    
    area: [
        {
            fromUnit: 'square-feet',
            toUnit: 'square-meters',
            factor: 0.092903,
            description: 'Convert square feet to square meters accurately. Perfect for real estate and construction.',
            uses: [
                'Property measurements',
                'Construction planning',
                'Room dimensions',
                'Floor area calculations'
            ]
        },
        {
            fromUnit: 'acres',
            toUnit: 'hectares',
            factor: 0.404686,
            description: 'Convert acres to hectares easily. Ideal for land measurements and agriculture.',
            uses: [
                'Land surveying',
                'Agricultural planning',
                'Property assessment',
                'Land development'
            ]
        },
        {
            fromUnit: 'square-meters',
            toUnit: 'square-feet',
            factor: 10.7639,
            description: 'Convert square meters to square feet quickly. Essential for real estate and construction.',
            uses: [
                'Property listings',
                'Building plans',
                'Interior design',
                'Space planning'
            ]
        },
        {
            fromUnit: 'hectares',
            toUnit: 'acres',
            factor: 2.47105,
            description: 'Convert hectares to acres accurately. Perfect for land measurement and agriculture.',
            uses: [
                'Farm planning',
                'Land development',
                'Real estate',
                'Conservation projects'
            ]
        },
        {
            fromUnit: 'square-km',
            toUnit: 'square-miles',
            factor: 0.386102,
            description: 'Convert square kilometers to square miles precisely. Ideal for geographic calculations.',
            uses: [
                'Geographic analysis',
                'Territory mapping',
                'Urban planning',
                'Environmental studies'
            ]
        }
    ],
    
    pressure: [
        {
            fromUnit: 'kpa',
            toUnit: 'psi',
            factor: 0.145038,
            description: 'Convert kilopascals to PSI accurately. Essential for engineering and technical work.',
            uses: [
                'Tire pressure',
                'Industrial processes',
                'Engineering calculations',
                'System pressure monitoring'
            ]
        },
        {
            fromUnit: 'bar',
            toUnit: 'psi',
            factor: 14.5038,
            description: 'Convert bar to PSI precisely. Perfect for pressure system measurements.',
            uses: [
                'Hydraulic systems',
                'Pneumatic equipment',
                'Industrial processes',
                'Pressure vessel monitoring'
            ]
        },
        {
            fromUnit: 'psi',
            toUnit: 'kpa',
            factor: 6.89476,
            description: 'Convert PSI to kilopascals accurately. Perfect for engineering and technical work.',
            uses: [
                'Industrial processes',
                'Pneumatic systems',
                'Hydraulic equipment',
                'Tire pressure'
            ]
        },
        {
            fromUnit: 'psi',
            toUnit: 'bar',
            factor: 0.0689476,
            description: 'Convert PSI to bar precisely. Essential for pressure system measurements.',
            uses: [
                'Industrial equipment',
                'Compressed air systems',
                'Hydraulic machinery',
                'Process control'
            ]
        },
        {
            fromUnit: 'mmhg',
            toUnit: 'kpa',
            factor: 0.133322,
            description: 'Convert millimeters of mercury to kilopascals. Perfect for medical and scientific use.',
            uses: [
                'Blood pressure readings',
                'Medical equipment',
                'Atmospheric pressure',
                'Laboratory measurements'
            ]
        }
    ],

    volume: [
        {
            fromUnit: 'liters',
            toUnit: 'gallons',
            factor: 0.264172,
            description: 'Convert liters to gallons accurately. Perfect for fuel, liquid measurements, and tank capacity.',
            uses: [
                'Fuel consumption',
                'Tank capacity',
                'Water usage',
                'Industrial liquids'
            ]
        },
        {
            fromUnit: 'cubic-meters',
            toUnit: 'cubic-feet',
            factor: 35.3147,
            description: 'Convert cubic meters to cubic feet precisely. Essential for volume and space calculations.',
            uses: [
                'Shipping containers',
                'Room volume',
                'Storage capacity',
                'Construction materials'
            ]
        },
        {
            fromUnit: 'milliliters',
            toUnit: 'fluid-ounces',
            factor: 0.033814,
            description: 'Convert milliliters to fluid ounces easily. Perfect for cooking and beverage measurements.',
            uses: [
                'Cooking recipes',
                'Beverage mixing',
                'Medicine dosage',
                'Laboratory work'
            ]
        }
    ],

    speed: [
        {
            fromUnit: 'kmh',
            toUnit: 'mph',
            factor: 0.621371,
            description: 'Convert kilometers per hour to miles per hour instantly. Essential for speed and travel calculations.',
            uses: [
                'Vehicle speed',
                'Travel planning',
                'Sports performance',
                'Weather systems'
            ]
        },
        {
            fromUnit: 'ms',
            toUnit: 'kmh',
            factor: 3.6,
            description: 'Convert meters per second to kilometers per hour accurately. Perfect for physics and sports.',
            uses: [
                'Physics calculations',
                'Athletic performance',
                'Wind speed',
                'Projectile motion'
            ]
        },
        {
            fromUnit: 'knots',
            toUnit: 'mph',
            factor: 1.15078,
            description: 'Convert knots to miles per hour precisely. Ideal for marine and aviation speeds.',
            uses: [
                'Marine navigation',
                'Aviation',
                'Weather forecasting',
                'Sailing'
            ]
        }
    ],

    digital: [
        {
            fromUnit: 'mb',
            toUnit: 'kb',
            factor: 1024,
            description: 'Convert megabytes to kilobytes instantly. Essential for file size and storage calculations.',
            uses: [
                'File transfers',
                'Storage planning',
                'Download sizes',
                'Memory management'
            ]
        },
        {
            fromUnit: 'gb',
            toUnit: 'mb',
            factor: 1024,
            description: 'Convert gigabytes to megabytes accurately. Perfect for storage and download calculations.',
            uses: [
                'Storage capacity',
                'Download time estimation',
                'System requirements',
                'Backup planning'
            ]
        },
        {
            fromUnit: 'tb',
            toUnit: 'gb',
            factor: 1024,
            description: 'Convert terabytes to gigabytes precisely. Ideal for large storage calculations.',
            uses: [
                'Server storage',
                'Data center planning',
                'Backup systems',
                'Media libraries'
            ]
        }
    ],

    time: [
        {
            fromUnit: 'hours',
            toUnit: 'minutes',
            factor: 60,
            description: 'Convert hours to minutes easily. Perfect for time management and scheduling.',
            uses: [
                'Schedule planning',
                'Task duration',
                'Time tracking',
                'Project management'
            ]
        },
        {
            fromUnit: 'days',
            toUnit: 'hours',
            factor: 24,
            description: 'Convert days to hours accurately. Essential for project and event planning.',
            uses: [
                'Project timelines',
                'Event planning',
                'Work schedules',
                'Travel planning'
            ]
        },
        {
            fromUnit: 'weeks',
            toUnit: 'days',
            factor: 7,
            description: 'Convert weeks to days precisely. Ideal for long-term planning.',
            uses: [
                'Project duration',
                'Vacation planning',
                'Contract periods',
                'Schedule management'
            ]
        }
    ],

    energy: [
        {
            fromUnit: 'joules',
            toUnit: 'calories',
            factor: 0.239006,
            description: 'Convert joules to calories accurately. Essential for energy and nutrition calculations.',
            uses: [
                'Food energy content',
                'Exercise calculations',
                'Scientific research',
                'Metabolic studies'
            ]
        },
        {
            fromUnit: 'kwh',
            toUnit: 'joules',
            factor: 3600000,
            description: 'Convert kilowatt-hours to joules precisely. Perfect for electrical energy calculations.',
            uses: [
                'Electricity consumption',
                'Power generation',
                'Energy efficiency',
                'Utility calculations'
            ]
        },
        {
            fromUnit: 'calories',
            toUnit: 'kilojoules',
            factor: 0.004184,
            description: 'Convert calories to kilojoules easily. Ideal for nutritional calculations.',
            uses: [
                'Dietary planning',
                'Nutritional analysis',
                'Food labeling',
                'Metabolism studies'
            ]
        }
    ],

    frequency: [
        {
            fromUnit: 'hz',
            toUnit: 'khz',
            factor: 0.001,
            description: 'Convert hertz to kilohertz accurately. Essential for electronic and audio applications.',
            uses: [
                'Audio frequency',
                'Radio communications',
                'Electronic design',
                'Signal processing'
            ]
        },
        {
            fromUnit: 'mhz',
            toUnit: 'ghz',
            factor: 0.001,
            description: 'Convert megahertz to gigahertz precisely. Perfect for computing and telecommunications.',
            uses: [
                'CPU clock speeds',
                'Wireless communications',
                'Network bandwidth',
                'Radar systems'
            ]
        }
    ],

    data_transfer: [
        {
            fromUnit: 'mbps',
            toUnit: 'gbps',
            factor: 0.001,
            description: 'Convert megabits per second to gigabits per second. Essential for network speed calculations.',
            uses: [
                'Network planning',
                'Internet speeds',
                'Data center capacity',
                'Bandwidth monitoring'
            ]
        },
        {
            fromUnit: 'kbps',
            toUnit: 'mbps',
            factor: 0.001,
            description: 'Convert kilobits per second to megabits per second. Perfect for internet speed calculations.',
            uses: [
                'Internet connectivity',
                'Streaming quality',
                'Download speeds',
                'Network monitoring'
            ]
        }
    ],

    angle: [
        {
            fromUnit: 'degrees',
            toUnit: 'radians',
            factor: 0.0174533,
            description: 'Convert degrees to radians accurately. Essential for mathematical and engineering calculations.',
            uses: [
                'Trigonometry',
                'Engineering design',
                'Navigation',
                'Physics calculations'
            ]
        },
        {
            fromUnit: 'radians',
            toUnit: 'degrees',
            factor: 57.2958,
            description: 'Convert radians to degrees precisely. Perfect for angular measurements.',
            uses: [
                'Mathematics',
                'Physics',
                'Astronomy',
                'Engineering'
            ]
        }
    ],

    fuel_economy: [
        {
            fromUnit: 'mpg',
            toUnit: 'kpl',
            factor: 0.425144,
            description: 'Convert miles per gallon to kilometers per liter. Essential for vehicle efficiency comparisons.',
            uses: [
                'Vehicle efficiency',
                'Fuel consumption',
                'Travel planning',
                'Fleet management'
            ]
        },
        {
            fromUnit: 'lper100km',
            toUnit: 'mpg',
            factor: 235.215,
            description: 'Convert liters per 100km to miles per gallon. Perfect for international fuel economy comparison.',
            uses: [
                'Car comparisons',
                'Fuel efficiency',
                'Economic analysis',
                'Environmental impact'
            ]
        }
    ],

    currency: [
        {
            fromUnit: 'usd',
            toUnit: 'eur',
            factor: 0.85,
            description: 'Convert US Dollars to Euros with current exchange rates. Essential for international transactions.',
            uses: [
                'International business',
                'Travel planning',
                'Online shopping',
                'Investment tracking'
            ]
        },
        {
            fromUnit: 'gbp',
            toUnit: 'usd',
            factor: 1.25,
            description: 'Convert British Pounds to US Dollars accurately. Perfect for international finance.',
            uses: [
                'Foreign exchange',
                'Business transactions',
                'Travel budgeting',
                'Market analysis'
            ]
        }
    ],

    power: [
        {
            fromUnit: 'watts',
            toUnit: 'horsepower',
            factor: 0.00134102,
            description: 'Convert watts to horsepower precisely. Essential for engine and motor specifications.',
            uses: [
                'Engine specifications',
                'Motor ratings',
                'Power equipment',
                'Industrial machinery'
            ]
        },
        {
            fromUnit: 'kilowatts',
            toUnit: 'watts',
            factor: 1000,
            description: 'Convert kilowatts to watts easily. Perfect for electrical calculations.',
            uses: [
                'Electrical systems',
                'Power consumption',
                'Energy efficiency',
                'Appliance ratings'
            ]
        }
    ],

    density: [
        {
            fromUnit: 'kgm3',
            toUnit: 'gcm3',
            factor: 0.001,
            description: 'Convert kg/m³ to g/cm³ accurately. Essential for material science.',
            uses: [
                'Material density',
                'Fluid properties',
                'Engineering calculations',
                'Scientific research'
            ]
        },
        {
            fromUnit: 'lbft3',
            toUnit: 'kgm3',
            factor: 16.0185,
            description: 'Convert lb/ft³ to kg/m³ precisely. Perfect for engineering calculations.',
            uses: [
                'Construction materials',
                'Fluid dynamics',
                'Material properties',
                'Industrial processes'
            ]
        }
    ],

    flow_rate: [
        {
            fromUnit: 'lpm',
            toUnit: 'gpm',
            factor: 0.264172,
            description: 'Convert liters per minute to gallons per minute. Essential for fluid flow calculations.',
            uses: [
                'Pump specifications',
                'Water flow',
                'Industrial processes',
                'Irrigation systems'
            ]
        },
        {
            fromUnit: 'm3s',
            toUnit: 'lps',
            factor: 1000,
            description: 'Convert cubic meters per second to liters per second. Perfect for large flow measurements.',
            uses: [
                'River flow',
                'Industrial flow',
                'Water treatment',
                'Hydraulic systems'
            ]
        }
    ],

    force: [
        {
            fromUnit: 'newtons',
            toUnit: 'lbf',
            factor: 0.224809,
            description: 'Convert Newtons to pound-force accurately. Essential for engineering calculations.',
            uses: [
                'Engineering design',
                'Force analysis',
                'Mechanical systems',
                'Physics calculations'
            ]
        },
        {
            fromUnit: 'kn',
            toUnit: 'newtons',
            factor: 1000,
            description: 'Convert kilonewtons to newtons precisely. Perfect for structural engineering.',
            uses: [
                'Structural analysis',
                'Material testing',
                'Construction',
                'Load calculations'
            ]
        }
    ],

    torque: [
        {
            fromUnit: 'nm',
            toUnit: 'ftlb',
            factor: 0.737562,
            description: 'Convert Newton-meters to foot-pounds accurately. Essential for mechanical engineering.',
            uses: [
                'Engine specifications',
                'Mechanical design',
                'Tool calibration',
                'Vehicle maintenance'
            ]
        },
        {
            fromUnit: 'kgfm',
            toUnit: 'nm',
            factor: 9.80665,
            description: 'Convert kilogram-force meters to Newton-meters. Perfect for automotive applications.',
            uses: [
                'Vehicle torque',
                'Equipment specs',
                'Machine design',
                'Maintenance work'
            ]
        }
    ],

    sound: [
        {
            fromUnit: 'db',
            toUnit: 'dbm',
            factor: null,
            formula: 'dBm = dB + 30',
            description: 'Convert decibels to dBm accurately. Essential for audio and signal measurements.',
            uses: [
                'Audio engineering',
                'Signal strength',
                'Acoustics',
                'Sound measurement'
            ]
        },
        {
            fromUnit: 'dbw',
            toUnit: 'dbm',
            factor: null,
            formula: 'dBm = dBW + 30',
            description: 'Convert dBW to dBm precisely. Perfect for power measurements.',
            uses: [
                'RF engineering',
                'Power measurements',
                'Signal analysis',
                'Communications'
            ]
        }
    ],

    radiation: [
        {
            fromUnit: 'sievert',
            toUnit: 'rem',
            factor: 100,
            description: 'Convert sieverts to rem accurately. Essential for radiation protection and safety.',
            uses: [
                'Radiation protection',
                'Nuclear safety',
                'Medical radiation',
                'Research facilities'
            ]
        },
        {
            fromUnit: 'gray',
            toUnit: 'rad',
            factor: 100,
            description: 'Convert gray to rad precisely. Perfect for radiation dose measurements.',
            uses: [
                'Radiation therapy',
                'Industrial radiation',
                'Research applications',
                'Safety monitoring'
            ]
        },
        {
            fromUnit: 'becquerel',
            toUnit: 'curie',
            factor: 2.7027e-11,
            description: 'Convert becquerel to curie accurately. Essential for radioactivity measurements.',
            uses: [
                'Nuclear medicine',
                'Radioactive materials',
                'Research labs',
                'Waste management'
            ]
        }
    ],

    electrical: [
        {
            fromUnit: 'volt',
            toUnit: 'millivolt',
            factor: 1000,
            description: 'Convert volts to millivolts instantly. Perfect for electronic measurements.',
            uses: [
                'Electronics',
                'Circuit design',
                'Power supplies',
                'Battery systems'
            ]
        },
        {
            fromUnit: 'ampere',
            toUnit: 'milliamp',
            factor: 1000,
            description: 'Convert amperes to milliamps accurately. Essential for electrical work.',
            uses: [
                'Circuit analysis',
                'Component testing',
                'Power consumption',
                'Battery charging'
            ]
        },
        {
            fromUnit: 'ohm',
            toUnit: 'kiloohm',
            factor: 0.001,
            description: 'Convert ohms to kiloohms precisely. Perfect for resistance measurements.',
            uses: [
                'Resistance calculation',
                'Circuit design',
                'Component selection',
                'Electrical testing'
            ]
        },
        {
            fromUnit: 'watt',
            toUnit: 'kilowatt',
            factor: 0.001,
            description: 'Convert watts to kilowatts easily. Ideal for power calculations.',
            uses: [
                'Power consumption',
                'Energy efficiency',
                'Appliance ratings',
                'System design'
            ]
        }
    ],

    viscosity: [
        {
            fromUnit: 'pas',
            toUnit: 'poise',
            factor: 10,
            description: 'Convert Pascal-seconds to poise accurately. Essential for fluid dynamics.',
            uses: [
                'Fluid mechanics',
                'Material science',
                'Chemical processing',
                'Quality control'
            ]
        },
        {
            fromUnit: 'stokes',
            toUnit: 'cst',
            factor: 100,
            description: 'Convert stokes to centistokes precisely. Perfect for kinematic viscosity.',
            uses: [
                'Oil industry',
                'Lubricant testing',
                'Fluid dynamics',
                'Material processing'
            ]
        }
    ],

    concentration: [
        {
            fromUnit: 'molarity',
            toUnit: 'molality',
            factor: null,
            formula: 'Requires density information',
            description: 'Convert molarity to molality. Essential for chemical calculations.',
            uses: [
                'Chemical analysis',
                'Solution preparation',
                'Laboratory work',
                'Research'
            ]
        },
        {
            fromUnit: 'ppm',
            toUnit: 'ppb',
            factor: 1000,
            description: 'Convert parts per million to parts per billion precisely.',
            uses: [
                'Water quality',
                'Environmental testing',
                'Chemical analysis',
                'Quality control'
            ]
        }
    ],

    typography: [
        {
            fromUnit: 'points',
            toUnit: 'pixels',
            factor: 1.333333,
            description: 'Convert points to pixels accurately. Essential for digital typography.',
            uses: [
                'Web design',
                'Digital publishing',
                'Graphic design',
                'UI development'
            ]
        },
        {
            fromUnit: 'em',
            toUnit: 'pixels',
            factor: 16,
            description: 'Convert em to pixels precisely. Perfect for responsive design.',
            uses: [
                'Web development',
                'Responsive design',
                'CSS styling',
                'Mobile apps'
            ]
        }
    ],

    engineering: {
        velocity: [
            {
                fromUnit: 'mps',
                toUnit: 'fps',
                factor: 3.28084,
                description: 'Convert meters per second to feet per second. Essential for engineering calculations.',
                uses: [
                    'Fluid dynamics',
                    'Projectile motion',
                    'Engineering simulations',
                    'Physics calculations'
                ]
            },
            {
                fromUnit: 'rps',
                toUnit: 'rpm',
                factor: 60,
                description: 'Convert revolutions per second to revolutions per minute. Perfect for rotational mechanics.',
                uses: [
                    'Motor specifications',
                    'Machine design',
                    'Turbine analysis',
                    'Mechanical systems'
                ]
            }
        ],
        
        torque: [
            {
                fromUnit: 'nm',
                toUnit: 'ftlb',
                factor: 0.737562,
                description: 'Convert Newton-meters to foot-pounds. Essential for mechanical engineering.',
                uses: [
                    'Engine specifications',
                    'Mechanical design',
                    'Tool calibration',
                    'Vehicle maintenance'
                ]
            },
            {
                fromUnit: 'kgfm',
                toUnit: 'nm',
                factor: 9.80665,
                description: 'Convert kilogram-force meters to Newton-meters. Perfect for automotive applications.',
                uses: [
                    'Vehicle torque',
                    'Equipment specs',
                    'Machine design',
                    'Maintenance work'
                ]
            }
        ],
        
        inertia: [
            {
                fromUnit: 'kgm2',
                toUnit: 'lbft2',
                factor: 23.7304,
                description: 'Convert kilogram-meter² to pound-foot². Essential for rotational dynamics.',
                uses: [
                    'Mechanical design',
                    'Motor selection',
                    'System dynamics',
                    'Machine analysis'
                ]
            }
        ],
        
        stress: [
            {
                fromUnit: 'mpa',
                toUnit: 'psi',
                factor: 145.038,
                description: 'Convert megapascals to pounds per square inch. Perfect for structural analysis.',
                uses: [
                    'Material strength',
                    'Structural design',
                    'Pressure vessels',
                    'Mechanical testing'
                ]
            },
            {
                fromUnit: 'kpa',
                toUnit: 'bar',
                factor: 0.01,
                description: 'Convert kilopascals to bar. Essential for pressure calculations.',
                uses: [
                    'Process engineering',
                    'Fluid systems',
                    'Pressure testing',
                    'System design'
                ]
            }
        ],
        
        strain: [
            {
                fromUnit: 'mmm',
                toUnit: 'inin',
                factor: 1,
                description: 'Convert mm/m to in/in. Perfect for material deformation analysis.',
                uses: [
                    'Material testing',
                    'Structural analysis',
                    'Deformation studies',
                    'Quality control'
                ]
            }
        ],
        
        thermal: [
            {
                fromUnit: 'wm2k',
                toUnit: 'btuhft2f',
                factor: 0.176110,
                description: 'Convert W/(m²·K) to BTU/(h·ft²·°F). Essential for heat transfer calculations.',
                uses: [
                    'Heat exchangers',
                    'Thermal design',
                    'HVAC systems',
                    'Process engineering'
                ]
            }
        ],
        
        power_density: [
            {
                fromUnit: 'wkg',
                toUnit: 'hpib',
                factor: 0.00164,
                description: 'Convert watts per kilogram to horsepower per pound. Perfect for power systems.',
                uses: [
                    'Motor design',
                    'Aircraft systems',
                    'Power equipment',
                    'System efficiency'
                ]
            }
        ]
    },

    calculators: {
        scientific: [
            {
                name: 'scientific',
                type: 'calculator',
                description: 'Advanced scientific calculator with trigonometric and logarithmic functions.',
                features: [
                    'Trigonometric functions',
                    'Logarithmic calculations',
                    'Complex numbers',
                    'Unit conversions'
                ]
            }
        ],
        
        financial: [
            {
                name: 'compound-interest',
                type: 'calculator',
                description: 'Calculate compound interest and investment growth over time.',
                features: [
                    'Interest calculations',
                    'Investment planning',
                    'Loan amortization',
                    'Retirement planning'
                ]
            },
            {
                name: 'mortgage',
                type: 'calculator',
                description: 'Calculate mortgage payments, interest, and amortization schedules.',
                features: [
                    'Monthly payments',
                    'Total interest',
                    'Amortization table',
                    'Extra payment analysis'
                ]
            }
        ],
        
        statistical: [
            {
                name: 'statistics',
                type: 'calculator',
                description: 'Statistical calculations including mean, median, mode, and standard deviation.',
                features: [
                    'Descriptive statistics',
                    'Probability calculations',
                    'Distribution analysis',
                    'Data visualization'
                ]
            }
        ]
    },

    seo_tools: {
        meta_tags: [
            {
                name: 'meta-generator',
                type: 'generator',
                description: 'Generate optimized meta tags for better search engine visibility.',
                features: [
                    'Title optimization',
                    'Description generation',
                    'Keywords analysis',
                    'Social media tags'
                ]
            }
        ],
        
        keyword_tools: [
            {
                name: 'keyword-density',
                type: 'analyzer',
                description: 'Analyze keyword density and distribution in content.',
                features: [
                    'Keyword frequency',
                    'Density calculation',
                    'Phrase analysis',
                    'Content optimization'
                ]
            },
            {
                name: 'keyword-suggestion',
                type: 'generator',
                description: 'Generate related keywords and long-tail variations.',
                features: [
                    'Related keywords',
                    'Long-tail variations',
                    'Search volume',
                    'Competition analysis'
                ]
            }
        ],
        
        content_tools: [
            {
                name: 'readability',
                type: 'analyzer',
                description: 'Analyze content readability and suggest improvements.',
                features: [
                    'Readability scores',
                    'Grammar check',
                    'Style suggestions',
                    'Content optimization'
                ]
            }
        ]
    },

    text_tools: {
        formatters: [
            {
                name: 'case-converter',
                type: 'converter',
                description: 'Convert text between different cases (upper, lower, title, etc.).',
                features: [
                    'Case conversion',
                    'Text formatting',
                    'Batch processing',
                    'Custom rules'
                ]
            }
        ],
        
        counters: [
            {
                name: 'word-counter',
                type: 'analyzer',
                description: 'Count words, characters, sentences, and paragraphs.',
                features: [
                    'Word count',
                    'Character count',
                    'Reading time',
                    'Statistics'
                ]
            }
        ],
        
        generators: [
            {
                name: 'lorem-ipsum',
                type: 'generator',
                description: 'Generate placeholder text in various lengths and formats.',
                features: [
                    'Custom length',
                    'Multiple formats',
                    'Language options',
                    'Copy to clipboard'
                ]
            }
        ],
        
        cleaners: [
            {
                name: 'text-cleaner',
                type: 'processor',
                description: 'Clean and format text by removing extra spaces, fixing formatting.',
                features: [
                    'Space removal',
                    'Line formatting',
                    'Special characters',
                    'Batch processing'
                ]
            }
        ]
    }
};

// Template for the HTML file
function generateConverterHTML(category, converter) {
    const fromUnitCapitalized = converter.fromUnit.charAt(0).toUpperCase() + converter.fromUnit.slice(1);
    const toUnitCapitalized = converter.toUnit.charAt(0).toUpperCase() + converter.toUnit.slice(1);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${converter.description}">
    <title>${fromUnitCapitalized} to ${toUnitCapitalized} Converter - Multi-Tools</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="../styles/main.css">
    <link rel="stylesheet" href="../styles/tool-page.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Add dark mode stylesheet -->
    <link rel="stylesheet" href="../styles/dark-mode.css">
    <!-- Add accessibility enhancements -->
    <link rel="stylesheet" href="../styles/accessibility.css">
</head>
<body>
    <!-- Header will be loaded dynamically -->
    <div id="header-placeholder"></div>

    <!-- Main Content -->
    <main class="container py-4">
        <div class="row">
            <!-- Tool Content -->
            <div class="col-lg-8">
                <div class="card tool-card">
                    <div class="card-header">
                        <h1 class="tool-title">${fromUnitCapitalized} to ${toUnitCapitalized} Converter</h1>
                    </div>
                    <div class="card-body">
                        <div class="tool-description mb-4">
                            <p>${converter.description}</p>
                        </div>
                        
                        <!-- Error Message Display -->
                        <div id="errorMessage" class="alert alert-danger" style="display: none;"></div>
                        
                        <!-- New: Quick Convert Presets -->
                        <div class="quick-convert-section mb-4">
                            <h4>Quick Convert</h4>
                            <div class="btn-group" role="group">
                                <button type="button" class="btn btn-outline-primary quick-convert" data-value="1">1 ${converter.fromUnit}</button>
                                <button type="button" class="btn btn-outline-primary quick-convert" data-value="10">10 ${converter.fromUnit}</button>
                                <button type="button" class="btn btn-outline-primary quick-convert" data-value="100">100 ${converter.fromUnit}</button>
                            </div>
                        </div>
                        
                        <!-- Enhanced Tool Input Section -->
                        <div class="tool-input-section">
                            <div class="row g-3 align-items-center">
                                <div class="col-md-5">
                                    <div class="input-group">
                                        <input type="number" class="form-control" id="${converter.fromUnit}Input" placeholder="Enter ${converter.fromUnit}" step="any">
                                        <span class="input-group-text">${converter.fromUnit}</span>
                                    </div>
                                </div>
                                <div class="col-md-2 text-center">
                                    <i class="fas fa-exchange-alt"></i>
                                </div>
                                <div class="col-md-5">
                                    <div class="input-group">
                                        <input type="number" class="form-control" id="${converter.toUnit}Input" placeholder="${toUnitCapitalized} result" step="any" readonly>
                                        <span class="input-group-text">${converter.toUnit}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-12">
                                    <button class="btn btn-primary" id="convertBtn">Convert</button>
                                    <button class="btn btn-secondary" id="resetBtn">Reset</button>
                                </div>
                            </div>
                            
                            <!-- New: Swap Units Button -->
                            <div class="text-center my-3">
                                <button class="btn btn-link" id="swapUnitsBtn">
                                    <i class="fas fa-exchange-alt"></i> Swap Units
                                </button>
                            </div>
                            
                            <!-- New: Copy Result Button -->
                            <div class="mt-3">
                                <button class="btn btn-outline-secondary" id="copyResultBtn">
                                    <i class="fas fa-copy"></i> Copy Result
                                </button>
                            </div>
                        </div>

                        <!-- New: Unit Comparison Table -->
                        <div class="card mt-4">
                            <div class="card-header">
                                <h3>Unit Comparison</h3>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-hover" id="comparisonTable">
                                        <thead>
                                            <tr>
                                                <th>${capitalizeFirst(converter.fromUnit)}</th>
                                                <th>${capitalizeFirst(converter.toUnit)}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <!-- Populated by JavaScript -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- New: Favorites Section -->
                        <div class="card mt-4">
                            <div class="card-header">
                                <h3>Favorite Conversions</h3>
                            </div>
                            <div class="card-body">
                                <div id="favoritesList">
                                    <!-- Populated by JavaScript -->
                                </div>
                                <button class="btn btn-outline-primary mt-2" id="addToFavoritesBtn">
                                    <i class="fas fa-star"></i> Save Current Conversion
                                </button>
                            </div>
                        </div>

                        <!-- New: Export History -->
                        <div class="card mt-4">
                            <div class="card-header">
                                <h3>Conversion History</h3>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <button class="btn btn-outline-secondary" id="exportHistoryBtn">
                                        <i class="fas fa-download"></i> Export History
                                    </button>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-sm" id="historyTable">
                                        <thead>
                                            <tr>
                                                <th>${capitalizeFirst(converter.fromUnit)}</th>
                                                <th>${capitalizeFirst(converter.toUnit)}</th>
                                                <th>Time</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="historyTableBody">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- New: Reference Values -->
                        <div class="card mt-4">
                            <div class="card-header">
                                <h3>Common Reference Values</h3>
                            </div>
                            <div class="card-body">
                                <div id="referenceValues">
                                    <!-- Populated by JavaScript -->
                                </div>
                            </div>
                        </div>

                        <!-- New: Unit System Information -->
                        <div class="card mt-4">
                            <div class="card-header">
                                <h3>Unit System Information</h3>
                            </div>
                            <div class="card-body">
                                <div class="nav nav-tabs" role="tablist">
                                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#overview">
                                        Overview
                                    </button>
                                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#history">
                                        History
                                    </button>
                                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#usage">
                                        Common Usage
                                    </button>
                                </div>
                                <div class="tab-content mt-3">
                                    <div class="tab-pane fade show active" id="overview">
                                        <!-- Unit system overview content -->
                                    </div>
                                    <div class="tab-pane fade" id="history">
                                        <!-- Historical information -->
                                    </div>
                                    <div class="tab-pane fade" id="usage">
                                        <!-- Common usage examples -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Additional Information -->
                <div class="card mt-4">
                    <div class="card-header">
                        <h2>Additional Information</h2>
                    </div>
                    <div class="card-body">
                        <!-- New: Unit Information Tabs -->
                        <ul class="nav nav-tabs" role="tablist">
                            <li class="nav-item">
                        <h3>Common Uses</h3>
                        <ul>
                            ${converter.uses.map(use => `<li>${use}</li>`).join('\n                            ')}
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="col-lg-4">
                <!-- Related Tools -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h3>Related Tools</h3>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                            ${generateRelatedTools(category, converter)}
                        </ul>
                    </div>
                </div>

                <!-- Ad Section -->
                <div class="ad-section">
                    <div class="ad-placeholder">
                        <p class="text-muted">Advertisement Space</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer will be loaded dynamically -->
    <div id="footer-placeholder"></div>

    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JavaScript -->
    <script src="../js/main.js"></script>
    <script src="../js/converters/${category}-constants.js"></script>
    <script src="../js/converters/generic-${category}-converter.js"></script>
    <script>
        // Initialize the converter
        document.addEventListener('DOMContentLoaded', function() {
            const converter = new ${capitalizeFirst(category)}Converter('${converter.fromUnit}', '${converter.toUnit}', ${converter.factor || 'null'});
        });
    </script>

    <!-- Add dark mode toggle -->
    <div class="theme-switch-wrapper">
        <label class="theme-switch" for="checkbox">
            <input type="checkbox" id="checkbox" />
            <div class="slider round"></div>
        </label>
        <em>Dark Mode</em>
    </div>

    <!-- Add accessibility controls -->
    <div class="accessibility-controls">
        <button class="btn btn-outline-secondary" id="increaseFontBtn">
            <i class="fas fa-text-height"></i> Increase Font
        </button>
        <button class="btn btn-outline-secondary" id="decreaseFontBtn">
            <i class="fas fa-text-height fa-flip-vertical"></i> Decrease Font
        </button>
        <button class="btn btn-outline-secondary" id="highContrastBtn">
            <i class="fas fa-adjust"></i> High Contrast
        </button>
    </div>

    <!-- Add keyboard shortcuts help -->
    <div class="keyboard-shortcuts-modal modal fade" id="keyboardShortcutsModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Keyboard Shortcuts</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <ul class="list-group">
                        <li class="list-group-item">Enter - Convert</li>
                        <li class="list-group-item">Esc - Reset</li>
                        <li class="list-group-item">Ctrl + C - Copy Result</li>
                        <li class="list-group-item">Ctrl + D - Toggle Dark Mode</li>
                        <li class="list-group-item">Ctrl + S - Save to Favorites</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Add voice input button -->
    <button class="btn btn-outline-primary voice-input-btn" id="voiceInputBtn">
        <i class="fas fa-microphone"></i> Voice Input
    </button>

    <!-- Add additional scripts -->
    <script src="../js/dark-mode.js"></script>
    <script src="../js/accessibility.js"></script>
    <script src="../js/voice-input.js"></script>
    <script src="../js/keyboard-shortcuts.js"></script>

    <!-- Add new feature scripts -->
    <script src="../js/features/comparison-table.js"></script>
    <script src="../js/features/favorites-manager.js"></script>
    <script src="../js/features/history-export.js"></script>
    <script src="../js/features/reference-values.js"></script>
    <script src="../js/features/unit-information.js"></script>
    <script src="../js/features/mobile-gestures.js"></script>
</body>
</html>`;
}

// Helper function to capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generate related tools links
function generateRelatedTools(category, currentConverter) {
    const tools = converterTools[category]
        .filter(tool => tool !== currentConverter)
        .slice(0, 4)
        .map(tool => {
            const fileName = `${tool.fromUnit}-to-${tool.toUnit}.html`;
            const title = `${capitalizeFirst(tool.fromUnit)} to ${capitalizeFirst(tool.toUnit)} Converter`;
            return `<li><a href="${fileName}">${title}</a></li>`;
        })
        .join('\n                            ');
    return tools;
}

// Function to generate category index pages
function generateCategoryIndexHTML(category, tools) {
    const categoryCapitalized = capitalizeFirst(category);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${categoryCapitalized} conversion tools - Convert between different ${category} units easily">
    <title>${categoryCapitalized} Converters - Multi-Tools</title>
    
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
        <div class="row">
            <!-- Category Content -->
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-header">
                        <h1 class="tool-title">${categoryCapitalized} Conversion Tools</h1>
                    </div>
                    <div class="card-body">
                        <div class="category-description mb-4">
                            <p>Find all available ${category} converters. Quick and accurate ${category} unit conversions for your needs.</p>
                        </div>
                        
                        <!-- Tools Grid -->
                        <div class="row row-cols-1 row-cols-md-2 g-4">
                            ${tools.map(tool => `
                            <div class="col">
                                <div class="card h-100">
                                    <div class="card-body">
                                        <h5 class="card-title">
                                            <a href="${tool.fromUnit}-to-${tool.toUnit}.html" class="text-decoration-none">
                                                ${capitalizeFirst(tool.fromUnit)} to ${capitalizeFirst(tool.toUnit)}
                                            </a>
                                        </h5>
                                        <p class="card-text">${tool.description}</p>
                                    </div>
                                </div>
                            </div>`).join('\n                            ')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="col-lg-4">
                <!-- Other Categories -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h3>Other Converter Categories</h3>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled">
                            ${Object.keys(converterTools)
                                .filter(cat => cat !== category)
                                .map(cat => `<li><a href="../${cat}/index.html">${capitalizeFirst(cat)} Converters</a></li>`)
                                .join('\n                            ')}
                        </ul>
                    </div>
                </div>

                <!-- Ad Section -->
                <div class="ad-section">
                    <div class="ad-placeholder">
                        <p class="text-muted">Advertisement Space</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer will be loaded dynamically -->
    <div id="footer-placeholder"></div>

    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JavaScript -->
    <script src="../js/main.js"></script>
</body>
</html>`;
}

// Ensure the tools directory exists
const toolsDir = path.join(__dirname, '..', 'tools');
if (!fs.existsSync(toolsDir)) {
    fs.mkdirSync(toolsDir, { recursive: true });
}

// Generate all converter tools and category index pages
Object.entries(converterTools).forEach(([category, tools]) => {
    // Create category directory if it doesn't exist
    const categoryDir = path.join(toolsDir, category);
    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
        console.log(`Created directory: tools/${category}`);
    }

    // Generate each tool in the category
    tools.forEach(converter => {
        const fileName = `${converter.fromUnit}-to-${converter.toUnit}.html`;
        const filePath = path.join(categoryDir, fileName);
        
        fs.writeFileSync(filePath, generateConverterHTML(category, converter));
        console.log(`Generated ${category}/${fileName}`);
    });

    // Generate category index page
    const indexPath = path.join(categoryDir, 'index.html');
    fs.writeFileSync(indexPath, generateCategoryIndexHTML(category, tools));
    console.log(`Generated ${category}/index.html`);
});

// Generate main index page
const mainIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Multi-Tools Unit Converters - Convert between different units easily">
    <title>Unit Converters - Multi-Tools</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/tool-page.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Header will be loaded dynamically -->
    <div id="header-placeholder"></div>

    <!-- Main Content -->
    <main class="container py-4">
        <div class="row">
            <div class="col-12">
                <h1 class="text-center mb-4">Unit Converters</h1>
                <p class="text-center mb-5">Choose a category to find the converter you need</p>
                
                <!-- Categories Grid -->
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    ${Object.entries(converterTools).map(([category, tools]) => `
                    <div class="col">
                        <div class="card h-100">
                            <div class="card-body">
                                <h2 class="card-title h5">
                                    <a href="tools/${category}/index.html" class="text-decoration-none">
                                        ${capitalizeFirst(category)} Converters
                                    </a>
                                </h2>
                                <p class="card-text">
                                    ${tools.length} conversion tools available
                                </p>
                                <ul class="list-unstyled">
                                    ${tools.slice(0, 3).map(tool => 
                                        `<li><a href="tools/${category}/${tool.fromUnit}-to-${tool.toUnit}.html">
                                            ${capitalizeFirst(tool.fromUnit)} to ${capitalizeFirst(tool.toUnit)}
                                        </a></li>`
                                    ).join('\n                                    ')}
                                    ${tools.length > 3 ? `<li><a href="tools/${category}/index.html">More...</a></li>` : ''}
                                </ul>
                            </div>
                        </div>
                    </div>`).join('\n                    ')}
                </div>
            </div>
        </div>
    </main>

    <!-- Footer will be loaded dynamically -->
    <div id="footer-placeholder"></div>

    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JavaScript -->
    <script src="js/main.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '..', 'index.html'), mainIndexHTML);
console.log('Generated main index.html');

console.log('All converter tools and index pages generated successfully!'); 