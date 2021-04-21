// Create the dropdown for names

d3.json('samples.json').then((data) => {
    var dropdown = data.names;
    console.log(data.metadata);
    var select = d3.selectAll('#selDataset');
    Object.entries(dropdown).forEach(([numbr, v]) => {
        select.append('option').text(v);
    })
})


function makePlot(testId) {
    d3.json('samples.json').then((data) => {
        // This is the array
        var samples = data.samples;
        var uidTestnum = samples.map(row => row.id).indexOf(testId);
        // Make bar plot
        var uidValueTen = samples.map(row => row.sample_values);
        var uidValueTen = uidValueTen[uidTestnum].slice(0, 10).reverse();
        var UIDTen = samples.map(row => row.otu_ids);
        var UIDTen = UIDTen[uidTestnum].slice(0, 10);
        var uidLabelTen = samples.map(row => row.otu_labels);
        var uidLabelTen = uidLabelTen[uidTestnum].slice(0, 10);
        var trace = {
            x: uidValueTen,
            y: UIDTen.map(r => `UTO ${r}`),
            text: uidLabelTen,
            type: 'bar',
            orientation: 'h'
        }
        Plotly.newPlot('bar', [trace]);

        // make bubble chart
        var uidValue = samples.map(row => row.sample_values);
        var uidValue = uidValue[uidTestnum];
        var UID = samples.map(row => row.otu_ids);
        var UID = UID[uidTestnum];
        var uidLabel = samples.map(row => row.otu_labels);
        var uidLabel = uidLabel[uidTestnum];
        var minUid = d3.min(UID);
        var maxUid = d3.max(UID);
        var mapNr = d3.scaleLinear().domain([minUid, maxUid]).range([0, 1]);
        var bubbleColors = UID.map(val => d3.interpolateRgbBasis(["#C16D9E", "blue", "purple"])(mapNr(val)));
        var trace1 = {
            x: UID,
            y: uidValue,
            text: uidLabel,
            mode: 'markers',
            marker: {
                color: bubbleColors,
                size: uidValue.map(x => x * 10),
                sizemode: 'area'
            }
        };
        var data1 = [trace1];
        var bubbleLayout = {
            xaxis: {
                autochange: true,
                height: 600,
                width: 1000,
                title: {
                    text: 'OTU ID'
                }
            },
        };
        Plotly.newPlot('bubble', data1, bubbleLayout);

        // make gauge chart 
        var meta = data.metadata;
        var data2 = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: meta[uidTestnum].wfreq,
                title: { text: "Washing frequency" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [null, 9] },
                    bar: { color: 'blue' },
                    steps: [
                        { range: [0, 2], color: "#C983A8" },
                        { range: [2, 3], color: "#C16D9E" },
                        { range: [3, 4], color: "#CD97B1" },
                        { range: [4, 5], color: "#D2ABBE" },
                        { range: [5, 6], color: "#D1BBBE" },
                        { range: [6, 8], color: "#DDCAD0" },
                        { range: [8, 9], color: "#E2D7DB" }
                    ]
                }
            }
        ];

        var gaugeLayout = { width: 600, height: 500 };
        Plotly.newPlot('gauge', data2, gaugeLayout);

        // display meta info
        var metadata = d3.select('#sample-metadata');
        metadata.html('');
        Object.entries(meta[uidTestnum]).forEach(([k, v]) => {
            metadata.append('p').text(`${k.toUpperCase()}:\n${v}`);
        })
    })
}

// Submit Button handler
function optionChanged(newId) {
    // Select the input value from the form
    makePlot(newId);
}

