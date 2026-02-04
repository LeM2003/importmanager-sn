# ImportManager SN

Outil web pour estimer le **coût rendu** d’un import Alibaba → Sénégal et organiser un **stock global** par produit.

## Demo
- Site: https://lem2003.github.io/importmanager-sn/
- Calculateur: https://lem2003.github.io/importmanager-sn/calculator.html
- Dashboard: https://lem2003.github.io/importmanager-sn/manager.html
- Repo: https://github.com/LeM2003/importmanager-sn

## Fonctionnalités (V1)
- Devise fournisseur: USD / CNY / EUR
- Conversion manuelle vers **FCFA (XOF)**
- Frais banque: **%** ou **montant fixe**
- Transitaire: facturation **XOF / kg**
- Résultats: total fournisseur, payé fournisseur, coût total rendu, prix conseillé, profit estimé
- Enregistrement d’un **lot d’import** → mise à jour du **stock global** (Dashboard)
- Prix de vente (Dashboard) → CA potentiel et bénéfice potentiel

## Fonctionnalités (V2)
- Enregistrer des ventes depuis le Dashboard (réservation du stock)
- Client + statut paiement (Payé / En attente)
- Annulation d’une commande en attente (restaure le stock)
- Résumé : encaissements (payé) vs créances (en attente)
- Historique des ventes

## Stack
- HTML / CSS
- JavaScript (vanilla)
- Stockage: LocalStorage (temporaire)

## Roadmap
- V3: remplacer les prompts par un formulaire (UX)
- V4: backend + base de données (FastAPI + PostgreSQL) + auth

## Screenshots

### Calculateur
![Calculateur](docs/screenshots/calculator.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)