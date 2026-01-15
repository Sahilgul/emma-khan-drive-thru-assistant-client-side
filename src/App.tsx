import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => (
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);

export default App;
