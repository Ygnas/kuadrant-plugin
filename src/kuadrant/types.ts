import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

export type CustomizationResource = {
  spec?: {
    displayName?: string;
    targetRef?: {
      group?: string;
      kind?: string;
      name?: string;
    };
  };
} & K8sResourceCommon;