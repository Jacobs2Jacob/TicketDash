**To Execute:**  
-Make sure your client port is 5173.  
-Run npm install.  
-Run the app with npm run dev.  
-Run unit tests with npm test.  
  
**Architectural Decisions**  
**-Feature-driven:**  
A common and scalable approach that isolates feature components from shared components (reusable across multiple features).  
**-Smart Routes:**  
For supporting future route based components and better scalability.  
**-React Query:**  
Along with React Infinite Scroll Component to achieve optimal performance in heavy data scenarios without virtualization overhead.  
**-Jest:**  
For unit testing of core API functionality.  
**-Signalr:**  
For real-time updates, as it integrates best with .NET and provides stable WebSocket communication.  
**-React Hook Form:**  
For a more maintainable and performant form experience with built-in validation.  
**-CSS Modules:**  
For scoped, maintainable styling with light/dark theme support through a theme context.  
**-TypeScript:**  
For strong type safety and consistency between client and server models.  
**-Redux:**  
Since tickets are the main feature in the app, they are shared, frequently change, so I used them with entity adapter, also Redux it's great fit for websockets with it's middleware feature.   
**-Context-Api:**  
For handling theme contexts and other light weight non-frequent updated features.  
**-Vite:**  
For configuration simplicity, fast dev server and modern codebase.  
  
**React Patterns used in this app:**  
**-Hooks**  
**-Compounds**  
**-Presentational components and logic containers**  
**-Layout Pattern** with one parent for both child to reduce loading times on unmount and hold the shared data in parent
