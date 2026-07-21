# Kanban Task Board

A production-quality Kanban Task Board built using React 18 and Vite. The application allows users to organize tasks across three stages: To Do, In Progress, and Done. Tasks are automatically saved using Local Storage, ensuring data persists even after refreshing the page.

## Overview

Version 2 introduces a redesigned user interface inspired by modern SaaS applications such as Notion, Linear, and ClickUp. The application features a clean dashboard, improved typography, professional icons, progress tracking, and an enhanced user experience while preserving all existing functionality.

## Features

### Phase 1
- Add new tasks
- Delete tasks
- Move tasks between To Do, In Progress, and Done
- Responsive three-column layout
- Modern and user-friendly interface

### Phase 2
- Edit tasks inline
- Task priority levels (High, Medium, Low)
- Automatic Local Storage persistence
- Real-time task search across all columns

### Phase 3
- Drag and drop tasks between columns using @dnd-kit/core
- Live drag preview and drop indicators
- Dynamic dashboard statistics
- Overall progress tracking

## Technologies Used

- React 18
- Vite
- JavaScript (ES6+)
- Plain CSS
- @dnd-kit/core
- Local Storage API

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:5173
```

## Production Build

```bash
npm run build
npm run preview
```

## Deployment

The application is deployed on Vercel.

**Live Demo**

https://prodesk-it-9gny.vercel.app/

## Data Persistence

All tasks are stored in the browser using Local Storage. Users can refresh or reopen the application without losing their data.

## Architecture

- State management is handled using React Hooks.
- Application state is maintained in the top-level component.
- Business logic is separated into reusable utility functions.
- Local Storage is managed through a reusable custom hook.
- The UI is built using reusable React components for better maintainability.

## License

This project is available for educational and personal use.