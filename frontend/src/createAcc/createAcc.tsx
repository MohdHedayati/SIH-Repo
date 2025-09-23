import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './createAcc.css';

function CreateAcc() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDOB] = useState("");
  const [name, setName] = useState("");

  const gridRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const maxMovement = 16;


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      const moveX = (mouseX - 0.5) * maxMovement;
      const moveY = (mouseY - 0.5) * maxMovement;

      requestAnimationFrame(() => {
        if (gridRef.current) {
          gridRef.current.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
        }
        if (mainRef.current) {
          mainRef.current.style.transform = `translate(${8 + moveX * 0.4}px, ${8 + moveY * 0.4}px)`;
          mainRef.current.style.boxShadow = `var(--primary) ${12 - moveX * 0.4}px ${12 - moveY * 0.4}px`;
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const submitData = async () => {
    try {
      sessionStorage.clear();
      const response = await fetch("http://localhost:8000/createAcc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name,username,dob, password }),
      });

      const data = await response.json();
      if (!data.isValid) { 
        alert(data.message);
        return;
      }
      if (data.isValid) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = '/login';
      }


    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      submitData();
    }
  };

  return (
    <div className="login-container">
      <title>LOG IN</title>
      <div id="parallax-grid" ref={gridRef}> </div>
      <div id="main-login" ref={mainRef}>
        <div id="toggle">
        </div>

        <h1>SIGN UP</h1>
        <div id="login">
          <input type="text" id="name" placeholder="Name" value={name.trim()} onChange={(e) => setName(e.target.value)}/>
          <input type="text" id="user" placeholder="Username" value={username.trim()} onChange={(e) => setUsername(e.target.value)}/>
          <input type="date" id="dob" placeholder="Date Of Birth" value={dob.trim()} onChange={(e) => setDOB(e.target.value)}/>
          <input type="password" id="password" placeholder="New Password" value={password.trim()} onKeyDown={handleKeyDown} onChange={(e) => setPassword(e.target.value)}/>
          <button id="submit" onClick={(e) => { e.preventDefault(); submitData(); }}>CONTINUE</button>
          <div className="link-container">
          <Link className="CP" to="/login"> Already Have an Account </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default CreateAcc;