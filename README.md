# NYC School District Quality Visualizations

This site contains several visualizations that explore qualities of New York City schools during the 2009-2010 school year. The dataset used for these visualizations is the 2009-2010 School Progress Reports data from the New York City Department of Education. These progress reports were the main tool for keeping track of school progress and performance during 2007-2013. Each school is graded with respect to its peer schools in three categories: student progress (graduation rates), student performance, and school environment. These individual categories receive a grade of A, B, C, D, or F, and then the three categories are rolled up into one overall grade. The dataset is publicly available on the [NYC Open Data website](https://data.cityofnewyork.us/Education/2009-2010-School-Progress-Reports-All-Schools/ffnc-f3aa).

This site is composed of five visualizations: one heatmap and four normalized stacked bar charts. Each chart makes use of animated transitions, mouseover tooltips, and annotations. This was written in HTML/CSS and Javascript, and uses the D3.js (v4) and jQuery libraries. Python 3 was used for processing the data prior to visualizing it. This project has been tested for compatibility with Chrome, Firefox, Edge, and Internet Explorer 11. I make no promises about Safari or any other browser.

## Narrative Structure

The narrative structure that I use to display these visualizations is the martini glass structure. The martini glass begins with author-driven content and leads into reader-driven content. My project is organized by these rules because it begins with a guided tour of the data and then reaches a point where the viewer can explore the data by themselves as desired.

The guided tour consists of five scenes that each consist of one chart, a brief text summary of what it shows, and some analysis of what insights may be drawn from it. This is the author-driven portion because I control the sequence in which viewers examine the data and I provide my own observations with each chart. This guided tour ends in a "jumping off point" as the martini glass structure demands. In this case, it is when the viewer clicks the Finish button at the end of the last scene. This begins the reader-driven portion. After clicking Finish, all of the scenes are unlocked and displayed on the same page for the viewer to easily scroll between charts. The viewer may now navigate the scenes freely and make their own observations about the data. If they wish, the viewer may also click the Reset All button to start the tour over.

## Sources
I used the following pages as references for developing this project.
* [D3 API Documentation](https://github.com/d3/d3/blob/master/API.md)
* [Normalized Stacked Bar Chart Example](https://bl.ocks.org/mbostock/3886394) by Mike Bostock