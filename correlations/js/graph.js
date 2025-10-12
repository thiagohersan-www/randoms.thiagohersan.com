class ScatterPlot {
  constructor(graphW, graphH) {
    this.s
  }

  updateGraph(xData, yData) {

  }
}


function scatterGraph(graphW, graphH) {
  return (s) => {
    s.setup = () => {
      s.createCanvas(graphW, graphH);
      s.background(200);
      s.noLoop();
    };

    s.updateGraph = (x, y, drawLobf=false) => {
      const minDim = Math.min(...x, ...y);
      const maxDim = Math.max(...x, ...y);

      const xplot = x.map(v => s.map(v, minDim, maxDim, 0, s.width));
      const yplot = y.map(v => s.map(v, minDim, maxDim, s.height, 0));

      const x0 = s.map(0, minDim, maxDim, 0, s.width);
      const y0 = s.map(0, minDim, maxDim, s.height, 0);

      s.background(200);
      s.stroke(0, 100);
      s.strokeWeight(2);

      s.line(0, y0, s.width, y0);
      s.line(x0, 0, x0, s.height);

      s.fill(16, 200);
      s.noStroke();
      xplot.forEach((v,i) => {
        s.ellipse(v, yplot[i], 4, 4);
      });

      if (drawLobf) {
        s.stroke(0, 0, 200, 100);
        s.strokeWeight(2);
        const { m, b } = lobf(xplot, yplot);
        s.line(0, b, s.width, m * s.width + b);
      }
    }
  }
}
