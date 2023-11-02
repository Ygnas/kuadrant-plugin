const getStatusCounts = (data) => {
  return data
    .map((item) => {
      const mainConditions = item.status && item.status.conditions ? item.status.conditions.map(condition => condition.status) : [];
      const parentConditions = item.status && item.status.parents ? item.status.parents.map(parent => parent.conditions.map(condition => condition.status)) : [];
      return [...mainConditions, ...parentConditions.flat()];
    })
    .flat()
    .reduce((counts, type) => {
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {});
};

const prepareChartData = (conditionCounts) => {
  return Object.keys(conditionCounts).map((type) => ({
    x: `${type}`,
    y: conditionCounts[type],
  }));
};

const prepareLegendData = (chartData) => {
  return chartData.map((data) => ({
    name: `${data.x}: ${data.y}`,
  }));
};

export { getStatusCounts, prepareChartData, prepareLegendData };