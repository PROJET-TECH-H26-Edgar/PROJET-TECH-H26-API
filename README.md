# Distributeur de Clés Intelligent – Setup Serveur

## Environnement recommandé

VPS / Serveur : Ubuntu 22.04

Accès SSH

IP publique

## Installation du serveur

1. Installation du Broker MQTT (Mosquitto)

   sudo apt install mosquitto mosquitto-clients -y

   sudo systemctl enable mosquitto

   sudo systemctl start mosquitto

2. Installation de MariaDB

   sudo apt install mariadb-server mariadb-client -y

   sudo systemctl start mariadb

   sudo systemctl enable mariadb

   sudo mysql_secure_installation

3. Installation de l'API

   sudo apt install nodejs npm -y

4. Installation du FireWall

   sudo ufw allow OpenSSH
   sudo ufw allow 443

   sudo ufw allow 1883

   sudo ufw allow 80

   sudo ufw allow 8000

   sudo ufw enable

## Mise en place du serveur

### Pré-requis

- Avoir Apache (ou NGINX) et un certificat HTTPS

### Procédures

**Ouvrir le port 443**

```bash
sudo ufw allow 443
```

**Installer CertBot**

```bash
sudo apt update
sudo apt install certbot
sudo apt install python3-certbot-nginx  # ou python3-certbot-nginx
```

**Générer le certificat**

```bash
sudo certbot --apache -d distributeurCle.edwrdedgar.me -d distributeurCle.edwrdedgar.me
```

**Tester le renouvellement automatique**

```bash
sudo certbot renew --dry-run
```

## Installation des applications et dépendances

### Dépendances principales

```bash
npm install express drizzle-orm
```

### Dépendances pour TypeScript

```bash
npm install -D typescript ts-node @types/node @types/express
```

### Autres dépendances utiles

```bash
npm install dotenv cors
npm install -D nodemon
```

### Pour l'utilisation de drizzle-kit (importer la base de données)

```bash
npm install drizzle-orm pg
```

### Installation complète des dépendances

```bash
npm install
```

---

## Configuration du fichier `.env`

Créez un fichier `.env` à la racine du projet:

```bash
# Connexion à la base de données (format décomposé)
DB_HOST=dbhost
DB_PORT=dbport
DB_USERNAME=dbusername
DB_PASSWORD=dbpassword
DB_DATABASE=dbdatabse

# Configuration de l'application
PORT=port
JWT_SECRET=secretTexte123
NODE_ENV=development

baseUrl=url

```

---

## Installation et configuration de MySQL sous Ubuntu

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install mysql-server -y
sudo systemctl status mysql
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation
```

### Création de la base de données et de l'utilisateur

```bash
sudo mysql -u root -p
CREATE DATABASE distributeurCle;
CREATE USER 'apiuser'@'localhost' IDENTIFIED BY 'motdepasse123';
GRANT ALL PRIVILEGES ON distributeurCle.* TO 'apiuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Initialisation de la base de données avec Drizzle

```bash
npm run db:generate
npm run db:push
npm run db:migrate
```

---

## Démarrer l’API

Important. Il faut être en mode root.

### En mode développement

```bash
npm run dev
```

### En mode production (après build)

```bash
npm run build
npm start
```

```bash
npm install -g pm2
pm2 start npm --name "APICle" -- run dev

```
