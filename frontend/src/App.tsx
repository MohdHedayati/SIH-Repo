import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './login/login.tsx';
import CreateAcc from './createAcc/createAcc.tsx';
import EditPassword from './editPass.tsx/edit.tsx';
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
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createAcc" element={<CreateAcc />} />
        <Route path="/edit" element={<EditPassword />} />

        {/*add other routes here*/}
      </Routes>
      </>
  );
}

export default App;