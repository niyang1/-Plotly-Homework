// FUNCTION #1 of 4
function buildCharts(UID) {

    d3.json("samples.json").then(data => {
        var sample = data.sample
        var resultArray = sample.filter(metadataRow => metadataRow.id == UID)
        var result = resultArray[0]
        var testNum = samples.map(row => row.id).indexOf(UID);
        // Make bar plot
        var otuValueTen = samples.map(row => row.sample_values);
        var otuValueTen = otuValueTen[testNum].slice(0, 10).reverse();
        var otuIdTen = samples.map(row => row.otu_ids);
        var otuIdTen = otuIdTen[testNum].slice(0, 10);
        var otuLabelTen = samples.map(row => row.otu_labels);
        var otuLabelTen = otuLabelTen[testNum].slice(0, 10);
        var trace = {
            x: otuValueTen,
            y: otuIdTen.map(r => `UTO ${r}`),
            text: otuLabelTen,
            type: 'bar',
            orientation: 'h'
        Plotly.newPlot("bar", chartData, layout);

        })
};

// FUNCTION #2 of 4
function populateDemoInfo(UID) {

    var demographicInfoBox = d3.select("#sample-metadata");
    demographicInfoBox.html("")
    d3.json("samples.json").then(data => {
        var metadata = data.metadata
        var resultArray = metadata.filter(metadataRow => metadataRow.id == UID)
        var result = resultArray[0]
        Object.entries(result).forEach(([key, value]) => {
            demographicInfoBox.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    })
}

// FUNCTION #3 of 4
function optionChanged(UID) {
    console.log(UID);
    buildCharts(UID);
    populateDemoInfo(UID);
}

// FUNCTION #4 of 4
function initDashboard() {
    var dropdown = d3.select("#selDataset")
    d3.json("samples.json").then(data => {
        var names = data.names;
        names.forEach(UID => {
            dropdown.append("option").text(UID).property("value", UID)
        })
        buildCharts(names[0]);
        populateDemoInfo(names[0]);
    });
};

initDashboard();