import Tile from './Tile'
import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import { Box } from '@looker/components';

looker.plugins.visualizations.add({
  options: {
    color_list: {
      type: "object_list",
      label: 'Tile Color',
      section: 'Colors',
      newItem: {
        color: '#F0000D',
        value: '',
        show_label: true
      },
      options: {
        value: {
          label: 'Value',
          type: 'string',
          default: '',
          placeholder: 'A value in the first column, to change the top color of the tiles',
        },
        color: {
          type: 'string',
          display: 'color',
          label: 'Color'
        }
      }
    },
    button_list: {
      type: "object_list",
      label: 'Button',
      section: 'Buttons',
      newItem: {
        value: '',
        icon: 'Public'
      },
      options: {
        value: {
          label: 'Button Name',
          type: 'string',
          default: '',
          placeholder: 'The display name for the buttons'
        },
        is_looker:{
          label: 'Are these Looker links?',
          type: 'string',
          default: 'no',
          display: 'select',
          values: [{'Yes': 'yes'}, {'No': 'no'}]
        },
        icon: {
          label: 'Icon Name',
          type: 'string',
          default: 'Public',
          placeholder: 'The name of icon for the button, from Looker Components',
          display: 'select',
          values: [{'Dashboard': 'Dashboard'},
          {'Public': 'Public'},
          {'Account': 'Account'},
          {'ChartBar': 'ChartBar'},
          {'Code': 'Code'},
          {'GitBranch': 'GitBranch'},
          {'Notes': 'Notes'}
        ],
          order: 1
        }
      }
    }
  },

  // Set up the initial state of the visualizationval[props.vertical_col].value
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


    if (config.button_list){
      if(config.button_list.length > queryResponse.fields.dimensions.length - 3){
        this.addError({title: "Not Enough Fields", message: "You have more buttons than button fields - remove a button or add another dimension"});
        return
      }
      else {
        var buttons = config.button_list.map(function(button, i) {
          return {'column': queryResponse.fields.dimensions[3+i].name, 'name':  button.value, 'icon': button.icon};
        });
      }
    }

    // update the state with our new data
    this.chart = ReactDOM.render(
        <TileGroup
          data={data} 
          tag_col={queryResponse.fields.dimensions[0].name}
          name_col={queryResponse.fields.dimensions.length>1 ? queryResponse.fields.dimensions[1].name : null}
          description_col={queryResponse.fields.dimensions.length>2 ? queryResponse.fields.dimensions[2].name : null}
          buttons = {buttons ? buttons : null}
          colorList={config.color_list}
         />,
      this._vis_element
    );

    done()
  }
});


export function TileGroup(props) {
  return (
    <Box display={'flex'} flexWrap={"wrap"}>
      {
          props.data.map((val, i) => 
            <Tile 
              key={i}
              tag={val[props.tag_col].value}
              name={props.name_col ? val[props.name_col].value: null}
              description={props.description_col ? val[props.description_col].value : null}
              colorList={props.colorList}
              buttons={props.buttons ? props.buttons.map(function(button,i){
                return {'name': button.name, 'link': val[button.column].value, 'icon': button.icon}}) : null}
            />
          )
        }
    </Box>
  )
};




