$(document).ready( function(){

    function buildWheel( selector, data ) {
        // Expand svg to parent size
        $(selector).width('100%').height('100%');

        // Get size in pixel
        var width = $(selector).width();
        var height = $(selector).height();
        
        // Other params
        var scalingFactor = 0.5;
        var interval = 0.05;
        var sectorAngle = Math.PI*2 / data.length;
        var delta = 1;
        var sumDelta = 0;

        var wheel = d3.select(selector);
        
        var arc = d3.svg.arc()
            .innerRadius(width*scalingFactor/2)
            .outerRadius(width*scalingFactor)
            .startAngle( function(d, i){
                return sectorAngle * i;
            })
            .endAngle( function(d, i){
                return (sectorAngle * (i+1)) - interval;
            });
    
        wheel.selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');
    
        setInterval(function(){
            delta = delta + 1;
            wheel.selectAll('path')
                .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')')
                .attr('transform', 'rotate(' + delta + ')');
                //.attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');
        }, 50);
    }
    
    interests = ['biking', 'nature', 'eating', 'climbing', 'snowing', 'dancing'];
    buildWheel('#date-wheel', interests);
});