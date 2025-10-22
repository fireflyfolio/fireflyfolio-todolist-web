# 📝 FireflyFolio TodoList Web

Application de gestion de tâches réalisée avec plusieurs frameworks modernes :  
**React**, **Vue**, et **Angular**.  
Ce projet a pour but d’explorer les différences d’architecture, de typage et de gestion d’état entre ces trois écosystèmes majeurs du frontend.

---

## 🚀 Objectifs

- Monter en compétence sur **les frameworks modernes du frontend**.  
- Comparer leurs approches de la **gestion d’état**, du **rendu** et des **composants**.  
- Expérimenter différents environnements de build (Vite, Angular CLI, Next.js…).  
- Créer une base commune pour tester et documenter plusieurs *patterns* (Hooks, Stores, Signals, Observables…).

---

## 🧩 Fonctionnalités communes

Chaque version (React, Vue, Angular) implémente les fonctionnalités suivantes :

- ➕ Ajouter / ✏️ modifier / ❌ supprimer des tâches  
- ✅ Marquer une tâche comme terminée  
- 🔍 Filtrer les tâches (toutes / actives / terminées)  
- 💾 Persistance locale (LocalStorage)  
- 📱 Interface responsive et épurée  
- ⚙️ Gestion d’état (selon la technologie)

---

## 🧠 Variantes par framework

### ⚛️ **React**
- Hooks, Context API et gestion d’état avancée  
- Variantes avec **Redux Toolkit**, **Zustand**, **TanStack Query**, **MobX**  
- Build : **Vite** ou **Next.js**  
- Typage : **TypeScript**  
- Lint : **ESLint + Prettier**


---

### 🖖 **Vue**
- Composition API, réactivité et composants monofichiers  
- Gestion d’état avec **Pinia**  
- Build : **Vite (vue-ts)**  
- Typage : **TypeScript**  
- Lint : **ESLint + Prettier**

Dossier :  
/fireflyfolio-todolist-web/vue/

---

### 🅰️ **Angular**
- Structure modulaire avec composants, services et pipes  
- Gestion d’état avec **Signals** ou **NgRx**  
- Build : **Angular CLI**  
- Typage : **TypeScript (strict mode)**  
- Lint : **ESLint**

Dossier :  
/fireflyfolio-todolist-web/angular/

---

## 📦 Installation (exemple React)

```bash
git clone https://github.com/<ton-username>/fireflyfolio-todolist-web.git
cd fireflyfolio-todolist-web/react
npm install
npm run dev
```

Pour Vue :
```bash
cd fireflyfolio-todolist-web/vue
npm install
npm run dev
```

Pour Angular :
```bash
cd fireflyfolio-todolist-web/angular
npm install
npm start
```