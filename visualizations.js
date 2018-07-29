var canvasName = "step2-canvas";
var gradeName = "overall";
var pad = 70;
var gradesList = ["A", "B", "C", "D", "F", "NA"];
var gradesColors = ["darkblue", "cornflowerblue", "#ffaa00", "coral", "crimson", "lightgrey"];
var districtList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
					"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
					"21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
					"31", "32", "75", "79", "84"];
var schoolLevels = ["ES", "MS", "HS", "K2", "K3", "K8", "HST", "YABC"];
var schoolLevelNames = ["Elementary", "Middle", "High", "K-2", "K-3", "K-8", "Transfer", "YABC"];

$(document).ready(function() {
	data = localStorage.getItem("data");
	if(data === undefined || data === "null" || data === null)
	{
		LoadData();
	}
	else
	{
		data = JSON.parse(data);
		DataDoneLoading();

	}
	WhatToShow();
});

function DataDoneLoading() {
	$(".loading-box").css("background-color", "darkblue");
	$("#done-loading-data-text").show();
	$("#start-button").text("Start");
	$("#start-button").attr("onclick", "NavTo('step1', 'start', 'heatmap');");
}

function LoadData() {
	window.data = [];

	d3.csv("data/reorganized_data.csv", function(d) {
		data.push(d);

		if(data.length % 7 === 0)
		{
			var box = data.length / 7;
			$("#loading-box-" + box).css("background-color", "darkblue");
		}

		if(data.length === 35)
		{
			localStorage.setItem("data", JSON.stringify(data));
			DataDoneLoading();
		}
	});
}

function CreateVisualization(step, gradeName) {
	if(step === "step1")
	{
		CreateHeatmap(step + "-canvas");
	}
	else if(step !== "reset" && step !== "start")
	{
		CreateBarChart(step + "-canvas", gradeName);
	}

	CreateAnnotations(step);
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
		.padding(0.2);

	var colorScale = d3.scaleOrdinal()
		.domain(gradesList)
		.range(gradesColors);

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
		.call(d3.axisLeft(yScale)
			.ticks(10, "%")
			.tickSizeInner(-(width - (pad*3))));

    g.append("text")
    	.attr("transform", "rotate(-90) translate(" + (-(height/2)) + ", 10)")
    	.attr("dy", "1em")
    	.style("text-anchor", "middle")
    	.text("Percent of Schools");

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

function CreateHeatmap(canvasName) {
	var svg = d3.select("#" + canvasName);
	d3.selectAll("#" + canvasName + " > *").remove();
	var canvas = $("#" + canvasName);
	var height = canvas.height();
	var width = canvas.width();
	var xpad = 100;
	var max_schools = 52;
	var g = svg.append("g");

	var yScale = d3.scaleBand()
		.domain(schoolLevelNames)
		.rangeRound([(pad*2/3), height - pad])
		.padding(0.1);

	var xScale = d3.scaleBand()
		.domain(districtList)
		.rangeRound([xpad, width - (pad*2)])
		.padding(0.1);

	var colorScale = d3.scaleLinear()
		.domain([1, max_schools])
		.range(["lavender", "darkblue"]);

	g.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0, " + (pad*2/3) + ")")
		.call(d3.axisTop(xScale).tickSize(0));

	g.append("text")
		.attr("transform", "translate(" + ((width - pad)/2) + ", 15)")
		.style("text-anchor", "middle")
		.text("School District");

	g.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + xpad + ",  0)")
		.call(d3.axisLeft(yScale).tickSize(0));

    g.append("text")
    	.attr("transform", "rotate(-90) translate(" + (-(height/2)) + ", 10)")
    	.attr("dy", "1em")
    	.style("text-anchor", "middle")
    	.text("School Level");

	var transition = d3.transition()
		.duration(1000);

	var tooltip = d3.select("#tooltip");

	var stack = d3.stack()
		.keys(schoolLevelNames)
		.value(function(d, key) { return key; })
		.order(d3.stackOrderNone)
		.offset(d3.stackOffsetNone);

	var series = stack(data);

	var serie = g.selectAll(".series")
		.data(series)
		.enter().append("g")
			.attr("class", function(d) { return "series " + d.key; });

	serie.selectAll(".heatbox")
		.data(function(d) { return d; })
		.enter().append("rect")
			.attr("class", "heatbox")
			.attr("x", function(d) { return xScale(d.data.district); })
			.attr("y", function(d) { 
				var level = $(this.parentNode).attr("class").split(" ")[1];
				return yScale(level);
			})
			.attr("fill", "white")
			.attr("height", yScale.bandwidth())
			.attr("width", xScale.bandwidth())
			.on("mouseover", function(d) {
				var levelName = $(this.parentNode).attr("class").split(" ")[1];
				var i = schoolLevelNames.indexOf(levelName);
				var level = schoolLevels[i];
				var num = d.data["num_" + level];

				tooltip.transition()
					.duration(200)
					.style("opacity", 0.9);
				tooltip.html("<b>District: </b>" + d.data.district + "<br />"
						+ "<b>Level: </b>" + levelName + "<br />"
						+ "<b>Num Schools: </b>" + num)
					.style("left", (d3.event.pageX + 10) + "px")
					.style("top", (d3.event.pageY + 10) + "px");
			})
			.on("mouseout", function(d) {
				tooltip.transition()
					.duration(500)
					.style("opacity", 0);
			})
			.transition(transition)
				.delay(function(d, i) { return i * 30; })
				.attr("fill", function(d) {
					var levelName = $(this.parentNode).attr("class").split(" ")[1];
					var i = schoolLevelNames.indexOf(levelName);
					var level = schoolLevels[i];
					var num = d.data["num_" + level];

					if(num == 0)
						return "white";
					else
						return colorScale(num);
				});

	g.append("text")
		.attr("transform", "translate(" + ((width - pad)/2) + ", " + (height - (pad/2)) + ")")
    	.style("text-anchor", "middle")
    	.style("font-weight", 800)
    	.style("font-size", 20)
    	.style("text-decoration", "underline")
    	.text("Legend");

    g.selectAll(".legend-box")
    	.data(function() {
    		var legendData = [];
    		for(var i = 1; i <= max_schools; i++)
    		{
    			legendData.push(i);
    		}
    		return legendData;
    	})
    	.enter().append("rect")
    		.attr("class", "legend-box")
    		.attr("fill", function(d) { return colorScale(d); })
    		.attr("x", function(d, i) { return ((width - pad)/2) - 52 + (i-1)*2; })
    		.attr("y", height - 20)
    		.attr("height", 20)
    		.attr("width", 5);

    g.append("text")
    	.text("1")
    	.attr("transform", "translate(" + (((width - pad)/2) - 72) + ", " + (height - 5) + ")")


    g.append("text")
    	.text("52")
    	.attr("transform", "translate(" + (((width - pad)/2) + 62) + ", " + (height - 5) + ")")
}

function CreateAnnotations(step) {
	var svg = d3.select("#" + step + "-canvas");
	var canvas = $("#" + step + "-canvas");
	var height = canvas.height();
	var width = canvas.width();
	
	var g = svg.append("g");

	var transition = d3.transition()
		.delay(1200)
		.duration(600);

	switch(step) {
		case "step1":
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width/2 + 320)
				.attr("y", height - 30)
				.text("District 79 consists only of YABC programs.")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});

			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", pad*1.5)
				.attr("y", height - 30)
				.text("District 2 has the most high schools.")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", pad*1.5)
				.attr("y", height - 18)
				.text("Mouse over for more details.")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});

			g.append("line")
				.attr("class",  "arrow annot")
				.style("opacity", "0")
				.attr("x1", 150)
				.attr("y1", height - 45)
				.attr("x2", 150)
				.attr("y2", 140)
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("line")
				.attr("class",  "arrow annot")
				.style("opacity", "0")
				.attr("x1", width - 190)
				.attr("y1", height - 45)
				.attr("x2", width - 190)
				.attr("y2", height - 90)
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});

			break;

		case "step2":
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 110)
				.text("Districts 18 & 84")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 95)
				.text("have the most")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 80)
				.text("missing data. Mouse")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 65)
				.text("over for details.")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("line")
				.attr("class",  "arrow annot")
				.style("opacity", "0")
				.attr("x1", width - pad*1.6)
				.attr("y1", height - 88)
				.attr("x2", width - pad*2.3)
				.attr("y2", height - 88)
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});

			break;

		case "step3":
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 110)
				.text("There are many")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 95)
				.text("D & F environment")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 80)
				.text("scores across all")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 65)
				.text("districts.")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("line")
				.attr("class",  "arrow annot")
				.style("opacity", "0")
				.attr("x1", width - pad*1.6)
				.attr("y1", height - 85)
				.attr("x2", width - pad*3.1)
				.attr("y2", height - 85)
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});

			break;

		case "step4":
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 110)
				.text("Almost half of the")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 95)
				.text("schools in district 75")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 80)
				.text("have a failing grade.")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("line")
				.attr("class",  "arrow annot")
				.style("opacity", "0")
				.attr("x1", width - pad*1.6)
				.attr("y1", height - 95)
				.attr("x2", width - pad*3.1)
				.attr("y2", height - 95)
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});

			break;

		case "step5":
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 200)
				.text("Low progress grades")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 185)
				.text("may point to issues")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 170)
				.text("in the city's charter")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("text")
				.attr("class", "annot")
				.style("opacity", "0")
				.attr("x", width - pad*1.5)
				.attr("y", height - 155)
				.text("school system.")
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});
			g.append("line")
				.attr("class",  "arrow annot")
				.style("opacity", "0")
				.attr("x1", width - pad*1.6)
				.attr("y1", height - 180)
				.attr("x2", width - pad*2.3)
				.attr("y2", height - 180)
				.transition(transition)
					.style("opacity", function() {
						if(window.annotations === true)
						{
							return "1";
						}
						else
						{
							return "0";
						}
					});

			break;
	}
}