# Task Notes / Notes de Tâches

A React Native application for managing tasks and notes.  
Une application React Native pour gérer les tâches et les notes.

## Prerequisites / Prérequis

- Node.js (v18 or higher / v18 ou supérieur)
- npm or yarn
- Expo CLI
- React Native development environment set up / Environnement de développement React Native configuré

## Installation

1. Clone the repository / Cloner le dépôt :

```bash
git clone https://github.com/yourusername/task-notes.git
cd task-notes
```

2. Install dependencies / Installer les dépendances :

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables / Créer un fichier `.env` à la racine avec les variables suivantes :

```env
API_URL=your_api_url_here
```

4. Start the development server / Démarrer le serveur de développement :

```bash
npm start
# or
yarn start
```

## Environment Variables / Variables d'Environnement

Create a `.env` file in the root directory with the following variables / Créer un fichier `.env` à la racine avec les variables suivantes :

- `API_URL`: The base URL for your API (e.g., `http://localhost:3000` or your production API URL) / L'URL de base de votre API (ex: `http://localhost:3000` ou votre URL de production)

## Project Structure / Structure du Projet

```
task-notes/
├── app/                    # Main application code / Code principal de l'application
│   ├── auth/              # Authentication screens / Écrans d'authentification
│   ├── (tabs)/            # Tab navigation screens / Écrans de navigation par onglets
│   └── _layout.tsx        # Root layout / Layout racine
├── components/            # Reusable components / Composants réutilisables
├── services/              # API and other services / API et autres services
├── contexts/              # React contexts / Contextes React
├── hooks/                 # Custom hooks / Hooks personnalisés
├── utils/                 # Utility functions / Fonctions utilitaires
└── types/                 # TypeScript type definitions / Définitions de types TypeScript
```

## Features / Fonctionnalités

- User authentication / Authentification utilisateur
- Task management / Gestion des tâches
- Note taking / Prise de notes
- QR code scanning / Scan de code QR
- Dark mode support / Support du mode sombre

## Contributing / Contribution

1. Fork the repository / Forker le dépôt
2. Create your feature branch / Créer votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commit your changes / Commiter vos changements (`git commit -m 'Add some amazing feature'`)
4. Push to the branch / Pousser vers la branche (`git push origin feature/amazing-feature`)
5. Open a Pull Request / Ouvrir une Pull Request

## License / Licence

This project is licensed under the MIT License - see the LICENSE file for details.  
Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.
