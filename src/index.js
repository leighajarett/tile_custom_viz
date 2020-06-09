import UseCase from './useCase'
import React from 'react'
import ReactDOM from 'react-dom'
import { Box, Heading } from '@looker/components';

looker.plugins.visualizations.add({
  // Id and Label are legacy properties that no longer have any function besides documenting
  // what the visualization used to have. The properties are now set via the manifest
  // form within the admin/visualizations page of Looker
  options: {
  },

  // Set up the initial state of the visualization
  create: function(element, config) {

    element.innerHTML = `
      <style>
        .usecase-vis {
          /* Vertical centering */
          height: 100%;
          width: 100%;
          margin: 0 !important;
          display: flex;
          justify-content: center;
          text-align: center;
        }
      </style>
    `;

    this._vis_element = document.getElementById('vis')
    this._vis_element.className = "usecase-vis";

  },

  // Render in response to the data or settings changing
  updateAsync: function(data, element, config, queryResponse, details, done) {

    // Clear any errors from previous updates
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({title: "No Dimensions", message: "This chart requires dimensions."});
      return;
    }

    const offset_props = {
      height: this._vis_element.offsetHeight, 
      width: this._vis_element.offsetWidth
    }

    // update the state with our new data
    this.chart = ReactDOM.render(
      <Verticals 
        data={data} 
        vertical_col={queryResponse.fields.dimensions[0].name}
        usecase_col={queryResponse.fields.dimensions[1].name}
        description_col={queryResponse.fields.dimensions[2].name}
         />,
      this._vis_element
    );

    done()
  }
});

export function Verticals(props) {
  const distinct = (value, index, self) => { return self.indexOf(value) === index };

  var verticals = props.data.map(function(item) {
    return item[props.vertical_col].value;
  });

  var unique_verticals = verticals.filter(distinct);
  
  return (
    <Box m='large' display='flex' flexWrap='wrap'>
      {
          unique_verticals.map((val, i) => 
            (<Vertical 
                key={i}
                vertical={val}
                data={props.data.filter(function (el) {
                  return el[props.vertical_col].value == val;;
                })}
                usecase_col={props.usecase_col}
                description_col={props.description_col}
              >
              </Vertical>)
          )
        }
    </Box>
  )
};


export function Vertical(props) {
  console.log(props)
  return (
    <Box
      m='medium'
      border="1px solid black"
      borderRadius="4px"
      width='40%'
      padding='10'
      marginLeft={'auto'}
      marginRight={'auto'}
      >
    <Heading fontSize='xlarge' fontWeight='bold' textAlign='center'>{props.vertical}</Heading>
    <Box>
      {
          props.data.map((val, i) => 
            (<UseCase 
                key={i}
                index={i+1}
                usecase_name={val[props.usecase_col].value}
                description={val[props.description_col].value}
              >
              </UseCase>)
          )
        }
    </Box>
    </Box>
  )
};


