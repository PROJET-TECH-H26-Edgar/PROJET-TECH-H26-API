# Distributeur de Clés Intelligent – Setup Serveur

## Environnement recommandé

VPS / Serveur : Ubuntu 22.04

Accès SSH

IP publique

## Architecture du système

- ESP32 → communique avec MQTT (Mosquitto)
- API Node.js → logique métier + base de données
- MySQL → stockage des utilisateurs et clés
- Application mobile → interface utilisateur
- NGINX → reverse proxy API + HTTPS

## Ports utilisés

- 80 → HTTP (Certbot)
- 443 → HTTPS (API)
- 8883 → MQTT sécurisé (ESP32)
- 9002 → WebSocket MQTT (debug / Expo)
- 8000 → API Node.js

## Installation du serveur

1. Installation du Broker MQTT (Mosquitto) et le sécurisé en MQTTS (!imoportant)
```bash
sudo mosquitto_passwd -c /etc/mosquitto/passwd usermqtt
```
Le projet utilise un certificat auto-signé Mosquitto situé ici :

- cafile : /etc/mosquitto/certs/mosquitto.crt
- certfile : /etc/mosquitto/certs/mosquitto.crt
- keyfile : /etc/mosquitto/certs/mosquitto.key

Ficher de configuration moquitto

   ```bash
   sudo nano /etc/mosquitto/mosquitto.conf
   
   
   persistence true
   persistence_location /var/lib/mosquitto/
   
   log_dest file /var/log/mosquitto/mosquitto.log
   
   include_dir /etc/mosquitto/conf.d
   
   # Auth globale (s'applique à tous les listeners)
   allow_anonymous false
   password_file /etc/mosquitto/passwd
   
   # MQTT sécurisé ESP32
   listener 8883
   cafile /etc/mosquitto/certs/mosquitto.crt
   certfile /etc/mosquitto/certs/mosquitto.crt
   keyfile /etc/mosquitto/certs/mosquitto.key
   require_certificate false
   
   # WebSocket pour Expo Go (sans SSL)
   listener 9002
   protocol websockets
   
   ```
      
2. Installation de MySQL


3. Installation de NodeJS


4. Installation du FireWall
   - sudo ufw allow OpenSSH
   - sudo ufw allow 443
   - sudo ufw allow 8883
   - sudo ufw allow 80
   - sudo ufw allow 8000
   - sudo ufw enable

## Mise en place du serveur

### Pré-requis

- Avoir NGINX (ou Apache) et un certificat HTTPS

### Procédures

#### Ajouter la configuration de NGINX
```bash
sudo nano /etc/nginx/sites-available/default
```
Fichier : 
```bash

server {
    server_name NOM_DOMAINE_SERVEUR;

        location /mqtt {
        proxy_pass http://localhost:9002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
    location / {
        proxy_pass https://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/NOM_DOMAINE_SERVEUR/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/NOM_DOMAINE_SERVEUR/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = NOM_DOMAINE_SERVEUR) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name NOM_DOMAINE_SERVEUR;
    return 404; # managed by Certbot


}

```


**Ouvrir le port 443**

```bash
sudo ufw allow 443
```

**Installer CertBot**

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

**Générer le certificat**

```bash
sudo certbot --nginx -d NOM_DOMAINE_SERVEUR -d NOM_DOMAINE_SERVEUR
```

**Tester le renouvellement automatique**

```bash
sudo certbot renew --dry-run
```


## Installation des applications et dépendances
### Installation complète des dépendances

```bash
npm install
```
## Instalation détaillé des dépendances au besoin
#### Dépendances principales

```bash
npm install express drizzle-orm
```

#### Dépendances pour TypeScript

```bash
npm install -D typescript ts-node @types/node @types/express
```

#### Autres dépendances utiles

```bash
npm install dotenv cors
npm install -D nodemon
```

#### Pour l'utilisation de drizzle-kit (importer la base de données)

```bash
npm install drizzle-orm mysql2
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


## Création de la base de données et de l'utilisateur

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
## Cloner l'API
```bash 
git clone <repo>
cd <repo>
npm install
```

## Démarrer l’API
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
pm2 start npm --name "APICle" -- start
pm2 save
pm2 startup

```
