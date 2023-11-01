import * as React from 'react';
import { getStatusCounts, prepareChartData, prepareLegendData } from './ChartHelper';
import {
    Card, CardBody, CardTitle, Grid, GridItem,
  } from '@patternfly/react-core';
import { ChartDonut } from '@patternfly/react-charts';
import { chart_color_green_400 as successColor } from '@patternfly/react-tokens/dist/js/chart_color_green_400';
import { global_danger_color_100 as failureColor } from '@patternfly/react-tokens/dist/js/global_danger_color_100';

const CardProp = ({ data }) => {
  const [selectedDataPoint, setSelectedDataPoint] = React.useState(null);

  const conditionCounts = getStatusCounts(data);
  const chartData = prepareChartData(conditionCounts);
  const legendData = prepareLegendData(chartData);

const colorScale = chartData.map((dataPoint) =>
  (dataPoint.x === 'False' || dataPoint.x === 'Unknown' ? failureColor.value : successColor.value)
);

const handleDataPointClick = (dataPoint) => {
  if (dataPoint) {
    setSelectedDataPoint(dataPoint);
  } else {
    setSelectedDataPoint(null);
  }
};

  return (
    <Card>
    <CardTitle>
      <span>
        <p>Status</p>
      </span>
    </CardTitle>
    <CardBody>
      <Grid>
        <GridItem xl2={6} xl={12} lg={12} md={12} sm={12}>
          <span>
            <p>This Side</p>
          </span>
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
        </GridItem>
        <GridItem xl2={6} xl={12} lg={12} md={12} sm={12}>
          <span>
            <p>Other Side</p>
          </span>
          {selectedDataPoint && selectedDataPoint.x !== 'Ready' && selectedDataPoint.x !== 'True' && (
          <div>
            Additional information for the "Not ready and not True" data point goes here.
          </div>
        )}
        </GridItem>
      </Grid>
    </CardBody>
  </Card>
);
};

export default CardProp;