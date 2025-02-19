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

    const ingredients = [
        {name: "Pâte Rigatoni", quantity: 500, unit: "g"},
        {name: "Sauce tomate", quantity: 200, unit: "ml"},
        {name: "Fromage râpé", quantity: 100, unit: "g"},
        {name: "Bœuf haché", quantity: 300, unit: "g"},
        {name: "Crème liquide", quantity: 150, unit: "ml"},
        {name: "Chocolat noir", quantity: 200, unit: "g"},
        {name: "Œufs", quantity: 3, unit: "pcs"},
        {name: "Spéculos", quantity: 80, unit: "g"},
        {name: "Kinder Bueno", quantity: 2, unit: "bars"},
        {name: "Tranche de pain", quantity: 2, unit: "pcs"},
        {name: "Laitue", quantity: 1, unit: "head"},
        {name: "Crevettes", quantity: 150, unit: "g"},
        {name: "Poulet", quantity: 200, unit: "g"},
        {name: "Semoule", quantity: 150, unit: "g"},
        {name: "Légumes frais", quantity: 200, unit: "g"},
        {name: "Truite", quantity: 200, unit: "g"},
        {name: "Riz", quantity: 150, unit: "g"},
    ];

    for (const ingredient of ingredients) {
        await prisma.ingredient.upsert({
            where: {name: ingredient.name},
            update: {},
            create: ingredient,
        })
    }


    const produitsAvecDescriptions = [
        {
            name: "Pates Rigatoni",
            uidUser: userAdmin.uid,
            description: "Un plat classique de pâtes italiennes en rigatoni, parfait pour les amateurs de cuisine italienne.",
            price: 12.99,
            isPlatDuJour: true,
            idCategory: 2,
            idType: 1,
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

    const produitIngredientsRelations = [
        {
            produitName: "Pates Rigatoni",
            ingredients: [
                {name: "Pâte Rigatoni", quantity: 200},
                {name: "Sauce tomate", quantity: 100},
                {name: "Fromage râpé", quantity: 50},
            ],
        },
        {
            produitName: "Fondant au chocolat",
            ingredients: [
                {name: "Chocolat noir", quantity: 120},
                {name: "Œufs", quantity: 2},
                {name: "Crème liquide", quantity: 50},
            ],
        },
        {
            produitName: "Tiramisu au poire spéculos",
            ingredients: [
                {name: "Spéculos", quantity: 50},
                {name: "Crème liquide", quantity: 100},
            ],
        },
        {
            produitName: "Tiramisu kinder bueno",
            ingredients: [
                {name: "Kinder Bueno", quantity: 1},
                {name: "Crème liquide", quantity: 100},
            ],
        },
        {
            produitName: "Burger Chicken",
            ingredients: [
                {name: "Poulet", quantity: 150},
                {name: "Tranche de pain", quantity: 2},
                {name: "Laitue", quantity: 50},
            ],
        },
        {
            produitName: "Pates au crevettes",
            ingredients: [
                {name: "Crevettes", quantity: 100},
                {name: "Pâte Rigatoni", quantity: 200},
                {name: "Sauce tomate", quantity: 80},
            ],
        },
        {
            produitName: "Taboulet",
            ingredients: [
                {name: "Semoule", quantity: 100},
                {name: "Légumes frais", quantity: 100},
            ],
        },
        {
            produitName: "Pokéball Truite",
            ingredients: [
                {name: "Truite", quantity: 100},
                {name: "Riz", quantity: 100},
                {name: "Légumes frais", quantity: 50},
            ],
        },
        {
            produitName: "Salade César",
            ingredients: [
                {name: "Poulet", quantity: 100},
                {name: "Laitue", quantity: 50},
            ],
        },
    ];

    for (const relation of produitIngredientsRelations) {
        const produit = await prisma.produit.findUnique({
            where: {name: relation.produitName},
        });

        if (!produit) {
            console.log(`Produit '${relation.produitName}' non trouvé.`);
            continue;
        }

        for (const ingredient of relation.ingredients) {
            const ingredientRecord = await prisma.ingredient.findUnique({
                where: {name: ingredient.name},
            });

            if (!ingredientRecord) {
                console.log(`Ingrédient '${ingredient.name}' non trouvé.`);
                continue;
            }

            await prisma.produitIngredient.upsert({
                where: {
                    idProduit_idIngredient: {
                        idProduit: produit.id,
                        idIngredient: ingredientRecord.id,
                    },
                },
                update: {
                    quantity: ingredient.quantity,
                },
                create: {
                    idProduit: produit.id,
                    idIngredient: ingredientRecord.id,
                    quantity: ingredient.quantity,
                },
            });
        }
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