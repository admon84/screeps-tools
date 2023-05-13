interface TerrainMap {
  [y: number]: {
    [x: number]: number;
  };
}

interface BuildingPlannerProps extends React.Component {
  state: {
    room: string;
    world: string;
    shard: string;
    terrain: TerrainMap;
    x: number;
    y: number;
    worlds: { [worldName: string]: { shards: string[] } };
    brush: string;
    brushLabel: React.ReactElement | null;
    rcl: number;
    structures: { [structure: string]: { x: number; y: number }[] };
    sources: { x: number; y: number }[];
    mineral: { [mineralType: string]: { x: number; y: number } };
    settings: {
      showStatsOverlay: boolean;
      blockStructuresOnEdges: boolean;
    };
  };
  resetState(): void;
  loadJson(json: any): any;
  addStructure(x: number, y: number): boolean;
  removeStructure(x: number, y: number, structure: string | null): void;
}

interface ModalProps {
  planner: BuildingPlannerProps;
  modal: boolean;
}

interface ModalImportRoomFormProps {
  planner: BuildingPlannerProps;
  room: string;
  world: string;
  shard: string;
  worlds: { [worldName: string]: { shards: string[] } };
  modal: boolean;
}

interface FieldValidation {
  value: string;
  validateOnChange: boolean;
  valid: boolean;
}

interface MapCellProps {
  x: number;
  y: number;
  terrain: number;
  planner: BuildingPlannerProps;
  structure: string | null;
  road: {
    middle: boolean;
    top: boolean;
    top_right: boolean;
    right: boolean;
    bottom_right: boolean;
    bottom: boolean;
    bottom_left: boolean;
    left: boolean;
    top_left: boolean;
  };
  rampart: boolean;
  source: boolean;
  mineral: string | null;
}
