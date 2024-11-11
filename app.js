

//Initial variables
const ctx = document.getElementById('myChart');
const dataArr = [17.45, 34.91, 52.36, 31.07, 23.39, 43.28, 25.48];
const labels = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

//Configurations
Chart.defaults.layout.padding.left = 20;
Chart.defaults.plugins.title.font.weight = 'bold';
Chart.defaults.plugins.title.font.size = 18;
Chart.defaults.elements.bar.borderSkipped = false;
Chart.defaults.elements.bar.borderRadius = 4;

//Generate colors array based on max value
const maxVal = Math.max(...dataArr);
const colors = dataArr.map(value => value < maxVal ? 'hsl(186, 34%, 60%, 1)' : 'hsl(10, 79%, 65%, 1)');
const hoverColors = colors.map(arr => arr.replace(/1\)$/, '0.7)'));

//Chart configuration
const myChart = new Chart(ctx, {
   type: 'bar',
   data: {
      labels,
      datasets: [{
         data: dataArr,
         backgroundColor: colors,
         hoverBackgroundColor: hoverColors
      }],
       },
   options: {
      onHover: (event, elements) => {
         event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
      },
      layout: {
             autoPadding: true
      },
      responsive: true,
      scales: {
         x: {
            grid: { display: false },
            border: { display: false }
         },
         y: {
            ticks: { display: false },
            grid: { display: false },
            border: { display: false }
         }
      },
      plugins: {
         colors: { forceOverride: true, enabled: false },
         legend: { display: false },
         title: {
            display: true,
            text: "Spending - Last 7 days",
            align: 'start',
            padding: { top: 20, bottom: 40 }
         },
         tooltip: {       
            // Disable the on-canvas tooltip
            enabled: false,

            external: function(context) {
               //console.log(context);
               // Tooltip Element
               let tooltipEl = document.getElementById('chartjs-tooltip');

               // Create element on first render
               if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML = '<table></table>';
                  document.body.appendChild(tooltipEl);
               }

               // Hide if no tooltip
               const tooltipModel = context.tooltip;
               if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = 0;
                  return;
               }
                

               // Set caret Position
               tooltipEl.classList.remove('above', 'below', 'no-transform');
               tooltipEl.classList.add(tooltipModel.yAlign || 'no-transform');
               

               function getBody(bodyItem) {
                  //console.log(bodyItem);
                  //console.log(bodyItem.lines);
                  return bodyItem.lines;
               }
            

               // Set Text
                  if (tooltipModel.body) {
                     //const titleLines = [];//tooltipModel.title || [];
                     const bodyLines = tooltipModel.body.map(getBody);
                     let innerHtml = '<thead>';
                     bodyLines.forEach(function(body, i) {
                        let [num] = body;
                        //console.log(num);
                        num = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
                        //console.log(num);
                        const colors = tooltipModel.labelColors[i];
                        colors.backgroundColor = 'transparent';
                        let style = 'background:' + colors.backgroundColor;
                        style += '; border-color:' + colors.borderColor;
                        style += '; border-width: 2px';
                        const span = '<span style="' + style + '">' + num + '</span>';
                        innerHtml += '<tr><td>' + span + '</td></tr>';
                     });
                        innerHtml += '</tbody>';

                        let tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                  }

                    const position = context.chart.canvas.getBoundingClientRect();
                    const bodyFont = Chart.helpers.toFont(tooltipModel.options.bodyFont);

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = (position.left + window.screenX + tooltipModel.caretX)/16 - 1.5 + 'rem';
                    tooltipEl.style.top = (position.top + window.screenY + tooltipModel.caretY)/16 - 2 + 'rem';
                    tooltipEl.style.font = bodyFont.string;
                    tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding +'px';
                    tooltipEl.style.pointerEvents = 'none';
                    tooltipEl.style.backgroundColor = 'black';
                    tooltipEl.style.color = 'white';
                    tooltipEl.style.padding = '5px';
                    tooltipEl.style.borderRadius = '0.3rem';
                }
                           
            }
        }
       },

    });

 