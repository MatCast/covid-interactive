const colors = [
  'rgb(71, 14, 143)',
  'rgb(255, 69, 0)',
  'rgb(255, 215, 0)',
  'rgb(1, 103, 103)',
  'rgb(226, 113, 141)',
]
const dataMap = {
    'rr': {
      'label': 'Precipitation',
      'color': 'rgb(67, 160, 195)',
      'fill': true,
      'yAxisID': 'Precipitation',
      'showLine': true,
      'pointRadius': 0,
    },
    'tl': {
      'label': 'Temperature',
      'color': 'rgb(255, 69, 0)',
      'fill': false,
      'yAxisID': 'Temperature',
      'showLine': true,
      'pointRadius': 0,
    },
    'tp': {
      'label': 'Dewpoint',
      'color': 'rgb(1, 103, 103)',
      'fill': false,
      'yAxisID': 'Temperature',
      'showLine': true,
      'pointRadius': 0,
    },
    'p': {
      'label': 'Pressure',
      'color': 'rgb(71, 14, 143)',
      'fill': false,
      'yAxisID': 'Pressure',
      'showLine': true,
      'pointRadius': 0,
    },
    'so': {
      'label': 'Sunshine',
      'color': 'rgb(255, 215, 0)',
      'fill': true,
      'yAxisID': 'Sunshine',
      'showLine': true,
      'pointRadius': 0,
    },
    'ff': {
      'label': 'Windspeed',
      'color': 'rgb(14, 143, 71)',
      'fill': false,
      'yAxisID': 'Windspeed',
      'showLine': true,
      'pointRadius': 0,
    },
    'dd': {
      'label': 'Winddirection',
      'color': 'rgba(48, 48, 48, 0.8)',
      'fill': false,
      'yAxisID': 'Winddirection',
      'showLine': false,
      'pointRadius': 2,
    }
  };
 
  const dataURL = 'confirmed.json';
  //  temperature chart
  const compChart = new Chart(document.getElementById('compChart').getContext('2d'), {
    // The type of chart we want to create
    type: 'line',
  
    // The data for our dataset
    data: {
      datasets: []
   },
  
    // Configuration options go here
    options: {
      tooltips: {
        mode: 'x-axis',
        intersect: true,
      },
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
        },
      },
      // scales: {
      //   xAxes: [{
      //     type: 'time',
      //     time: {
      //       tooltipFormat: 'YYYY-MM-DD HH:mm',
      //       displayFormats: {
      //         hour: 'MMM DD HH:mm'
      //       }
      //     },
      //     gridLines: {
      //       display: false
      //     },
      //   }],
      //   yAxes: [{
      //       scaleLabel: {
      //         display: true,
      //         labelString: 'Temperature [\xB0C]',
      //         fontColor: dataMap.tl.color,
      //       },
      //       id: 'Temperature',
      //       type: 'linear',
      //       position: 'left',
      //       gridLines: {
      //         display: false
      //       },
      //     },
          
      //   ]
      // }
    }
  });
  
  //  pressure chart
  const pressChart = new Chart(document.getElementById('pressChart').getContext('2d'), {
    // The type of chart we want to create
    type: 'line',
  
    // The data for our dataset
    data: {
      labels: [],
      datasets: []
    },
  
    // Configuration options go here
    options: {
      tooltips: {
        mode: 'x-axis',
        intersect: true,
      },
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
        },
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
          },
          type: 'time',
          time: {
            tooltipFormat: 'YYYY-MM-DD HH:mm',
            displayFormats: {
              hour: 'MMM DD HH:mm'
            }
          },
          gridLines: {
            display: false
          },
        }],
        yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Pressure [hPa]',
              fontColor: dataMap.p.color,
            },
            id: 'Pressure',
            type: 'linear',
            position: 'left',
            gridLines: {
              display: false
            },
          },
        ]
      }
    }
  });
  
  formatData()

  function transpose(data) {
      tranposed = []
      data.columns.array.forEach(element => {
          
      });
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
}

  function formatData() {
    d3.json(dataURL).then(function(data) {
      const dataset1 = prepDataset(data , 'Italy');
      const dataset2 = prepDataset(data , 'Spain');
      updateChart(tempChart, [dataset1, dataset2]);
  })
}
  
function prepDataset(data, nation){
  const dataObject = {
    labels: [],
    dataset : {
      label: nation,
      data: [],
      backgroundColor: 'rgb(14, 143, 71, 0.3)',
      borderColor: 'rgb(14, 143, 71)',
  }
  }
  i = 0
  data[nation].forEach(d => {
    if (d > 99) {
      i += 1;
      dataObject.labels.push(i)
      dataObject.dataset.data.push({
        x: i,
        y: d,
      })
    }
  });
  return dataObject;
}

// Removes all datasets from the chart
function removeDataSets(chart) {
  chart.data.datasets = [];
}

// Adds single dataset to the chart
function addDataSet(chart, newDatSet) {
  chart.data.datasets.push(newDatSet);
}

function chooseLabels(datasets) {
  let max_len = 0
  let labels = []
  datasets.forEach(dataset => {
    if (dataset.labels.length > max_len) {
      max_len = dataset.labels.length;
      labels = dataset.labels;
    }
  });
  return labels;
}

// Updates chart lables removing old ones
function updateLabels(chart, newLabels) {
  chart.data.labels = [];
  newLabels.forEach((label) => {
    chart.data.labels.push(label);
  });
}

// Updates all datasets of the chart removing old ones
function updateDataSets(chart, newDatSets) {
  // removeDataSets(chart);
  newDatSets.forEach((newDatSet) => {
    addDataSet(chart, newDatSet);
  });
  chart.update();
}

// Completely updates the chart (datasets and labels)
function updateChart(chart, datasets) {
  const newLabels = chooseLabels(datasets);
  let newDataSets = []
  datasets.forEach((dataset, i) => {
    newDataSets.push(dataset.dataset);
    dataset.dataset.borderColor = colors[i];
    dataset.dataset.backgroundColor = colors[i].substring(0, colors[i].length - 1) + ', 0.2)'
    dataset.dataset.fill = true;
  })
  updateLabels(chart, newLabels);
  updateDataSets(chart, newDataSets);
}


// Creates a new dataset object to pass to addDataSet()
function formatDataSet(key, jsonData) {
  const newDataset = {
    label: key,
    backgroundColor: dataMap[key].color,
    borderColor: dataMap[key].color,
    data: jsonData[key],
    fill: dataMap[key].fill,
    yAxisID: dataMap[key].yAxisID,
    showLine: dataMap[key].showLine,
    pointRadius: dataMap[key].pointRadius,
  };
  return newDataset;
}

// updates the temperature chart
function updataTempChart(chart, data) {
  removeNegativeRR(data.rr);
  roundSunshine(data.so);
  const newDatSets = [
    formatDataSet('tl', data),
    formatDataSet('tp', data),
    formatDataSet('rr', data),
    formatDataSet('so', data)
  ];
  const newLabels = data.datumsec;
  updateChart(chart, newLabels, newDatSets);
}

// updates the pressure chart
function updataPressChart(chart, data) {
  const newDatSets = [
    formatDataSet('p', data),
    formatDataSet('ff', data),
    formatDataSet('dd', data),
  ];
  const newLabels = data.datumsec;
  updateChart(chart, newLabels, newDatSets);
}
