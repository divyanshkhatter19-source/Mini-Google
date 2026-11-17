import { useRef, useEffect, useCallback } from 'react';

function LinkGraph({ pages, pageRankScores }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const nodesRef = useRef([]);

  const getNodePositions = useCallback((width, height, count) => {
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.32;
    return pages.map((_, i) => {
      const angle = (2 * Math.PI * i) / count - Math.PI / 2;
      return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
  }, [pages]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    ctx.clearRect(0, 0, W, H);

    const nodes = getNodePositions(W, H, pages.length);
    nodesRef.current = nodes;

    // Build id-to-index map
    const idToIdx = {};
    pages.forEach((p, i) => { idToIdx[p.id] = i; });

    // Draw edges (arrows)
    pages.forEach((page, i) => {
      const from = nodes[i];
      page.outgoingLinks.forEach((targetId) => {
        const j = idToIdx[targetId];
        if (j === undefined) return;
        const to = nodes[j];

        // Shorten the line to end at the node circle edge
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return;

        const nodeRadius = 22;
        const arrowLen = 10;

        const ux = dx / dist;
        const uy = dy / dist;

        const startX = from.x + ux * nodeRadius;
        const startY = from.y + uy * nodeRadius;
        const endX = to.x - ux * (nodeRadius + 4);
        const endY = to.y - uy * (nodeRadius + 4);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Arrowhead
        const angle = Math.atan2(endY - startY, endX - startX);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowLen * Math.cos(angle - Math.PI / 7),
          endY - arrowLen * Math.sin(angle - Math.PI / 7)
        );
        ctx.lineTo(
          endX - arrowLen * Math.cos(angle + Math.PI / 7),
          endY - arrowLen * Math.sin(angle + Math.PI / 7)
        );
        ctx.closePath();
        ctx.fillStyle = '#94a3b8';
        ctx.fill();
      });
    });

    // Find max pagerank for scaling
    const maxPR = Math.max(...Object.values(pageRankScores), 0.001);

    // Draw nodes
    pages.forEach((page, i) => {
      const { x, y } = nodes[i];
      const pr = pageRankScores[page.id] || 0;
      const scale = 0.6 + (pr / maxPR) * 0.4;
      const r = 22 * scale;

      // Glow for high PR
      if (pr / maxPR > 0.7) {
        ctx.beginPath();
        ctx.arc(x, y, r + 6, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      const green = Math.floor(100 + (pr / maxPR) * 155);
      ctx.fillStyle = `rgb(30, ${green}, 80)`;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Page number
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`P${page.id}`, x, y);

      // URL label below
      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, system-ui, sans-serif';
      const label = page.url.length > 18 ? page.url.slice(0, 16) + '…' : page.url;
      ctx.fillText(label, x, y + r + 14);

      // PR score above
      ctx.fillStyle = '#1e293b';
      ctx.font = '9px Inter, system-ui, sans-serif';
      ctx.fillText(`PR: ${pr.toFixed(3)}`, x, y - r - 8);
    });
  }, [pages, pageRankScores, getNodePositions]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <div className="link-graph-container">
      <div className="graph-header">
        <h3 className="graph-title">🗺️ Page Link Graph</h3>
        <p className="graph-subtitle">Node size and color reflect PageRank importance. Arrows show link direction.</p>
      </div>
      <canvas ref={canvasRef} className="link-graph-canvas" />
    </div>
  );
}

export default LinkGraph;

