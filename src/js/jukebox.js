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
        var rotationStep = 10;

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
            .attr('d', arc)
            .style("fill",function() {
                return "hsl(" + Math.random() * 360 + ",100%,50%)";
            });
    
        wheelTouch = Hammer($(selector)[0]);
        
        wheelTouch.get('pan')
            .set({ direction: Hammer.DIRECTION_ALL });
    
        wheelTouch.on('pan swipe', function(e){
            // Average velocities
            var velocity = 0.5 * (Math.abs(e.velocityX) + Math.abs(e.velocityY));

            // Change sign to velocity if rotation is counter-clockwise
            var quadrant = getEventQuadrant(selector, e);
            velocity = velocity * rotationSignRespectingQuadrantAndMovement(quadrant, e.velocityX, e.velocityY);
            
            // Rotate menu
            rotation += rotationStep * velocity;
            center.attr('transform', 'translate(' + width/2 + ',' + height/2 + ') rotate(' + rotation + ')');
        });
    }
    
    // Returns in which quadrant of an elemnent there was an event (event is in absolute coordinates)
    function getEventQuadrant(selector, e){
        var x = e.center.x;
        var y = e.center.y;
        var svgCenter = {
            x: $(selector).offset().left + ($(selector).width()/2),
            y: $(selector).offset().top + ($(selector).width()/2)   // It's a square!
        };
        
        if( x > svgCenter.x && y < svgCenter.y)
            return 1;
        if( x > svgCenter.x && y > svgCenter.y)
            return 2;
        if( x < svgCenter.x && y > svgCenter.y)
            return 3;
        if( x < svgCenter.x && y < svgCenter.y)
            return 4;
            
    }
    
    // Decide direction of rotation by observing quadrant and velocities of swipe.
    // Could have be written in much less code, but then it would be mad-gerogliphic style
    function rotationSignRespectingQuadrantAndMovement(quadrant, vX, vY) {
        if( quadrant === 1 ){
            if(Math.abs(vX) > Math.abs(vY)){
                return -sign(vX);
            } else {
                return -sign(vY);
            }
        }
        if( quadrant === 2 ){
            if(Math.abs(vX) > Math.abs(vY)){
                return sign(vX);
            } else {
                return -sign(vY);
            }
        }
        if( quadrant === 3 ){
            if(Math.abs(vX) > Math.abs(vY)){
                return sign(vX);
            } else {
                return sign(vY);
            }
        }
        if( quadrant === 4 ){
            if(Math.abs(vX) > Math.abs(vY)){
                return -sign(vX);
            } else {
                return sign(vY);
            }
        }
        
        // Exceptions solved
        return 1;
    }
    
    function sign(x){
        if(x >= 0)
            return 1;
        return -1;
    }
    
    interests = ['biking', 'nature', 'eating', 'climbing', 'snowing', 'dancing'];
    buildWheel('#date-wheel', interests);
});