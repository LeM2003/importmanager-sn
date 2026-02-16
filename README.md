# 📦 ImportManager-SN

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Live Demo](https://img.shields.io/badge/Demo-Live-success?style=for-the-badge)](https://lem2003.github.io/importmanager-sn/)

**Outil web pour estimer le coût rendu d'un import Alibaba → Sénégal**  
**et gérer un stock global par produit**

[📱 Voir la Démo](https://lem2003.github.io/importmanager-sn/) • [🧮 Calculateur](https://lem2003.github.io/importmanager-sn/calculator.html) • [📊 Dashboard](https://lem2003.github.io/importmanager-sn/manager.html)

---

## 🎯 À propos

**ImportManager-SN** est une application web conçue pour simplifier la gestion d'importations commerciales depuis Alibaba vers le Sénégal. Elle permet de calculer précisément les coûts rendus (incluant frais bancaires et transitaire) et de gérer un inventaire global avec suivi des ventes.

### Problème Résolu

Les importateurs sénégalais font face à des défis :

* ❌ Difficulté à estimer le coût réel rendu au Sénégal
* ❌ Conversions multiples de devises (USD, CNY, EUR → XOF)
* ❌ Manque d'outils simples pour gérer le stock
* ❌ Suivi manuel des ventes et créances

### Solution

✅ **Calculateur intelligent** avec conversions multi-devises  
✅ **Gestion de stock** centralisée et automatisée  
✅ **Suivi des ventes** avec statut paiement  
✅ **Estimation de profit** en temps réel  
✅ **Interface moderne** et accessible

---

## 🚀 Démo en Ligne

L'application est **déployée et fonctionnelle** :

| Module | Lien | Description |
| --- | --- | --- |
| 🏠 **Page d'accueil** | [Accueil](https://lem2003.github.io/importmanager-sn/) | Présentation du projet |
| 🧮 **Calculateur** | [Calculator](https://lem2003.github.io/importmanager-sn/calculator.html) | Estimation des coûts d'import |
| 📊 **Dashboard** | [Manager](https://lem2003.github.io/importmanager-sn/manager.html) | Gestion de stock et ventes |

> 💡 **Astuce** : Les données sont stockées localement (LocalStorage). Elles persistent dans votre navigateur.

---

## ✨ Fonctionnalités

### 📦 Version 1.0 (Implémentée)

#### Calculateur de Coût Rendu

* ✅ **Support multi-devises** : USD, CNY (Yuan), EUR
* ✅ **Conversion vers FCFA** (XOF) - Taux manuel configurable
* ✅ **Frais bancaires** : Pourcentage ou montant fixe
* ✅ **Coût transitaire** : Facturation en XOF par kilogramme
* ✅ **Résultats détaillés** :
  + Total fournisseur (devise d'origine)
  + Montant payé au fournisseur (XOF)
  + Coût total rendu au Sénégal
  + Prix de vente conseillé
  + Profit estimé

#### Dashboard de Gestion

* ✅ **Enregistrement de lots d'import** avec mise à jour automatique du stock
* ✅ **Prix de vente configurable** par produit
* ✅ **Calcul du CA potentiel** (Chiffre d'affaires)
* ✅ **Bénéfice potentiel** par produit

---

### 🎉 Version 2.0 (Implémentée)

#### Gestion des Ventes

* ✅ **Enregistrement de ventes** depuis le Dashboard
* ✅ **Réservation automatique du stock**
* ✅ **Gestion client** avec statut de paiement :
  + 💰 **Payé** - Encaissement confirmé
  + ⏳ **En attente** - Créance client
* ✅ **Annulation de commande** en attente (restauration du stock)
* ✅ **Résumé financier** :
  + Encaissements totaux (ventes payées)
  + Créances totales (ventes en attente)
* ✅ **Historique complet des ventes**

---

### 🎨 Version 3.0 (Implémentée - Février 2025)

#### Interface Utilisateur Moderne

* ✅ **Modale interactive** : Formulaires modernes avec animations
* ✅ **Expérience fluide** : Remplacement des prompts par des pop-ups élégantes
* ✅ **Design glassmorphism** : Backdrop-filter et effets visuels sophistiqués
* ✅ **Validation en temps réel** : Contrôle des saisies utilisateur
* ✅ **Responsive design** : Adapté à tous les écrans (mobile, tablette, desktop)
* ✅ **Animations smooth** : Transitions fluides et professionnelles

**Amélioration clé :** L'expérience utilisateur est maintenant au niveau des applications web modernes. Fini les boîtes de dialogue bloquantes `prompt()`, place à une interface intuitive et professionnelle !

---

## 🛠️ Technologies

### Stack Technique

* **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
* **Stockage** : LocalStorage (navigateur)
* **Déploiement** : GitHub Pages
* **Architecture** : Application monopage (SPA)

### Pourquoi ce Stack ?

* ✅ **Simplicité** : Aucune dépendance, fonctionne partout
* ✅ **Performance** : Chargement instantané
* ✅ **Accessibilité** : Fonctionne hors ligne après chargement
* ✅ **Portabilité** : Compatible tous navigateurs modernes

---

## 📥 Installation & Utilisation

### Méthode 1 : Utiliser la Démo en Ligne (Recommandé)

Accédez directement à : **https://lem2003.github.io/importmanager-sn/**

### Méthode 2 : Installation Locale

```bash
# Cloner le dépôt
git clone https://github.com/LeM2003/importmanager-sn.git
cd importmanager-sn

# Ouvrir avec un serveur local
# Option A : Python
python -m http.server 8000

# Option B : Node.js (http-server)
npx http-server

# Accéder à l'application
# http://localhost:8000
```

### Méthode 3 : Téléchargement Direct

1. Téléchargez le ZIP du projet
2. Extrayez les fichiers
3. Ouvrez `index.html` dans votre navigateur

---

## 📖 Guide d'Utilisation

### 1. Calculer un Coût d'Import

1. Accédez au **[Calculateur](https://lem2003.github.io/importmanager-sn/calculator.html)**
2. Sélectionnez la **devise fournisseur** (USD, CNY, EUR)
3. Entrez le **prix unitaire** et la **quantité**
4. Configurez les **taux de conversion** vers XOF
5. Ajoutez les **frais bancaires** (% ou montant fixe)
6. Indiquez le **poids total** et le **coût transitaire/kg**
7. Cliquez sur **"Calculer"**
8. Résultats affichés avec prix conseillé et profit

### 2. Gérer votre Stock

1. Accédez au **[Dashboard](https://lem2003.github.io/importmanager-sn/manager.html)**
2. Enregistrez un nouveau lot après calcul
3. Définissez un **prix de vente** pour chaque produit
4. Visualisez votre **stock disponible**
5. Consultez le **CA potentiel**

### 3. Enregistrer une Vente

1. Depuis le Dashboard, cliquez sur **"Vendre"**
2. Une modale moderne s'ouvre avec un formulaire complet
3. Entrez la **quantité vendue** et le **nom du client**
4. Sélectionnez le **statut** : Payé ou En attente
5. Le stock est **automatiquement mis à jour**
6. Consultez l'**historique des ventes**

---

## 🗺️ Roadmap

### Version 4.0 (En Planification)

* **Export PDF** des calculs et factures
* **Thème sombre** (mode nuit)
* **Multi-langues** : Français / Anglais / Wolof
* **Graphiques** : Visualisation des ventes et profits avec Chart.js
* **Statistiques avancées** : Tendances, meilleurs produits, etc.

### Version 5.0 (Backend Complet)

* **Backend API** avec FastAPI (Python) ou Node.js/Express
* **Base de données** PostgreSQL ou MongoDB
* **Authentification** multi-utilisateur
* **Synchronisation cloud** des données
* **Application mobile** (Progressive Web App)
* **Notifications** par email/SMS
* **Rapports avancés** et analytics

---

## 📸 Captures d'Écran

### 🧮 Calculateur de Coût Rendu

![Calculateur](docs/images/calculator.png)

*Interface de calcul avec support multi-devises et estimation automatique du profit*

---

### 📊 Dashboard de Gestion

![Dashboard](docs/images/dashboard.png)

*Gestion centralisée du stock, des ventes et suivi des créances*

---

## 🎯 Cas d'Usage Réels

### Pour Importateurs

* Estimer rapidement le coût réel d'un produit Alibaba
* Définir un prix de vente compétitif
* Gérer l'inventaire et les ventes
* Suivre les créances clients

### Pour Petits Commerçants

* Outil simple sans formation nécessaire
* Accessible depuis n'importe quel appareil
* Gratuit et sans abonnement
* Fonctionne hors ligne

---

## 🔒 Confidentialité & Données

* ✅ **Données locales uniquement** : Tout est stocké dans votre navigateur
* ✅ **Aucune connexion serveur** : Vos données ne quittent jamais votre appareil
* ✅ **Pas de tracking** : Aucune analyse ou collecte de données
* ✅ **Open Source** : Code auditable par tous

⚠️ **Important** : LocalStorage peut être effacé si vous nettoyez les données de votre navigateur. Pensez à exporter régulièrement vos données.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. Créer une branche (`git checkout -b feature/AmeliorationDashboard`)
3. Commit vos changements (`git commit -m 'Add: nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/AmeliorationDashboard`)
5. Ouvrir une **Pull Request**

### Idées de Contributions

* 🎨 Amélioration de l'UI/UX
* 🌍 Traductions (Anglais, Wolof, etc.)
* 📊 Nouveaux graphiques et visualisations
* 🐛 Correction de bugs
* 📖 Amélioration de la documentation
* ⚡ Optimisations de performance

---

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
Copyright (c) 2025 Mouhamadou Diouf
```

---

## 👨‍💻 Auteur

### **Mouhamadou Diouf**

🎓 Étudiant en **Master Data Science & Intelligence Artificielle**  
📍 Swiss UMEF University - Dakar, Sénégal

🎓 **Licence Statistique et Informatique Décisionnelle**  
📍 BEM Dakar | Diplômé le 31 août 2025

---

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mouhamadou_Diouf-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mouhamadou-diouf-364309276)
[![GitHub](https://img.shields.io/badge/GitHub-@LeM2003-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LeM2003)
[![Email](https://img.shields.io/badge/Email-dioufmouha71@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:dioufmouha71@gmail.com)

**Compétences** : JavaScript • Python • PHP • SQL • Web Development • Data Analysis

---

**Made with ❤️ in Dakar, Senegal 🇸🇳**

---

## 🔗 Mes Autres Projets

* 🐍 [**Python SysAdmin Tools**](https://github.com/LeM2003/Python-SysAdmin-Tools) - Outils d'automatisation système (Scanner de ports, Analyseur de logs)
* 📚 Autres projets en cours de développement...

---

## 📞 Support & Contact

* 🐛 **Bugs** : [Ouvrir une issue](https://github.com/LeM2003/importmanager-sn/issues)
* 💬 **Questions** : [Discussions GitHub](https://github.com/LeM2003/importmanager-sn/discussions)
* 📧 **Email** : [dioufmouha71@gmail.com](mailto:dioufmouha71@gmail.com)

---

[![Stars](https://img.shields.io/github/stars/LeM2003/importmanager-sn?style=social)](https://github.com/LeM2003/importmanager-sn)
[![Forks](https://img.shields.io/github/forks/LeM2003/importmanager-sn?style=social)](https://github.com/LeM2003/importmanager-sn/fork)

**⭐ Si ce projet vous aide, n'hésitez pas à lui donner une étoile !**

*Dernière mise à jour : 17 février 2025*
