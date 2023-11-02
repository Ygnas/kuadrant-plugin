import * as React from 'react';
import {
  Card, CardBody, CardTitle, Grid, GridItem,
} from '@patternfly/react-core';

const CardGridComponent = ({ chartComponent = null, selectedDataPoint = null }) => {
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
            {chartComponent}
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

export default CardGridComponent;