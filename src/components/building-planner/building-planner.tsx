import * as React from 'react';
// import * as LZString from 'lz-string';
import * as Constants from '../common/constants';
import { MapCell } from './map-cell';
import { ModalJson } from './modal-json';
import { ModalReset } from './modal-reset';
import { ModalSettings } from './modal-settings';
import { ModalImportRoomForm } from './modal-import-room';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { screepsWorlds } from '../common/utils';

type BrushOption = {
  value: string;
  label: JSX.Element;
  isDisabled?: boolean;
};

export class BuildingPlanner extends React.Component {
  state: Readonly<{
    room: string;
    world: string;
    shard: string;
    terrain: TerrainMap;
    hover: boolean;
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
  }>;

  constructor(props: any) {
    super(props);
    this.state = this.getInitialState();
  }

  componentDidMount() {
    this.loadShards();

    // let params = location.href.split('?')[1];
    // let searchParams = new URLSearchParams(params);

    // if (searchParams.get('share')) {
    //     let json = LZString.decompressFromEncodedURIComponent(searchParams.get('share')!);
    //     if (json) {
    //         this.loadJson(JSON.parse(json));
    //     }
    // }
  }

  getInitialState() {
    let terrain: TerrainMap = {};

    for (let y = 0; y < 50; y++) {
      terrain[y] = {};
      for (let x = 0; x < 50; x++) {
        terrain[y][x] = 0;
      }
    }

    return {
      room: Constants.PLANNER.ROOM,
      world: Constants.PLANNER.WORLD,
      shard: Constants.PLANNER.SHARD,
      terrain: terrain,
      hover: false,
      x: 0,
      y: 0,
      worlds: {
        mmo: {
          shards: [],
        },
        season: {
          shards: [],
        },
      },
      brush: 'spawn',
      brushLabel: null,
      rcl: Constants.PLANNER.RCL,
      structures: {},
      sources: [],
      mineral: {},
      settings: {
        showStatsOverlay: true,
        blockStructuresOnEdges: true,
      },
    };
  }

  resetState() {
    this.setState(this.getInitialState());
    this.loadShards();
  }

  loadShards() {
    const component = this;
    for (const world in screepsWorlds) {
      fetch(`/api/shards/${world}`).then((response) => {
        response.json().then((data: any) => {
          if (!data || Object.keys(data).length === 0) {
            return;
          }
          const shards: string[] = [];
          data.shards.forEach((shard: { name: string }) => {
            shards.push(shard.name);
          });
          component.setState({
            worlds: {
              ...this.state.worlds,
              [world]: {
                shards: shards,
              },
            },
          });
        });
      });
    }
  }

  loadJson(json: any) {
    const component = this;

    if (json.shard && json.name) {
      let world = 'mmo';
      if (json.world && json.world === 'season') {
        world = 'season';
      }
      fetch(`/api/terrain/${world}/${json.shard}/${json.name}`).then((response) => {
        response.json().then((data: any) => {
          let terrain = data.terrain[0].terrain;
          let terrainMap: TerrainMap = {};
          for (var y = 0; y < 50; y++) {
            terrainMap[y] = {};
            for (var x = 0; x < 50; x++) {
              let code = terrain.charAt(y * 50 + x);
              terrainMap[y][x] = code;
            }
          }

          component.setState({ terrain: terrainMap });
        });
      });
    }

    let structures: {
      [structure: string]: Array<{
        x: number;
        y: number;
      }>;
    } = {};

    Object.keys(json.buildings).forEach((structure) => {
      structures[structure] = json.buildings[structure].pos;
    });

    component.setState({
      room: json.name ?? Constants.PLANNER.ROOM,
      world: json.world ?? Constants.PLANNER.WORLD,
      shard: json.shard ?? Constants.PLANNER.SHARD,
      rcl: typeof json.rcl === 'number' ? Math.max(1, Math.min(8, json.rcl)) : Constants.PLANNER.RCL,
      structures,
    });
  }

  addStructure(x: number, y: number) {
    let structures = this.state.structures;
    let added = false;

    let allowed = false;
    if (!this.state.settings.blockStructuresOnEdges || (x > 0 && x < 49 && y > 0 && y < 49)) {
      allowed = true;
    }

    if (allowed && Constants.CONTROLLER_STRUCTURES[this.state.brush][this.state.rcl]) {
      if (!structures[this.state.brush]) {
        structures[this.state.brush] = [];
      }

      if (structures[this.state.brush].length < Constants.CONTROLLER_STRUCTURES[this.state.brush][this.state.rcl]) {
        let foundAtPos = false;

        // remove existing structures at this position except ramparts
        const containerOrRoad = ['container', 'road'];
        if (this.state.brush !== 'rampart') {
          for (let type in structures) {
            if (type === 'rampart') {
              continue;
            }
            if (containerOrRoad.includes(this.state.brush) && containerOrRoad.includes(type)) {
              continue;
            }

            foundAtPos =
              structures[type].filter((pos) => {
                return pos.x === x && pos.y === y;
              }).length > 0;

            if (foundAtPos) {
              this.removeStructure(x, y, type);
            }
          }
        }

        if (structures[this.state.brush].length > 0) {
          foundAtPos =
            structures[this.state.brush].filter((pos) => {
              return pos.x === x && pos.y === y;
            }).length > 0;
        }

        if (!foundAtPos) {
          structures[this.state.brush].push({
            x: x,
            y: y,
          });
          added = true;
        }
      }
    }

    this.setState({ structures: structures });
    return added;
  }

  removeStructure(x: number, y: number, structure: string | null) {
    let structures = this.state.structures;

    if (structure === 'controller') {
      // keep these structures, only reimport or reload page can remove them
      return;
    }

    if (structure && structures[structure]) {
      structures[structure] = structures[structure].filter((pos) => {
        return !(pos.x === x && pos.y === y);
      });
    }

    this.setState({ structures: structures });
  }

  getRoadProps(x: number, y: number) {
    let roadProps = {
      middle: false,
      top: false,
      top_right: false,
      right: false,
      bottom_right: false,
      bottom: false,
      bottom_left: false,
      left: false,
      top_left: false,
    };
    if (this.isRoad(x, y)) {
      roadProps.middle = true;
      for (let dx of [-1, 0, 1]) {
        for (let dy of [-1, 0, 1]) {
          if (dx === 0 && dy === 0) continue;
          if (this.isRoad(x + dx, y + dy)) {
            if (dx === -1 && dy === -1) {
              roadProps.top_left = true;
            } else if (dx === 0 && dy === -1) {
              roadProps.top = true;
            } else if (dx === 1 && dy === -1) {
              roadProps.top_right = true;
            } else if (dx === 1 && dy === 0) {
              roadProps.right = true;
            } else if (dx === 1 && dy === 1) {
              roadProps.bottom_right = true;
            } else if (dx === 0 && dy === 1) {
              roadProps.bottom = true;
            } else if (dx === -1 && dy === 1) {
              roadProps.bottom_left = true;
            } else if (dx === -1 && dy === 0) {
              roadProps.left = true;
            }
          }
        }
      }
    }
    return roadProps;
  }

  getStructure(x: number, y: number): string | null {
    let structure = null;
    Object.keys(this.state.structures).forEach((structureName) => {
      if (!['road', 'rampart'].includes(structureName)) {
        this.state.structures[structureName].forEach((pos) => {
          if (pos.x === x && pos.y === y) {
            structure = structureName;
          }
        });
      }
    });
    return structure;
  }

  isRoad(x: number, y: number) {
    let road = false;
    if (this.state.structures.road) {
      this.state.structures.road.forEach((pos) => {
        if (pos.x === x && pos.y === y) {
          road = true;
        }
      });
    }
    return road;
  }

  isRampart(x: number, y: number) {
    let rampart = false;
    if (this.state.structures.rampart) {
      this.state.structures.rampart.forEach((pos) => {
        if (pos.x === x && pos.y === y) {
          rampart = true;
        }
      });
    }
    return rampart;
  }

  hasSource(x: number, y: number) {
    let source = false;
    if (this.state.sources) {
      this.state.sources.forEach((pos) => {
        if (pos.x === x && pos.y === y) {
          source = true;
        }
      });
    }
    return source;
  }

  getMineral(x: number, y: number): string | null {
    const minerals = ['X', 'Z', 'L', 'K', 'U', 'O', 'H'];
    for (let key of minerals) {
      if (this.state.mineral[key]) {
        let mineral = this.state.mineral[key];
        if (mineral.x === x && mineral.y === y) {
          return key;
        }
      }
    }
    return null;
  }

  getSelectedBrush() {
    if (!this.state.brush) {
      return null;
    }
    const selected = {
      value: this.state.brush,
      label: this.getStructureBrushLabel(this.state.brush),
    };
    return selected;
  }

  getStructureBrushes() {
    return Object.keys(Constants.STRUCTURES).map((key) => {
      let props: BrushOption = {
        value: key,
        label: this.getStructureBrushLabel(key),
      };
      if (this.getStructureDisabled(key)) {
        props.isDisabled = true;
      }
      return props;
    });
  }

  getStructureDisabled(key: string) {
    const total = Constants.CONTROLLER_STRUCTURES[key][this.state.rcl];
    if (total === 0) {
      return true;
    }
    const placed = this.state.structures[key] ? this.state.structures[key].length : 0;
    if (placed >= total) {
      return true;
    }
    return false;
  }

  getStructureBrushLabel(key: string) {
    const structure = Constants.STRUCTURES[key];
    const placed = this.state.structures[key] ? this.state.structures[key].length : 0;
    const total = Constants.CONTROLLER_STRUCTURES[key][this.state.rcl];
    const src = `/assets/structures/${key}.png`;

    return (
      <div className="structure-brush">
        <span>
          <img src={src} alt={key} /> {structure}
        </span>
        <span className="darker-text">
          {placed}/{total}
        </span>
      </div>
    );
  }

  getRCLOptions() {
    const roomLevels = Array.from(Array(8), (_, x) => ++x);
    return roomLevels.map((key) => ({
      value: key,
      label: `RCL ${key}`,
    }));
  }

  setBrush(brush: string) {
    this.setState({ brush: brush });
  }

  setRCL(rcl: number) {
    this.setState({ rcl: rcl });

    if (Constants.CONTROLLER_STRUCTURES[this.state.brush][rcl] === 0) {
      this.setState({ brush: null, brushLabel: null });
    }
  }

  getSelectedRCL() {
    return {
      value: this.state.rcl,
      label: `RCL ${this.state.rcl}`,
    };
  }

  getSelectTheme(theme: any) {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary: '#2684ff',
        primary25: '#555',
        primary50: '#555',
        neutral0: '#333',
        neutral80: '#efefef',
      },
    };
  }

  render() {
    return (
      <Container fluid className="building-planner">
        <Row>
          <Col xs={7} md={9} xl={10}>
            <div className="map-wrapper">
              <div className="map">
                {[...Array(50)].map((_, y: number) => {
                  return [...Array(50)].map((_, x: number) => (
                    <MapCell
                      x={x}
                      y={y}
                      planner={this}
                      terrain={this.state.terrain[y][x]}
                      structure={this.getStructure(x, y)}
                      road={this.getRoadProps(x, y)}
                      rampart={this.isRampart(x, y)}
                      source={this.hasSource(x, y)}
                      mineral={this.getMineral(x, y)}
                      key={'mc-' + x + '-' + y}
                    />
                  ));
                })}
              </div>
              <div className="map-overlay">
                {this.state.settings.showStatsOverlay && this.state.hover && (
                  <div className="stats-panel">
                    <div>X: {this.state.x}</div>
                    <div>Y: {this.state.y}</div>
                  </div>
                )}
              </div>
            </div>
          </Col>
          <Col xs={5} md={3} xl={2} className="controls">
            <Stack gap={2}>
              <div className="group-rcl">
                <Form.Select
                  value={this.state.rcl}
                  onChange={(e) => this.setRCL(parseInt(e.target.value))}
                  className="select-rcl"
                  size="sm"
                >
                  {this.getRCLOptions().map(({ value, label }) => (
                    <option value={value}>{label}</option>
                  ))}
                </Form.Select>
              </div>
              <Stack gap={1}>
                {this.getStructureBrushes().map(({ value, label }) => (
                  <Button
                    variant={this.state.brush === value ? 'primary' : 'secondary'}
                    onClick={() => this.setBrush(value)}
                    size="sm"
                    style={{ textAlign: 'left' }}
                    active={this.state.brush === value}
                  >
                    {label}
                  </Button>
                ))}
              </Stack>

              <Form.Text>Actions</Form.Text>
              <Stack gap={1}>
                <ModalImportRoomForm
                  planner={this}
                  room={this.state.room}
                  shard={this.state.shard}
                  world={this.state.world}
                  worlds={this.state.worlds}
                  modal={false}
                />
                <ModalJson planner={this} modal={false} />
                <ModalReset planner={this} modal={false} />
                <ModalSettings planner={this} modal={false} />
              </Stack>
            </Stack>
          </Col>
        </Row>
      </Container>
    );
  }
}
