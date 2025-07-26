import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CitizenDashboard.css";
import FeedbackForm from "../components/Feedbackform";
import awarenessImage from "../assets/image.jpg";
import backImage from "../assets/citizenback.jpg";


function CitizenDashboard() {
  // ✅ State Variables
  const [points, setPoints] = useState(0);
  const [reports, setReports] = useState([]);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
const [reportToFeedback, setReportToFeedback] = useState(null);
const [selectedFile, setSelectedFile] = useState(null);

  const videoRef = useRef(null);
  const submissionsRef = useRef(null);
  const rewardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    fetchRewardPoints();
    fetchLeaderboard();
    startCamera();
    fetchLocation();
  }, []);

  // ✅ Fetch Reports
  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/waste/my-reports", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReports(response.data);
      // Check if there's any completed report without feedback
      const pendingFeedbackReport = response.data.find(
        (report) => report.status === "completed" && !report.feedback
      );
      if (pendingFeedbackReport) {
        setReportToFeedback(pendingFeedbackReport);
        setShowFeedbackPopup(true);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  // ✅ Fetch Leaderboard Data
  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/leaderboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  // ✅ Fetch Reward Points from Backend
const fetchRewardPoints = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const response = await axios.get("http://localhost:5002/api/waste/my-reward-points", {
      headers: { Authorization: `Bearer ${token}` }, // ✅ Corrected template literal syntax
    });

    setPoints(response.data.rewardPoints); // ✅ Update reward points state
  } catch (error) {
    console.error("Error fetching reward points:", error.response?.data || error.message);
  }
};
  
  
  // ✅ Get User's Location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAN_dWYJZn5_bFQx7huMdod7z0gsefFi4Y`
            );
            console.log("🔹 Google Maps API Response:", response.data);
            if (response.data.results.length > 0) {
              const address = response.data.results[0].formatted_address;
  
              setLocation({
                latitude,
                longitude,
                address, // ✅ Store the readable address
              });
            } else {
              setLocation({
                latitude,
                longitude,
                address: "Address not found",
              });
            }
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => console.error("Error fetching location:", error)
      );
    }
  };

  // ✅ Start Camera
  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error("Error accessing camera:", error));
  };

  // ✅ Capture Image from Camera
  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL("image/png"));
  };
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    return new Blob([new Uint8Array(byteArrays)], { type: mimeType });
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);  // ✅ Fix: Set selectedFile instead of image
    }
  };
  // ✅ Submit Waste Report & Show Reward Popup
  const submitReport = async () => {
    if ((!image && !selectedFile) || !description || !location) {
      alert("Please capture/select an image, enter a description, and allow location access.");
      return;
    }
  
    const formData = new FormData();
  
    if (selectedFile) {
      // If user selects an image from files, upload it directly
      formData.append("image", selectedFile);
    } else if (image) {
      // If user captures an image, convert base64 to file and then upload
      const blob = base64ToBlob(image, "image/png");
      const file = new File([blob], "waste.png", { type: "image/png" });
      formData.append("image", file);
    }
  
    formData.append("description", description);
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);
    formData.append("address", location.address || "Address not available");
  
    try {
      await axios.post("http://localhost:5002/api/waste/report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      alert("✅ Waste reported successfully!");
      setImage(null);
      setSelectedFile(null); // Reset the selected file
      setDescription("");
      fetchReports();
      fetchRewardPoints();
      fetchLeaderboard();
  
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } catch (error) {
      console.error("❌ Error submitting report:", error.response?.data || error);
      alert("❌ Failed to report waste. Please try again.");
    }
  };

  const leaderboardRef = useRef(null); // ✅ Reference for leaderboard section

const toggleLeaderboard = async () => {
  try {
    if (!showLeaderboard) {
      console.log("Fetching leaderboard data...");
      const response = await axios.get("http://localhost:5002/api/leaderboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Leaderboard Data:", response.data);
      setLeaderboard(response.data);
    }
    setShowLeaderboard((prev) => !prev);

    // ✅ Scroll to Leadership Board if it's shown
    setTimeout(() => {
      leaderboardRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
  }
};


  // ✅ Scroll to Sections
  const scrollToSubmissions = () => {
    submissionsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToRewards = () => {
    rewardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  
  return (
    <div className="dashboard-container">
      {showPopup && <div className="reward-popup">🎉 You got +10 points!</div>}

      <nav className="navbar">
  {/* Left Side: Logo + Website Name */}
  <div className="logo-container">
    <img src={require("../assets/clearzonelogo.jpg")} alt="ClearZone Logo" className="logo" />
    <span className="site-name">ClearZone</span>
  </div>

  {/* Center: Nav Items */}
  <div className="nav-items">
    <span className="nav-item" onClick={scrollToSubmissions}>View Latest Submissions</span>
    <span className="nav-item" onClick={scrollToRewards}>View Reward Points</span>
    <span className="nav-item" onClick={toggleLeaderboard}>View Leadership Board</span>
    <span className="nav-item" onClick={() => navigate("/about")}>About Us</span>
  </div>

  <div className="nav-right">
    <button className="logout-btn" onClick={handleLogout}>Logout</button>
  </div>
</nav>

<div className="hero-section">
  <img src={require("../assets/image.jpg")} alt="Helping Citizens" className="hero-image" />
  <div className="hero-text">
    <h1>Making Our Cities Cleaner</h1>
    <p>
      ClearZone is a community-driven initiative that empowers citizens to report waste accumulation areas.  
      By doing so, municipal workers can efficiently address these issues, ensuring cleaner streets and a healthier environment.  
      Our reward-based system encourages public participation and awareness, promoting responsible waste disposal.  
      Join us in creating a greener, more sustainable city for future generations.
    </p>
  </div>
</div>




      {/* ✅ Report Waste Section */}
      <div className="report-section">
  <h3 className="report-waste-heading">Report Waste</h3>
  {location && (
    <div className="location-box">
      📍 Location: {location.latitude}, {location.longitude}
    </div>
  )}
  <textarea placeholder="Describe the waste location..." value={description} onChange={(e) => setDescription(e.target.value)} />
  <div className="camera-section">
    <video ref={videoRef} autoPlay playsInline className="video-feed" />
    <button onClick={captureImage}>Capture Image</button>
  </div>
  {/* Upload Image Section */}
  <div className="upload-section">
    <input type="file" accept="image/*" onChange={handleFileUpload} />
    {selectedFile && (
      <div>
        <p>Selected File: {selectedFile.name}</p>
        <img src={URL.createObjectURL(selectedFile)} alt="Selected Waste" className="image-preview" />
      </div>
    )}
  </div>

  {image && <img src={image} alt="Captured Waste" className="image-preview" />}
  <button className="submit-btn" onClick={submitReport}>Submit Waste Report</button>
</div>


     {/* ✅ Latest Submissions */}
     <div className="latest-reports">
        <h3>Latest Submissions</h3>
        {reports.length === 0 ? (
          <p>No reports found. Try submitting one!</p>
        ) : (
          <table className="reports-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Submitted On</th>
                <th>Image</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td>{report.description}</td>
                  <td>{report.status || "Pending"}</td>
                  <td>{report.assigned ? report.assigned.name : "Not Assigned"}</td>
                  <td>{new Date(report.createdAt).toLocaleString()}</td>
                  <td>
                    {report.imageUrl ? (
                      <img src={report.imageUrl} alt="Reported Waste" className="table-image" />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    {report.feedback ? (
                      <p>{report.feedback.rating} Stars - {report.feedback.comment}</p>
                    ) : (
                      "No Feedback Given"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showFeedbackPopup && reportToFeedback && (
    <div className="feedback-popup">
        <h3>Provide Feedback for Completed Report</h3>
        <FeedbackForm
            reportId={reportToFeedback._id}
            onFeedbackSubmitted={(updatedReport) => {
                setReports((prevReports) =>
                    prevReports.map((r) =>
                        r._id === updatedReport._id ? updatedReport : r
                    )
                );
                setShowFeedbackPopup(false);
            }}
        />
    </div>
)}
        {/* ✅ Reward Points Section (Enhanced) */}
<div ref={rewardRef} className="reward-section">
  <h3>Reward Points</h3>
  <p>You currently have <span className="points">{points}</span> points.</p>
  <p className="reward-info">
    🎯 Earn points by reporting waste!  
    🏆 Higher points increase your ranking on the leadership board.  
    🔄 Keep contributing to make our city cleaner!  
  </p>
</div>


      {/* ✅ Leadership Board */}
<div ref={leaderboardRef} className="leaderboard-section">
  <h3>Leadership Board 🏆</h3>
  <p className="leaderboard-description">
    The top contributors who actively report waste and help keep the environment clean are ranked here. 
    Earn more reward points by making meaningful contributions!
  </p>
  
  {leaderboard.length === 0 ? (
    <p>No leaderboard data available.</p>
  ) : (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Reward Points</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map((user, index) => {
          let rankClass = "";
          if (index === 0) rankClass = "rank-1"; // Gold 🥇
          else if (index === 1) rankClass = "rank-2"; // Silver 🥈
          else if (index === 2) rankClass = "rank-3"; // Bronze 🥉

          return (
            <tr key={user._id} className={rankClass}>
              <td>{index + 1}</td>
              <td>{user.name || "No Name"}</td>
              <td>{user.rewardPoints}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )}
</div>


    </div>
    
  );
  
}

export default CitizenDashboard;
