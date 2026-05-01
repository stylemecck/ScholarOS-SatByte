const User = require('../models/User');

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

    res.json({
      totalUsers,
      totalRevenue,
      totalAIRequests,
      topTools: topTools.length > 0 ? topTools : [{ name: 'N/A', count: 0 }],
      userGrowth: formattedGrowth,
      revenueHistory: formattedRevenue
    });
  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    res.status(500).json({ error: 'Failed to fetch admin stats', details: err.message });
  }
};
