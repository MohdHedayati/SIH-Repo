import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './ResultsPage.css';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// --- Data Structures ---
const collegeData: { [state: string]: { [region: string]: any[] } } = {
  'Andhra Pradesh': {},
  'Arunachal Pradesh': {},
  'Assam': {},
  'Bihar': {},
  'Chhattisgarh': {},
  'Goa': {},
  'Gujarat': {},
  'Haryana': {},
  'Himachal Pradesh': {},
  'Jharkhand': {},
  'Karnataka': {},
  'Kerala': {},
  'Madhya Pradesh': {},
  'Maharashtra': {
    'Mumbai': [
      { name: 'Veermata Jijabai Technological Institute (VJTI)', location: 'Matunga', website: 'https://www.vjti.ac.in/' },
      { name: 'Sardar Patel Institute of Technology (SPIT)', location: 'Andheri', website: 'https://www.spit.ac.in/' },
      { name: 'Dwarkadas J. Sanghvi College of Engineering (DJSCE)', location: 'Vile Parle', website: 'https://www.djsce.ac.in/' },
      { name: 'K. J. Somaiya College of Engineering', location: 'Vidyavihar', website: 'https://kjsce.somaiya.edu/en/' },
      { name: 'Thadomal Shahani Engineering College (TSEC)', location: 'Bandra', website: 'https://tsec.edu/' },
      { name: 'Ramrao Adik Institute of Technology (RAIT)', location: 'Nerul', website: 'https://www.rait.ac.in/' },
      { name: 'Fr. C. Rodrigues Institute of Technology', location: 'Vashi', website: 'https://www.fcrit.ac.in/' },
      { name: 'Vivekanand Education Society\'s Institute of Technology', location: 'Chembur', website: 'https://ves.ac.in/vesit/' },
      { name: 'Usha Mittal Institute of Technology', location: 'Juhu', website: 'https://umit.sndt.ac.in/' },
      { name: 'Don Bosco Institute of Technology', location: 'Kurla', website: 'https://www.dbit.in/' }
    ],
    'Pune': [],
    'Nagpur': []
  },
  'Manipur': {},
  'Meghalaya': {},
  'Mizoram': {},
  'Nagaland': {},
  'Odisha': {},
  'Punjab': {},
  'Rajasthan': {},
  'Sikkim': {},
  'Tamil Nadu': {},
  'Telangana': {},
  'Tripura': {},
  'Uttar Pradesh': {},
  'Uttarakhand': {},
  'West Bengal': {}
};

const allStates = Object.keys(collegeData);

const parseRecommendationText = (text: string) => {
    const parts = text.split('\n\n');
    const title = parts[0].replace('###', '').trim();
    const sections = parts.slice(1).map(part => {
        const lines = part.split('\n');
        const heading = lines[0].replace(/\*/g, '').trim();
        const items = lines.slice(1).map(line => line.replace(/^[0-9]\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').trim());
        return { heading, items };
    });
    return { title, sections };
};

// --- Main Component ---
function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const recommendation = location.state?.recommendation;
    const reportRef = useRef<HTMLDivElement>(null);

    const [selectedState, setSelectedState] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');

    if (!recommendation) { return <div>Loading or invalid access...</div>; }

    const { title, sections } = parseRecommendationText(recommendation.question_text);
    
    // --- Chart.js Setup ---
    const chartData = {
        labels: ['Logical Systems', 'Strategic Thinking', 'Hands-on Building', 'Data Analysis', 'Team Collaboration', 'Creative Design'],
        datasets: [{
            label: 'Your Skill Alignment',
            data: [9, 7, 8, 6, 7, 4], // Example data
            backgroundColor: 'rgba(157, 141, 232, 0.2)',
            borderColor: '#9d8de8',
            borderWidth: 2,
        }],
    };
    const chartOptions: any = { maintainAspectRatio: false, scales: { r: { angleLines: { color: 'rgba(255, 255, 255, 0.2)' }, grid: { color: 'rgba(255, 255, 255, 0.2)' }, pointLabels: { color: '#e0e0e0', font: { size: 12 } }, ticks: { display: false } } }, plugins: { legend: { display: false } } };

    // --- PDF Download Logic ---
    const handleDownloadPdf = () => {
        const input = reportRef.current;
        if (input) {
            html2canvas(input, { backgroundColor: '#101010', scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save("AI_Career_Roadmap.pdf");
            });
        }
    };

    const regionsForState = selectedState ? Object.keys(collegeData[selectedState]) : [];
    const collegesForRegion = selectedState && selectedRegion ? collegeData[selectedState][selectedRegion] : [];

    return (
        <div className="results-page-wrapper">
            <div className="results-content-area" ref={reportRef}>
                <header className="results-header">
                    <h1>Your Personalized Roadmap</h1>
                    <p>{recommendation.chatbot_reply}</p>
                </header>

                <main className="results-grid">
                    <section className="main-content">
                        <div className="roadmap-card title-card"><h2>{title}</h2></div>
                        {sections.map((section, index) => (
                            <div key={index} className="roadmap-card">
                                <h3>{section.heading}</h3>
                                <ul>{section.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}</ul>
                            </div>
                        ))}
                    </section>
                    
                    <aside className="sidebar-content">
                        <div className="sidebar-card chart-card">
                            <h3>Skill Profile</h3>
                            <div className="chart-container"><Radar data={chartData} options={chartOptions} /></div>
                        </div>
                        <div className="sidebar-card">
                            <h3>Browse Colleges</h3>
                            <div className="dropdown-container">
                                <select className="dropdown" value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedRegion(''); }}>
                                    <option value="">Select State</option>
                                    {allStates.map(state => <option key={state} value={state}>{state}</option>)}
                                </select>
                                <select className="dropdown" value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} disabled={regionsForState.length === 0}>
                                    <option value="">Select Region</option>
                                    {regionsForState.map(region => <option key={region} value={region}>{region}</option>)}
                                </select>
                            </div>
                            <div className="college-list">
                                {collegesForRegion.length > 0 && collegesForRegion.map((college: any, index) => (
                                    <div key={index} className="college-card">
                                        <div className="college-info">
                                            <h4>{college.name}</h4>
                                            <span>{college.location}</span>
                                        </div>
                                        <a href={college.website} target="_blank" rel="noopener noreferrer" className="explore-button">Explore</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </main>
            </div>
            
            <footer className="results-footer">
                <button className="action-button" onClick={() => navigate('/')}>Take Quiz Again</button>
                <button className="action-button primary" onClick={handleDownloadPdf}>Download Report</button>
            </footer>
        </div>
    );
}

export default ResultsPage;