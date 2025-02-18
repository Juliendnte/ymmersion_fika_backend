import {PrismaClient} from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    const roleAdmin = await prisma.role.upsert({
        where: {role: "Admin"},
        update: {},
        create: {
            role: "Admin",
        },
    });

    const roleUser = await prisma.role.upsert({
        where: {role: "Member"},
        update: {},
        create: {
            role: "Member",
        },
    });

    const hashedPasswordAdmin = await bcrypt.hash('adminPassword', 10)
    const hashedPasswordMember = await bcrypt.hash('memberPassword', 10)

    const userAdmin = await prisma.user.upsert({
        where: {email: "admin@example.com"},
        update: {},
        create: {
            name: "Admin User",
            email: "admin@example.com",
            password: hashedPasswordAdmin,
            idRole: roleAdmin.id,
        },
    });

    const userMember = await prisma.user.upsert({
        where: {email: "user@example.com"},
        update: {},
        create: {
            name: "Normal User",
            email: "user@example.com",
            password: hashedPasswordMember,
            idRole: roleUser.id,
        },
    });

    // Seed more categories (Fake Data)
    const categories = [
        { name: "Les salades Y-novante" },
        { name: "Plats Chauds Y-novants" },
        { name: "Y-Snack" },
        { name: "Y-Dessert" },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: category,
        });
    }


    const types = [
        { name: "Plats" },
        { name: "Boissons" },
        { name: "Desserts" },
        { name: "Snacks" },
    ];

    for (const type of types) {
        await prisma.type.upsert({
            where: { name: type.name },
            update: {},
            create: type,
        });
    }


    // Seed example products
    const product1 = await prisma.produit.upsert({
        where: {name: "Pizza Margherita"},
        update: {},
        create: {
            name: "Pizza Margherita",
            uidUser: userAdmin.uid,
            description: "Une délicieuse pizza italienne classique.",
            price: 12.99,
            isPlatDuJour: true,
            idType: 2,
        },
    });

    const product2 = await prisma.produit.upsert({
        where: {name: "Cheesecake"},
        update: {},
        create: {
            name: "Cheesecake",
            uidUser: userMember.uid,
            description: "Un dessert crémeux et savoureux.",
            price: 6.99,
            idCategory: 4,
            idType: 4
        },
    });

    console.log("Seeding completed!");
}

main()
    .catch((e) => {
        console.error("Error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });