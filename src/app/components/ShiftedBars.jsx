import ReactShared from "@roam/react-shared";
import d3 from "d3";

let { ResizableComponent, Popover } = ReactShared;

function objToArray(obj) {
  return Object.keys(obj).map(function(key) {
    return obj[key];
  });
}

function generateRandomNumber(min, max) {
  return Math.round(Math.random() * (max -  min + 1)) + min;
}

function generateKeyValuePairs(index) {
  let keys = [ "Total anticoagulant Rx", "NOAC %", "NOAC SOV", "log(#Rep visits)", "NOAC % variance", "Others" ];
  let obj = {};
  for(let key of keys) {
    obj[key] = generateRandomNumber(10, 60);
  }
  return obj;
}

function generateFakeLabels(N) {
  let data = [];
  for(let i = 0; i < N; i++) {
    if (N === 2) {
      data.push({
        [i === 0 ? "Before Praxbind" : "After Praxbind"]: generateKeyValuePairs(),
        color: COLORS[i + 5]
      });
    } else {
      data.push({
        ["Label " + i]: generateKeyValuePairs(),
        color: COLORS[i + 5]
      });
    }
  }
  return data;
}

// Selection functions
function animateBarSelection(selection) {
  selection.transition()
    .duration(400)
    .attr("x", function(d) {
      return d.x;
    })
    .attr("y", function(d) {
      return d.y;
    });
}

function getPreviousInex(datum, bars) {
  let prevIndex = -1;
  bars.forEach((bar, i) => {
    if (datum[0].columnId === bar.id) {
      prevIndex = i;
      return;
    }
  });

  return prevIndex;
}

const COLORS = [
  "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#4CAF50",
  "#00BCD4", "#009688", "#8BC34A", "#558B2F", "#B6981E", "#FF9800", "#FF5722", "#795548", "#607D8B",
  "#38DAE9", "#099D13", "#FF9902", "#673BB7", "#DC3BAB", "#607D8B", "#9C27B0", "#673AB7", "#3F51B5",
  "#03A9F4", "#795548", "#607D8B", "#9C27B0", "#673AB7", "#3F51B5"
];

export default class ShiftedBars extends ResizableComponent {
  // ***********************************************
  // Constructors
  // ***********************************************
  constructor(props) {
    super(props, {
      bind: true
    });
    /*
     * `bars` is an array of objects of the form {
     *   [label]: {
     *     [key]: value
     *   }
     * }
     *
     * where `label` is the name of the segment, `key` is the name of the feature
     * Each object must have the same key value pairs for any given label, otherwise
     * the missing data will be represented by greyed out bars, with height proportional
     * to the average height of values for other labels
     */
    this.state = {
      bars: [],
      hoveredIndex: undefined,
      popupPostions: undefined
    };

    this.lines = {};
    this.attrKeys = [];
  }

  // ***********************************************
  // React Methods
  // ***********************************************
  componentWillMount() {
    this.sortLeftBar();
  }

  componentDidMount() {
    super.componentDidMount();
    this.computeLayoutProperties();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bars !== this.props.bars) {
      this.setState({
        bars: nextProps.bars
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.bars[0] !== this.state.bars[0]) {
      this.sortLeftBar();
    }
  }

  getPositionsForBars(bars) {
    return bars.map((bar) => {
      let keys = Object.keys(bar);
      let label = keys[0];
      let keyValuePairs = bar[label];
      let yScale = d3.scale.linear()
        .domain([ 0, 100 * Object.keys(keyValuePairs).length ])
        .range([ 0, 600 || 0 ]);

      let prev = 0;
      return this.attrKeys.map((key) => {
        let value = keyValuePairs[key];
        let datum = {
          key,
          y: prev,
          label,
          columnId: bar.id,
          color: bar[keys[1]],
          height: yScale(value)
        };
        prev += yScale(value) + 10;
        return datum;
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.sortLeftBar();
    let bars = this.getPositionsForBars(this.state.bars);
    this.updateLines(bars);

    let columnLabelContainer = d3.select("div.shifted-column-label-container");
    if (columnLabelContainer[0][0] !== null) {
      let columnLabelSelection = columnLabelContainer.selectAll("p.shifted-column-label").data(this.attrKeys);
      if (columnLabelSelection[0][0] === undefined) {
        this.attrKeys.forEach((key, i) => {
          columnLabelContainer.append("p")
            .classed("shifted-column-label", true)
            .text(key)
            .style("margin", "0")
            .style("position", "absolute")
            .style("white-space", "nowrap")
            .style("text-align", "end")
            .style("min-width", "160px")
            .style("font-family", "proxima_novasemibold")
            .style("font-size", "14px")
            .style("top", (bars[0][i].y + (bars[0][i].height / 2)) + 20 + "px")
            .style("left", (this.xScale(0) - 150) + "px");
        });
      } else {
        columnLabelSelection.text((d) => d)
          .transition().duration(800)
          .style("top", (d, i) => {
            return (bars[0][i].y + (bars[0][i].height / 2)) + 20 + "px";
          })
          .style("left", (this.xScale(0) - 150) + "px");
      }
    }

    let lineGroup = d3.select(this.refs.svg)
      .select("g.shifted-lines")
      .selectAll("line.shifted-line")
      .data(this.lines);

    lineGroup.enter()
      .append("line")
      .classed("shifted-line", true);

    lineGroup.exit().remove();

    lineGroup.attr("x1", d => d.x1)
      .attr("x2", d => d.x2)
      .attr("y1", d => d.y1)
      .attr("y2", d => d.y2)
      .attr("stroke", "#B8B8B8");

    if (prevState.bars !== this.state.bars) {
      lineGroup.style("opacity", 0)
        .transition().delay(800).duration(300)
        .style("opacity", 1);
    }

    let barGroup = d3.select(this.refs.svg)
      .selectAll("g.shifted-bars")
      .data(bars);

    let barGroupEnterSelection = barGroup.enter()
      .append("g")
      .classed("shifted-bars", true);

    barGroupEnterSelection.append("text")
      .classed("shifted-label", true)
      .attr("x", 10)
      .attr("y", -10)
      .text((d, i) => {
        return d[0].label;
      })
      .style("text-anchor", "middle")
      .style("cursor", "pointer")
      .style("font-family", "proxima_novasemibold")
      .style("font-size", "14px")
      .on("click", (d, i) => {
        if (this.state.hoveredIndex !== i) {
          this.setState({
            hoveredIndex: i,
            popupPostions: {
              x: this.xScale(i) + 10,
              y: 10
            }
          }, () => {
            document.addEventListener("click", this.handlePageClickEvent, false);
          });
        }
      });

    barGroup.attr("transform", (d, i) => {
      let prevIndex = getPreviousInex(d, prevState.bars);
      return "translate(" + (prevIndex === -1 ? 0 : this.xScale(prevIndex) + 40) + ", 30)";
    })
    .transition().duration(400)
    .attr("transform", (d, i) => "translate(" + (this.xScale(i) + 40) + ", 30)");

    barGroup.select("text.shifted-label").text((d) => d[0].label);

    barGroup.exit().transition().duration(400).attr("transform", "translate(0,0)").remove();

    let barSelection = barGroup.selectAll("rect.shifted-bar")
      .data(function(d) {
        return d;
      });

    animateBarSelection(barSelection.enter()
    .append("rect")
    .style("fill", (d) => d.color)
    .attr("height", 0)
    .classed("shifted-bar", true)
    .transition()
    .duration(400)
    .attr("height", function(d) {
      return d.height;
    }));

    barSelection
      .attr("x", 0)
      .attr("width", 20)
      .attr("height", (d) => d.height)
      .style("fill", (d) => d.color)
      .transition()
      .delay(400)
      .duration(400)
      .attr("y", (d) => d.y);

    barSelection.exit()
      .transition()
      .duration(400)
      .attr("x", this.state.layoutWidth + 200)
      .attr("y", 1000)
      .remove();
  }

  updateLines(bars) {
    this.lines = [];
    bars.forEach((bar, i1) => {
      bar.forEach((subBar, i2) => {
        if (i1 !== bars.length - 1) {
          this.lines.push({
            x1: this.xScale(i1) + 10,
            x2: this.xScale(i1 + 1) + 10,
            y1: subBar.y,
            y2: bars[i1 + 1][i2].y,
          });

          this.lines.push({
            x1: this.xScale(i1) + 10,
            x2: this.xScale(i1 + 1) + 10,
            y1: subBar.y + subBar.height,
            y2: bars[i1 + 1][i2].y + bars[i1 + 1][i2].height,
          });
        }
      });
    });
  }

  sortLeftBar() {
    if (this.state.bars.length > 0) {
      let leftBarKeys = Object.keys(this.state.bars[0]);
      let leftBar = this.state.bars[0][leftBarKeys[0]];
      this.attrKeys = Object.keys(leftBar);
      this.attrKeys = Object.keys(leftBar).sort((a, b) => {
        return leftBar[b] - leftBar[a];
      });
    }
  }

  render() {
    let styles = this.getStyles();
    this.defineXScale();

    return (
      <div>
        {this.state.hoveredIndex !== undefined && <div ref="popoverContainer" style={{
          position: "absolute",
          left: parseInt(this.state.popupPostions.x) + 10,
          top: 465 + parseInt(this.state.popupPostions.y)
        }}>
          <Popover
            visible={true}
            align={"left"}
            popoverBodyStyle={styles.popoverBodyStyle}>
            <span ref="compareBtn" style={styles.popoverSpan} onClick={this.compareBar}>Compare</span>
            <span ref="removeBtn" style={styles.popoverSpan} onClick={this.removeBar}>Remove</span>
          </Popover>
        </div>}
        {this.state.bars.length > 0 && <div className="shifted-column-label-container" style={{
          display: "inline-block",
          position: "absolute"
        }}></div>}
        <svg ref="svg" width={1200} height={600}>
          <g className="shifted-lines" transform={"translate(40, 30)"}></g>
        </svg>
      </div>
    );
  }

  // ***********************************************
  // Other methods
  // ***********************************************
  defineXScale() {
    this.xScale = d3.scale.ordinal()
      .domain(d3.range(this.state.bars.length))
      .rangeBands([ 0, this.state.layoutWidth || 0 ], 0.2);
  }

  handleMouseClickEvent(labelIndex, event) {
    if (this.state.hoveredIndex !== labelIndex) {
      this.setState({
        hoveredIndex: labelIndex,
        popupPostions: {
          x: event.target.getAttribute("x"),
          y: event.target.getAttribute("y")
        }
      }, () => {
        document.addEventListener("click", this.handlePageClickEvent, false);
      });
    }
  }

  handlePageClickEvent(event) {
    if (this.state.hoveredIndex !== undefined && !this.refs.popoverContainer.contains(event.target) && !this.isClickedOnLabel(event.target)) {
      this.setState({
        hoveredIndex: undefined,
        popupPostions: undefined
      }, () => {
        document.removeEventListener("click", this.handlePageClickEvent, false);
      });
    } else if (event.target.isSameNode(this.refs.removeBtn)) {
      this.removeBar();
    } else if (event.target.isSameNode(this.refs.removeBtn)) {
      this.compareBar();
    }
  }

  isClickedOnLabel(target) {
    let labelContainsBool = false;
    let labelSelectors = d3.selectAll("text.shifted-label");
    this.state.bars.forEach((bar, i) => {
      if (labelSelectors[0][i].contains(target)) {
        return labelContainsBool = true;
      }
    });
    return labelContainsBool;
  }

  compareBar() {
    if (this.state.hoveredIndex !== undefined && this.state.bars.length > 1) {
      let oldBars = [];
      this.state.bars.forEach((stateBar) => {
        oldBars.push(stateBar);
      });
      let newBars = [];
      newBars[0] = oldBars[this.state.hoveredIndex];
      oldBars.splice(this.state.hoveredIndex, 1);
      oldBars.forEach((bar, i) => {
        newBars[i + 1] = bar;
      });

      this.setState({
        bars: newBars,
        hoveredIndex: undefined,
        popupPostions: undefined
      }, () => {
        this.props.updateBars(this.state.bars);
        document.removeEventListener("click", this.handlePageClickEvent, false);
      });
    }
  }

  removeBar() {
    if (this.state.hoveredIndex !== undefined && this.state.bars.length > 1) {
      // let newBars = this.state.bars;
      // newBars.splice(this.state.hoveredIndex, 1);
      // this.props.removeBars(this.state.hoveredIndex);
      // this.setState({
      //   bars: newBars,
      //   hoveredIndex: undefined,
      //   popupPostions: undefined
      // });
      let hoveredIndex = this.state.hoveredIndex;
      this.setState({
        hoveredIndex: undefined,
        popupPostions: undefined
      }, () => {
        this.props.removeBars(this.state.bars[hoveredIndex]);
        document.removeEventListener("click", this.handlePageClickEvent, false);
      });
    }
  }

  getStyles() {
    return {
      popoverSpan: {
        display: "block",
        border: "1px solid #ECECEC",
        fontSize: "12px",
        padding: "5px",
        cursor: "pointer"
      },
      popoverBodyStyle: {
        // padding: "10px"
      }
    };
  }
}
