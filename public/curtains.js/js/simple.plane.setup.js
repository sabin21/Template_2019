
window.addEventListener("DOMContentLoaded", function() {
    // track the mouse positions to send it to the shaders
    var mousePosition = {
        x: 0,
        y: 0,
    };
    // we will keep track of the last position in order to calculate the movement strength/delta
    var mouseLastPosition = {
        x: 0,
        y: 0,
    };
    var mouseDelta = 0;

    var webGLCurtain = new Curtains("canvas");

    // handling errors
    webGLCurtain.onError(function() {
        // we will add a class to the document body to display original images
        document.body.classList.add("no-curtains");
    });

    var planeElements = document.getElementsByClassName("curtain");

    var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1.0;

    // some basic parameters
    var params = {
        widthSegments: 30,
        heightSegments: 30,
        uniforms: {
            resolution: { // resolution of our plane
                name: "uResolution",
                type: "2f", // notice this is an length 2 array of floats
                value: [pixelRatio * planeElements[0].clientWidth, pixelRatio * planeElements[0].clientHeight],
            },
            time: { // time uniform that will be updated at each draw call
                name: "uTime",
                type: "1f",
                value: 0,
            },
            mousePosition: { // our mouse position
                name: "uMousePosition",
                type: "2f", // again an array of floats
                value: [mousePosition.x, mousePosition.y],
            },
            mouseMoveStrength: { // the mouse move strength
                name: "uMouseMoveStrength",
                type: "1f",
                value: 0,
            }
        }
    }

    // create our plane
    var simplePlane = webGLCurtain.addPlane(planeElements[0], params);

    // if there has been an error during init, simplePlane will be null
    simplePlane && simplePlane.onReady(function() {
        // set a fov of 35 to exagerate perspective
        simplePlane.setPerspective(35);

        // now that our plane is ready we can listen to mouse move event
        var wrapper = document.getElementById("page-wrap");

        wrapper.addEventListener("mousemove", function(e) {
            handleMovement(e, simplePlane);
        });

        wrapper.addEventListener("touchmove", function(e) {
            handleMovement(e, simplePlane);
        });

        // on resize, update the resolution uniform
        window.addEventListener("resize", function() {
            simplePlane.uniforms.resolution.value = [pixelRatio * planeElements[0].clientWidth, pixelRatio * planeElements[0].clientHeight];
        });

    }).onRender(function() {
        // increment our time uniform
        simplePlane.uniforms.time.value++;

        // send the new mouse move strength value
        simplePlane.uniforms.mouseMoveStrength.value = mouseDelta;
        // decrease the mouse move strenght a bit : if the user doesn't move the mouse, effect will fade away
        mouseDelta = Math.max(0, mouseDelta * 0.995);
    });

    // handle the mouse move event
    function handleMovement(e, plane) {

        if(mousePosition.x != -100000 && mousePosition.y != -100000) {
            // if mouse position is defined, set mouse last position
            mouseLastPosition.x = mousePosition.x;
            mouseLastPosition.y = mousePosition.y;
        }

        // touch event
        if(e.targetTouches) {

            mousePosition.x = e.targetTouches[0].clientX;
            mousePosition.y = e.targetTouches[0].clientY;
        }
        // mouse event
        else {
            mousePosition.x = e.clientX;
            mousePosition.y = e.clientY;
        }

        // convert our mouse/touch position to coordinates relative to the vertices of the plane
        var mouseCoords = plane.mouseToPlaneCoords(mousePosition.x, mousePosition.y);
        // update our mouse position uniform
        plane.uniforms.mousePosition.value = [mouseCoords.x, mouseCoords.y];

        // calculate the mouse move strength
        if(mouseLastPosition.x && mouseLastPosition.y) {
            var delta = Math.sqrt(Math.pow(mousePosition.x - mouseLastPosition.x, 2) + Math.pow(mousePosition.y - mouseLastPosition.y, 2)) / 30;
            delta = Math.min(4, delta);
            // update mouseDelta only if it increased
            if(delta >= mouseDelta) {
                mouseDelta = delta;
                // reset our time uniform
                plane.uniforms.time.value = 0;
            }
        }
    }
});
