const express = require('express');
const router = express.Router();
const { getTotalSales, getSalesGrowthRate, getNewCustomers, getRepeatCustomers, getCustomerLifetimeValue } = require('../controllers/analyticsController');




// Route to get total sales over time
router.get('/total-sales', getTotalSales);

// Route to get sales growth rate over time
router.get('/sales-growth-rate', getSalesGrowthRate);

// Route to get new customers added over time
router.get('/new-customers', getNewCustomers);



module.exports = router;
