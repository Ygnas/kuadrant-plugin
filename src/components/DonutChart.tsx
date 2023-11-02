import * as React from 'react';
import { getStatusCounts, prepareChartData, prepareLegendData } from './ChartHelper';
import { ChartDonut } from '@patternfly/react-charts';
import { chart_color_green_400 as successColor } from '@patternfly/react-tokens/dist/js/chart_color_green_400';
import { global_danger_color_100 as failureColor } from '@patternfly/react-tokens/dist/js/global_danger_color_100';

const DonutChart = ({ data, onDataPointSelect }) => {
  const conditionCounts = getStatusCounts(data);
  const chartData = prepareChartData(conditionCounts);
  const legendData = prepareLegendData(chartData);

  const colorScale = chartData.map((dataPoint) =>
    (dataPoint.x === 'False' || dataPoint.x === 'Unknown' ? failureColor.value : successColor.value)
  );

  const handleDataPointClick = (dataPoint) => {
    if (dataPoint) {
      onDataPointSelect(dataPoint);
    } else {
      onDataPointSelect(null);
    }
  };

  return (
    <ChartDonut
      width={1000}
      data={chartData}
      colorScale={colorScale}
      legendData={legendData}
      legendOrientation="vertical"
      legendPosition="right"
      events={[
        {
          target: 'data',
          eventHandlers: {
            onClick: (_, { index }) => {
              handleDataPointClick(chartData[index]);
            },
          },
        },
      ]}
      innerRadius={65}
    />
  );
};

export default DonutChart;