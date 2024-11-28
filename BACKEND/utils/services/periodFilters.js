function getPeriodFilters(period) {
    const now = new Date();
    switch (period) {
      case "monthly":
        return {
          //greater than firstday of current month
  
          createdAt: {
            //year,month,1st day
            $gte: new Date(now.getFullYear(), now.getMonth(), 1),
            //now.getMonth()+1 moves to next month first day
            $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
          },
        };
  
      case "yearly":
      default:
        return {
          createdAt: {
            //gt first day of this year to lt first day of nrxt year
            $gte: new Date(now.getFullYear(), 0, 1),
            $lt: new Date(now.getFullYear() + 1, 0, 1),
          },
        };
    }
  }
  module.exports=getPeriodFilters