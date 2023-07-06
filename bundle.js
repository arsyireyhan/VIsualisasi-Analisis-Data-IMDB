(function (d3) {
    'use strict';

    const scatterPlot = () => {
      let width;
      let height;
      let data;
      let xValue;
      let yValue;
      let colorValue;
      let xType;
      let yType;
      let margin;
      let radius;
      let tooltip;
  
      const my = (selection) => {
        const x = (xType === 'categorical'
          ? d3.scalePoint().domain(data.map(xValue)).padding(0.2)
          : d3.scaleLinear().domain(d3.extent(data, xValue))
        ).range([margin.left, width - margin.right]);
  
        const y = (yType === 'categorical'
          ? d3.scalePoint().domain(data.map(yValue)).padding(0.2)
          : d3.scaleLinear().domain(d3.extent(data, yValue))
        ).range([height - margin.bottom, margin.top]);
  
        
       const  colorsRainbow = ["#59B371", "#F6B933", "#54C2EE", "#C061A2", "#EA5054"];
  
        const color = d3.scaleOrdinal()
            .domain(['0','1','2','3','4'])
            .range(colorsRainbow);
        
        const marks = data.map((d) => ({
          x: x(xValue(d)),
          y: y(yValue(d)),
          color: color(colorValue(d))
        }));
  
        const t = d3.transition().duration(1000);

        tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
  
        const positionCircles = (circles) => {
          circles
            .attr('cx', (d) => d.x + Math.random() * 10)
            .attr('cy', (d) => d.y + Math.random() * 10)
            .on('mouseover', (event, d) => {
              tooltip.style('visibility', 'visible')
              .html(`
                <strong>Movie:</strong> ${d.movie}<br/>
                <strong>Year:</strong> ${d.year}<br/>
                <strong>Rating:</strong> ${d.rating}
              `);
              // Show tooltip or perform desired actions on mouseover
              // Example: Show a tooltip with data information
              tooltip.style('visibility', 'visible')
                .html(`X: ${d.x}<br/>Y: ${d.y}`);
            })
            .on('mouseout', () => {
              // Hide tooltip or revert any changes on mouseout
              tooltip.style('visibility', 'hidden');
            });
        };

        const showTooltip = (event, d) => {
          const tooltipcontent = `
          <div><strong>Movie:</strong> ${d.movie}</div>
          <div><strong>Year:</strong> ${d.year}</div>
          <div><strong>Rating:</strong> ${d.rating}</div>
        `;
          const tooltip = d3.select('.tooltip');
          tooltip
            .html(tooltipcontent)
            .style('left', event.pageX + 'px')
            .style('top', event.pageY + 'px')
            .style('visibility', 'visible')
            .transition()
            .duration(200)
            .style('opacity', 1)
            // .html(`Movie: ${d.movie}<br>Year: ${d.year}<br>Rating: ${d.rating}`);
        };

        const hideTooltip = () => {
          const tooltip = d3.select('.tooltip');
          tooltip
            .style('visibility', 'hidden');

        };
  
        const colorCircles = (circles) => {
            circles
                .attr('fill', d => color(d.color))
                    .style('fill-opacity', 0.5);
        
        };
        
        const initializeRadius = (circles) => {
          circles.attr('r', 0);
        };
        const growRadius = (enter) => {
          enter.transition(t).attr('r', radius);
        };
  
        const circles = selection
          .selectAll('circle')
          .data(marks)
          .join(
            (enter) =>
              enter
                .append('circle')
                .call(positionCircles)
                .call(initializeRadius)
                    .call(colorCircles)
                .call(growRadius),
            (update) =>
              update.call((update) =>
                update
                  .transition(t)
                  .call(positionCircles)
              ),
            (exit) => exit.remove()
          )
          .on('mouseover', (event, d) => showTooltip(event, d))
          .on('mouseout', hideTooltip);
          
  
        selection
          .selectAll('.y-axis')
          .data([null])
          .join('g')
          .attr('class', 'y-axis')
          .attr('transform', `translate(${margin.left},0)`)
          .transition(t)
          .call(d3.axisLeft(y));
  
        selection
          .selectAll('.x-axis')
          .data([null])
          .join('g')
          .attr('class', 'x-axis')
          .attr(
            'transform',
            `translate(0,${height - margin.bottom})`
          )
          .transition(t)
          .call(d3.axisBottom(x));
        
        
      };
  
      my.width = function (_) {
        return arguments.length ? ((width = +_), my) : width;
      };
  
      my.height = function (_) {
        return arguments.length ? ((height = +_), my) : height;
      };
  
      my.data = function (_) {
        return arguments.length ? ((data = _), my) : data;
      };
  
      my.xValue = function (_) {
        return arguments.length ? ((xValue = _), my) : xValue;
      };
  
      my.yValue = function (_) {
        return arguments.length ? ((yValue = _), my) : yValue;
      };
  
       my.colorValue = function (_) {
        return arguments.length ? ((colorValue = _), my) : colorValue;
      };
      
      my.xType = function (_) {
        return arguments.length ? ((xType = _), my) : xType;
      };
  
      my.yType = function (_) {
        return arguments.length ? ((yType = _), my) : yType;
      };
  
      my.margin = function (_) {
        return arguments.length ? ((margin = _), my) : margin;
      };
  
      my.radius = function (_) {
        return arguments.length ? ((radius = +_), my) : radius;
      };
  
      return my;
    };
  
    const menu = () => {
      let id;
      let labelText;
      let options;
      const listeners = d3.dispatch('change');
      // <label for="cars">Choose a car:</label>
  
      // <select name="cars" id="cars">
      //   <option value="volvo">Volvo</option>
      //   <option value="saab">Saab</option>
      //   <option value="mercedes">Mercedes</option>
      //   <option value="audi">Audi</option>
      // </select>
      const my = (selection) => {
        selection
          .selectAll('label')
          .data([null])
          .join('label')
          .attr('for', id)
          .text(labelText);
  
        selection
          .selectAll('select')
          .data([null])
          .join('select')
          .attr('id', id)
          .on('change', (event) => {
            listeners.call('change', null, event.target.value);
          })
          .selectAll('option')
          .data(options)
          .join('option')
          .attr('value', (d) => d.value)
          .text((d) => d.text);
      };
  
      my.id = function (_) {
        return arguments.length ? ((id = _), my) : id;
      };
  
      my.labelText = function (_) {
        return arguments.length
          ? ((labelText = _), my)
          : labelText;
      };
  
      my.options = function (_) {
        return arguments.length ? ((options = _), my) : options;
      };
  
      my.on = function () {
        var value = listeners.on.apply(listeners, arguments);
        return value === listeners ? my : value;
      };
  
      return my;
    };

    const csvUrl = "https://raw.githubusercontent.com/arsyireyhan/Windows-11-Sentiment-Analysis/main/output_IMDB.csv"
    
    const parseRow = (d) => {
        d.imdb = +d.imdb;
        d.metascore = +d.metascore;
        d.votes = +d.votes;
        d.runtime = +d.runtime;
        d.movie = +d.movie;
        d.rating = +d.rating;
        d.year = +d.year;
        d.review_quality = +d.review_quality;
        return d;
    };
    
    const width = window.innerWidth * 0.95;
    const height = window.innerHeight * 0.85;
    const svg = d3.select('body') // tooltip
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    const menuContainer = d3.select('body')
        .append('div')
        .attr('class', 'menu-container');
    
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('padding', '10px');    
    
    const xMenu = menuContainer.append('div').attr('class', 'xMenu');
    const yMenu = menuContainer.append('div').attr('class', 'yMenu');
    
    const main = async () => {
        const plot = scatterPlot()
        .width(width)
        .height(height)
        .data(await d3.csv(csvUrl, parseRow))
        .xValue((d) => d.metascore)
        .yValue((d) => d.votes)
        .colorValue((d) => d.review_quality) 
        .margin({
            top: 60,
            right: 40,
            bottom: 30,
            left: 120,
        })
        .radius(5);
    
        console.log(await d3.csv(csvUrl, parseRow));

        svg.call(plot);

        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('visibility', 'hidden')
          .style('background-color', 'white')
          .style('border', 'solid')
          .style('border-width', '1px')
          .style('border-radius', '5px')
          .style('padding', '10px');
    
        const options = [
            //imdb
            {
                value: 'imdb',
                text: 'IMDB',
                type: 'quantitative',
            },
            //metascore
            {
                value: 'metascore',
                text: 'Metascore',
                type: 'quantitative',
            },
            //votes
            {
                value: 'votes',
                text: 'Votes',
                type: 'quantitative',
            },  
            //runtime
            {
                value: 'runtime',
                text: 'Runtime',
                type: 'quantitative',
            },
            //cluster
            {
                value: 'review_quality',
                text: 'Cluster',
                type: 'Categorical',
            },
        ];
    
        const columnToType = new Map(
            options.map(({ value, type }) => [value, type])
          );
          options.forEach((option) => {
            columnToType.set(option.value, option.type);
          });
    
        const getType = (column) => columnToType.get(column);
    
        //X Menu Container
        xMenu.call(
            menu()
              .id('x-menu')
              .labelText(' X:')
              .options(options)
              .on('change', (column) => {
                console.log(getType(column));
                svg.call(
                  plot
                    .xValue((d) => d[column])
                    .xType(getType(column))
                );
              })
          );
        
        yMenu.call(
            menu()
              .id('y-menu')
              .labelText(' Y:')
              .options(options)
              .on('change', (column) => {
                console.log(getType(column));
                svg.call(
                  plot
                    .yValue((d) => d[column])
                    .yType(getType(column))
                );
              })
          );
    };
    main();
  
}(d3));
