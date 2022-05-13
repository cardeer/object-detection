import { ObjectDetectionResult } from "@nipacloud/nvision/dist/models/NvisionRequest";

export interface State {
  parents: { [key: string]: [string, number] };
  filter: { [key: string]: boolean };
  detectedObjects: ObjectDetectionResult[];
  captured: boolean;
}

const state: State = {
  filter: {},
  parents: {},
  detectedObjects: [],
  captured: false,
};

export default state;
