import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

async function generateSeedSQL() {
    const adminEmail = 'admin@ohmitexcontrols.co.ke';
    const adminPassword = 'Xq7#mPvL2$nRwK9!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminId = 'c_' + uuidv4().replace(/-/g, '').substring(0, 23);

    let sql = `-- Ohmitex Seed Data\n\n`;

    // Admin
    sql += `INSERT INTO "User" ("id", "email", "password", "name", "role", "twoFactorEnabled", "createdAt", "updatedAt")\n`;
    sql += `VALUES ('${adminId}', '${adminEmail}', '${hashedPassword}', 'Admin User', 'ADMIN', false, NOW(), NOW())\n`;
    sql += `ON CONFLICT ("email") DO NOTHING;\n\n`;

    // Services
    const services = [
        { title: 'Design & Assembly of Control Panels', slug: 'control-panels', description: 'Our DDC controllers range from application specific controllers to network area controllers (automation servers) and are efficient, easy to install and easy to operate. We help you choose the best DDC system that suits your application and need.\\n\\nWhether it is a pump control application or a fan control application, our intelligent motor control panels are keenly designed and assembled to efficiently serve your control needs. We offer a wide range of switchgear brands that gives us the flexibility to meet all our customer needs irrespective of their preferences.', icon: 'Cpu' },
        { title: 'Building Management System (BMS)', slug: 'bms', description: 'A building management system is a vital tool for any company looking to maximize the effectiveness of its building systems and operations.\\n\\nOur building management systems are designed using the latest technology to help building owners and managers achieve increased productivity, improved comfort and safety for building occupants, and improved energy efficiency.', icon: 'Building' },
        { title: 'Home Automation', slug: 'home-automation', description: 'Smarter homes are lively homes.\\n\\nOhmitex Smart Controls offers advanced, reliable, and interactive home automation solutions that will meet all your needs. Our solutions give you the privilege to utilize IoT technology for the efficient running of your home.', icon: 'Home' },
        { title: 'Energy Management Systems', slug: 'energy-management', description: 'Ohmitex Smart Controls offers you the best energy management system to help you monitor your energy consumption and provide suggestions for lowering use thereby controlling your electric utilities and electricity-consuming devices.', icon: 'Zap' },
        { title: 'Industrial Automation', slug: 'industrial-automation', description: 'Improve your system workflow and production using our advanced industrial automation systems.', icon: 'Factory' },
        { title: 'Calibration & Training Services', slug: 'calibration-training', description: 'We offer comprehensive calibration services including Water Meters, Gas Meters, and Energy Meters calibration. We also provide Operator Training to ensure your team can efficiently manage and maintain your automation systems.', icon: 'Settings' }
    ];

    sql += `-- Services\n`;
    for (const service of services) {
        const id = 'c_' + uuidv4().replace(/-/g, '').substring(0, 23);
        sql += `INSERT INTO "Service" ("id", "title", "slug", "description", "icon", "createdAt", "updatedAt")\n`;
        sql += `VALUES ('${id}', '${service.title.replace(/'/g, "''")}', '${service.slug}', '${service.description.replace(/'/g, "''")}', '${service.icon}', NOW(), NOW())\n`;
        sql += `ON CONFLICT ("slug") DO NOTHING;\n\n`;
    }

    fs.writeFileSync('cpanel-seed.sql', sql);
    console.log('SQL generated to cpanel-seed.sql');
}

generateSeedSQL();
