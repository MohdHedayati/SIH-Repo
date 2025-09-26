import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || '{}');
  const userName = user.name ? user.name.split(' ')[0] : 'User';

  const handleStartQuiz = () => {
    navigate('/questions');
  };

  return (
    <div className="dashboard-container">
      <div className="news-ticker">
        <div className="news-ticker-content">
          {/* --- News items are listed once --- */}
          <div className="news-item">
            <span className="news-head">ADMISSION ALERT</span>
            <span className="news-body">CAP Round II registration is closing on 30th September 2025.</span>
          </div>
          <div className="news-item">
            <span className="news-head">WEBINAR</span>
            <span className="news-body">Join our free webinar on "Careers in AI" this Saturday.</span>
          </div>
          <div className="news-item">
            <span className="news-head">NEW FEATURE</span>
            <span className="news-body">Personalized college recommendations are now live on the results page!</span>
          </div>

          {/* --- The SAME news items are duplicated for a seamless loop --- */}
          <div className="news-item">
            <span className="news-head">ADMISSION ALERT</span>
            <span className="news-body">CAP Round II registration is closing on 30th September 2025.</span>
          </div>
          <div className="news-item">
            <span className="news-head">WEBINAR</span>
            <span className="news-body">Join our free webinar on "Careers in AI" this Saturday.</span>
          </div>
          <div className="news-item">
            <span className="news-head">NEW FEATURE</span>
            <span className="news-body">Personalized college recommendations are now live on the results page!</span>
          </div>
        </div>
      </div>

      <header className="dashboard-header">
        <h1>Welcome Back, {userName}!</h1>
        <p>Your journey to the perfect career starts now. Let's explore your potential.</p>
      </header>
      
      {/* The rest of the dashboard grid remains unchanged */}
      <div className="dashboard-grid">
        <div className="dashboard-card cta-card" onClick={handleStartQuiz}>
          <h2>AI Career Counselor</h2>
          <p>Unsure about your next step? Take our in-depth, personalized quiz to discover career paths that align with your unique personality and skills.</p>
          <button className="cta-button">Start the Quiz Now</button>
        </div>
        <div className="dashboard-card updates-card">
          <h3>Latest Updates</h3>
          <ul>
            <li><strong>Admission Alert:</strong> CAP Round II registration closing on 30th Sept 2025.</li>
            <li><strong>New Feature:</strong> You can now explore top colleges on your results page!</li>
            <li><strong>Webinar:</strong> Join our free webinar on "Careers in AI" next Saturday.</li>
          </ul>
        </div>
        <div className="dashboard-card past-quizzes-card">
          <h3>Your Past Quizzes</h3>
          <div className="past-quiz-item">
            <span>Engineering Path Analysis</span>
            <span className="quiz-date">Completed: 24 Sept 2025</span>
          </div>
          <div className="past-quiz-item placeholder">
            <span>Your next result will appear here...</span>
          </div>
          <a href="#" className="view-all-link">View All</a>
        </div>
        <div className="dashboard-card quick-actions-card">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
                <div className="action-item"><span>📝</span> Edit Profile</div>
                <div className="action-item"><span>📅</span> Book a Session</div>
                <div className="action-item"><span>🎓</span> Explore Colleges</div>
                <div className="action-item"><span>❓</span> Help & FAQ</div>
            </div>
        </div>
        <div className="dashboard-card events-card">
            <h3>Upcoming Events</h3>
            <div className="event-item">
                <div className="event-date"><span className="month">SEP</span><span className="day">27</span></div>
                <div className="event-details"><h4>Webinar: Careers in AI</h4><p>Online | 4:00 PM IST</p></div>
            </div>
            <div className="event-item">
                <div className="event-date"><span className="month">OCT</span><span className="day">05</span></div>
                <div className="event-details"><h4>Workshop: Building Your Portfolio</h4><p>Online | 11:00 AM IST</p></div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;