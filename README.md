**To Execute:**  
-Make sure your client port is 5173.  
-Run npm install.  
-Run the app with npm run dev.  
-Run unit tests with npm test.  
  
**Architectural Decisions**  
**-FSD:**  
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
Tickets are a core and dynamic part of the app.  
Redux provides a predictable, centralized way to manage this data, and the Entity Adapter simplifies handling frequent updates and normalized state.  
As the app evolves using the ticket states can be easily shared across the components.  
In addition, Redux middleware integrates well with real-time updates via WebSockets.  
**-Error Handling:**  
Global: Interceptor -> Middleware -> UI  
Local: try/catch state  
**-Context-Api:**  
For handling theme contexts and other light weight non-frequent updated features.  
**-Vite:**  
For configuration simplicity, fast dev server and modern codebase.  
  
**React Patterns used in this app:**  
**-Custom Hooks**  
**-Compounds**  
**-Feature and Reusable components**  
**-Layout Pattern** with one parent for both child to reduce loading times on unmount and hold the shared data in parent
