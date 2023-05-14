import * as React from 'react';

export class MapCell extends React.Component<MapCellProps> {
  state: Readonly<{
    hover: boolean;
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
  }>;

  constructor(props: MapCellProps) {
    super(props);

    this.state = {
      hover: false,
      structure: this.props.structure,
      road: {
        middle: this.props.road.middle,
        top: this.props.road.top,
        top_right: this.props.road.top_right,
        right: this.props.road.right,
        bottom_right: this.props.road.bottom_right,
        bottom: this.props.road.bottom,
        bottom_left: this.props.road.bottom_left,
        left: this.props.road.left,
        top_left: this.props.road.top_left,
      },
      rampart: this.props.rampart,
      source: this.props.source,
      mineral: this.props.mineral,
    };
  }

  componentWillReceiveProps(newProps: MapCellProps) {
    this.setState({
      structure: newProps.structure,
      road: newProps.road,
      rampart: newProps.rampart,
      source: newProps.source,
      mineral: newProps.mineral,
    });
  }

  getCellContent() {
    let content = [];

    switch (this.state.structure) {
      case 'spawn':
      case 'extension':
      case 'link':
      case 'constructedWall':
      case 'tower':
      case 'observer':
      case 'powerSpawn':
      case 'extractor':
      case 'terminal':
      case 'lab':
      case 'container':
      case 'nuker':
      case 'storage':
      case 'factory':
      case 'controller':
      case 'source':
        let path = process.env.PUBLIC_URL + `/img/structures/${this.state.structure}.png`;
        content.push(<img src={path} />);
    }

    if (this.state.source) {
      content.push(<img src={process.env.PUBLIC_URL + '/img/resources/source.png'} />);
    }

    switch (this.state.mineral) {
      case 'X':
      case 'Z':
      case 'L':
      case 'K':
      case 'U':
      case 'O':
      case 'H':
        let path = process.env.PUBLIC_URL + `/img/resources/${this.state.mineral}.png`;
        content.push(<img src={path} />);
    }

    if (this.state.road.middle) {
      content.push(
        <svg height="2%" width="100%">
          <circle cx="50%" cy="50%" r="1" fill="#6b6b6b" />
        </svg>
      );
    }
    if (this.state.road.top_left) {
      content.push(
        <svg height="2%" width="100%">
          <line x1="0" y1="0" x2="50%" y2="50%" stroke="#6b6b6b" strokeWidth={2} />
        </svg>
      );
    }
    if (this.state.road.top) {
      content.push(
        <svg height="2%" width="100%">
          <line x1="50%" y1="0" x2="50%" y2="50%" stroke="#6b6b6b" strokeWidth={2} />
        </svg>
      );
    }
    if (this.state.road.top_right) {
      content.push(
        <svg height="2%" width="100%">
          <line x1="100%" y1="0" x2="50%" y2="50%" stroke="#6b6b6b" strokeWidth={2} />
        </svg>
      );
    }
    if (this.state.road.right) {
      content.push(
        <svg height="2%" width="100%">
          <line x1="100%" y1="50%" x2="50%" y2="50%" stroke="#6b6b6b" strokeWidth={2} />
        </svg>
      );
    }
    if (this.state.road.bottom_right) {
      content.push(
        <svg height="2%" width="100%">
          <line x1="100%" y1="100%" x2="50%" y2="50%" stroke="#6b6b6b" strokeWidth={2} />
        </svg>
      );
    }
    if (this.state.road.bottom) {
      content.push(
        <svg height="2%" width="100%">
          <line x1="50%" y1="100%" x2="50%" y2="50%" stroke="#6b6b6b" strokeWidth={2} />
        </svg>
      );
    }
    if (this.state.road.bottom_left) {
      content.push(
        <svg height="2%" width="100%">
          <line x1="0" y1="100%" x2="50%" y2="50%" stroke="#6b6b6b" strokeWidth={2} />
        </svg>
      );
    }
    if (this.state.road.left) {
      content.push(
        <svg height="2%" width="100%">
          <line x1="0" y1="50%" x2="50%" y2="50%" stroke="#6b6b6b" strokeWidth={2} />
        </svg>
      );
    }

    return content.length ? content : ' ';
  }

  className() {
    let className = '';

    if (this.state.hover) {
      className += 'hover ';
    }

    if (this.state.structure) {
      className += this.state.structure + ' ';
    }

    if (this.state.road.middle) {
      className += 'road ';
    }

    if (this.state.rampart) {
      className += 'rampart ';
    }

    if (this.state.source) {
      className += 'source ';
    }

    if (this.state.mineral) {
      className += this.state.mineral + ' ';
    }

    if (this.props.terrain & 1) {
      return className + 'cell wall';
    } else if (this.props.terrain & 2) {
      return className + 'cell swamp';
    } else {
      return className + 'cell plain';
    }
  }

  mouseEnter(e: any) {
    // update this.state.x and this.state.y
    this.setState({ hover: true });
    this.props.planner.setState({
      hover: true,
      x: parseInt(e.currentTarget.dataset.x),
      y: parseInt(e.currentTarget.dataset.y),
    });
    // handle click and drag
    if (e.buttons === 1) {
      this.onClick();
      this.setState({ hover: false });
    } else if (e.buttons === 2) {
      this.onContextMenu(e);
      this.setState({ hover: false });
    }
  }

  mouseLeave(e: any) {
    this.setState({ hover: false });
    this.props.planner.setState({
      hover: false,
      x: 0,
      y: 0,
    });
  }

  onClick() {
    if (this.props.planner.addStructure(this.props.x, this.props.y)) {
      switch (this.props.planner.state.brush) {
        case 'road':
          this.setState({ road: true });
          break;
        case 'rampart':
          this.setState({ rampart: true });
          break;
        default:
          this.setState({ structure: this.props.planner.state.brush });
          break;
      }
    }
  }

  onContextMenu(e: any) {
    e.preventDefault();

    if (this.state.structure !== '' || this.state.road || this.state.rampart) {
      this.props.planner.removeStructure(this.props.x, this.props.y, this.state.structure);
      this.props.planner.removeStructure(this.props.x, this.props.y, 'rampart');
      this.props.planner.removeStructure(this.props.x, this.props.y, 'road');

      this.setState({ structure: '', road: false, rampart: false });
    }
  }

  render() {
    return (
      <div className="tile">
        <div
          className={this.className()}
          onMouseEnter={this.mouseEnter.bind(this)}
          onMouseLeave={this.mouseLeave.bind(this)}
          onClick={this.onClick.bind(this)}
          onContextMenu={this.onContextMenu.bind(this)}
          data-x={this.props.x}
          data-y={this.props.y}
        >
          {this.getCellContent()}
        </div>
      </div>
    );
  }
}
