## Distributeur de Clés Intelligent – Setup Serveur

# Environnement recommandé
  VPS / Serveur : Ubuntu 22.04
  
  Accès SSH
  
  IP publique


# Installation du serveur 

  1. Installation du Broker MQTT (Mosquitto)
      sudo apt install mosquitto mosquitto-clients -y
      sudo systemctl enable mosquitto
      sudo systemctl start mosquitto

  2. Installation de MySQL
       sudo apt install mysql-server -y
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
