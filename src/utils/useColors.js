import * as d3 from "d3-scale-chromatic";

export default function useColors() {

    const colorRangeInfo = {
        colorStart: 0,
        colorEnd: 1,
        useEndAsStart: true,
    };
    
    const colorScale = d3.interpolateInferno;

    function calculatePoint(i, intervalSize) {
        var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
        return useEndAsStart
          ? colorEnd - i * intervalSize
          : colorStart + i * intervalSize;
      }

    function interpolateColors(dataLength) {
        var { colorStart, colorEnd } = colorRangeInfo;
        var colorRange = colorEnd - colorStart;
        var intervalSize = colorRange / dataLength;
        var i, colorPoint;
        var colorArray = [];
  
        for (i = 0; i < dataLength; i++) {
          colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
          colorArray.push(colorScale(colorPoint));
        }
  
        return colorArray;
      }

    return {interpolateColors}
}