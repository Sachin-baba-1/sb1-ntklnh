import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Note, Topic, ParentNode } from '../types';

interface GraphViewProps {
  notes: Note[];
  topics: Topic[];
  parentNodes: ParentNode[];
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  group: string;
  isParent?: boolean;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string;
  target: string;
}

const GraphView: React.FC<GraphViewProps> = ({ notes, topics, parentNodes }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svg.node()?.getBoundingClientRect().width || 800;
    const height = svg.node()?.getBoundingClientRect().height || 600;

    svg.selectAll("*").remove();

    const nodes: GraphNode[] = [
      ...parentNodes.map(parent => ({ id: parent.id, group: "parent", isParent: true })),
      ...notes.map(note => ({ id: note.id, group: note.topic })),
    ];

    const links: GraphLink[] = [
      ...notes.map(note => ({ 
        source: parentNodes.find(parent => parent.id === note.parentId)?.id || "MY_notes", 
        target: note.id 
      })),
    ];

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => d.isParent ? 15 : 10)
      .attr("fill", d => {
        if (d.isParent) return "#666";
        const topic = topics.find(t => t.name === d.group);
        return topic ? topic.color : "#ccc";
      })
      .call(drag(simulation) as any);

    node.append("title")
      .text(d => d.isParent ? d.id : notes.find(n => n.id === d.id)?.title || "");

    const labels = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.isParent ? d.id : notes.find(n => n.id === d.id)?.title || "")
      .attr("font-size", "12px")
      .attr("dx", 15)
      .attr("dy", 4);

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);

      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);

      labels
        .attr("x", d => d.x!)
        .attr("y", d => d.y!);
    });

    // Zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        svg.selectAll("g").attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [notes, topics, parentNodes]);

  function drag(simulation: d3.Simulation<GraphNode, undefined>) {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  return (
    <div className="w-full h-full">
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
};

export default GraphView;