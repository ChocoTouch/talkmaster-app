
# Frontend - TalkMaster

Ce frontend est construit avec **React** et **Vite** en utilisant le template **TailAdmin** pour l’administration.

---

## 🧰 Stack Technique

- **Framework** : React 19  
- **Build tool** : Vite  
- **Styling** : Tailwind CSS + Tailwind Merge  
- **State management** : Zustand  
- **Routing** : React Router v7  
- **Calendrier** : FullCalendar  
- **Graphiques** : ApexCharts  
- **Divers** : React DnD, React Dropzone, React Helmet Async, React Toastify, Swiper  
- **Authentification** : gestion des rôles avec composants protégés  
- **Lint & format** : ESLint + Prettier  
- **Plugins Vite** : @vitejs/plugin-react, vite-plugin-svgr

---

## 📦 Dépendances principales
```json
{
  "@fullcalendar/core": "^6.1.15",
  "@fullcalendar/daygrid": "^6.1.15",
  "@fullcalendar/interaction": "^6.1.15",
  "@fullcalendar/list": "^6.1.15",
  "@fullcalendar/react": "^6.1.15",
  "@fullcalendar/timegrid": "^6.1.15",
  "@headlessui/react": "^2.2.3",
  "axios": "^1.9.0",
  "clsx": "^2.1.1",
  "flatpickr": "^4.6.13",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-router": "^7.1.5",
  "react-router-dom": "^7.6.0",
  "zustand": "^5.0.4",
  "tailwindcss": "^4.1.6",
  "typescript": "^5.8.3"
}
```
----------

## 🚀 Scripts NPM

-   `npm run dev` — lance le serveur de développement Vite avec hot reload
    
-   `npm run build` — construit l’application pour la production
    
-   `npm run serve` — prévisualise la build production localement
    
-   `npm run lint` — lance ESLint sur tous les fichiers JS/TS
    
-   `npm run format` — formate le code avec Prettier
    

----------

## 🗂 Structure des Routes / Pages

### Public

-   `/public` — Page d’accueil publique (`Home`)
    
-   `/about` — Page À propos (`About`)
    
-   `/signin` — Connexion
    
-   `/signup` — Inscription
    

### Privé (requiert authentification et rôles)

Les routes privées sont accessibles via un layout admin protégé par un composant `RequireRole` qui contrôle l’accès selon les rôles utilisateur.

-   `/` (Dashboard) — accessible uniquement aux **Admins**
    
-   `/basic-tables` — accessible aux **Admin, Organisateur, Conférencier**
    
-   `/form-elements` — accessible aux **Admin, Conférencier**
    
-   `/calendar` — accessible aux **Admin, Organisateur, Conférencier**
    
-   `/blank` — accessible uniquement aux **Admins**
    
-   `*` — Page 404 (`NotFound`)
    

----------

## 🛡 Gestion des rôles

Les rôles gérés sont :

-   `ADMIN`
    
-   `ORGANISATEUR`
    
-   `CONFERENCIER`
    

Le composant `RequireRole` protège les routes en vérifiant si l'utilisateur connecté a les droits nécessaires.

----------

## 🔧 Exemple de routing principal (App.js)

```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppAdminLayout from "./layout/AppAdminLayout";
import AppPublicLayout from "./layout/AppPublicLayout";
import RequireRole from "./components/auth/RequireRole";
import { Role } from "./types/roles";

// Pages publiques
import Home from "./pages/public/Home";
import About from "./pages/public/About";

// Auth
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";

// Pages privées
import Dashboard from "./pages/private/Dashboard/Home";
import BasicTables from "./pages/private/Tables/BasicTables";
import FormElements from "./pages/private/Forms/FormElements";
import Calendar from "./pages/private/Calendar";
import Blank from "./pages/private/Blank";
import NotFound from "./pages/private/OtherPage/NotFound";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<AppPublicLayout />}>
          <Route index path="/public" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          element={
            <RequireRole
              allowedRoles={[Role.ADMIN, Role.ORGANISATEUR, Role.CONFERENCIER]}
            >
              <AppAdminLayout />
            </RequireRole>
          }
        >
          <Route
            index
            path="/"
            element={
              <RequireRole allowedRoles={[Role.ADMIN]}>
                <Dashboard />
              </RequireRole>
            }
          />
          <Route
            path="/basic-tables"
            element={
              <RequireRole allowedRoles={[Role.ADMIN, Role.ORGANISATEUR, Role.CONFERENCIER]}>
                <BasicTables />
              </RequireRole>
            }
          />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route
            path="/blank"
            element={
              <RequireRole allowedRoles={[Role.ADMIN]}>
                <Blank />
              </RequireRole>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
```
----------

## 📚 Notes

-   L’application utilise le template **TailAdmin** pour le design et l’UX.
    
-   La gestion d’état globale est faite avec **Zustand**.
    
-   La navigation est optimisée avec un composant `ScrollToTop` pour reset la position à chaque changement de route.
    
-   Le calendrier FullCalendar est intégré avec plusieurs plugins (daygrid, timegrid, interaction, list).
    
-   Le frontend est prêt pour une intégration avec un backend FastAPI et Prisma.