import { prisma } from '../lib/prisma';

async function createBlogPost() {
    // Get the admin user
    const admin = await prisma.user.findFirst({
        where: { email: 'admin@ohmitex.local' }
    });

    if (!admin) {
        console.error('Admin user not found');
        process.exit(1);
    }

    const post = await prisma.blogPost.create({
        data: {
            title: 'Building Management Systems in Kenyan and East African Facilities',
            slug: 'building-management-systems-kenya-east-africa',
            excerpt: 'As buildings across Kenya and East Africa grow in size and complexity, managing them effectively has become a practical challenge. BMS provides the structure needed to manage multiple building services in a coordinated and reliable way.',
            content: `<p>As buildings across Kenya and East Africa grow in size and complexity, managing them effectively has become a practical challenge rather than a theoretical one. Hospitals operate around the clock, shopping malls host thousands of occupants daily, and universities run diverse facilities with varying schedules. In these environments, Building Management Systems (BMS) have become an essential operational layer rather than an optional upgrade.</p>

<p>BMS provides the structure needed to manage multiple building services in a coordinated and reliable way.</p>

<h2>What a BMS Looks Like in Practice</h2>

<p>A Building Management System brings together key building services—such as HVAC, lighting, electrical distribution, water systems, and alarms—into a single monitoring and control platform. Sensors installed throughout the building collect real-time data, while controllers execute predefined logic based on conditions like occupancy, temperature, or time of day.</p>

<p>For facility teams, this translates into visibility. Instead of responding only when failures occur, operators can observe trends, identify anomalies early, and make informed adjustments before small issues become major disruptions.</p>

<h2>Why Regional Conditions Make BMS Important</h2>

<p>In the East African context, buildings often operate under variable power conditions. Grid instability, generator use, and increasing electricity costs place pressure on both electrical and mechanical systems. Without centralized control, systems may run inefficiently or inconsistently.</p>

<p>A well-configured BMS helps manage these realities by coordinating system operation, prioritizing critical loads, and reducing unnecessary runtime. This is particularly important in facilities where downtime has serious consequences, such as healthcare environments or high-traffic commercial spaces.</p>

<h2>Applications Across Key Building Types</h2>

<p>In hospitals, BMS plays a critical role in maintaining stable indoor conditions. Temperature control, air quality management, and continuous monitoring of critical systems support patient safety and clinical operations. Equally important is system redundancy—ensuring that backup power and essential services are always available when needed.</p>

<p>Shopping malls and large commercial developments face a different challenge: scale. Managing lighting, ventilation, and power across expansive spaces requires centralized oversight. BMS allows operators to monitor performance across multiple zones, detect faults early, and maintain consistency in occupant comfort despite fluctuating foot traffic.</p>

<p>Universities and educational institutions operate on varied schedules, with classrooms, laboratories, hostels, and administrative offices all following different usage patterns. BMS enables time-based scheduling and zone-level control, ensuring systems operate efficiently during academic terms while scaling down during holidays or low-occupancy periods.</p>

<h2>Integration as a Practical Necessity</h2>

<p>Many existing buildings were developed with standalone systems installed at different times. This fragmentation makes it difficult to understand overall performance. BMS integration brings these systems together, allowing data from power monitoring, HVAC, and occupancy sensors to inform operational decisions.</p>

<p>Integrated systems also simplify maintenance planning. By tracking runtime and performance trends, facility teams can move from reactive repairs to planned maintenance, extending equipment life and reducing unexpected failures.</p>

<h2>Focusing on Reliability and Maintainability</h2>

<p>In regional building projects, success is measured less by sophistication and more by reliability. A practical BMS is one that can be maintained locally, adapted over time, and understood by on-site teams. Clear system logic, proper documentation, and use of open protocols are key to long-term sustainability.</p>

<p>Ultimately, BMS supports better building operation by providing control, insight, and consistency—qualities that are increasingly essential in the East African built environment.</p>`,
            published: true,
            publishedAt: new Date('2026-01-05T09:00:00.000Z'),
            authorId: admin.id,
            seoTitle: 'Building Management Systems in Kenya & East Africa | Ohmitex',
            seoDescription: 'Learn how Building Management Systems (BMS) are transforming facility management in Kenya and East Africa with centralized control and monitoring.',
            tags: ['BMS', 'Building Management', 'HVAC', 'Kenya', 'East Africa', 'Facility Management'],
        }
    });

    console.log('Blog post created:', post.title);
    console.log('Slug:', post.slug);
    console.log('Published:', post.publishedAt);
}

createBlogPost()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
