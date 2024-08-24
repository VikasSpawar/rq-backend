const mongoose = require('mongoose');

const getTotalSales = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || 2022 // Get year from query or use current year
        const orders = mongoose.connection.collection('shopifyOrders');
    
        const totalSales = await orders.aggregate([
            
            {
                $addFields: {
                    created_at_date: {
                        $dateFromString: {
                            dateString: "$created_at" // Convert created_at from string to date
                        }
                    }
                }
            },
            {
                $match: {
                    created_at: {
                        $gte: `${year}-01-19T00:00:00`,
                        $lt: `${year+1}-01-19T00:00:00`
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$created_at_date" }
                    },
                    totalSales: { $sum: { $toDouble: "$total_price" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.month": 1 } }
        ]).toArray();
        
       
        
        
        const salesData = new Array(12).fill(0);
        totalSales.forEach(item => {
            salesData[item._id.month - 1] = item.totalSales;
        });

        res.json(salesData);
      
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

const getSalesGrowthRate = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || 2022; // Get year from query or use current year
        const orders = mongoose.connection.collection('shopifyOrders');

  
        const salesGrowth = await orders.aggregate([
            
            {
                $addFields: {
                    created_at_date: {
                        $dateFromString: {
                            dateString: "$created_at" // Convert created_at from string to date
                        }
                    }
                }
            },
            {
                $match: {
                    created_at: {
                        $gte: `${year}-01-19T00:00:00`,
                        $lt: `${year+1}-01-19T00:00:00`
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$created_at_date" }
                    },
                    totalSales: { $sum: { $toDouble: "$total_price" } },
                }
            },
            { $sort: { "_id.month": 1 } }
        ]).toArray();

        const salesGrowthRates = [];
        for (let i = 1; i < salesGrowth.length; i++) {
            const previousSales = salesGrowth[i - 1]?.totalSales || 0;
            const currentSales = salesGrowth[i]?.totalSales || 0;
            const growthRate = previousSales === 0 ? 0 : (currentSales - previousSales) / previousSales;
            salesGrowthRates.push(growthRate);
        }

        res.json(salesGrowthRates);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

const getNewCustomers = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || 2022; // Get year from query or use current year
        const customers = mongoose.connection.collection('shopifyCustomers');

        const newCustomers = await customers.aggregate([
            {
                $addFields: {
                    created_at_date: {
                        $dateFromString: {
                            dateString: "$created_at" // Convert created_at from string to date
                        }
                    }
                }
            },
            {
                $match: {
                    created_at: {
                        $gte: `'${year}-01-19T00:00:00'`,
                        $lt: `${year+1}-01-19T00:00:00`
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$created_at_date" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.month": 1 } },
          
        ]).toArray();

        const customerData = new Array(12).fill(0);
        newCustomers.forEach(item => {
            customerData[item._id.month - 1] = item.count;
        });

        res.json(customerData);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};





module.exports = {
    getTotalSales,
    getSalesGrowthRate,
    getNewCustomers,

};
