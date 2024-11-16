

//Initial variables
const ctx = document.getElementById('myChart').getContext('2d');
const dataArr = [];
let labels = [];

//fetch data from data.json
fetch('data.json')
   .then(function(response) {
      return response.json();
   })
   .then(function(data) {
      if(!Array.isArray(data)) {
         throw new Error('Data is not in array format!');
      }
      data.forEach((item) => {
         const {day, amount} = item;
         labels.push(day); 
         dataArr.push(amount);
      })

//Modifying global defaults
Chart.defaults.elements.bar.borderSkipped = false;
Chart.defaults.elements.bar.borderRadius = 3;

//Generate colors array based on max value
const maxVal = Math.max(...dataArr);
const colors = dataArr.map(value => value < maxVal ? 'hsl(10, 79%, 65%, 1)' : 'hsl(186, 34%, 60%, 1)');
const hoverColors = colors.map(arr => arr.replace(/1\)$/, '0.7)'));

//Chart instance
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
      responsive: true,
      maintainAspectRatio: false,  // Allow chart to resize freely
      scales: {
         x: {
            grid: { display: false },
            border: { display: false },
            beginAtZero: true,
            // 0 < categoryPercentage <= 1
            categoryPercentage: 0.8,
            // Set barPercentage to control bar width
            barPercentage: 0.9 
         },
         y: {
            ticks: { display: false },
            grid: { display: false },
            border: { display: false },
            beginAtZero: true
         }
      },
      plugins: {
         colors: { enabled: false },
         legend: { display: false },
         title: {
            display: true,
            text: "Spending - Last 7 days",
            align: 'start',
            padding: { top: 20, bottom: 20 },
            font: { size: 18, weight: 700 }
         },
         tooltip: {       
            // Disable the on-canvas tooltip and override it
            enabled: false,

            external: function(context) {
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
                  return bodyItem.lines;
               }
            

               // Set Text
                  if (tooltipModel.body) {
                     //const titleLines = [];//tooltipModel.title || [];
                     const bodyLines = tooltipModel.body.map(getBody);
                     let innerHtml = '<thead>';
                     bodyLines.forEach(function(body, i) {
                        let [num] = body;
                        num = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
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
                    tooltipEl.style.backgroundColor = 'hsl(25, 47%, 15%)';
                    tooltipEl.style.color = 'hsl(33, 100%, 98%)';
                    tooltipEl.style.padding = '5px';
                    tooltipEl.style.borderRadius = '0.3rem';
                }
                           
            }
        }
       },

    });

   })
      
   .catch(err =>  console.error('Error fetching data: ', err));