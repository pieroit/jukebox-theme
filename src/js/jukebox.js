$(document).ready(function() {

    // Disable page bouncing
    $(document).bind(
            'touchmove',
            function(e) {
                e.preventDefault();
            }
    );

    // Buold wheel and rotation controls
    function buildWheel(selector) {
        
        
        console.log(data);
        // Clear div contents
        $(selector).empty();
        
        // Expand svg to parent size
        $(selector).width('100%').height('100%');

        // Get size in pixel
        var width = $(selector).width();
        var height = $(selector).height();

        // Other params
        var scalingFactor = 0.5;
        var innerRadius = width * scalingFactor / 2;
        var outerRadius = width * scalingFactor;
        var interval = 0.05;
        var sectorAngle = Math.PI * 2 / data.length;
        var rotation = 0;
        var rotationStep = 10;

        var wheel = d3.select(selector);

        // Build arc
        var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)
                .startAngle(function(d, i) {
                    return sectorAngle * i;
                })
                .endAngle(function(d, i) {
                    return (sectorAngle * (i + 1)) - interval;
                });

        // Create grouping element and move it to the center
        var center = wheel.append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        // Add arc + label groups
        center.selectAll()
                .data(data)
                .enter()
                .append('g');

        // Add arcs
        center.selectAll('g')
                .append('path')
                .attr('d', arc)
                .attr('class', 'sector-button')
                .style('fill', function() {
                    return "hsl(" + Math.random() * 360 + ",100%,50%)";
                });

        // Add labels
        center.selectAll('g')
                .append('text')
                .attr('class', 'sector-text')
                .attr('transform', function(d, i) {
                    info = getLabelsXYAngle(i);
                    return 'rotate(' + info.angle + ',' + info.cx + ',' + info.cy + ')';
                })
                .attr('x', function(d, i) {
                    return getLabelsXYAngle(i).cx;
                })
                .attr('dy', function(d, i) {
                    return getLabelsXYAngle(i).cy;
                })
                .html(function(d) {
                    return d;
                });

        // Add triangle to indicate current selection
        wheel.append('polygon')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
                .attr('points', function() {
                    var width = innerRadius / 2;
                    var height = innerRadius * 1.2;
                    return -width / 2 + ',' + '0 0' + -height + ', ' + width / 2 + ',0';
                })
                .style('fill', 'gray');

        // Add OK button
        wheel.append('circle')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
                .attr('r', innerRadius * 0.7)
                .style('fill', 'gray')
                .attr('id', 'ok-button');

        // Add OK text
        wheel.append('text')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
                .attr('id', 'ok-button-text')
                .attr('x', -10)
                .attr('dy', 0)
                .html(function(d) {
                    return 'Ok';
                });

        // Init touch controls
        var wheelTouch = Hammer($(selector)[0]);
        wheelTouch.get('pan')
                .set({direction: Hammer.DIRECTION_ALL});
        
        // Tap and Rotation controls
        wheelTouch.on('tap', function(el) {
            console.log(data);
            selectedValue = d3.select(el.target).data()[0];

            if (selectedValue !== undefined) {
                // Tap on sector
                updateInput(selectedValue);
            } else {
                // Tap on center
                elementId = $(el.target).attr('id');
                if (elementId.indexOf('ok-button') > -1) {
                    // Which input was chosen?
                    var selectedIndex = getSectorIndexFromRotation(rotation, data.length);
                    updateInput(data[selectedIndex]);
                }
            }
        })
        .on('pan swipe', function(e) {
            // Average velocities
            var velocity = 0.5 * (Math.abs(e.velocityX) + Math.abs(e.velocityY));

            // Change sign to velocity if rotation is counter-clockwise
            var quadrant = getEventQuadrant(selector, e);
            velocity = velocity * rotationSignRespectingQuadrantAndMovement(quadrant, e.velocityX, e.velocityY);

            // Trigger events (only meaningful ones)
            //console.log(Math.abs(rotation)%sectorAngle);
            if( thereWasASectorSwitch(rotation, rotationStep*velocity, data.length)){
                if(velocity < 0) {
                    $(document).trigger('rotateAntiClockwise');
                } else {
                    $(document).trigger('rotateClockwise');
                }
            }
            
            // Update rotation
            rotation += rotationStep * velocity;            
            
            // Rotate wheel
            center.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ') rotate(' + rotation + ')');
        });

        // Utility function to create labels
        function getLabelsXYAngle(i) {
            var labelXYA = {};

            // Label rotation angle
            var angle = (sectorAngle * i) + (Math.PI / data.length);
            labelXYA.angle = (angle * 360) / (Math.PI * 2);

            // Label coordinates
            var startAngle = Math.PI / 2;
            var radius = (innerRadius + outerRadius) / 2
            labelXYA.cx = radius * Math.cos(-startAngle + (sectorAngle / 3) + (sectorAngle * i));
            labelXYA.cy = radius * Math.sin(-startAngle + (sectorAngle / 3) + (sectorAngle * i));

            return labelXYA;
        }

        function updateInput(value) {
            $(document).trigger('centerWheelPress', value);
        }
    }

    // Returns in which quadrant of an elemnent there was an event (event is in absolute coordinates)
    function getEventQuadrant(selector, e) {
        var x = e.center.x;
        var y = e.center.y;
        var svgCenter = {
            x: $(selector).offset().left + ($(selector).width() / 2),
            y: $(selector).offset().top + ($(selector).width() / 2)   // It's a square!
        };

        if (x > svgCenter.x && y < svgCenter.y)
            return 1;
        if (x > svgCenter.x && y > svgCenter.y)
            return 2;
        if (x < svgCenter.x && y > svgCenter.y)
            return 3;
        if (x < svgCenter.x && y < svgCenter.y)
            return 4;
    }

    // Decide direction of rotation by observing quadrant and velocities of swipe.
    // Could have be written in much less code, but then it would be mad-gerogliphic style
    function rotationSignRespectingQuadrantAndMovement(quadrant, vX, vY) {
        if (quadrant === 1) {
            if (Math.abs(vX) > Math.abs(vY)) {
                return -sign(vX);
            } else {
                return -sign(vY);
            }
        }
        if (quadrant === 2) {
            if (Math.abs(vX) > Math.abs(vY)) {
                return sign(vX);
            } else {
                return -sign(vY);
            }
        }
        if (quadrant === 3) {
            if (Math.abs(vX) > Math.abs(vY)) {
                return sign(vX);
            } else {
                return sign(vY);
            }
        }
        if (quadrant === 4) {
            if (Math.abs(vX) > Math.abs(vY)) {
                return -sign(vX);
            } else {
                return sign(vY);
            }
        }

        // Exceptions solved
        return 1;
    }
    
    // Deduce if pointed sector changed based on rotation of wheel and its derivative
    function thereWasASectorSwitch(rotation, delta, nSectors){
        var indexBefore = getSectorIndexFromRotation(rotation, nSectors);
        var indexNow = getSectorIndexFromRotation(rotation+delta, nSectors);
        
        if(indexBefore !== indexNow){
            return true;
        }
        return false;
    }
    
    // Deduce index of sector from rotation
    function getSectorIndexFromRotation(rotation, nSectors){
        var actualRotation = rotation % 360;
        if (actualRotation > 0) {
            actualRotation = Math.abs(360 - actualRotation);
        } else {
            actualRotation = Math.abs(actualRotation);
        }
        var selectedIndex = (actualRotation * nSectors) / 360;
        return Math.floor(selectedIndex);
    }

    function sign(x) {
        if (x >= 0)
            return 1;
        return -1;
    }
    
    // Execution starts here
    var interests = ['biking', 'nature', 'eating', 'climbing', 'snowing', 'dancing'];
    var dates = [];
    for(var i=0; i<20; i++){
        dates.push('');
    }
    
    // Build initial wheel
    var data = dates;
    var date = new Date();
    $('#date-from-input').val( date.getDate() );
    $('#date-to-input').val( date.getDate() + 3 );
    var decidedFromDate = false;
    var decidedToDate = false;
    buildWheel('#wheel');
    
    // Tab switching events
    Hammer( $('#select-interest-tab')[0] ).on('tap', function(){
        data = interests;
        buildWheel('#wheel');
    });
    Hammer( $('#select-date-tab')[0] ).on('tap', function(){
        data = dates;
        buildWheel('#wheel');
    });
        
    Hammer( $('#date-from-input')[0] ).on('tap', function(){
        decidedFromDate = false;
        decidedToDate = false;
    });
    
    // Events fired by the wheel
    $(document).on('rotateAntiClockwise', function(){
        if(!decidedFromDate){
            var fromDate = parseInt( $('#date-from-input').val(), 10);
            $('#date-from-input').val( fromDate - 1 );
        } else if(!decidedToDate) {
            var toDate = parseInt( $('#date-to-input').val(), 10);
            $('#date-to-input').val( toDate - 1 );
        }
    });
    $(document).on('rotateClockwise', function(){
        if( !decidedFromDate){
            var fromDate = parseInt( $('#date-from-input').val(), 10);
            $('#date-from-input').val( fromDate + 1 );
        } else if(!decidedToDate) {
            var toDate = parseInt( $('#date-to-input').val(), 10);
            $('#date-to-input').val( toDate + 1 );
        }
    });
    $(document).on('centerWheelPress', function(e, value){
        if( !decidedFromDate ) {
            decidedFromDate = true;
        }
        else if( !decidedToDate ){
            decidedToDate = true;
            data = interests;
            buildWheel('#wheel');
            $('a[href="#select-interest"]').tab('show');
        } else {
            var chosenInterests = $('#interest-input').val() + ', ' + value;
            console.log(chosenInterests);
            $('#interest-input').val(chosenInterests);
            $('#select-interest-tab').trigger('tap');
        }
    });
});