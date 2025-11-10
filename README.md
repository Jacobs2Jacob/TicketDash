**To execute:  **
Make sure your client port is 5173.  
Run npm install.  
Run the app with npm run dev.  
Run unit tests with npm test.  
  
**Architectural Decisions:  **
The directory structure is feature-driven, a common and scalable approach that isolates feature components from shared components (reusable across multiple features).  
Used smart routes to support future route based components and better scalability.  
Used React Query with React Infinite Scroll Component to achieve optimal performance in heavy data scenarios without virtualization overhead.  
Used Jest for unit testing of core API functionality.  
Used SignalR for real-time updates, as it integrates best with .NET and provides stable WebSocket communication.  
Used React Hook Form for a more maintainable and performant form experience with built-in validation.  
Used CSS Modules for scoped, maintainable styling with light/dark theme support through a theme context.  
The entire app is written in TypeScript for strong type safety and consistency between client and server models.  
I Used Redux, since tickets are the main feature in the app, they are complex and i used them with entity adapter, and may be used later by other components,
Also Redux because it's great to use with websockets with it's middleware feature.  
Used Context-Api for handling theme contexts and other light weight non-frequent updated features.  
  
**React Patterns used in this app:  **
Hooks,  
Compounds,  
Presentational components and logic containers.  
Layout Pattern with one parent for both child to reduce loading times on unmount and hold the shared data in parent.
