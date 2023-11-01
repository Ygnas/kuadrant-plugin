import * as React from 'react';
import {
  K8sResourceCommon,
  ListPageBody,
  ListPageCreateDropdown,
  ListPageFilter,
  ListPageHeader,
  ResourceLink,
  RowFilter,
  RowProps,
  TableColumn,
  TableData,
  VirtualizedTable,
  getGroupVersionKindForResource,
  useK8sWatchResource,
  useListPageFilter,
} from '@openshift-console/dynamic-plugin-sdk';
import { useHistory } from 'react-router-dom';
import { CustomResource, CustomizationResource } from '../kuadrant/types';
import { referenceFor } from '../kuadrant/resources';
import './example.css';
import CardProp from './ChartProp';

// Define the resources to be displayed in the table
// Add each resource to the list with its group, version, and kind
const resources: CustomResource[] = [
  {
    group: 'kuadrant.io',
    version: 'v1alpha1',
    kind: 'TLSPolicy',
  },
  {
    group: 'gateway.networking.k8s.io',
    version: 'v1beta1',
    kind: 'HTTPRoute',
  },
  {
    version: 'v1',
    kind: 'Deployment',
    namespace: 'kuadrant-system'
  }
];


// Table columns to be displayed
// +--------+--------+--------+--------+--------+--------+
// |  Name  |  Kind  |  Target  |  Grafana Metrics  |
// +--------+--------+--------+--------+--------+--------+--------+--------+
// |  Row 1, Cell 1  |  Row 1, Cell 2  |  Row 1, Cell 3  |  Row 1, Cell 4  |
// |  Row 2, Cell 1  |  Row 2, Cell 2  |  Row 2, Cell 3  |  Row 2, Cell 4  |
// |  Row 3, Cell 1  |  Row 3, Cell 2  |  Row 3, Cell 3  |  Row 3, Cell 4  |
// +--------+--------+--------+--------+--------+--------+--------+--------+
const columns: TableColumn<CustomizationResource>[] = [
  {
    title: 'Name',
    id: 'name',
  },
  {
    title: 'Kind',
    id: 'kind',
  },
  {
    title: 'Target',
    id: 'targetRef',
  },
  {
    title: 'Grafana Metrics',
    id: 'grafana',
  },
];

const Row = ({ obj, activeColumnIDs }: RowProps<CustomizationResource>) => {
  // Extract resource metadata
  const { metadata, kind, spec } = obj;
  const { name, namespace } = metadata;

  // Generate a link to the resource
  const resourceLink = (
    <ResourceLink
      groupVersionKind={getGroupVersionKindForResource(obj)}
      name={name}
      namespace={namespace}
    />
  );

  // Display the resource kind and target reference
  const resourceKind = kind;
  const targetReference = spec?.targetRef;

  // Render the table row
  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        {resourceLink}
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {resourceKind}
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        {targetReference ? `${targetReference.kind} / ${targetReference.name}` : '-'}
      </TableData>
      <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
      {resourceKind === 'TLSPolicy' ? (
    // Links back to grafana dashboard
    <a href={`https://grafana-monitoring.apps.stitchpoc2.vtdv.p1.openshiftapps.com/d/gatewayapihttproutes/gateway-api-state-${resourceKind}`}>{resourceKind}</a>
  ) : resourceKind === 'HTTPRoute' ? (
    // Links back to grafana dashboard
    <a href={`https://grafana-monitoring.apps.stitchpoc2.vtdv.p1.openshiftapps.com/d/gatewayapihttproutes/gateway-api-state-${resourceKind}s`}>{resourceKind}</a>
  ) : (
    '-'
  )}
      </TableData>
    </>
  );
};

// Define a filter for the resource list page
export const filters: RowFilter[] = [
  {
    filterGroupName: 'Kind',
    type: 'kind',
    reducer: (resource: K8sResourceCommon) => resource.kind,
    filter: (input, resource: K8sResourceCommon) => {
      // If no filter selected, include all resources
      if (!input.selected?.length) {
        return true;
      }

      // Check if the resource kind is included in the selected filters
      return input.selected.includes(resource.kind);
    },
    items: resources.map(({ kind }) => ({ id: kind, title: kind })),
  },
];

// Define props for the CustomizationTable component
type CustomizationTableProps = {
  data: CustomizationResource[];
  unfilteredData: CustomizationResource[];
  loaded: boolean;
  loadError?: {
    message?: string;
  };
};

const CustomizationTable = ({ data, unfilteredData, loaded, loadError }: CustomizationTableProps) => {
  return (
    <VirtualizedTable<CustomizationResource>
      data={data}
      unfilteredData={unfilteredData}
      loaded={loaded}
      loadError={loadError}
      columns={columns}
      Row={Row}
    />
  );
};

const CustomizationList = () => {
  const history = useHistory();
  const watches = resources.map(({ group, version, kind, namespace }) => {
    // Fetch data, loaded status, and potential error for each resource
    const [data, loaded, error] = useK8sWatchResource<CustomizationResource[]>({
      groupVersionKind: { group, version, kind },
      isList: true,
      namespaced: true,
      namespace: namespace
    });
    if (error) {
      console.error('Could not load', kind, error);
    }
    return [data, loaded, error];
  });

  // Flatten data and check if all resources are loaded (or if there was an error)
  const flatData = watches.map(([list]) => list).flat();
  const loaded = watches.every(([, loaded, error]) => !!(loaded || error));

  // Apply filters to the data
  const [data, filteredData, onFilterChange] = useListPageFilter(flatData, filters);

  // Create items for the "Create" dropdown
  const createItems = resources.reduce((acc, { group, version, kind }) => {
    acc[referenceFor(group, version, kind)] = kind;
    return acc;
  }, {});

  // Handle the creation of new resources
  const onCreate = (reference: string) => {
    const path = `/k8s/cluster/${reference}/~new`;
    history.push(path);
  };

  return (
    <>
      {/* List page header */}
      <ListPageHeader title="Kuadrant">
        {/* Create dropdown for new resources */}
        <ListPageCreateDropdown items={createItems} onClick={onCreate}>
          Create
        </ListPageCreateDropdown>
      </ListPageHeader>
      <ListPageBody>
        {/* Filter and display resources */}
        <ListPageFilter
          data={data}
          loaded={loaded}
          rowFilters={filters}
          onFilterChange={onFilterChange}
        />
        <CardProp data={filteredData}/>
        {/* Display the customized table with data */}
        <CustomizationTable
          data={filteredData}
          unfilteredData={data}
          loaded={loaded}
        />
      </ListPageBody>
    </>
  );
};

export default CustomizationList;