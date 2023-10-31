import React from 'react';
import { getStatusCounts, prepareChartData, prepareLegendData } from './ChartHelper';
import {
    Card, CardBody, CardTitle, Grid, GridItem,
  } from '@patternfly/react-core';
import { ChartDonut } from '@patternfly/react-charts';
import { chart_color_blue_300 as runningColor } from '@patternfly/react-tokens/dist/js/chart_color_blue_300';
import { chart_color_green_400 as successColor } from '@patternfly/react-tokens/dist/js/chart_color_green_400';
import { global_danger_color_100 as failureColor } from '@patternfly/react-tokens/dist/js/global_danger_color_100';


const colorScale = [
    successColor.value,
    runningColor.value,
    failureColor.value,
  ];

const CardProp = ({ data }) => {
  const conditionCounts = getStatusCounts(data);
  const chartData = prepareChartData(conditionCounts);
  const legendData = prepareLegendData(chartData);

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
          <div className="chartDonut">
            <ChartDonut width={1000} data={chartData} colorScale={colorScale} legendData={legendData} legendOrientation="vertical" legendPosition="right" />
          </div>
        </GridItem>
        <GridItem xl2={6} xl={12} lg={12} md={12} sm={12}>
          <span>
            <p>Other Side</p>
          </span>
        </GridItem>
      </Grid>
    </CardBody>
  </Card>
);
};

export default CardProp;