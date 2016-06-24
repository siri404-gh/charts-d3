var count = function(data, check) {
    var counter = 0;
    data.forEach(function(d) {
        counter += check(d);
    });
    return counter;
};

var sortFunc = function(data, parameter, desc) {
    return data.sort(function(d, e) {
        if(desc) {
            if(parameter)
            return e[parameter] - d[parameter];
            return e - d;
        } else {
            if(parameter)
            return d[parameter] - d[parameter];
            return d - e;
        }
    });
};

var plotGdp = function(data, className, parameter, text, sortOrder) {
    var sortedData = sortFunc(data, parameter, sortOrder);
    var dataArray = [];
    sortedData.forEach(function(d, i) {
        dataArray.push(i);
    });

    var xScale = d3.scale.linear()
        .domain(d3.extent(sortedData, function(d) {return parseInt(d[parameter])}))
        .range([0, 500]);


    d3.select(className)
        .selectAll("div")
        .data(dataArray)
        .enter().append("div")
        .attr('class', 'bar')
        .style('width', function(d, i) { return xScale( sortedData[i][parameter] ) + "px"; })
        .text( function(d, i) { return  sortedData[i][text] });
};

var plotCrime = function(data, className, yParameter, widthFunc, textFunc) {
    data.forEach(function(d) {
        if(dataArray.indexOf(d[yParameter]) == -1) dataArray.push(d[yParameter]);
    });

    dataArray = sortFunc(dataArray, null, true);

    d3.select(className)
    .selectAll("div")
    .data(dataArray)
    .enter().append("div")
    .attr('class', 'bar')
    .style("width", widthFunc)
    .text(textFunc);
};
