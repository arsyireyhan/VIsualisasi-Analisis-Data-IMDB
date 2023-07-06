import {csv, select} from 'd3';
import {scatterPlot} from './ScatterPlot';
import {menu} from './Menu';

const csvUrl = "https://raw.githubusercontent.com/arsyireyhan/Windows-11-Sentiment-Analysis/main/output_IMDB.csv"

const parseRow = (d) => {
    d.imdb = +d.imdb;
    d.metascore = +d.metascore;
    d.votes = +d.votes;
    d.runtime = +d.runtime;
    d.review_quality = +d.review_quality;
    return d;
};

const width = window.innerWidth * 0.9;
const height = window.innerHeight * 0.75;
const svg = select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const menuContainer = select('body')
    .append('div')
    .attr('class', 'menu-container');

const xMenu = menuContainer.append('div').attr('class', 'xMenu');
const yMenu = menuContainer.append('div').attr('class', 'yMenu');

const main = async () => {
    const plot = scatterPlot()
    .width(width)
    .height(height)
    .data(await csv(csvUrl, parseRow))
    .xValue((d) => d.metascore)
    .yValue((d) => d.votes)
    .colorValue((d) => d.review_quality) 
    .margin({
        top: 50,
        right: 20,
        bottom: 30,
        left: 120,
    })
    .radius(5);

    console.log(await csv(csvUrl, parseRow));

    svg.call(plot);

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
