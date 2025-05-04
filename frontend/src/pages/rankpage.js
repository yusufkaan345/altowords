import React, { useState, useEffect } from 'react';
import TopMenu from '../components/main/TopMenu';
import { fetchUserScore, calculateUserRank, fetchAllScores } from '../components/rank/RankService';
import { useAuth } from '../context/AuthContext';
import { useToken } from '../context/useToken';
import { Container, Card, Spinner, Alert, ProgressBar, Badge, Table, Row, Col } from 'react-bootstrap';
import { FaStar, FaTrophy, FaLock, FaUnlock, FaCheck } from 'react-icons/fa';
import "../assets/styles/rankpage.css";
import { AiOutlineStar, AiOutlineCrown, AiOutlineLock, AiOutlineCheck } from 'react-icons/ai';
import beginner from '../assets/images/levels/beginner.png';
import intermediate from '../assets/images/levels/intermediate.png';
import advanced from '../assets/images/levels/advanced.png';
import expert from '../assets/images/levels/expert.png';
import master from '../assets/images/levels/master.png';
import rankData from '../components/rank/ranks.json';

// Import rank images
import tahta1 from '../assets/images/ranks/tahta1.png';
import tahta2 from '../assets/images/ranks/tahta2.png';
import tahta3 from '../assets/images/ranks/tahta3.png';
import tahta4 from '../assets/images/ranks/tahta4.png';
import tahta5 from '../assets/images/ranks/tahta5.png';
import demir1 from '../assets/images/ranks/demir1.png';
import demir2 from '../assets/images/ranks/demir2.png';
import demir3 from '../assets/images/ranks/demir3.png';
import demir4 from '../assets/images/ranks/demir4.png';
import demir5 from '../assets/images/ranks/demir5.png';
import yakut1 from '../assets/images/ranks/yakut1.png';
import yakut2 from '../assets/images/ranks/yakut2.png';
import yakut3 from '../assets/images/ranks/yakut3.png';
import yakut4 from '../assets/images/ranks/yakut4.png';
import yakut5 from '../assets/images/ranks/yakut5.png';
import zumrut1 from '../assets/images/ranks/zümrüt1.png';
import zumrut2 from '../assets/images/ranks/zümrüt2.png';
import zumrut3 from '../assets/images/ranks/zümrüt3.png';
import zumrut4 from '../assets/images/ranks/zümrüt4.png';
import zumrut5 from '../assets/images/ranks/zümrüt5.png';
import ametist1 from '../assets/images/ranks/ametist1.png';
import ametist2 from '../assets/images/ranks/ametist2.png';
import ametist3 from '../assets/images/ranks/ametist3.png';
import ametist4 from '../assets/images/ranks/ametist4.png';
import ametist5 from '../assets/images/ranks/ametist5.png';

// Map level numbers to imported images
const rankImages = {
  1: tahta1, 2: tahta2, 3: tahta3, 4: tahta4, 5: tahta5,
  6: demir1, 7: demir2, 8: demir3, 9: demir4, 10: demir5,
  11: yakut1, 12: yakut2, 13: yakut3, 14: yakut4, 15: yakut5,
  16: zumrut1, 17: zumrut2, 18: zumrut3, 19: zumrut4, 20: zumrut5,
  21: ametist1, 22: ametist2, 23: ametist3, 24: ametist4, 25: ametist5
};

// Category names for each rank group
const rankCategories = {
  "Tahta": [1, 2, 3, 4, 5],
  "Demir": [6, 7, 8, 9, 10],
  "Yakut": [11, 12, 13, 14, 15],
  "Zümrüt": [16, 17, 18, 19, 20],
  "Ametist": [21, 22, 23, 24, 25]
};

function RankPage() {
  const { currentUser } = useAuth();
  const { getToken } = useToken();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rankInfo, setRankInfo] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [rankLevels, setRankLevels] = useState([]);
  
  // User level images
  const levelImages = {
    'Beginner': beginner,
    'Intermediate': intermediate,
    'Advanced': advanced,
    'Expert': expert,
    'Master': master
  };

  // Define level roadmap
  const levelRoadmap = [
    { level: 'Beginner', points: 0, image: beginner, description: 'Just starting out with basic reading skills.' },
    { level: 'Intermediate', points: 500, image: intermediate, description: 'Building vocabulary and comprehension skills.' },
    { level: 'Advanced', points: 1500, image: advanced, description: 'Reading complex texts with good understanding.' },
    { level: 'Expert', points: 3000, image: expert, description: 'High-level reading and analysis skills.' },
    { level: 'Master', points: 5000, image: master, description: 'Complete mastery of reading in English.' }
  ];

  useEffect(() => {
    if (currentUser) {
      loadUserRankData();
      loadLeaderboard();
    } else {
      setLoading(false);
      setLeaderboardLoading(false);
    }
  }, [currentUser]);

  const loadUserRankData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) {
        setError("Failed to authenticate. Please try again later.");
        setLoading(false);
        return;
      }

      const userData = await fetchUserScore(token);
      if (!userData || userData.totalScore === undefined) {
        setError("Could not retrieve your score data.");
        setLoading(false);
        return;
      }
      
      const userRankInfo = calculateUserRank(userData.totalScore);
      setRankInfo({
        ...userRankInfo,
        userName: userData.userName
      });

      // Generate all levels for roadmap
      const allLevels = [];
      for (let level = 1; level <= 25; level++) {
        let category = "Tahta";
        if (level >= 6 && level <= 10) category = "Demir";
        else if (level >= 11 && level <= 15) category = "Yakut";
        else if (level >= 16 && level <= 20) category = "Zümrüt";
        else if (level >= 21) category = "Ametist";

        const isCurrentLevel = level === userRankInfo.currentLevel.globalLevel;
        const isUnlocked = level <= userRankInfo.currentLevel.globalLevel;
        
        // Find the required XP for this level
        let requiredXp = 0;
        for (const rank of rankData.ranks) {
          const levelData = rank.levels.find(l => l.globalLevel === level);
          if (levelData) {
            requiredXp = levelData.requiredXp;
            break;
          }
        }
        
        allLevels.push({
          level,
          category,
          image: rankImages[level],
          isCurrentLevel,
          isUnlocked,
          requiredXp
        });
      }
      setRankLevels(allLevels);
      
    } catch (err) {
      console.error("Error loading user rank data:", err);
      setError("Failed to load rank data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      setLeaderboardLoading(true);
      const token = await getToken();
      if (!token) {
        setLeaderboardLoading(false);
        return;
      }

      const allScores = await fetchAllScores(token);
      if (allScores && Array.isArray(allScores)) {
        // Sort by score in descending order
        const sortedScores = [...allScores].sort((a, b) => b.totalScore - a.totalScore);
        
        // Calculate rank level for each user
        const scoresWithRank = sortedScores.map(user => {
          const userRank = calculateUserRank(user.totalScore);
          return {
            ...user,
            rank: userRank
          };
        });
        
        setLeaderboardData(scoresWithRank);
      }
    } catch (err) {
      console.error("Error loading leaderboard:", err);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const getUserLevel = (points) => {
    if (points >= 5000) return 'Master';
    if (points >= 3000) return 'Expert';
    if (points >= 1500) return 'Advanced';
    if (points >= 500) return 'Intermediate';
    return 'Beginner';
  };

  // Kullanıcı puanını rankInfo'dan al, eğer yoksa leaderboard'dan al
  const currentUserPoints = rankInfo?.totalScore || 
    leaderboardData.find(user => user.userName === currentUser?.displayName)?.totalScore || 0;

  if (loading) {
    return (
      <div className="rank-page">
        <TopMenu />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <Spinner animation="border" role="status" variant="light">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="rank-page">
        <TopMenu />
        <Container className="pt-5">
          <Alert variant="light">
            Please log in to see your rank progress.
          </Alert>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rank-page">
        <TopMenu />
        <Container className="pt-5">
          <Alert variant="danger">
            {error}
            <div className="mt-3">
              <button className="btn btn-primary" onClick={loadUserRankData}>
                Try Again
              </button>
            </div>
          </Alert>
        </Container>
      </div>
    );
  }

  if (!rankInfo) {
    return (
      <div className="rank-page">
        <TopMenu />
        <Container className="pt-5">
          <Alert variant="info">
            No rank data available. Start earning points by completing tests!
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="rank-page">
      <TopMenu />
      <div className="rank-page-content">
        <Container className="py-5 rank-container">
          
            <h4>Altoword Reading - Global Leaderboard</h4>
            <meta name="description" content="See how you rank against other readers on ReadEnglish." />
          
          <div className="text-center mb-4">
            <h1 className="display-4 text-white fw-bold rank-title">Level Journey</h1>
            <p className="text-light rank-subtitle">Track your progress and compete with other learners</p>
          </div>
          
          <Row className="mb-4">
            <Col lg={6} className="mb-4">
              <Card className="simple-rank-card mx-auto">
                <div className="rank-image-container">
                  <img 
                    src={rankImages[rankInfo.currentLevel.globalLevel]} 
                    alt={`${rankInfo.currentRank.name} Level ${rankInfo.currentLevel.globalLevel}`} 
                    className="rank-image"
                  />
                  <div className="level-badge">
                    <Badge bg="warning" className="level-number">{rankInfo.currentLevel.globalLevel}</Badge>
                  </div>
                </div>
                
                <Card.Body className="rank-details">
                  <div className="d-flex align-items-center mb-3 justify-content-center">
                    <FaTrophy className="trophy-icon me-2" />
                    <h2 className="rank-title mb-0">{rankInfo.currentRank.name} Level {rankInfo.currentLevel.globalLevel}</h2>
                  </div>
                  
                  <div className="score-display text-center mb-3">
                    <Badge bg="info" className="score-badge">
                      <FaStar className="star-icon me-1" /> 
                      Total Score: {rankInfo.totalScore}
                    </Badge>
                  </div>
                  
                  <div className="progress-container mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Next Level Progress</span>
                      <span>{rankInfo.currentXp} / {rankInfo.requiredXp} XP</span>
                    </div>
                    <ProgressBar 
                      now={rankInfo.levelProgress} 
                      variant="success" 
                      className="level-progress"
                    />
                  </div>
                  
                  {rankInfo.nextLevel && (
                    <div className="next-level-info text-center">
                      <p className="mb-0">
                        <strong>Next Level:</strong> {rankInfo.nextLevel.name || rankInfo.currentRank.name} {rankInfo.nextLevel.globalLevel}
                      </p>
                      <p className="mb-0 text-muted">
                        Need {rankInfo.requiredXp - rankInfo.currentXp} more XP to advance
                      </p>
                    </div>
                  )}
                  
                  {rankInfo.isMaxLevel && (
                    <div className="max-level-info text-center">
                      <p className="congratulations mb-0">Congratulations! You've reached the maximum level!</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6}>
              <Card className="leaderboard-card">
                <Card.Header className="text-center bg-primary text-white py-3">
                  <h2 className="mb-0">Global Leaderboard</h2>
                </Card.Header>
                <Card.Body>
                  {leaderboardLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  ) : (
                    <Table responsive className="leaderboard-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>User</th>
                          <th>Level</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboardData.map((user, index) => {
                          const userLevel = getUserLevel(user.totalScore);
                          const isCurrentUser = user.userName === currentUser.displayName;
                          const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';
                          
                          return (
                            <tr 
                              key={user.userName} 
                              className={`${isCurrentUser ? 'current-user-row' : ''} ${rankClass}`}
                            >
                              <td>
                                {index === 0 && <AiOutlineCrown className="me-1" style={{ color: 'gold', fontSize: '1.25rem' }} />}
                                {index + 1}
                              </td>
                              <td>{user.userName} {isCurrentUser && <span className="ms-2 text-success fw-bold">(you)</span>}</td>
                              <td className="level-cell">
                                <img 
                                  src={levelImages[userLevel]} 
                                  alt={userLevel} 
                                  className="leaderboard-level-icon me-2" 
                                  title={userLevel}
                                />
                                {userLevel}
                              </td>
                              <td>
                                <AiOutlineStar className="me-1" style={{ color: '#ffc107' }} /> {user.totalScore}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Level Roadmap */}
          <Card className="roadmap-card mt-4">
            <Card.Header className="text-center bg-success text-white py-3">
              <h2 className="mb-0">Level Roadmap</h2>
            </Card.Header>
            <Card.Body>
              {levelRoadmap.map((level, index) => {
                // Determine if the level is completed, active, or locked
                const isCompleted = currentUserPoints >= level.points;
                const isActive = !isCompleted && 
                  (index === 0 || currentUserPoints >= levelRoadmap[index - 1].points);
                const isLocked = !isCompleted && !isActive;
                
                let statusClass = '';
                if (isCompleted) statusClass = 'completed';
                else if (isActive) statusClass = 'active';
                else statusClass = 'locked';
                
                return (
                  <div key={level.level} className={`roadmap-item ${statusClass}`}>
                    <img 
                      src={level.image} 
                      alt={level.level} 
                      className="roadmap-level-icon" 
                    />
                    <div className="roadmap-content">
                      <h5 className="mb-1">
                        {level.level}
                        {isCompleted && <AiOutlineCheck className="ms-2 text-success" />}
                        {isLocked && <AiOutlineLock className="ms-2" />}
                        {isActive && <FaUnlock className="ms-2 text-warning" />}
                      </h5>
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="mb-0">{level.description}</p>
                        <Badge bg={isCompleted ? 'success' : isActive ? 'info' : 'secondary'}>
                          {level.points} points
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Card.Body>
          </Card>
          
          {/* Detailed Rank Categories */}
          <Card className="roadmap-card mt-4">
            <Card.Header className="text-center bg-dark text-white py-3">
              <h2 className="mb-0">Detailed Level Progress</h2>
            </Card.Header>
            <Card.Body>
              {Object.keys(rankCategories).map(categoryName => {
                const categoryLevels = rankCategories[categoryName];
                return (
                  <div key={categoryName} className="rank-category">
                    <h4 className="category-title">{categoryName}</h4>
                    <div className="d-flex flex-wrap">
                      {categoryLevels.map(level => {
                        const levelData = rankLevels.find(rl => rl.level === level);
                        const isUnlocked = levelData?.isUnlocked || false;
                        const isCurrentLevel = levelData?.isCurrentLevel || false;
                        
                        // Get the required XP directly from rankData
                        let requiredXp = 0;
                        for (const rank of rankData.ranks) {
                          const levelInfo = rank.levels.find(l => l.globalLevel === level);
                          if (levelInfo) {
                            requiredXp = levelInfo.requiredXp;
                            break;
                          }
                        }
                        
                        return (
                          <div 
                            key={level} 
                            className={`roadmap-level-item ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrentLevel ? 'current' : ''}`}
                            title={`${categoryName} Level ${level}`}
                          >
                            <div className="level-icon-container">
                              <img 
                                src={rankImages[level]} 
                                alt={`Level ${level}`} 
                                className="img-fluid" 
                              />
                              <span className="level-status-icon">
                                {isUnlocked ? <FaCheck /> : <FaLock />}
                              </span>
                              {isCurrentLevel && <span className="current-level-marker">Current</span>}
                            </div>
                            <span className="level-number-badge">{level}</span>
                            <div className="xp-requirement">
                              <Badge bg="info" className="xp-badge">
                                <AiOutlineStar className="me-1" /> {requiredXp} XP
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              
              <div className="text-center">
                <div className="roadmap-legend">
                  <div className="legend-item">
                    <span className="current-dot"></span> Current Level
                  </div>
                  <div className="legend-item">
                    <FaCheck size={12} className="me-1 text-success" /> Unlocked
                  </div>
                  <div className="legend-item">
                    <FaLock size={12} className="me-1 text-secondary" /> Locked
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}

export default RankPage;
