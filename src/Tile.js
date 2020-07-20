import React, { useEffect } from 'react'
import { Paragraph, Heading, Box, ButtonOutline, ComponentsProvider } from '@looker/components';
import styled, { ThemeProvider } from 'styled-components'
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Open Sans']
  }
});

const InnerBox = styled(Box)`
    box-shadow: 4px 5px 2px #ECECEC;
    border-left: 1px solid #ECECEC;`

const ButtonBox =  styled(Box)`
    vertical-align: bottom;`

const MyButtonOutline =  styled(ButtonOutline)`
    target: _blank;`

// Create (or import) our react component
export default function Tile (props) {
  var [color, setColor] = React.useState("#ECECEC");
  var [buttons, setButtons] = React.useState([]);
  // var [detailLink, setLink] = React.useState(null);
  // var [buttonTitles,setTitles] = React.useState(['Go to Dashboards','See Demo Details']);


  useEffect(() => {
    if (props.colorList) {
      var current_color = props.colorList.filter(function (el) {
        return el.value == props.tag });
      if(current_color.length>0){
        setColor(current_color[0].color)
      }
    }
    else {
      setColor("#ECECEC")
    }
  }, [props.colorList]);

  useEffect(() => {
    if (props.buttons) {
      setButtons(props.buttons);
    }
    else{
      setButtons([]);
    }
  }, [props.buttons]);

  function handleClick(e, link){
    LookerCharts.Utils.openUrl(link, event, false, {linkType: 'url'})
    //LookerCharts.Utils.openDrillMenu({event, links: [{ label: 'hi', type: 'url', url: 'https://google.com' }]})
  }

  console.log(props.buttons)
  return(
      <InnerBox
        paddingLeft={"20px"}
        minWidth={"500px"}
        width={"25%"}
        margin={"10px"}
        borderTop = {"5px solid " + color}
        position={"relative"}
        height={"auto"}
      >
      <Paragraph fontSize={'small'} fontFamily={'Open Sans'} marginTop={"10px"}>{props.tag}</Paragraph>
      <Box marginTop={"30px"} marginBottom={"100px"} >
          <Heading fontSize={"large"} fontFamily={'Open Sans'} fontWeight={'bold'}>{props.name}</Heading>
          <Paragraph fontFamily={'Open Sans'} marginRight={"10px"} marginBottom={"20px"}>{props.description}</Paragraph>
      </Box>
      <Box position={"absolute"} bottom={0}>
        <ComponentsProvider>
          {
            buttons.map((button, i) => 
              button.link ?
              <ButtonOutline key={i} color="neutral" size="small" iconBefore={button.icon} marginRight={"10px"} marginBottom={"10px"} onClick={(e) => handleClick(e,button.link)}>
                {button.name}
              </ButtonOutline>
              :
              <></>
            )
          }   
        </ComponentsProvider>
      </Box>
      </InnerBox>
  )
}