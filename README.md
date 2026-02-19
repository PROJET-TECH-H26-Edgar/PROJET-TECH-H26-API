# Distributeur de Clés Intelligent – Setup Serveur

## Environnement recommandé
  VPS / Serveur : Ubuntu 22.04
  
  Accès SSH
  
  IP publique


## Installation du serveur 

  1. Installation du Broker MQTT (Mosquitto)
     ```bash
      sudo apt install mosquitto mosquitto-clients -y
     
      sudo systemctl enable mosquitto
     
      sudo systemctl start mosquitto
    

  2. Installation de MariaDB

     ```bash
       sudo apt install mariadb-server mariadb-client -y
     
       sudo systemctl start mariadb
     
       sudo systemctl enable mariadb
     
       sudo mysql_secure_installation
     

  4. Installation de l'API
     ```bash
       sudo apt install nodejs npm -y
    

  5. Installation du FireWall
     ```bash
      sudo ufw allow OpenSSH
      sudo ufw allow 443
     
      sudo ufw allow 1883
     
      sudo ufw allow 80
     
      sudo ufw allow 8000
     
      sudo ufw enable
    
# Mise en place des services 

  1. Mosquitto
      ```bash
       sudo nano /etc/mosquitto/mosquitto.conf
        
       listener 1883
       allow_anonymous true
      ```
       Test du fonctionnelment
       Sur le VSP :
     ```bash
        mosquitto_pub -t test -m "hello"
      ```
      Sur l'ordinateur local :
     ```bash
       mosquitto_sub -t test
      ```

  2. MariaDB

     Création de la base de données
     ```bash
       CREATE DATABASE keyDispenser;
      ```
     Création d'un utilisateur
      ```bash
      CREATE USER 'apiuser'@'localhost' IDENTIFIED BY 'motdepasse';
      GRANT ALL PRIVILEGES ON keyDispenser.* TO 'apiuser'@'localhost';
      FLUSH PRIVILEGES;
     ```
     Lancement du script de création
     
     Fichier script.sql dans le repository
     
       
