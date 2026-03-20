import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const clientLogos: { name: string; logoUrl: string }[] = [
    { name: 'Air Design Ltd', logoUrl: '/images/clients/air-design.jpg' },
    { name: 'AGC Tenwek Hospital', logoUrl: '/images/clients/tenwek.jpg' },
    { name: "Gertrude's Hospital", logoUrl: '/images/clients/gertrude.png' },
    { name: 'Sarit Center', logoUrl: '/images/clients/sarit.png' },
    { name: 'Aga Khan University Hospital', logoUrl: '/images/clients/aga-khan.png' },
    { name: 'KUTTRH', logoUrl: '/images/clients/kuttrh.png' },
    { name: 'Plumbing System Ltd', logoUrl: '/images/clients/plumbing-systems.jpg' },
    { name: 'Snowpeak Refrigeration & Contractors Ltd', logoUrl: '/images/clients/snowpeak.jpg' },
    { name: 'Criserve Engineering Ltd', logoUrl: '/images/clients/criserve.jpg' },
];

async function main() {
    console.log('Updating client logos...');
    for (const { name, logoUrl } of clientLogos) {
        const result = await prisma.client.updateMany({
            where: { name },
            data: { logoUrl },
        });
        console.log(`  ${result.count > 0 ? '✅' : '⚠️  not found'} ${name}`);
    }
    console.log('Done!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
