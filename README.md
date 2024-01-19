# Eagle Dream - Application cloud

Eagle Dream est une application web permettant d'afficher des données récupérées depuis une base de données. Elle est composée de plusieurs services :

- Un frontend en React pour l'interface utilisateur

- Un backend Node.js avec des API pour la logique métier et l'accès aux données

- Une base de données MySql pour stocker les données

Ces différents services sont containerisés avec Docker et déployés sur Kubernetes pour facilité l'orchestration et la mise à l'échelle.

## Pourquoi ces choix techniques

React : pour la simplicité et la performance de développement du frontend

Node.js : pour la rapidité de développement des API avec JavaScript

MySQL : base de données relationnelle permettant un stockage structuré et un accès performant aux données

Docker : pour containeriser les services et simplifier le déploiement

Kubernetes : pour l'orchestration et la mise à l'échelle des containers

## Architecture

L'application suit une architecture classique avec un frontend, un backend et une base de données. Le frontend consume les API du backend. Le backend se connecte à la base MySql pour récupérer et mettre à jour les données.

## Les étapes :

### Initialisation du projet :

Pour commencer nous avons dû créer une image docker et la publier sur docker hub. Vous pouvez retrouver nos deux images publiées sur les captures ci-dessous. Il s’agit du frontend et du backend.

![image](https://github.com/EagleDreamAPP/eagleDreamBackend/assets/73187667/acdc8ab8-bc74-49d6-862c-b71135c39395)

![image](https://github.com/EagleDreamAPP/eagleDreamBackend/assets/73187667/388b003b-efc5-4e19-a2d3-e8c7c12a96e9)

### Création de service et deployement

Pour créer un déploiement de service kubernetes, à la manière de docker compose, nous devons rédiger un fichier `.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: eagle-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: eagle-backend
      tier: backend
  template:
    metadata:
      labels:
        app: eagle-backend
        tier: backend
    spec:
      containers:
        - name: eagle-backend
          image: sochiiro/eagledreamback:5
          ports:
            - name: http
              containerPort: 3000
```

Pour mieux comprendre ce fichier, on peut se pencher sur ses différentes parties.
- Il faut déclarer que ce service sera un deploiement, c'est ce que l'on retrouve à la ligne `kind: Deployment`
- La partie spec représente les spécificités du service (nombre de réplique, récupération d'image, attribution de port pour notre container etc.)

Nous récupérons directement les images que nous avions créées et push précédement sur le docker desktop.


Passons à la partie service :

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: eagle-backend
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP

```

Ce fichier définit le service Kubernetes, spécifiant le sélecteur, les ports, et le type de service.

On peut observer sur cette capture que notre service backend (eagle-backend) a bien été déployé : 

![image](https://github.com/EagleDreamAPP/eagleDreamBackend/assets/73187667/4804ba11-7acc-4e30-8642-f10ea22184ea)


Pour consulter l'intégralité du code, y compris les détails du déploiement et du service, veuillez visiter : [**Déploiement & service yaml**](https://github.com/EagleDreamAPP/eagleDreamBackend/blob/docker/deployment-api.yaml)

### Ajout d'un second service

Après la mise en place réussie de notre service backend, nous avons procédé à l'implémentation du deuxième service : le frontend. Sur la capture ci-dessous, vous pouvez l'identifier sous le nom "eagle-frontend", aux côtés du service déjà opérationnel, "eagle-backend".

![image](https://github.com/EagleDreamAPP/eagleDreamBackend/assets/73187667/d71d6a98-fd4a-4d93-9e03-2fbbbf7f6137)

Le processus de déploiement du frontend est similaire à celui décrit précédemment pour notre backend. Cependant, une différence notable réside dans le choix de type de service. Contrairement au backend, où nous avons utilisé un type de service ClusterIP, pour notre frontend, nous avons opté pour l'utilisation d'un load balancer.

Un load balancer offre une répartition équilibrée du trafic entre plusieurs instances de l'application, garantissant une meilleure disponibilité et une gestion optimale de la charge. En configurant un service de type LoadBalancer, Kubernetes provisionne automatiquement un frontend pour l'utilisateur.

Voici un extrait du fichier `deployment-frontend.yaml` illustrant l'utilisation du type de service LoadBalancer :

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: eagle-frontend
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

### Local gateway

La local gateway permet de faire le pont entre nos services et de pouvoir y accéder depuis un http pour créer une infrastructure dynamique.

Plusieurs options s'offraient à nous pour sa mise en place. Nous avons décidé d'utiliser Ingress plutôt qu'un serveur mesh ; bien qu'un serveur mesh permette d'avoir une infrastructure plus solide et plus sécurisé, il est plus difficile à mettre en place. En raison de l'échelle de notre application, l'utilité de recourir à un outil plus complexe tel que le service mesh ne nous a pas paru pertinente.

Nous avons créer, à la manière de notre fichier de déploiement, un fichier `ingress.yaml` et utilisé le service Ingress NGINX dont voici le code :

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: eagledream-ingress
  annotations:
    # nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  rules:
    - host: eagledream.info
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 8080
          - path: /another-service
            pathType: Prefix
            backend:
              service:
                name: backend-service
                port:
                  number: 3006
```
Nous avons commencé à hébergé le service sur le port `80` :

![image](https://github.com/EagleDreamAPP/eagleDreamBackend/assets/73226823/4cadee3f-2d66-4661-8797-c3a2a72904c1)

Ce fichier nous permet de créer un accès extérieur à notre application. Par exemple nous avons décidé d'héberger notre application sur le lien `http:eagledream.info` et cela avec différents chemins : 
- `/` qui permet d'accéder direcement à notre frontend-service
- `/another-service` pour accéder directement à notre backend.

![image](https://github.com/EagleDreamAPP/eagleDreamBackend/assets/73226823/8be96054-cae1-4966-b4af-81dca04070c7)

Et on peut voir que notre frontend est bien accessible par l'url, et ceci grâce à Ingress et la local gateway.

### Connexion à la base de données

La dernière étape cruciale de notre déploiement était d'établir une connexion solide entre notre base de données et les autres services. Cela était essentiel pour permettre une communication fluide entre nos services, permettant ainsi à notre frontend d'afficher des données stockées dans la base de données via les API de notre backend.

Pour la gestion de la base de données, nous avons envisagé plusieurs approches, notamment l'utilisation de bases de données locales telles que PostgreSql ou MySql, ainsi que des solutions sur le cloud comme MongoDB. Après une analyse approfondie des besoins de notre projet, nous avons choisi d'adopter une base de données locale. Cette décision a été motivée par sa mise en place plus simple et son adéquation suffisante à la taille actuelle de notre projet.

Bien que la base de données sur le cloud puisse offrir des performances supérieures, notre choix en faveur de la base de données locale s'est appuyé sur les considérations suivantes :

- **Simplicité de mise en place :** Une base de données locale a permis une configuration plus rapide et moins complexe, ce qui était crucial pour le déploiement initial de notre application.

- **Évolutivité future :** Bien que la base de données locale puisse être considérée comme une solution de départ, elle peut évoluer en taille et en complexité au fur et à mesure de la croissance de notre projet. Cela nous offre la flexibilité nécessaire pour migrer vers une solution sur le cloud si les besoins en performances évoluent.

- **Coût initial :** À l'échelle actuelle de notre application, l'utilisation d'une base de données locale présente également des avantages économiques, en minimisant les coûts initiaux associés aux solutions sur le cloud.

Pour mettre en place ce service MySql, nous avons crée plusieurs fichiers .yaml pour bien séparer les différents aspects (authentification, accès et stockage). Tout cela sera déployé par le fichier de mysql-deployement.yaml.

![image](https://github.com/EagleDreamAPP/eagleDreamBackend/assets/73187667/f2eda15e-e81e-4b79-b255-dada7587575c)

Une fois que tout est bien déployé nous avons des nodeports et le clusterip actifs qui nous informe que l'on peut y accéder.
Cela est possible grâce aux deux fichiers correspondants ([**mysql-serviceNodePort.yaml**](https://github.com/EagleDreamAPP/eagleDreamBackend/blob/docker/mysql/mysql-serviceNodePort.yaml)  et [**mysql-serviceClusterIp.yaml**](https://github.com/EagleDreamAPP/eagleDreamBackend/blob/docker/mysql/mysql-serviceClusterIp.yaml))


Vous pouvez voir sur les captures suivantes que la base de donnée a bien pu être créée et qu'elle est connectée au backend.
![image](https://github.com/EagleDreamAPP/eagleDreamBackend/assets/73187667/c1361472-0b23-4b1b-a366-2c6802057f5b)

Une fois les services actifs, il est possible d'y accéder grâce à cette commande `kubectl exec --stdin --tty <Nom du pod> -- mysql <Mot de passe>`. Le nom du pod correspond au nom du service déployé, et le mot de passe est créé grâce au fichier [**mysql-secret.yaml**](https://github.com/EagleDreamAPP/eagleDreamBackend/blob/docker/mysql/mysql-secret.yaml)

Une fois que la commande s'est bien executée, nous pouvons faire quelques requêtes comme celles ci-dessous.

Ici nous créons une database dans mysql

![image](https://github.com/EagleDreamAPP/eagleDreamBackend/assets/73187667/394539e5-8207-4606-9d46-9e596765dc3a)

Celle-ci permet la création d'un utilisateur avec son identifiant et son mot de passe

![image](https://github.com/EagleDreamAPP/eagleDreamBackend/assets/73187667/cfe30ae4-63ba-44c6-8c87-c037c570b8a9)

Cette dernière requête permet de donner des droits d'administrateur à l'utilisateur précédement créé

![image](https://github.com/EagleDreamAPP/eagleDreamBackend/assets/73187667/174d0ada-5203-41ef-8750-ca4217ef7a6f)

Enfin, nous pouvons voir grâce à Minikube Kubernetes que notre service mysql est bien hebergé et accessible par url
![image](https://github.com/EagleDreamAPP/eagleDreamBackend/assets/73187667/727c9f2e-6c2b-490d-a324-31ea26dee589)

## Profils Google labs : 

Nicolas : 
![image](https://github.com/EagleDreamAPP/eagleDreamBackend/assets/73187667/c2058a70-3107-4d88-a2d5-204239f6a333)

Thomas : 
![image](https://github.com/EagleDreamAPP/eagleDreamBackend/assets/73187667/9f9aeb45-9635-4b1e-8b3f-4aa8ae714467)


## Conclusion

Ce projet nous a permis de mettre en pratique nos connaissances en déploiement d'applications web avec Kubernetes.

Nous avons pu :

- Containeriser une application React et Node.js avec Docker
- Déployer ces conteneurs sur un cluster Kubernetes
- Configurer des services et un ingress pour exposer les applications
- Connecter les services à une base de données MySQL

Kubernetes s'est révélé être un outil puissant pour orchestrer nos conteneurs. Sa flexibilité nous a permis d'itérer rapidement sur notre architecture à mesure que de nouveaux besoins émergeaient.

Les défis rencontrés nous ont appris les bonnes pratiques de conception d'applications pour le cloud. Notre application est désormais facile à faire évoluer pour supporter plus de trafic.

Dans l'ensemble, ce fût une excellente expérience pour mettre en pratique concrètement les technologiques de pointe du cloud computing !
