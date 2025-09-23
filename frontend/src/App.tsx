import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './login/login.tsx';
import CreateAcc from './createAcc/createAcc.tsx';
import EditPassword from './editPass.tsx/edit.tsx';
import Questions from './Questions';
import './index.css';

function App() {
  return (<>
    <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
    
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/createAcc" element={<CreateAcc />} />
        <Route path="/edit" element={<EditPassword />} />
        <Route path="/questions" element={<Questions />} />
        {/*add other routes here*/}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </>
  );
}

export default App;