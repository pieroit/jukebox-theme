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

// Delete duplicate elements in an array
function deleteDuplicates(list){
    var cleanList = [];
    for(var i=0; i<list.length; i++){
        if(cleanList.indexOf(list[i]) === -1){
            cleanList.push(list[i]);
        }
    }
    return cleanList;
}

