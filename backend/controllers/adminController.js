const User = require('../models/User');
const Resume = require('../models/Resume');

exports.getStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const totalUsers = await User.countDocuments();
    const allUsers = await User.find({}, 'createdAt creditHistory').lean();

    let totalRevenue = 0;
    let totalAIRequests = 0;
    const toolUsage = {};
    const revenueByMonth = {};
    const growthByMonth = {};

    allUsers.forEach(user => {
      // User Growth Tracking
      if (user.createdAt) {
        const signupDate = new Date(user.createdAt);
        if (!isNaN(signupDate.getTime())) {
          const monthYear = signupDate.toLocaleString('default', { month: 'short', year: '2-digit' });
          growthByMonth[monthYear] = (growthByMonth[monthYear] || 0) + 1;
        }
      }

      if (user.creditHistory && Array.isArray(user.creditHistory)) {
        user.creditHistory.forEach(history => {
          const historyDate = new Date(history.date || Date.now());
          if (!isNaN(historyDate.getTime())) {
            const historyMonthYear = historyDate.toLocaleString('default', { month: 'short', year: '2-digit' });

            if (history.type === 'added') {
              const estimatedValue = history.amount * 4; // ₹4 per credit estimate
              totalRevenue += estimatedValue;
              revenueByMonth[historyMonthYear] = (revenueByMonth[historyMonthYear] || 0) + estimatedValue;
            } else if (history.type === 'spent') {
              totalAIRequests += 1;
              const tool = history.description ? history.description.replace('Used ', '').replace('Analyzed ', '') : 'Other';
              toolUsage[tool] = (toolUsage[tool] || 0) + 1;
            }
          }
        });
      }
    });

    // Format Charts Data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const now = new Date();
    
    const formattedGrowth = months.map(m => {
        const key = `${m} ${currentYear}`;
        return { name: m, users: growthByMonth[key] || 0 };
    }).filter(d => {
        const dateForMonth = new Date(`${d.name} 1, 20${currentYear}`);
        return d.users > 0 || dateForMonth <= now;
    });

    const formattedRevenue = months.map(m => {
        const key = `${m} ${currentYear}`;
        return { name: m, revenue: revenueByMonth[key] || 0 };
    }).filter(d => {
        const dateForMonth = new Date(`${d.name} 1, 20${currentYear}`);
        return d.revenue > 0 || dateForMonth <= now;
    });

    const topTools = Object.entries(toolUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const totalResumes = await Resume.countDocuments();
    const allResumes = await Resume.find({}, 'atsScore template skills').lean();
    
    let sumScore = 0;
    let validScoreCount = 0;
    const templateCounts = {};
    const skillCounts = {};

    allResumes.forEach(r => {
      if (typeof r.atsScore === 'number') {
        sumScore += r.atsScore;
        validScoreCount++;
      }
      if (r.template) {
        templateCounts[r.template] = (templateCounts[r.template] || 0) + 1;
      }
      if (r.skills && Array.isArray(r.skills)) {
        r.skills.forEach(s => {
          if (s) {
            skillCounts[s] = (skillCounts[s] || 0) + 1;
          }
        });
      }
    });

    const avgAtsScore = validScoreCount > 0 ? Math.round(sumScore / validScoreCount) : 0;

    const mostUsedTemplates = Object.entries(templateCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const popularSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    res.json({
      totalUsers,
      totalRevenue,
      totalAIRequests,
      topTools: topTools.length > 0 ? topTools : [{ name: 'N/A', count: 0 }],
      userGrowth: formattedGrowth,
      revenueHistory: formattedRevenue,
      totalResumes,
      avgAtsScore,
      mostUsedTemplates,
      popularSkills
    });
  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    res.status(500).json({ error: 'Failed to fetch admin stats', details: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    const users = await User.find({}, 'name email role plan credits createdAt').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("ADMIN GET USERS ERROR:", err);
    res.status(500).json({ error: 'Failed to fetch users list', details: err.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    const { userId } = req.params;
    const user = await User.findById(userId, 'name email role plan credits createdAt creditHistory savedResults');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error("ADMIN GET USER DETAILS ERROR:", err);
    res.status(500).json({ error: 'Failed to fetch user details', details: err.message });
  }
};

