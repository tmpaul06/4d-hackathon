import ReactShared from "@roam/react-shared";
import ShiftedBars from "components/ShiftedBars";
import VerticalTree from "components/VerticalTree";
import { generateBarObjectFromNode } from "utils/Normalize";
import AppBarDrawer from "components/appBar/AppBarDrawer";

let { BaseComponent } = ReactShared;

function findBarIndex(node, bars) {
  let barIndexFound = -1;
  bars.forEach((bar, i) => {
    if (bar.id === node.id) {
      barIndexFound = i;
      return;
    }

    if (bar.id === node.id + "_1") {
      barIndexFound = 0.1;
      return;
    }

    if (bar.id === node.id + "_2") {
      barIndexFound = 0.2;
      return;
    }
  });

  return barIndexFound;
}

export default class Workspace extends BaseComponent {

  constructor(props) {
    super(props, {
      bind: true
    });

    this.state = {
      bars: [],
      initialBar: {},
      removedBar: undefined,
      pageTitle: "ROAM"
    };
  }

  handleAddNode(node) {
    let barIndexFound = findBarIndex(node, this.state.bars);
    if (barIndexFound === -1 && this.state.bars.length > 0) {
      let stateBars = [];
      let initialBarIndex = findBarIndex(this.state.initialBar, this.state.bars);
      if (initialBarIndex === 0.1 || initialBarIndex === 0.2) {
        stateBars.push(this.state.initialBar);
      } else {
        this.state.bars.forEach((bar) => {
          stateBars.push(bar);
        });
      }
      stateBars.push(generateBarObjectFromNode(node, stateBars.length));

      this.setState({
        bars: stateBars
      });
    } else if (barIndexFound === -1 && this.state.bars.length === 0) {
      let stateBars = [];
      this.state.bars.forEach((bar) => {
        stateBars.push(bar);
      });
      stateBars.push(generateBarObjectFromNode({
        name: "Before Pradaxa",
        id: node.id + "_1",
        color: node.color
      }, stateBars.length));

      stateBars.push(generateBarObjectFromNode({
        name: "After Pradaxa",
        id: node.id + "_2",
        color: node.color
      }, stateBars.length));

      this.setState({
        bars: stateBars,
        initialBar: generateBarObjectFromNode(node, this.state.bars.length)
      });
    }
  }

  handleRemoveNode(node) {
    let barIndexFound = findBarIndex(node, this.state.bars);
    if (barIndexFound !== -1) {
      let stateBars = [];
      this.state.bars.forEach((bar) => {
        stateBars.push(bar);
      });
      stateBars.splice(barIndexFound, 1);
      if (stateBars.length === 1) {
        let initialBar = stateBars[0];
        stateBars = [];

        stateBars.push(generateBarObjectFromNode({
          name: "Before Pradaxa",
          id: initialBar.id + "_1",
          color: initialBar.color
        }, stateBars.length));

        stateBars.push(generateBarObjectFromNode({
          name: "After Pradaxa",
          id: initialBar.id + "_2",
          color: initialBar.color
        }, stateBars.length));

        this.setState({
          bars: stateBars,
          initialBar
        });
      } else {
        this.setState({
          bars: stateBars
        });
      }
    }
  }

  updateBars(newBars) {
    // Do not set state. Just modify it.
    this.state.bars = newBars;
  }

  removeBars(node) {
    this.setState({
      removedBar: node.id
    }, () => {
      this.handleRemoveNode(node);
    });
  }

  render() {
    return (
      <div className="full-height">
        <AppBarDrawer
          title={this.state.pageTitle}
          onIconClick={this._back}
          autoFocus={true}/>
        <div className="row full-height container" style={{
          position: "relative",
          top: "60px"
        }}>
          <p style={{
            fontFamily: "proxima_novasemibold",
            margin: "0",
            marginTop: "40px"
          }}>NTS October 2015</p>
        <p style={{
          fontFamily: "proxima_nova_rgregular",
          margin: "0",
          marginBottom: "20px"
        }}>Providers who had warfrain NTS in October,2015</p>
          <VerticalTree addNode={this.handleAddNode} removeNode={this.handleRemoveNode} removedBar={this.state.removedBar}/>
          <ShiftedBars bars={this.state.bars} updateBars={this.updateBars} removeBars={this.removeBars}/>
        </div>
      </div>
    );
  }
};
