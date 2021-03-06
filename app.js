const colors = [
  'rgb(71, 14, 143)',
  'rgb(255, 69, 0)',
  'rgb(255, 215, 0)',
  'rgb(1, 103, 103)',
  'rgb(226, 113, 141)',
  'rgb(67, 160, 195)',
  'rgb(178, 34, 34)',
  'rgb(255, 20, 147)',
  'rgb(50, 205, 50)',
  'rgb(0, 0, 139)',
  'rgb(210, 105, 30)'
]; 
const confirmedURL = 'confirmed.json';
const deathsURL = 'deaths.json';
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
      callbacks: {
        title: function(tooltipItem) {
          let point = tooltipItem[0].label; 
          return `Day ${point}`;
        }
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 0,
        bottom: 10
      },
    },scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Days since confrmed cases > 99',
        },
        type: 'linear',
        position: 'left',
      ticks: {
        // Include a dollar sign in the ticks
        callback: function(value, index, values) {
            return parseInt(value);
        },
      },
    }],
      yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Total number of confirmed cases',
          },
          type: 'linear',
          position: 'left',
        },
      ]
    }
  }
});

//  pressure chart
const deathChart = new Chart(document.getElementById('deathsChart').getContext('2d'), {
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
      callbacks: {
        title: function(tooltipItem, data) {
          let point = tooltipItem[0].label; 
          return `Day ${point}`;
        },
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 0,
        bottom: 30
      },
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Days since confrmed cases > 99',
        },
        type: 'linear',
        position: 'left',
      ticks: {
        // Include a dollar sign in the ticks
        callback: function(value, index, values) {
            return parseInt(value);
        },
      },
    }],
      yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Total number of Deaths',
          },
          type: 'linear',
          position: 'left',
        },
      ]
    }
  }
});
  
main()

const nationsToPlot = ['World']

function transpose(data) {
    tranposed = []
    data.columns.array.forEach(element => {
        
    });
  return Object.keys(a[0]).map(function(c) {
      return a.map(function(r) { return r[c]; });
  });
}



function main() {
  Promise.all([d3.json(confirmedURL), d3.json(deathsURL)]).then(function([dataComp, dataDeaths]) {
    populateNations(dataComp, 'nations-list');
    const search = document.getElementById('search-nation');
    const close = document.getElementById('close-inputs');
    search.addEventListener('focusin', function() {
      document.getElementById('nations-to-add').classList.remove("hidden");
      close.classList.remove("hidden");
    });
    close.addEventListener('click', function() {
      document.getElementById('nations-to-add').classList.add("hidden");
      close.classList.add("hidden");
      search.value = '';
    });
    search.addEventListener('keyup', function() {searchNation('search-nation', 'nations-list');});
    document.querySelectorAll('input[type="checkbox"]').forEach((el) =>{
      el.addEventListener('change', (e) => {changeNations(e, compChart, deathChart, dataComp, dataDeaths)})
    });
    updateCharts(compChart, deathChart, dataComp, dataDeaths, nationsToPlot);
    createChips(nationsToPlot);
    checkNations();
})
}


function prepDataset(data, nation){
  const dataObject = {
    labels: [],
    dataset : {
      label: nation,
      data: [],
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

function prepDeaths(data, nation, casesObject){
  const dataObject = {
    labels: [],
    dataset : {
      label: nation,
      data: [],
  }
  }
  let j = 0;
  const start = data[nation].length - casesObject.labels.length;
  data[nation].forEach((d,i) => {
    if (i >= start) {
      j += 1;
      dataObject.labels.push(j)
      dataObject.dataset.data.push({
        x: j,
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

function populateNations(data, ulID){
  let ul = document.getElementById(ulID);
  ul.innerHTML = '';
  nations = Object.keys(data);
  nations.forEach((nation, i) => {
    let li = document.createElement("li");
    let label = document.createElement("label");
    let input = document.createElement("input");
    let text = document.createTextNode(nation)
    input.setAttribute("type", "checkbox");
    label.appendChild(input);
    label.appendChild(text);
    li.appendChild(label);
    ul.appendChild(li);
  })
}

function searchNation(searchID, ulID) {
  // Declare variables
  let input, filter, ul, li, i, txtValue;
  input = document.getElementById(searchID);
  filter = input.value.toUpperCase();
  ul = document.getElementById(ulID);
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    label = li[i].getElementsByTagName("label")[0];
    txtValue = label.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function removeFromChart(divChip) {
  const nation = divChip.childNodes[0].nodeValue;
  document.querySelectorAll('input[type="checkbox"]').forEach((el) => {
    if (nation == el.parentNode.innerText) {
      el.checked = false;
      el.dispatchEvent(new Event("change"));
      divChip.classList.add('hidden')
    }
  });
}

function getChip(nation){
  let chip = null;
  document.querySelectorAll('.chip').forEach((divChip) => {
    if (nation == divChip.childNodes[0].nodeValue) {
      chip = divChip;
    }
  });
  return chip;
}

function createChips(nations){
  const divActive = document.getElementById('active-nations');
  const divChip = document.createElement("div");
  divChip.classList.add('chip')
  const span = document.createElement("span");
  span.classList.add('closebtn');
  nations.forEach(nation => {
    divChip.innerText = nation;
    span.innerText = 'X';
    divChip.append(span);
    span.addEventListener('click', () => {removeFromChart(divChip);} );
    divActive.appendChild(divChip);
  });
}

function checkNations() {
  document.querySelectorAll('input[type="checkbox"]').forEach((el) => {
    if (nationsToPlot.includes(el.parentNode.innerText)) {
      el.checked = true;
    }
  })
}

function getSelectedNation(node){
  nation = node.parentNode.innerText
  if (node.checked == false) {
    let ix = nationsToPlot.indexOf(nation);
    let divChip = getChip(nation);
    if (divChip != null) {
      divChip.remove();
    }   
    
    if (ix > -1) {
      nationsToPlot.splice(ix, 1)
    }
  }
  else{
    nationsToPlot.push(nation);
    createChips(nationsToPlot);
  }
}

function changeNations(e, compChart, deathChart, dataComp, dataDeaths) {
  getSelectedNation(e.target);
  removeDataSets(compChart);
  removeDataSets(deathChart);
  updateCharts(compChart, deathChart, dataComp, dataDeaths, nationsToPlot);
}

// Updates all datasets of the chart removing old ones
function updateDataSets(chart, newDatSets) {
  newDatSets.forEach((newDatSet) => {
    addDataSet(chart, newDatSet);
  });
  chart.update();
}

function formatDatasets(dataObject) {
  let newDataSets = []
  dataObject.forEach((dataset, i) => {
    newDataSets.push(dataset.dataset);
    dataset.dataset.borderColor = colors[i];
    dataset.dataset.backgroundColor = colors[i].substring(0, colors[i].length - 1) + ', 0.2)'
    dataset.dataset.fill = false;
  })
  return newDataSets;
}

// Completely updates the chart (datasets and labels)
function updateCharts(compChart, deathChart, dataComp, dataDeaths, nations) {
  const dataObjectsComp = [];
  nations.forEach((nation) => {
    dataObjectsComp.push(prepDataset(dataComp , nation));
    
  })
  
  const dataObjectsDeaths = [];
  nations.forEach((nation, i) => {
    dataObjectsDeaths.push(prepDeaths(dataDeaths, nation, dataObjectsComp[i]));
    
  })
  let newLabels = chooseLabels(dataObjectsComp);
  let newDataSetsComp = formatDatasets(dataObjectsComp);
  let newDataSetsDeaths = formatDatasets(dataObjectsDeaths);
  updateLabels(compChart, newLabels);
  updateLabels(deathChart, newLabels);
  updateDataSets(compChart, newDataSetsComp);
  updateDataSets(deathChart, newDataSetsDeaths);
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
