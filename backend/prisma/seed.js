const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    const password = await bcrypt.hash('password123', 10);

    const specializations = [
        'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Psychiatrist',
        'Orthopedic Surgeon', 'Ophthalmologist', 'General Practitioner', 'Dentist', 'ENT Specialist'
    ];

    const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];

    const doctors = [];

    for (let i = 1; i <= 15; i++) {
        const specialization = specializations[Math.floor(Math.random() * specializations.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const experience = Math.floor(Math.random() * 20) + 1; // 1-20 years
        const fee = Math.floor(Math.random() * 200) + 50; // $50-$250
        const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 - 5.0

        doctors.push({
            name: `Dr. Dummy Doctor ${i}`,
            email: `doctor${i}@example.com`,
            password: password,
            role: 'doctor',
            specialization: specialization,
            qualification: 'MBBS, MD',
            experience: experience,
            consultationFee: fee,
            address: `${Math.floor(Math.random() * 900) + 100} Main St, ${location}`,
            location: location,
            rating: parseFloat(rating),
            bio: `Experienced ${specialization} with over ${experience} years of practice. Dedicated to providing the best care for patients.`,
            phoneNumber: `555-01${i.toString().padStart(2, '0')}`
        });
    }

    for (const doctor of doctors) {
        const existingUser = await prisma.users.findUnique({
            where: { email: doctor.email }
        });

        if (!existingUser) {
            await prisma.users.create({
                data: doctor
            });
            console.log(`✅ Created doctor: ${doctor.name}`);
        } else {
            console.log(`⚠️ Doctor already exists: ${doctor.name}`);
        }
    }

    console.log('✅ Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
