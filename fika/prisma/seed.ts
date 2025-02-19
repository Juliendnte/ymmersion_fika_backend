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
        {name: "Les salades Y-novante"},
        {name: "Plats Chauds Y-novants"},
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
            promotion: 20,
            idCategory: 4,
            idType: 4
        },
    });

    const platsDuJour = [
        {
            name: "Poulet Rôti",
            uidUser: userAdmin.uid,
            description: "Un poulet parfumé et croustillant préparé avec des épices locales.",
            price: 10.99,
            available: true,
            isPlatDuJour: true,
            idType: 1, // Id du type correspondant
        },
        {
            name: "Lasagne Végétarienne",
            uidUser: userAdmin.uid,
            description: "Une lasagne riche en légumes et gratinée avec du fromage.",
            price: 8.99,
            available: true,
            isPlatDuJour: true,
            idType: 1,
        },
        {
            name: "Couscous Royal",
            uidUser: userAdmin.uid,
            description: "Un couscous garni de légumes et de viande tendre.",
            price: 14.99,
            isPlatDuJour: true,
            idType: 1,
        },
        {
            name: "Soupe à l'oignon",
            uidUser: userAdmin.uid,
            description: "Une soupe traditionnelle et savoureuse.",
            price: 5.99,
            available: true,
            isPlatDuJour: true,
            idType: 1,
        },
        {
            name: "Boeuf Bourguignon",
            uidUser: userAdmin.uid,
            description: "Un classique mijoté avec du vin rouge et des épices.",
            price: 12.50,
            isPlatDuJour: true,
            idType: 1,
        },
        {
            name: "Tajine de Poulet",
            uidUser: userAdmin.uid,
            description: "Un tajine délicat aux saveurs marocaines.",
            price: 11.99,
            isPlatDuJour: true,
            idType: 1,
        },
    ];

// Créer les plats du jour dans la base de données
    for (const plat of platsDuJour) {
        await prisma.produit.upsert({
            where: {name: plat.name},
            update: {},
            create: plat,
        });
    }

    const produitsAvecPromo = [
        {
            name: "Burger Gourmet",
            uidUser: userMember.uid,
            description: "Un burger de qualité supérieure avec un pain artisanal.",
            price: 9.99,
            available: true,
            promotion: 15, // Réduction de 15%
            idCategory: 3, // Id catégorie correspondant
            idType: 1, // Type principal
        },
        {
            name: "Chocolat Chaud",
            uidUser: userMember.uid,
            description: "Une boisson parfaite pour se réchauffer.",
            price: 3.50,
            available: true,
            promotion: 10, // Réduction de 10%
            idCategory: 2,
            idType: 2,
        },
        {
            name: "Muffin Myrtille",
            uidUser: userMember.uid,
            description: "Un petit gâteau moelleux avec des myrtilles juteuses.",
            price: 2.99,
            promotion: 20, // Réduction de 20%
            idCategory: 4,
            idType: 3,
        },
        {
            name: "Sandwich Healthy",
            uidUser: userMember.uid,
            description: "Sandwich frais et équilibré avec une touche de pesto.",
            price: 7.49,
            available: true,
            promotion: 25, // Réduction de 25%
            idCategory: 3,
            idType: 3,
        },
        {
            name: "Crêpe au Chocolat",
            uidUser: userMember.uid,
            description: "Une crêpe fine nappée de chocolat fondant.",
            price: 4.50,
            available: true,
            promotion: 15, // Réduction de 15%
            idCategory: 4,
            idType: 4,
        },
        {
            name: "Salade César",
            uidUser: userMember.uid,
            description: "Une salade fraîche avec du poulet et une sauce César maison.",
            price: 8.50,
            available: true,
            promotion: 10, // Réduction de 10%
            idCategory: 1,
            idType: 1,
        },
        {
            name: "Smoothie Tropical",
            uidUser: userMember.uid,
            description: "Un mélange de fruits exotiques pour une pause rafraîchissante.",
            price: 5.99,
            available: true,
            promotion: 20, // Réduction de 20%
            idCategory: 2,
            idType: 2,
        },
        {
            name: "Brownie au Chocolat",
            uidUser: userMember.uid,
            description: "Un dessert fondant et irrésistible.",
            price: 3.99,
            available: true,
            promotion: 25, // Réduction de 25%
            idCategory: 4,
            idType: 4,
        },
    ];

// Créer les produits avec des promotions dans la base de données
    for (const produit of produitsAvecPromo) {
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