# Dashboard TPI

## Description :

L'interface du tableau de bord permet à l'utilisateur de visualiser et interagir avec les données via différents types de graphiques (barres, lignes, camemberts, etc.). Elle inclut une barre de recherche pour filtrer les dashboards et un système d'alertes intelligentes qui détecte automatiquement les anomalies dans les données. 

Des KPI (nombre d'utilisateurs, dashboards, tables) sont affichés sous forme de cartes. Le menu latéral offre un accès rapide aux différentes sections de l'application comme la gestion des utilisateurs, la création de dashboards, et l'importation de données.

Elle intègre également des fonctionnalités liées à Metabase, permettant de visualiser, créer et personnaliser des cartes (questions) et des dashboards. Grâce à l'intégration avec Metabase, l'utilisateur peut consulter des graphiques dynamiques générés directement à partir des données des cartes Metabase. Il peut également obtenir des URL d'intégration pour embarquer des cartes ou dashboards dans l'application. Le système d'alertes est également intelligent, détectant automatiquement des anomalies dans les données des cartes Metabase et affichant des notifications en fonction des valeurs aberrantes ou significatives.

## Prérequis :

Avant de démarrer le projet, vous devez vous assurer que vous avez installé les outils suivants sur votre machine :

Frontend  :

-> Node.js 

->npm

Backend : 

-> Spring Boot

-> Metabase 

## Comment lancer Metabase : 

1. Accéder à ce lien : https://www.metabase.com/start/oss/
   
![image](https://github.com/user-attachments/assets/cad94f8e-bf6d-4a43-a5ff-e5be22ec1b46)

Télècharger le fichier . jar

2. Une fois téléchargé, ouvrez votre CMD au tant qu'administrateur et exécutez la commande suivante :

```bash
cd C:\PATH où il y a le fichier .jar
```
puis pour démarrer Metabase, utilisez la commande suivante :

```bash
java -jar metabase.jar
```

Cela vous redirigera directement vers http://localhost:3000.

![image](https://github.com/user-attachments/assets/af13bd61-492c-4868-8efa-f8527a796a0f)

## Installation 

1. Cloner le projet
   
Clonez le dépôt GitHub:

```bash
git clone <url-du-dépôt>
```

2. Télécharger le postgres :

et ajoutez comme nom de la base  : DashboardTPI :

![image](https://github.com/user-attachments/assets/072672c2-d05c-4465-a19b-532fefc1e137)

   
3. Installation des dépendances (Frontend)
   
Naviguez dans le dossier du frontend et installez les dépendances nécessaires :

```bash
cd frontend
```
```bash
npm install
```

4. Configuration du Backend (Metabase)
Assurez-vous que Metabase est en cours d'exécution sur votre machine ou que vous disposez d'une instance Metabase accessible.

Connectez le backend de l'application à Metabase en configurant les paramètres de connexion dans le fichier de configuration du backend.

Dans le fichier MetabaseService : 

Modifiez le username, et le mot de passe 

![image](https://github.com/user-attachments/assets/dd6f7451-96f4-47e6-849f-7d6d8ee39778)

5. Obtenir une clé secrète :
-> Accédez à http://localhost:3000, puis connectez-vous en tant qu'administrateur. 
puis cliquez sur Intégration

![image](https://github.com/user-attachments/assets/7433addf-15e4-4cbd-bade-1728f11c28b8)

Ensuite cliquer sur gérer, et copier votre clé dans le fichier MetabaseService : 

![image](https://github.com/user-attachments/assets/1e1b37aa-3c6c-4c57-8aee-02a8c7976bb3)

![image](https://github.com/user-attachments/assets/6198edba-1ba4-48a6-ab5d-5f35f9c11d6b)

## Utilisation

1. Se connecter
   
Lors de la première utilisation, vous devez vous connecter avec un compte utilisateur valide. Si vous êtes connecté, vous serez redirigé vers la page d'accueil avec un aperçu des dashboards disponibles.

2. Explorer les dashboards

Utilisez la barre de recherche pour trouver un dashboard spécifique.

Cliquez sur un dashboard pour afficher les données et visualiser les graphiques associés.

3. Alertes et notifications
   
L'application surveille les données et génère des alertes automatiquement pour toute anomalie détectée dans les données.

Les alertes seront affichées en temps réel sur l'interface utilisateur.

4. Visualisation des graphiques
   
Les graphiques disponibles incluent des barres, des lignes, des camemberts, des nuages de points et des graphiques de type surface.

Vous pouvez interagir avec les graphiques pour explorer les données et analyser les tendances.

## Technologies utilisées

-> Frontend : React.js, Styled-Components, Axios, ...

-> Backend : Spring Boot, Metabase API

-> Base de données : PostgreSQL (pour la gestion des utilisateurs)

-> Autres : html2canvas, jsPDF pour l'exportation des rapports en PDF.


## Par :

Manar AFIFI
Projet Dashboard 
