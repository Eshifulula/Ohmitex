import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@ohmitex.local';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin!23456';

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Admin User
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = await prisma.user.upsert({
        where: { email: ADMIN_EMAIL },
        update: {},
        create: {
            email: ADMIN_EMAIL,
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // 2. Services (with enhanced descriptions from Word doc)
    const services = [
        {
            title: 'Design & Assembly of Control Panels',
            slug: 'control-panels',
            description: 'Our DDC controllers range from application specific controllers to network area controllers (automation servers) and are efficient, easy to install and easy to operate. We help you choose the best DDC system that suits your application and need.\\n\\nWhether it is a pump control application or a fan control application, our intelligent motor control panels are keenly designed and assembled to efficiently serve your control needs. We offer a wide range of switchgear brands that gives us the flexibility to meet all our customer needs irrespective of their preferences.',
            icon: 'Cpu',
        },
        {
            title: 'Building Management System (BMS)',
            slug: 'bms',
            description: 'A building management system is a vital tool for any company looking to maximize the effectiveness of its building systems and operations.\\n\\nOur building management systems are designed using the latest technology to help building owners and managers achieve increased productivity, improved comfort and safety for building occupants, and improved energy efficiency.',
            icon: 'Building',
        },
        {
            title: 'Home Automation',
            slug: 'home-automation',
            description: 'Smarter homes are lively homes.\\n\\nOhmitex Smart Controls offers advanced, reliable, and interactive home automation solutions that will meet all your needs. Our solutions give you the privilege to utilize IoT technology for the efficient running of your home.',
            icon: 'Home',
        },
        {
            title: 'Energy Management Systems',
            slug: 'energy-management',
            description: 'Ohmitex Smart Controls offers you the best energy management system to help you monitor your energy consumption and provide suggestions for lowering use thereby controlling your electric utilities and electricity-consuming devices.',
            icon: 'Zap',
        },
        {
            title: 'Industrial Automation',
            slug: 'industrial-automation',
            description: 'Improve your system workflow and production using our advanced industrial automation systems.',
            icon: 'Factory',
        },
        {
            title: 'Calibration & Training Services',
            slug: 'calibration-training',
            description: 'We offer comprehensive calibration services including Water Meters, Gas Meters, and Energy Meters calibration. We also provide Operator Training to ensure your team can efficiently manage and maintain your automation systems.',
            icon: 'Settings',
        },
    ];

    const createdServices = [];
    for (const service of services) {
        const created = await prisma.service.upsert({
            where: { slug: service.slug },
            update: service,
            create: service,
        });
        createdServices.push(created);
    }
    console.log(`✅ ${createdServices.length} services created`);

    // 3. Clients
    const clients = [
        { name: 'Air Design Ltd', logoUrl: '/images/clients/air-design.jpg' },
        { name: 'AGC Tenwek Hospital', logoUrl: '/images/clients/tenwek.jpg' },
        { name: 'Gertrude\'s Hospital', logoUrl: '/images/clients/gertrude.png' },
        { name: 'Sarit Center', logoUrl: '/images/clients/sarit.png' },
        { name: 'Aga Khan University Hospital', logoUrl: '/images/clients/aga-khan.png' },
        { name: 'KUTTRH', logoUrl: '/images/clients/kuttrh.png' },
        { name: 'Plumbing System Ltd', logoUrl: '/images/clients/plumbing-systems.jpg' },
        { name: 'Snowpeak Refrigeration & Contractors Ltd', logoUrl: '/images/clients/snowpeak.jpg' },
        { name: 'Criserve Engineering Ltd', logoUrl: '/images/clients/criserve.jpg' },
    ];

    for (const client of clients) {
        await prisma.client.upsert({
            where: { name: client.name },
            update: client,
            create: client,
        });
    }
    console.log(`✅ ${clients.length} clients created`);

    // 4. Projects (25+ from Word document)
    const allServices = await prisma.service.findMany();
    const serviceMap = new Map(allServices.map((s: any) => [s.slug, s.id]));

    const projectsWithServices = [
        // Control Panels - Air Design Ltd
        {
            title: 'AGC Tenwek Hospital - CO Sensors & MCC Panel',
            slug: 'agc-tenwek-co-sensors',
            client: 'Air Design Ltd',
            description: 'Design, assembly, testing and commissioning of CO sensors & MCC Panel for Basement Ventilation at AGC Tenwek Hospital.',
            solution: 'Implemented a comprehensive basement ventilation system with integrated CO sensors and MCC panel to ensure safe air quality levels in underground parking areas.',
            serviceSlug: 'control-panels',
        },
        {
            title: 'Gertrude\'s Hospital - Starter Panel',
            slug: 'gertrudes-starter-panel',
            client: 'Air Design Ltd',
            description: 'Design, assembly, testing and commissioning of starter panel for Gertrude\'s Project.',
            solution: 'Delivered a custom starter panel solution for HVAC equipment, ensuring reliable startup and operation of critical hospital systems.',
            serviceSlug: 'control-panels',
        },
        {
            title: 'Mehta - VFD Panels',
            slug: 'mehta-vfd-panels',
            client: 'Air Design Ltd',
            description: 'Design, assembly, testing and commissioning of Variable Frequency Drive Panels for Mehta.',
            solution: 'Installed energy-efficient VFD panels to control motor speeds, resulting in significant energy savings and improved process control.',
            serviceSlug: 'control-panels',
        },
        {
            title: 'AGC Tenwek Hospital - AHU Control System',
            slug: 'agc-tenwek-ahu',
            client: 'Air Design Ltd',
            description: 'Supply, programming, testing and commissioning of AHU Control system at AGC Tenwek Hospital.',
            solution: 'Designed and commissioned a sophisticated AHU control system to maintain optimal temperature and air quality in patient care areas.',
            serviceSlug: 'control-panels',
        },
        {
            title: 'AGC Tenwek Hospital - Operation Theatre HVAC',
            slug: 'agc-tenwek-ot-hvac',
            client: 'Air Design Ltd',
            description: 'Design, programming, testing and commissioning of Operation Theatre HVAC Monitoring and Control System.',
            solution: 'Implemented a critical HVAC monitoring system for operation theatres, ensuring precise environmental control for surgical procedures.',
            serviceSlug: 'bms',
        },
        {
            title: 'KUTTRH - MCC Panels for Fans & Actuators',
            slug: 'kuttrh-mcc-panels',
            client: 'Air Design Ltd',
            description: 'Design, assembly, testing and commissioning of MCC Panels for Fans and Power Boards for Actuators at KUTTRH.',
            solution: 'Delivered comprehensive MCC panels for HVAC fans and actuator control at the Kenyatta University Teaching, Referral and Research Hospital.',
            serviceSlug: 'control-panels',
        },
        {
            title: 'Dr. Kalebi Labs - Ventilation MCC',
            slug: 'kalebi-labs-ventilation',
            client: 'Air Design Ltd',
            description: 'Design, assembly, testing and commissioning of MCC Panels for ventilation fans at Dr. Kalebi Labs.',
            solution: 'Installed MCC panels to control laboratory ventilation systems, ensuring safe working conditions and proper air exchange.',
            serviceSlug: 'control-panels',
        },
        {
            title: 'Skanem Interlabels Factory - Production Line CO Sensor',
            slug: 'skanem-production-co',
            client: 'Air Design Ltd',
            description: 'Design, programming, testing and commissioning of MCC Panel and CO sensor for Production line fans.',
            solution: 'Implemented an automated ventilation control system with CO monitoring for safe factory production environments.',
            serviceSlug: 'industrial-automation',
        },
        {
            title: 'Tile & Carpets Kalekim Center - VFD Panel',
            slug: 'kalekim-vfd',
            client: 'Air Design Ltd',
            description: 'Design, assembly, testing and commissioning of Variable Frequency Drive Panel.',
            solution: 'Provided VFD panel for efficient motor control in the facility, reducing energy consumption and improving operational flexibility.',
            serviceSlug: 'control-panels',
        },
        {
            title: 'The Mandrake Towers - Staircase & Lift Pressurization',
            slug: 'mandrake-pressurization',
            client: 'Air Design Ltd',
            description: 'Design, programming, testing and commissioning MCC Panel for Staircase and Lift Pressurization systems.',
            solution: 'Installed critical pressurization systems to maintain safe escape routes during fire emergencies in this high-rise building.',
            serviceSlug: 'control-panels',
        },
        {
            title: 'CITI Bank - Office Ventilation MCC',
            slug: 'citibank-ventilation',
            client: 'Air Design Ltd',
            description: 'Design, programming, testing and commissioning of MCC Panel and Room Pressure sensor for office ventilation fans.',
            solution: 'Delivered a sophisticated ventilation control system with room pressure monitoring for optimal indoor air quality.',
            serviceSlug: 'control-panels',
        },
        {
            title: 'Lion\'s Hospital Eastleigh - Office Ventilation',
            slug: 'lions-hospital-ventilation',
            client: 'Air Design Ltd',
            description: 'Design, assembly, testing and commissioning of MCC Panel for Office ventilation.',
            solution: 'Installed MCC panel to automate and control office ventilation systems for improved comfort and air quality.',
            serviceSlug: 'control-panels',
        },
        {
            title: 'Carrefour Kenol - Ventilation Fans MCC',
            slug: 'carrefour-kenol-ventilation',
            client: 'Air Design Ltd',
            description: 'Design, assembly, testing and commissioning of MCC Panel for ventilation fans.',
            solution: 'Provided retail space ventilation control system to maintain comfortable shopping environment.',
            serviceSlug: 'control-panels',
        },
        {
            title: 'Gertrude\'s Hospital Muthaiga - Room Pressure Monitoring',
            slug: 'gertrudes-muthaiga-pressure',
            client: 'Air Design Ltd',
            description: 'Design, assembly, testing and commissioning of Room Pressure monitoring system.',
            solution: 'Implemented advanced room pressure monitoring for isolation rooms, ensuring patient safety and infection control.',
            serviceSlug: 'bms',
        },

        // Plumbing Systems Ltd
        {
            title: 'TDB Towers - Overflow Alarm Control Panel',
            slug: 'tdb-overflow-alarm',
            client: 'Plumbing System Ltd',
            description: 'Design and assembly of Overflow Alarm Control Panel at the Trade and Development Bank Towers.',
            solution: 'Created an automated alarm system to prevent water tank overflow, protecting critical infrastructure.',
            serviceSlug: 'control-panels',
        },
        {
            title: 'TDB Towers - Grey Water Solenoid Valve Control',
            slug: 'tdb-grey-water',
            client: 'Plumbing System Ltd',
            description: 'Design, assembly, testing and commissioning of Grey Water Solenoid Valve Control Panel.',
            solution: 'Automated grey water management system for efficient water recycling and conservation.',
            serviceSlug: 'control-panels',
        },
        {
            title: 'Enaki - Water Circulation PLC Control',
            slug: 'enaki-water-circulation',
            client: 'Plumbing System Ltd',
            description: 'Design, assembly, programming, and commissioning of PLC-based control panel for Water Circulation Pumps.',
            solution: 'Implemented PLC-based automation for optimized water circulation, improving efficiency and reducing energy costs.',
            serviceSlug: 'industrial-automation',
        },
        {
            title: 'Rosselyn Estate - Reverse Osmosis Plant',
            slug: 'rosselyn-ro-plant',
            client: 'Plumbing System Ltd',
            description: 'Design, assembly, programming, and commissioning of PLC-based control panel for Reverse Osmosis Plant.',
            solution: 'Delivered a fully automated RO plant control system providing clean water to the residential estate.',
            serviceSlug: 'industrial-automation',
        },

        // Snowpeak Refrigeration & Contractors Ltd
        {
            title: 'Bunge Towers - Tunnel Jet Fan Control',
            slug: 'bunge-jet-fan',
            client: 'Snowpeak Refrigeration & Contractors Ltd',
            description: 'Design, assembly, testing and commissioning of Tunnel Jet Fan Control Panel at Bunge Towers.',
            solution: 'Installed jet fan control system for underground parking ventilation, ensuring proper air circulation and CO management.',
            serviceSlug: 'control-panels',
        },
        {
            title: 'Bunge Towers - Packaging Unit Control',
            slug: 'bunge-packaging',
            client: 'Snowpeak Refrigeration & Contractors Ltd',
            description: 'Design, assembly, testing and commissioning of Packaging Unit Control Panel.',
            solution: 'Delivered automation solution for packaging operations, improving efficiency and product handling.',
            serviceSlug: 'industrial-automation',
        },
        {
            title: 'Bunge Towers - Fire Alarm Interface Panel',
            slug: 'bunge-fire-alarm',
            client: 'Snowpeak Refrigeration & Contractors Ltd',
            description: 'Programming and configuration of Eaton Cooper Compatible Fire Alarm Interface Panel.',
            solution: 'Integrated fire alarm system with building controls for enhanced safety and emergency response.',
            serviceSlug: 'bms',
        },

        // BMS
        {
            title: 'Sarit Center - BMS Operations',
            slug: 'sarit-center-bms',
            client: 'Soma Associates',
            description: 'Comprehensive BMS maintenance and upgrades including operator training, meter calibration, and system integration.',
            solution: 'Provided ongoing BMS support including: Operator Training, Water Meters Calibration, Gas Meters Calibration, Energy Meters Calibration, and Integration of Parking Lighting System to BMS. Ensuring optimal building performance and energy efficiency.',
            serviceSlug: 'bms',
        },

        // Industrial Automation
        {
            title: 'TDB Towers - Irrigation Control System',
            slug: 'tdb-irrigation',
            client: 'Criserve Engineering Ltd',
            description: 'Design, assembly, testing and commissioning of control panel for irrigation system.',
            solution: 'Automated irrigation control system for landscaping, ensuring efficient water usage and healthy greenery.',
            serviceSlug: 'industrial-automation',
        },
        {
            title: 'Kays Estate - Irrigation System',
            slug: 'kays-estate-irrigation',
            client: 'Criserve Engineering Ltd',
            description: 'Design, assembly, testing and commissioning of control panel for Irrigation System.',
            solution: 'Delivered automated irrigation solution for residential estate, optimizing water consumption and landscape maintenance.',
            serviceSlug: 'industrial-automation',
        },
    ];

    for (const projectData of projectsWithServices) {
        const { serviceSlug, ...project } = projectData;
        const serviceId = serviceMap.get(serviceSlug);

        if (serviceId) {
            await prisma.project.upsert({
                where: { slug: project.slug },
                update: {
                    ...project,
                    serviceId,
                    imageUrl: '/images/Picture4.png',
                },
                create: {
                    ...project,
                    serviceId,
                    imageUrl: '/images/Picture4.png',
                },
            });
        }
    }
    console.log(`✅ ${projectsWithServices.length} projects created`);

    console.log('🎉 Seeding completed!');
    const testimonials = [
        {
            id: 'seed-testimonial-air-design',
            name: 'Operations Team',
            company: 'Air Design Ltd',
            position: 'Project Partner',
            content: 'Ohmitex consistently delivers dependable control panels and automation support. Their team is responsive, practical, and strong during commissioning.',
            rating: 5,
            approved: true,
            featured: true,
        },
        {
            id: 'seed-testimonial-sarit',
            name: 'Facility Management',
            company: 'Sarit Center',
            position: 'Building Operations',
            content: 'Their BMS support and control integration work helped us improve monitoring, efficiency, and operational visibility across critical systems.',
            rating: 5,
            approved: true,
            featured: true,
        },
        {
            id: 'seed-testimonial-plumbing-systems',
            name: 'Engineering Team',
            company: 'Plumbing System Ltd',
            position: 'Project Delivery',
            content: 'We value their structured approach, technical depth, and the quality of their automation panels. They are a reliable implementation partner.',
            rating: 5,
            approved: true,
            featured: false,
        },
    ];

    for (const testimonial of testimonials) {
        await prisma.testimonial.upsert({
            where: { id: testimonial.id },
            update: {
                name: testimonial.name,
                company: testimonial.company,
                position: testimonial.position,
                content: testimonial.content,
                rating: testimonial.rating,
                approved: testimonial.approved,
                featured: testimonial.featured,
            },
            create: testimonial,
        });
    }
    console.log(`Added ${testimonials.length} testimonials`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
