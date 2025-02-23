# La Fika - API Fast Food

## Description
Bienvenue dans l'API de **La Fika**, une entreprise de fast-food. Cette API est construite avec **NestJS**, utilise **Prisma** comme ORM et une base de données **PostgreSQL** gérée via **Docker**.

## Technologies utilisées
- **NestJS** - Framework Node.js pour la construction d'API robustes.
- **Prisma** - ORM moderne pour gérer les interactions avec la base de données.
- **Docker** - Conteneurisation de la base de données PostgreSQL.
- **PostgreSQL** - Base de données relationnelle.
- **Stripe** - Gestion des paiements en ligne.

## Prérequis
Avant de commencer, assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (Version recommandée : LTS)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Prisma CLI](https://www.prisma.io/docs/concepts/components/prisma-cli)

## Installation
1. **Cloner le projet**
   ```sh
   git clone https://github.com/Juliendnte/ymmersion_fika_backend.git
   cd ymmersion_fika_backend/fika
   ```

2. **Installer les dépendances**
   ```sh
   npm install
   ```

3. **Configurer l'environnement**
    - Dupliquer le fichier `.env.example` en `.env`
    - Modifier les valeurs selon votre configuration

   Exemple de configuration dans `.env.example` :
   ```env
   DATABASE_URL="postgresql://fika_user:fika_password@localhost:5435/fika_db?schema=public"
   BASE_URL='http://localhost:3000'
   BASE_URL_MEDIA='http://localhost:3000/assets'
   JWT_SECRET=''
   ACCESS_TOKEN_EXPIRATION=30m
   REFRESH_TOKEN_EXPIRATION=7d
   RESET_TOKEN_EXPIRATION=15m
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USER="" 
   EMAIL_PASSWORD=""
   EMAIL_FROM=""
   EMAIL_RESET_PASSWORD_URL=''
   STRIPE_API_KEY=''
   STRIPE_SECRET_KEY=''
   STRIPE_WEBHOOK_SECRET=''
   ```

4. **Démarrer la base de données**
   ```sh
   npm run db:dev:up
   ```

5. **Appliquer les migrations et peupler la base de données**
   ```sh
   npx prisma migrate dev --name init
      ```

6. **Lancer le serveur NestJS**
   ```sh
   npm run start:dev
   ```

L'API sera accessible sur `http://localhost:3000` par défaut.

## Licence
Ce projet est sous licence **MIT**.

---

🚀 Bon développement avec **La Fika API** !

