import {PrismaClient} from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    const roleAdmin = await prisma.role.upsert({
        where: {role: "admin"},
        update: {},
        create: {
            role: "admin",
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
        {name: "Plats Chauds Y-novants"},
        {name: "Les salades Y-novante"},
        {name: "Y-Snack"},
        {name: "Y-Dessert"},
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: {name: category.name},
            update: {},
            create: category,
        });
    }


    const types = [
        {name: "Plats"},
        {name: "Boissons"},
        {name: "Desserts"},
        {name: "Snacks"},
    ];

    for (const type of types) {
        await prisma.type.upsert({
            where: {name: type.name},
            update: {},
            create: type,
        });
    }


    const produitsAvecDescriptions = [
        {
            name: "Pates Rigatoni",
            uidUser: userAdmin.uid,
            description: "Un plat classique de pâtes italiennes en rigatoni, parfait pour les amateurs de cuisine italienne.",
            price: 12.99,
            isPlatDuJour: true,
            idCategory: 2,
            idType: 2,
            imagePath: "/produits/IMG_7056.jpg"
        },
        {
            name: "Fondant au chocolat",
            uidUser: userMember.uid,
            description: "Un dessert au chocolat intense, fondant au cœur et apprécié des gourmands.",
            price: 6.99,
            promotion: 20, // Réduction de 20 %
            idCategory: 4,
            idType: 4,
            imagePath: "/produits/IMG_7058.jpg"
        },
        {
            name: "Tiramisu au poire spéculos",
            uidUser: userAdmin.uid,
            description: "Une variante du classique tiramisu associant la fraîcheur de la poire et la douceur épicée des spéculos.",
            price: 10.99,
            available: true,
            isPlatDuJour: true,
            idType: 1,
            imagePath: "/produits/IMG_7062.jpg"
        },
        {
            name: "Tiramisu kinder bueno",
            uidUser: userAdmin.uid,
            description: "Un dessert inspiré du Kinder Bueno, combinant une mousse au chocolat et des saveurs délicieuses de noisette.",
            price: 8.99,
            available: true,
            isPlatDuJour: true,
            idType: 1,
            imagePath: "/produits/IMG_7065.jpg"
        },
        {
            name: "Burrit'au Boeuf",
            uidUser: userAdmin.uid,
            description: "Une variante gourmande du burrito classique, garnie de bœuf tendre et d’épices.",
            price: 14.99,
            isPlatDuJour: true,
            idType: 1,
            imagePath: "/produits/IMG_7067.jpg"
        },
        {
            name: "Burger Chicken",
            uidUser: userAdmin.uid,
            description: "Un burger savoureux avec du poulet croustillant et une sauce maison irrésistible.",
            price: 5.99,
            available: true,
            isPlatDuJour: true,
            idType: 1,
            imagePath: "/produits/IMG_7069.jpg"
        },
        {
            name: "Pates au crevettes",
            uidUser: userAdmin.uid,
            description: "Des pâtes fines accompagnées de crevettes juteuses et d’une touche d’assaisonnement méditerranéen.",
            price: 12.50,
            isPlatDuJour: true,
            idType: 1,
            imagePath: "/produits/IMG_7071.jpg"
        },
        {
            name: "Taboulet",
            uidUser: userMember.uid,
            description: "Une salade orientale fraîche et saine, composée de semoule, de légumes frais et d'épices.",
            price: 9.99,
            available: true,
            promotion: 15, // Réduction de 15%
            idCategory: 3, // Id catégorie correspondant
            idType: 1, // Type principal
            imagePath: "/produits/IMG_7075.jpg"
        },
        {
            name: "Pokéball Truite",
            uidUser: userMember.uid,
            description: "Un plat d’inspiration japonaise, avec des tranches de truite marinée, des légumes frais et du riz.",
            price: 2.99,
            promotion: 20, // Réduction de 20%
            idCategory: 4,
            idType: 3,
            imagePath: "/produits/IMG_7080.jpg"
        },
        {
            name: "Salade César",
            uidUser: userMember.uid,
            description: "Une salade fraîche avec des morceaux de poulet grillé, des croûtons et une sauce César maison.",
            price: 8.50,
            available: true,
            promotion: 10, // Réduction de 10%
            idCategory: 1,
            idType: 1,
            imagePath: "/produits/IMG_7077.jpg"
        },
        {
            name: "Fondant au chocolat",
            uidUser: userMember.uid,
            description: "Un dessert au chocolat qui fond en bouche, idéal pour terminer le repas sur une note sucrée.",
            price: 3.99,
            available: true,
            promotion: 25, // Réduction de 25%
            idCategory: 4,
            idType: 4,
            imagePath: "/produits/IMG_7073.jpg"
        },
    ];

    for (const produit of produitsAvecDescriptions) {
        await prisma.produit.upsert({
            where: {name: produit.name},
            update: {},
            create: produit,
        });
    }

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