module.exports = function getMonthYear(date) {
  const d = new Date(date);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" }); 
};
