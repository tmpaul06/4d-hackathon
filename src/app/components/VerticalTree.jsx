import ReactShared from "@roam/react-shared";
import d3 from "d3";
import { normalizeData } from "utils/Normalize";
import store from "stores/Store";

let { ResizableComponent, Utils } = ReactShared;
let { StyleUtils } = Utils;

function lineSegment(x, y) {
  return "L " + x + " " + y;
}

function getRootNode(nodes) {
  let rootNode;
  nodes.forEach((node) => {
    if (node.depth === 0) {
      rootNode = node;
    }
  });

  return rootNode;
}

function areNodesEqual(n1, n2) {
  return n1.id === n2.id;
}

function findSelectedNode(node, selectedNodes) {
  let selectedNodeIndex = -1;
  selectedNodes.forEach((selectedNode, i) => {
    if (areNodesEqual(node, selectedNode)) {
      selectedNodeIndex = i;
    }
    return;
  });

  return selectedNodeIndex;
}

export default class VerticalTree extends ResizableComponent {

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
      selectedNodes: [],
      nodes: [],
      links: []
    };
  }

  // ***********************************************
  // React Methods
  // ***********************************************
  componentDidMount() {
    super.componentDidMount();
    // Render a text element in the DOM, get its computed text length or bounding box
    let svgTextNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
    let node = this.refs.svg.appendChild(svgTextNode);
    node.appendChild(document.createTextNode("a"));
    let { width } = node.getBoundingClientRect();
    this.characterWidth = width;
    this.refs.svg.removeChild(node);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.removedBar !== undefined && nextProps.removedBar !== this.props.removedBar) {
      let selectedNodes = [];
      this.state.selectedNodes.forEach((selectedNode) => {
        selectedNodes.push(selectedNode);
      });
      let selectedNodeIndexFound = findSelectedNode({ id: nextProps.removedBar }, selectedNodes);
      if (selectedNodeIndexFound !== -1) {
        selectedNodes.splice(selectedNodeIndexFound, 1);
        this.setState({
          selectedNodes
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.layoutWidth !== this.state.layoutWidth) {
      let { nodes = [], links = [] } = this.getNodesAndLinks(this.state.layoutWidth, 400);
      let rootNode = getRootNode(nodes);
      if (this.state.selectedNodes.length === 0 || (this.state.selectedNodes.length === 1 && this.state.selectedNodes[0].id === rootNode.id)) {
        this.props.addNode(rootNode);
        this.setState({
          nodes,
          links,
          selectedNodes: [ rootNode ]
        });
      } else {
        this.setState({
          nodes,
          links
        });
      }
    }
  }

  onNodeClick(node) {
    let selectedNodes = [];
    this.state.selectedNodes.forEach((selectedNode) => {
      selectedNodes.push(selectedNode);
    });

    let selectedNodeIndexFound = findSelectedNode(node, selectedNodes);
    if (selectedNodeIndexFound === -1) {
      selectedNodes.push(node);
      this.props.addNode(node);
      this.setState({
        selectedNodes
      });
    } else if (selectedNodes.length !== 1) {
      selectedNodes.splice(selectedNodeIndexFound, 1);
      this.props.removeNode(node);
      this.setState({
        selectedNodes
      });
    }
  }

  render() {
    let styles = this.getStyles();
    let { nodes, links } = this.state;
    console.log("nodes", nodes);
    let w = this.characterWidth;
    return (
      <div>
        <svg width={this.state.layoutWidth} height={400} ref="svg">
          <g transform="translate(20, 40)">
            <g ref="nodes">
              {nodes.map((node, i) => {
                return (
                  <g key={i} transform={"translate(" + node.x + "," + node.y + ")"} onClick={this.onNodeClick.bind(null, node)} >
                    <rect
                      x={-(node.name.length + 5) * w / 2}
                      y={-20}
                      rx={5}
                      ry={5}
                      width={(node.name.length + 5) * w}
                      height={40}
                      style={StyleUtils.merge(styles.node, this.selectedNode(node) && this.getHighlightedNodeStyles(node))} />
                    <text y={w}
                      style={styles.nodeText}
                      textAnchor="middle">
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </g>
            <g ref="edges">
              {links.map(function(link, i) {
                let s = link.source, t = link.target;
                return (
                  <path
                    key={i}
                    d={"M " + s.x + " " + (s.y + 20) + " " + lineSegment(s.x, (s.y + t.y) / 2) + " " + lineSegment(t.x, (s.y + t.y) / 2) + " " + lineSegment(t.x, t.y - 20)}
                    style={styles.link}
                  />
                );
              })}
            </g>
          </g>
        </svg>
      </div>
    );
  }

  selectedNode(node) {
    let status = undefined;
    this.state.selectedNodes && this.state.selectedNodes.forEach((item, index) => {
      if(item.id === node.id) {
        status = true;
      }
    });
    return status;
  }

  getTreeData() {
    let data = [ {
      "name": "All HCPs",
      "parent": "null",
      "children": [ {
        "name": "Cardiologists",
        "parent": "All HCPs",
        "children": [ {
          "name": "High Rx",
          "parent": "Cardiologists"
        }, {
          "name": "Low Rx",
          "parent": "Cardiologists"
        } ]
      }, {
        "name": "Family Medicine",
        "parent": "All HCPs",
        "children": [ {
          "name": "High Rx",
          "parent": "Family Medicine"
        }, {
          "name": "Low Rx",
          "parent": "Family Medicine"
        } ]
      }, {
        "name": "Internal Medicine",
        "parent": "All HCPs",
        "children": [ {
          "name": "High Rx",
          "parent": "Internal Medicine"
        }, {
          "name": "Low Rx",
          "parent": "Internal Medicine"
        } ]
      }, {
        "name": "Other",
        "parent": "All HCPs",
        "children": [ {
          "name": "High Rx",
          "parent": "Other"
        }, {
          "name": "Low Rx",
          "parent": "Other"
        } ]
      } ]
    } ];

    return normalizeData(data);
  }


  getStyles() {
    return {
      node:  {
        stroke: "#B8B8B8",
        strokeWidth: "2px",
        cursor: "pointer",
        fill: "#FFFFFF",
        boxShadow: "0px 0px 20px 10px #B8B8B8"
      },
      onNodeClick: {
        stroke: "#0000FF",
        strokeWidth: "4px",
        fill: "#C9DAF8"
      },
      nodeText: {
        fontSize: "12px",
        fontFamily: "proxima_novasemibold",
        cursor: "pointer",
        WebkitUserSelect: "none",
        color: "#212121"
      },
      link: {
        fill: "none",
        stroke: "#B8B8B8",
        strokeWidth: "2px"
      }
    };
  }

  getHighlightedNodeStyles(node) {
    return {
      stroke: node.color,
      strokeWidth: "2px"
    };
  }

  getNodesAndLinks(width, height) {
    if (!width || !height) {
      return {};
    }
    let tree = d3.layout.tree()
      .size([ width, height ]);

    let root = this.getTreeData()[0];
    // Compute the new tree layout.
    let nodes = tree.nodes(root).reverse();
    let links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 100; });
    return {
      nodes,
      links
    };
  }

}
