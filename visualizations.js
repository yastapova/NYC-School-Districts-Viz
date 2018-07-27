var canvasName = "step2-canvas";
var gradeName = "overall";
var pad = 70;
var gradesList = ["A", "B", "C", "D", "F", "NA"];
var districtList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
					"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
					"21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
					"31", "32", "75", "79", "84"];

data = [];

d3.csv("data/reorganized_data.csv", function(d) {
	data.push(d);
});

function CreateVisualization(step, gradeName) {
	if(step === "step1")
	{
		// put heatmap here
	}
	else if(step !== "reset" && step !== "start")
	{
		CreateBarChart(step + "-canvas", gradeName)
	}
}

function CreateBarChart(canvasName, gradeName) {
	var svg = d3.select("#" + canvasName);
	var canvas = $("#" + canvasName);
	var height = canvas.height();
	var width = canvas.width();
	var g = svg.append("g");

	var yScale = d3.scaleLinear()
		.rangeRound([(pad/2), height - (pad/2)]);

	var xScale = d3.scaleBand()
		.domain(districtList)
		.rangeRound([(pad/2), width - (pad/2)])
		.padding(0.1);

	var colorScale = d3.scaleOrdinal()
		.domain(gradesList)
		.range(["darkblue", "cornflowerblue", "#ffaa00", "coral", "crimson", "lightgrey"]);

	var stack = d3.stack()
		.keys(gradesList)
		.value(function(d, key) { return d["relative_" + gradeName + "_" + key]; })
		.order(d3.stackOrderNone)
		.offset(d3.stackOffsetNone);

	var series = stack(data);

	var serie = g.selectAll(".serie")
		.data(series)
		.enter().append("g")
			.attr("class", "serie")
			.attr("fill", function(d) { return colorScale(d.key); });

	serie.selectAll("rect")
		.data(function(d) { return d; })
		.enter().append("rect")
			.attr("x", function(d) { return xScale(d.data.district); })
			.attr("y", function(d) { return yScale(d[0]); })
			.attr("height", function(d) { return yScale(d[1]) - yScale(d[0]); })
			.attr("width", xScale.bandwidth())
			.attr("district", function(d) { return d.data.district; });
			// .attr("grade", function(d) { return d.key; })
			// .attr("percent", function(d) { return d.data["relative_" + gradeName + "_" + d.key]})
			// .attr("num_schools", function(d) { return d.data["total_" + gradeName + "_" + d.key]});
}