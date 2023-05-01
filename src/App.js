import { ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';


import QuizQuestionsList from './component/Home';
import QuizQuestionDetails from './component/userdetails';
import AddQuizQuestionForm from './component/create';
import QuizStats from './component/statistic'
const client = new ApolloClient({
  uri:'http://localhost:8000/graphQuery',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
      <div>
        <nav className="navbar">
          <ul className='nav ul'>
            <li className='nav li '>
              <Link to="/">Home</Link>
            </li>
            <li className='nav li '>
               <Link to="/create">Create Quiz</Link>
             </li>
          </ul>
        </nav>
        <Routes>
        <Route path="/" element={<QuizQuestionsList />} />
        <Route path="/quiz/:id/details" element={<QuizQuestionDetails />} />
        <Route path="/quiz/:id/stats" element={<QuizStats />} />
        <Route path="/create" element={<AddQuizQuestionForm />} />
        </Routes>
      </div>
    </Router>
    </ApolloProvider>
  );
}

export default App;
