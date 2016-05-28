(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function() {

  var canvas = document.getElementById("myCanvas");
  var R = 10;
  var playerBBOX = {
    x: 100,
    y: 200,
    w: R * 2,
    h: R * 2
  };
  // Physics variables
  var f = {
    x: 0,
    y: 3
  };

  var simId;

  var v = {
    x: 0,
    y: 0
  };

  var reqAnimFrame = window.requestAnimationFrame;
  var cancelAnimFrame = window.cancelAnimationFrame;

  var mass = 40;

  var ctx = canvas.getContext("2d");
  function log() {
    var obj = {
      start: function(message) {
        obj.message = message;
        obj.startTime = Date.now();
      },
      end: function() {
        console.log("Game:", obj.message, "[" + (Date.now() - obj.startTime) + " ms]");
      }
    };
    return obj;
  }

  function handleWallCollision(restitution) {
    var minX = playerBBOX.x;
    var maxX = playerBBOX.x + playerBBOX.w;
    var minY = playerBBOX.y;
    var maxY = playerBBOX.y + playerBBOX.h;
    if (maxX > canvas.width) {
      playerBBOX.x = 0;
    }
    if (minX < 0) {
      playerBBOX.x = canvas.width - playerBBOX.w;
    }
    if (minY < 0) {
      playerBBOX.y = canvas.height - playerBBOX.h;
    }
    if (maxY > canvas.height) {
      playerBBOX.y = 0;
    }
  }

  var pathGradient = [];

  function randomInt(a, b) {
    return Math.floor(Math.random() * (b - a)) + a;
  }

  function setupWorld() {
    var ctx = document.getElementById("tmpCanvas").getContext("2d");
    var imageElem = document.getElementById("world");
    ctx.drawImage(imageElem, 0, 0, canvas.width, canvas.height);
    var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    image = Filters.grayscale(image);
    // imageData = Filters.threshold(imageData, 128);
    // Note that ImageData values are clamped between 0 and 255, so we need
    // to use a Float32Array for the gradient values because they
    // range between -255 and 255.
    var vertical = Filters.convoluteFloat32(image,
      [ -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1 ]);
    var horizontal = Filters.convoluteFloat32(image,
      [ -1, -2, -1,
         0,  0,  0,
         1,  2,  1 ]);
    var final_image = Filters.createImageData(vertical.width, vertical.height);
    for (var i=0; i<final_image.data.length; i+=4) {
      // make the vertical gradient red
      var v = Math.abs(vertical.data[i]);
      final_image.data[i] = 255 - (v + h);
      // make the horizontal gradient green
      var h = Math.abs(horizontal.data[i]);
      final_image.data[i+1] = 255 - (v + h);
      // and mix in some blue for aesthetics
      final_image.data[i+2] = 255 - (v + h);
      final_image.data[i+3] = 255; // opaque alpha 
    }
    final_image = Filters.threshold(final_image, 200);
    ctx.putImageData(final_image, 0, 0);
    
    // Use a grid with pre-determined resolution to identify,
    // 
  }

  function setupPlayer(img, x, y) {
    // Player is represented by a simple circle
    ctx.drawImage(img, x, y);
    // ctx.beginPath();
    // ctx.fillStyle = "orange";
    // ctx.arc(x + R, y + R, R, 0, Math.PI * 2);
    // ctx.stroke();
    // ctx.fill();
  }

  function slabContainsPixel(indices, dataMatrix) {
    var result = false;
    for(var i = 0, len = indices.length; i < len; i++) {
      if (dataMatrix[indices[i].index] !== 0) {
        result = true;
        break;
      }
    }
    return result;
  }

  function getIndex(x, y, width) {
    return x * width + y;
  }

  function getIndices(xRange, yRange, width) {
    var indices = [];
    for (var i = xRange[0]; i < xRange[1]; i++) {
      for (var j = yRange[0]; j < yRange[1]; j++) {
        indices.push({
          index: getIndex(j, i, width) + 3,
          x: j,
          y: i
        });
      }
    }
    return indices;
  }

  var bob;

  var GSobelX = [
    [ -1, 0, 1 ],
    [ -2 , 0, 2 ],
    [ -1, 0, 1 ]
  ];
  var GSobelY = [
    [ -1, -2, -1 ],
    [ 0, 0, 0 ],
    [ 1, 2, 1 ]
  ];

  function findPixelSets(data, indices, w, resolution) {
    function intensity(index) {
      return data[index] || 0;
    }
    // Run over the data with the set of provided indices.
    // Find the closest set of pixels to the given boundary.
    // For these pixels, compute the gradient using Sobel
    // operator, and return the average gradient
    
    var averageGx = 0, averageGy = 0, numX = 0, numY = 0;
    for (var i = 0, len = indices.length; i < len; i+= 1) {
      if (data[indices[i].index] !== 0) {
        // Intensity is 1
        var x = indices[i].x, y = indices[i].y;
        // Construct 8 point image intensities
        var intensities = [
          [ intensity(getIndex(x - 1, y - 1, w)), intensity(getIndex(x, y - 1, w)), intensity(getIndex(x + 1, y - 1, w)) ],
          [ intensity(getIndex(x - 1, y , w)), intensity(getIndex(x, y, w)), intensity(getIndex(x + 1, y, w)) ],
          [ intensity(getIndex(x - 1, y + 1, w)), intensity(getIndex(x, y + 1, w)), intensity(getIndex(x + 1, y + 1, w)) ],
        ];
        // Multiply by respective operators to get Gx, Gy
        var Gx = 0, Gy = 0;
        for(var p = 0; p < 2; p++) {
          for(var q = 0; q < 2; q++) {
            Gx += GSobelX[p][q] * intensities[p][q];
            Gy += GSobelY[p][q] * intensities[p][q];
          }
        }
        averageGx += Gx;
        averageGy += Gy;
        numX++;
        numY++;
      }
    }
    averageGx = averageGx / numX;
    averageGy = averageGy / numY;
    return [ averageGx, averageGy ];
  }

  function handleWorldCollision() {
    // Use a slice of bounding box around player to detect
    // if a foreign pixel is present.
    
    // First use a hit box test. The hit box for the world is a rectangular
    // slab around the player model
    var slabWidth = 2;
    var world = ctx.getImageData(playerBBOX.x - slabWidth,
      playerBBOX.y - slabWidth,
      playerBBOX.w + 2 * slabWidth,
      playerBBOX.h + 2 * slabWidth);

    var worldData = world.data;

    // Get all pixels excluding the player box itself.
    var len = worldData.length;
    var w = playerBBOX.w + 2 * slabWidth;
    // Get the indices for each of the four slabs
    // South face
    var southIndices = getIndices([ 0, w ],
      [ playerBBOX.h + slabWidth, playerBBOX.h + 2 * slabWidth ], 4 * w);
    var result = slabContainsPixel(southIndices, worldData);

    // West face
    // var result = result || slabContainsPixel(getIndices([ 0, slabWidth ],
    //   [ slabWidth, playerBBOX.h + slabWidth ], 4 * w), worldData);

    if (result === true) {
      f.x = 0;
      f.y =0;
      v.x = 0;
      v.y = 0;
    }
  }

  function paintBackground() {
    var tmpCtx = document.getElementById("tmpCanvas").getContext("2d");
    ctx.putImageData(tmpCtx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
  }


  function tick(elapsed) {
    elapsed = elapsed || 0;
    var dt = 0.5;
    f.x = 3 * Math.sin(elapsed * 2 * 22 / (7 * 5000));
    f.y = 3 * Math.cos(elapsed * 2 * 22 / (7 * 3000));
    v.x += f.x / mass * dt;
    v.y += f.y / mass * dt;
    playerBBOX.x = playerBBOX.x + v.x * dt;
    playerBBOX.y = playerBBOX.y + v.y * dt;
    // Update position and bounding box
    handleWallCollision(0.95);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlanet(canvas.width / 2, canvas.height / 2, 25);
    // Background planets
    for (var i = 0; i < 5; i++) {
      drawPlanet(randomCoords[i].x, randomCoords[i].y, randomCoords[i].r,
       randomCoords[i].color, randomCoords[i].dotColor, elapsed);
    }
    drawOrbit();
    setupPlayer(bob, playerBBOX.x, playerBBOX.y);
  }

  var randomCoords = [];

  var colors = [ "#D4C4B6", "#549A76", "#A49355" ];
  var dotColors= colors.concat([ "#6780A8", "#F1BA46" ]);
  for(var i = 0; i < 5; i++) {
    randomCoords.push({
      x: randomInt(0, canvas.width),
      y: randomInt(0, canvas.height),
      r:randomInt(13, 18),
      color: colors[i % 3],
      dotColor: dotColors[(12 - i) % 5]
    });
  }

  function startSimulation(elapsed) {
    requestAnimationFrame(startSimulation);
    tick(elapsed);
  }

  function drawOrbit() {
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();
    ctx.closePath();
  }

  function drawPlanet(x, y, r, bgStyle, dotStyle, elapsed) {
    elapsed = elapsed || 0;
    ctx.beginPath();
    ctx.fillStyle = bgStyle || "#F9AC49";
    x += 2 * Math.cos(elapsed / 400);
    y += 7 * Math.sin(elapsed / 800);
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = dotStyle || "#D58229";
    ctx.beginPath();
    ctx.arc(x - 5, y + 5, r / 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 3, y - 5, r / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 7, y - 8, r / 4, 0, Math.PI * 2 / 4);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 9, y - 9, r / 5, 0, Math.PI * 2 / 3);
    ctx.fill();
    ctx.arc(x, y + 9, r / 6, 0, Math.PI * 3 / 4);
    ctx.fill();
    ctx.closePath();
    // var my_gradient=ctx.createLinearGradient(100, 0, 100, 600);
    //
    // my_gradient.addColorStop(0, "#3d2131");
    // my_gradient.addColorStop(0.5, "#583A5A");
    // my_gradient.addColorStop(1, "#330A2A");
    // ctx.fillStyle = my_gradient;
    // ctx.drawImage(planet, 100, 100, 64, 64);
  }

  // var planet = document.getElementById("planet");


  function setupGame() {
    bob = document.getElementById("bob");
    startSimulation();
  }

  window.onload = function() {
    setupGame();
  };

})();