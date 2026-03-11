# Hospital_Manager

# 🏥 Application de Gestion d’Hôpital

## 🎯 Contraintes


* ✅ LocalStorage
* ✅ Vue Router
* ✅ Composition API
* ✅ Travail en équipe

---

# 🧠 Architecture de gestion d’état

Chaque module aura son propre storage :

* patients
* doctors
* appointments
* rooms
* users

---

# 🏗️ Fonctionnalités

---

## 1️⃣ Authentification simulée

* Page Login
* Vérification d’un tableau `users` stocké en localStorage
* Sauvegarde de `currentUser`
* Route Guard selon rôle

### Rôles :

* admin
* doctor
* receptionist

---

## 2️⃣ Gestion des Patients (CRUD complet)

Fonctionnalités :

* Ajouter patient
* Modifier patient
* Supprimer patient
* Recherche
* Filtre par statut
* Page détail patient

### Structure patient :

```js
{
  id,
  firstName,
  lastName,
  gender,
  phone,
  bloodGroup,
  status,
  doctorId,
  roomId,
  createdAt
}
```

## 3️⃣ Gestion des Médecins

* CRUD
* Spécialité
* Voir liste des patients liés

Structure :

```js
{
  id,
  name,
  speciality,
  phone,
  available
}
```

---

## 4️⃣ Gestion des Rendez-vous

* Sélection patient
* Sélection médecin
* Date / heure
* Statut

Validation :

* Empêcher double réservation (simulation)

---

## 5️⃣ Gestion des Chambres

* Numéro
* Capacité
* Statut
* Affectation patient

---

## 6️⃣ Dashboard dynamique

* Total patients
* Patients hospitalisés
* Médecins
* Rendez-vous du jour

👉 Calculé avec computed

---

# 🔄 Gestion des relations sans backend

Important pédagogiquement 👇

Pour lier patient → médecin :

On stocke seulement `doctorId`
Puis on fait :

```js
const doctor = doctors.value.find(d => d.id === patient.doctorId)
```
👉 Simulation relation base de données.

---

# ⭐ Bonus pour rendre le projet impressionnant

* Pagination manuelle
* Toast notifications personnalisées
* Mode sombre
* Export JSON des données
* Bouton "Réinitialiser base"
* Form validation personnalisée
* Filtrage multi-critères
* Recherche temps réel


# 🏥 1️⃣ VUES PAR RÔLE

On part sur 3 rôles :

* **Admin**
* **Médecin**
* **Réceptionniste**

---

# 👑 ADMIN

### 🎯 Rôle : Supervision & gestion globale

### Vues accessibles :

1. Dashboard général
2. Gestion des patients (CRUD complet)
3. Gestion des médecins (CRUD complet)
4. Gestion des chambres
5. Gestion des rendez-vous
6. Gestion des utilisateurs

### Ce qu’il peut faire :

✔ Voir toutes les statistiques
✔ Supprimer des données
✔ Modifier tout
✔ Créer des comptes

---

# 👨‍⚕️ MÉDECIN

### 🎯 Rôle : Suivi médical uniquement

### Vues accessibles :

1. Dashboard médecin
2. Mes patients
3. Détail patient
4. Mes rendez-vous

### Restrictions :

❌ Pas de suppression globale
❌ Pas d’accès aux chambres
❌ Pas d’accès aux utilisateurs

### Ce qu’il peut faire :

✔ Voir uniquement ses patients
✔ Modifier statut médical
✔ Ajouter notes médicales
✔ Voir ses rendez-vous

---

# 🧾 RÉCEPTIONNISTE

### 🎯 Rôle : Accueil & organisation

### Vues accessibles :

1. Dashboard accueil
2. Gestion des patients (CRUD simple)
3. Gestion des rendez-vous
4. Gestion des chambres (lecture + affectation)
---

# 🗺️ RÉCAP VISUEL

| Vue          | Admin | Médecin          | Réceptionniste |
| ------------ | ----- | ---------------- | -------------- |
| Dashboard    | ✅     | ✅ (filtré)       | ✅ (simplifié)  |
| Patients     | ✅     | ✅ (ses patients) | ✅              |
| Médecins     | ✅     | ❌                | ❌              |
| Rendez-vous  | ✅     | ✅ (ses rdv)      | ✅              |
| Chambres     | ✅     | ❌                | ✅              |
| Utilisateurs | ✅     | ❌                | ❌              |

---

# 🛡️ Implémentation technique (Vue Router)

Utiliser :

```js
meta: { role: 'admin' }
```

Et dans le router guard :

```js
if (to.meta.role && to.meta.role !== currentUser.role) {
   return next('/unauthorized')
}
```
---

# 🎨 CONSEILS DESIGN (TRÈS IMPORTANT)

## 1️⃣ Design professionnel = Simple & épuré

👉 Éviter :

* Trop de couleurs
* Boutons flashy
* Animations excessives

👉 Favoriser :

* Blanc / Gris clair
* 1 couleur principale
* Espaces aérés
* Cartes (cards)
---

## 3️⃣ Layout recommandé

### Sidebar fixe à gauche

Menu vertical :

* Dashboard
* Patients
* Médecins
* Rendez-vous
* etc.

### Header en haut :

* Nom utilisateur
* Rôle
* Bouton déconnexion

---

## 4️⃣ Design par rôle (détail important)

Le menu doit changer selon le rôle.

---

# 📊 Dashboard moderne

Utiliser :

* Cards statistiques
* Icônes simples
* Graphique léger

Exemple de cartes :

* Total patients
* Rendez-vous aujourd’hui
* Chambres occupées

---

# Interdictions

* Bootstrap copié collé
* Template premium
* Thème acheté
* utilisation de l'IA pour le CSS

Pourquoi ?

Parce que le but est d’évaluer :

* Organisation
* UX
* Structure
* Réflexion

---

## Groupe de Travail
        **RDC 3
Caleb
    Cédric
    Othniel
    Armel
Amiel
    Rogales
    Maxson
    Marcel
Dylan
    Steeven
    Descartes
    Manoel

      **RDC 2

Halil
    Breton
    Afolabi
    Christelle
    
Brunel
    Florence
    Arsène
    Bathèz

Kamal
    Théodore
    Raimi
    Renaud
