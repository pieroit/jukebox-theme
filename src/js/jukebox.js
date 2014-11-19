$(document).ready( function(){
    
    // Disable page bouncing
    $(document).bind(
      'touchmove',
          function(e) {
            e.preventDefault();
          }
    );

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
        var rotation = 0;

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
            
        center = wheel.append('g')
            .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');
            //.attr('transition', 'transform 2s');
    
        center.selectAll()
            .data(data)
            .enter()
            .append('path')
            .attr('d', arc);
    
        Hammer($(selector)[0]).on('panleft panright', function(e){
            
            if(e.deltaX > 0)
                rotation += 10;
            else
                rotation -= 10;
            
            //rotation = rotation % 360;
            console.log(rotation);
            
            center.transition().duration(500).attr('transform', 'translate(' + width/2 + ',' + height/2 + ') rotate(' + rotation + ')');
        });
    }
    
    interests = ['biking', 'nature', 'eating', 'climbing', 'snowing', 'dancing'];
    buildWheel('#date-wheel', interests);
});