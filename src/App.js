import { useRoutes } from 'react-router-dom';
import routes from './router/index';
import './App.less';

function App() {
  const element = useRoutes(routes)
  return (
    <div className="app">
      {element}
    </div>
  );
};

export default App;
