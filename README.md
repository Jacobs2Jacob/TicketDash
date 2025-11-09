To execute:
Make sure your client port is 5173.
Run npm install.
Install PostgreSQL if necessary.
Run the app with npm run dev.
Run unit tests with npm test.

Architectural Decisions:
The directory structure is feature-driven, a common and scalable approach that separates feature components (used once in the app) from shared components (reused across multiple features).
Used smart routes to support future code splitting and better scalability.
Used React Query with React Infinite Scroll Component to achieve optimal performance in heavy data scenarios without virtualization overhead.
Used Jest for unit testing of core API functionality.
Used SignalR for real-time updates, as it integrates best with .NET and provides stable WebSocket communication.
Used React Hook Form for a more maintainable and performant form experience with built-in validation.
Used CSS Modules for scoped, maintainable styling with light/dark theme support through a theme context.
The entire app is written in TypeScript for strong type safety and consistency between client and server models.
