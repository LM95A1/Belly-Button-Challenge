// Use the D3 library to read in `samples.json`.
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((importedData) => {
  let data = importedData;

  // Populate dropdown with ids
  let idSelect = d3.select("#selDataset");
  data.names.forEach((name) => {
    idSelect.append("option").text(name);
  });

  // Initialize with data from the first ID
  buildCharts(data.names[0]);
  buildMetadata(data.names[0]);
});

function optionChanged(newId) {
  // Fetch new data each time a new sample is selected
  buildCharts(newId);
  buildMetadata(newId);
}

function buildCharts(sampleId) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let samples = data.samples.filter(sample => sample.id === sampleId)[0];
    let otuIds = samples.otu_ids;
    let otuLabels = samples.otu_labels;
    let sampleValues = samples.sample_values;

    // Bar chart
    let barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    Plotly.newPlot("bar", barData);

    // Bubble chart
    let bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    }];

    Plotly.newPlot("bubble", bubbleData);

    // Gauge chart
    let metadata = data.metadata.filter(meta => meta.id == sampleId)[0];
    let washFreq = metadata.wfreq;

    let gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 9] },
          steps: [
            { range: [0, 1], color: "#f8f3ec" },
            { range: [1, 2], color: "#f4f1e4" },
            { range: [2, 3], color: "#e9e6ca" },
            { range: [3, 4], color: "#e5e7b3" },
            { range: [4, 5], color: "#d5e49d" },
            { range: [5, 6], color: "#b7cc8f" },
            { range: [6, 7], color: "#8cbf88" },
            { range: [7, 8], color: "#8abb8f" },
            { range: [8, 9], color: "#85b48a" }
          ],
          bar: { color: "#cb4335" }
        }
      }
    ];

    let gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}

function buildMetadata(sampleId) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let metadata = data.metadata.filter(meta => meta.id == sampleId)[0];
    let metaDiv = d3.select("#sample-metadata");

    // Clear any existing metadata
    metaDiv.html("");

    // Populate the metadata
    Object.entries(metadata).forEach(([key, value]) => {
      metaDiv.append("p").text(`${key}: ${value}`);
    });
  });
}
