import React from "react";
import * as d3 from "d3";
import data from "../data/data.json";

export default class ForceLayout extends React.PureComponent {
  componentDidMount() {
    var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width,
    height = canvas.height;

    var simulation = d3.forceSimulation(data.nodes)
      .force("charge", d3.forceManyBody())
      .force("link", d3.forceLink(data.links))
      .force("center", d3.forceCenter());
      
    simulation
        .on("tick", ticked);

    function ticked() {
      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(width / 2, height / 2 + 40);

      context.beginPath();
      data.links.forEach(drawLink);
      context.strokeStyle = "#aaa";
      context.stroke();

      context.beginPath();
      data.nodes.forEach(drawNode);
      context.fill();
      context.strokeStyle = "#fff";
      context.stroke();

      context.restore();
    }

    function drawLink(d) {
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
    }

    function drawNode(d) {
      context.moveTo(d.x + 3, d.y);
      context.arc(d.x, d.y, 6, 0, 2 * Math.PI);
    }
  }

  render() {
    return <canvas width="960" height="500"></canvas>;
  }
}
