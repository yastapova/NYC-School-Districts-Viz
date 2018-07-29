var canvasName = "step2-canvas";
var gradeName = "overall";
var pad = 70;
var gradesList = ["A", "B", "C", "D", "F", "NA"];
var gradesColors = ["darkblue", "cornflowerblue", "#ffaa00", "coral", "crimson", "lightgrey"];
var districtList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
					"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
					"21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
					"31", "32", "75", "79", "84"];

data = localStorage.getItem("data");
if(data === undefined || data === "null" || data === null)
{
	LoadData();
}
else
{
	data = JSON.parse(data);
}

function LoadData() {
	window.data = [];

	d3.csv("data/reorganized_data.csv", function(d) {
		data.push(d);

		if(data.length === 35)
		{
			localStorage.setItem("data", JSON.stringify(data));
		}
	});
}

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
	d3.selectAll("#" + canvasName + " > *").remove();
	var canvas = $("#" + canvasName);
	var height = canvas.height();
	var width = canvas.width();
	var g = svg.append("g");

	var yScale = d3.scaleLinear()
		.domain([1, 0])
		.rangeRound([(pad/2), height - (pad/2)]);

	var xScale = d3.scaleBand()
		.domain(districtList)
		.rangeRound([pad, width - (pad*2)])
		.padding(0.1);

	var colorScale = d3.scaleOrdinal()
		.domain(gradesList)
		.range(gradesColors);

	var transition = d3.transition()
		.duration(1000);

	var tooltip = d3.select("#tooltip");

	var stack = d3.stack()
		.keys(gradesList)
		.value(function(d, key) { return d["relative_" + gradeName + "_" + key]; })
		.order(d3.stackOrderNone)
		.offset(d3.stackOffsetNone);

	var series = stack(data);

	var serie = g.selectAll(".series")
		.data(series)
		.enter().append("g")
			.attr("class", "series")
			.attr("fill", function(d) { return colorScale(d.key); });

	serie.selectAll(".bar")
		.data(function(d) { return d; })
		.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return xScale(d.data.district); })
			.attr("y", function(d) { return yScale(1 - d[0]); })
			.attr("height", 0)
			.attr("width", xScale.bandwidth())
			.on("mouseover", function(d) {
				var fill = $(this.parentNode).attr("fill");
				var i = gradesColors.indexOf(fill);
				var grade = gradesList[i];
				var pct = Math.round(d.data["relative_" + gradeName + "_" + grade] * 100);
				var count = d.data["total_" + gradeName + "_" + grade]

				tooltip.transition()
					.duration(200)
					.style("opacity", 0.9);
				tooltip.html("<b>District: </b>" + d.data.district + "<br />"
						+ "<b>Grade: </b>" + grade + "<br />"
						+ "<b>Num Schools: </b>" + count + "<br />"
						+ "<b>% Schools: </b>" + pct + "%")
					.style("left", (d3.event.pageX + 20) + "px")
					.style("top", (d3.event.pageY + 20) + "px");
			})
			.on("mouseout", function(d) {
				tooltip.transition()
					.duration(500)
					.style("opacity", 0);
			})
			.transition(transition)
				.attr("height", function(d) { return yScale(1 - d[1]) - yScale(1 - d[0]) });
			
	g.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0, " + (height - (pad/2)) + ")")
		.call(d3.axisBottom(xScale));

	g.append("text")
		.attr("transform", "translate(" + ((width - pad)/2) + ", " + (height) + ")")
		.style("text-anchor", "middle")
		.text("School District");

	g.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + pad + ",  0)")
		.call(d3.axisLeft(yScale).ticks(10, "%"));

    g.append("text")
    	.attr("transform", "rotate(-90) translate(" + (-(height/2)) + ", 10)")
    	.attr("dy", "1em")
    	.style("text-anchor", "middle")
    	.text("Percent of Schools");

    g.append("text")
    	.attr("transform", "translate(" + (width - pad) + ", " + pad + ")")
    	.style("text-anchor", "middle")
    	.style("font-weight", 800)
    	.style("font-size", 20)
    	.style("text-decoration", "underline")
    	.text("Legend");

    g.selectAll(".legend-box")
    	.data(gradesList)
    	.enter().append("rect")
    		.attr("class", "legend-box")
    		.attr("fill", function(d) { return colorScale(d); })
    		.attr("x", width - (pad * 1.35))
    		.attr("y", function(d, i) { return pad * 1.25 + i * 30; })
    		.attr("height", 20)
    		.attr("width", 20);

    g.selectAll(".legend-label")
    	.data(gradesList)
    	.enter().append("text")
    		.attr("class", "legend-label")
    		.text(function(d) { return d; })
    		.attr("x", width - (pad * 0.85))
    		.attr("y", function(d, i) { return pad * 1.45 + i * 30; });
}