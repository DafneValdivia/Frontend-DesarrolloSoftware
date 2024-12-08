import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import "./graph.css";

const DebtGraph = () => {
  const { id: groupId } = useParams();
  const svgRef = useRef();
  const [balanceData, setBalanceData] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // Obtener los datos del balance desde la API
    const fetchBalanceData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/balance/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBalanceData(response.data);
      } catch (error) {
        console.error("Error al obtener los datos del balance:", error);
      }
    };

    fetchBalanceData();
  }, [groupId]);

  useEffect(() => {
    if (balanceData.length === 0) return;

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 100 };

    // Crear un balance neto por usuario
    const balances = {};
    balanceData.forEach(({ fromUserId, fromName, toUserId, toName, amount }) => {
      if (!balances[fromUserId]) balances[fromUserId] = { id: fromUserId, name: fromName, balance: 0 };
      if (!balances[toUserId]) balances[toUserId] = { id: toUserId, name: toName, balance: 0 };

      balances[fromUserId].balance -= amount;
      balances[toUserId].balance += amount;
    });

    const formattedData = Object.values(balances);

    // Configurar SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Limpiar el SVG antes de renderizar
    svg.selectAll("*").remove();

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(formattedData, d => d.balance), d3.max(formattedData, d => d.balance)])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(formattedData.map(d => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    // Crear ejes
    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);

    // Dibujar barras
    svg
      .selectAll("rect")
      .data(formattedData)
      .enter()
      .append("rect")
      .attr("x", d => (d.balance > 0 ? xScale(0) : xScale(d.balance)))
      .attr("y", d => yScale(d.name))
      .attr("width", d => Math.abs(xScale(d.balance) - xScale(0)))
      .attr("height", yScale.bandwidth())
      .attr("fill", d => (d.balance > 0 ? "green" : "red"));
  }, [balanceData]);

  return (
    <div className="graph-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DebtGraph;
