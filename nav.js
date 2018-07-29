nav_visible = localStorage.getItem("nav_visible");
if(nav_visible === undefined || nav_visible === "null" || nav_visible === null)
{
	nav_visible = {
		"step1" : false,
		"step2" : false,
		"step3" : false,
		"step4" : false,
		"step5" : false,
		"reset" : false,
	};
}
else
{
	nav_visible = JSON.parse(nav_visible);
}
localStorage.setItem("nav_visible", JSON.stringify(nav_visible));

show_all_divs = localStorage.getItem("show_all_divs");
if(show_all_divs === undefined || show_all_divs === "null" || show_all_divs === null)
{
	show_all_divs = false;
}
else
{
	show_all_divs = JSON.parse(show_all_divs);
}
localStorage.setItem("show_all_divs", JSON.stringify(show_all_divs));

annotations = localStorage.getItem("annotations");
if(annotations === undefined || annotations === "null" || annotations === null)
{
	annotations = true;
}
else
{
	annotations = JSON.parse(annotations);
}
localStorage.setItem("annotations", JSON.stringify(annotations));

step_vis_type = {
	"step1" : "heatmap",
	"step2" : "overall",
	"step3" : "env",
	"step4" : "perf",
	"step5" : "prog"
}

function NavTo(show_step, hide_step, gradeName) {
	if(show_all_divs)
	{
		ShowAllDivs();
		return;
	}

	if(hide_step === "")
	{
		var keys = Object.keys(nav_visible);
		for(var i = 0; i < keys.length-1; i++)
		{
			$("#" + keys[i] + "-div").hide();
		}
		$("#start-div").hide();
	}
	else
	{
		$("#" + hide_step + "-div").hide();
	}

	$("#" + show_step + "-button").show();
	$("#" + show_step + "-div").show();

	CreateVisualization(show_step, gradeName);
	
	nav_visible[show_step] = true;
	localStorage.setItem("nav_visible", JSON.stringify(nav_visible));
}

function Reset() {
	var keys = Object.keys(nav_visible);
	for(var i = 0; i < keys.length; i++)
	{
		nav_visible[keys[i]] = false;
	}

	show_all_divs = false;

	localStorage.setItem("nav_visible", JSON.stringify(nav_visible));
	localStorage.setItem("show_all_divs", JSON.stringify(show_all_divs));
	ToggleAnnotations(true);

	location.href='index.html';
}

function ShowAllDivs() {
	show_all_divs = true;
	$(".hideable").hide();

	var keys = Object.keys(nav_visible);
	for(var i = 0; i < keys.length-1; i++)
	{
		$("#" + keys[i] + "-div").show();
		CreateVisualization(keys[i], step_vis_type[keys[i]]);
	}
	$("#start-div").show();

	localStorage.setItem("nav_visible", JSON.stringify(nav_visible));
	localStorage.setItem("show_all_divs", JSON.stringify(show_all_divs));
}

function WhatToShow() {
	if(show_all_divs)
	{
		ShowAllDivs();
		$("#navbar > button").show();
	}
	else
	{
		var keys = Object.keys(nav_visible);
		var last_key = "start";
		for(var i = 0; i < keys.length-1; i++)
		{
			if(nav_visible[keys[i]])
			{
				$("#" + keys[i] + "-button").show();
				last_key = keys[i];
			}
			else
			{
				break;
			}
		}
	}
}

function ToggleAnnotations(turn) {
	window.annotations = turn;
	var button = $("#annot-button");

	if(turn === true)
	{
		button.html("Turn Off Annotations");
		button.attr("onclick", "ToggleAnnotations(false);")
		$(".annot").show();
	}
	else
	{
		button.html("Turn On Annotations");
		button.attr("onclick", "ToggleAnnotations(true);")
		$(".annot").hide();
	}
	
	localStorage.setItem("annotations", JSON.stringify(annotations));
}