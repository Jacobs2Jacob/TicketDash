**To Execute:**  
•  Make sure your client port is 5173.  
•  Run npm install.  
•  Run the app with npm run dev.  
•  Run unit tests with npm test.  
  
**Short Brief**  
**Real-Time Ticket Support Dashboard**  
• A super smooth, responsive, smart architecture and scalable CRUD SPA Real-Time React Dashboard for managing Tickets.  
  
**Architectural Decisions**  
**FSD:**  
• A common and scalable approach that isolates feature components from shared components (reusable across multiple features).  
**Smart Routes:**  
• For supporting future route based components and better scalability.  
**-React Query:**  
Act as the source of truth for Tickets.  
For pagination used along with React Infinite Scroll Component to achieve optimal performance in heavy data scenarios without virtualization overhead.  
**-Jest:**  
For unit testing of core API functionality.  
**-Socket.io:**  
For real-time updates over WebSockets with automatic reconnection and transport fallbacks.  
**-React Hook Form:**  
For a more maintainable and performant form experience with built-in validation.  
**-CSS Modules:**  
For scoped, maintainable styling with light/dark theme support through a theme context.  
**-TypeScript:**  
For strong type safety and consistency between client and server models.  
**-Redux:**  
Redux middleware integrates well with real-time updates via WebSockets as well as Authentication flow (Thunks).  
**-Error Handling:**  
Network: Interceptor -> Middleware -> Component -> UI  
Local: Hook -> Component -> UI  
Render: Error boundary -> UI  
**-Context-Api:**  
For handling theme contexts and other light weight non-frequent updated features.  
**-Vite:**  
For configuration simplicity, fast dev server and modern codebase.  
  
**React Patterns used in this app:**  
**• Custom Hooks**  
**• Compounds**  
**• Feature and Reusable components**  
**• Layout Pattern** with one parent for both child to reduce loading times on unmount and hold the shared data in parent
