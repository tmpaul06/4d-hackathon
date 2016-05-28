var T = 0;
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

  var canvas = document.getElementById("myCanvas");
  var lineCanvas = document.getElementById("trace");
  var lineCtx = lineCanvas.getContext("2d");
  var R = 10;
  var tracing = false;
  var playerBBOX = {
    x: 48,
    y: 280,
    w: 48,
    h: 48
  };
  var prevCoords = {
    x: playerBBOX.x + playerBBOX.w / 2,
    y: playerBBOX.y + playerBBOX.h / 2
  };
  var homeX = canvas.width * 0.7;
  var homeY = canvas.height * 0.85;
  var centerPlanet = {
    x: canvas.width / 2 - 25,
    y: canvas.height / 2 - 25,
    xc: canvas.width / 2,
    yc: canvas.height / 2,
    r: 25
  };
  // Physics variables
  var f = {
    x: 0,
    y: 0
  };

  var maxSteps = 2000;

  var simId;

  var v = {
    x: 0,
    y: -3
  };

  function init() {
    playerBBOX.x = 48;
    playerBBOX.y = 280;
    v.x = 0, v.y = -3;
    f.x = 0, f.y = 0;
    prevCoords.x = playerBBOX.x + playerBBOX.w / 2;
    prevCoords.y = playerBBOX.y + playerBBOX.h / 2;
  }

  var reqAnimFrame = window.requestAnimationFrame;
  var cancelAnimFrame = window.cancelAnimationFrame;

  var mass = 40;
  var centerPlanetMass = 100;

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
    /* var minX = playerBBOX.x;
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
    }*/
  }

  var pathGradient = [];

  function randomInt(a, b) {
    return Math.floor(Math.random() * (b - a)) + a;
  }


  function setupPlayer(img, x, y) {
    ctx.drawImage(img, x, y);
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
    var dt = tracing ? 4 : 0.5;
    var G=1e-3;

    var playerx = playerBBOX.x + (playerBBOX.w)/2;
    var playery=playerBBOX.y + (playerBBOX.h)/2;
    if (tracing) {
      playerx = prevCoords.x;
      playery = prevCoords.y;
    }

    var p = playerBBOX, c = centerPlanet;
    var Mp = mass, Mb = centerPlanetMass;
    var r=Math.sqrt((playerx - canvas.width/2)*(playerx-canvas.width/2) + (playery-canvas.height/2)*(playery-canvas.height/2));
    var F=((G*Mp*Mb/r*r));
    var Gx=-F*(playerx-canvas.width / 2) / r;
    var Gy=F*-(playery - canvas.height / 2) / r;
    // If player is near the edges of the world, apply high negative thrust.
    // If player is somewhere in the middle, apply small to no thrust
    var thrustX = T * (playerx - canvas.width / 2) * 1e-3,
      thrustY = T * (playery - canvas.height / 2) * 1e-3;
    f.x = Gx - thrustX;
    f.y = Gy - thrustY;
    v.x += 0.4 * f.x / mass * dt;
    v.y += 0.4 * f.y / mass * dt;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!tracing) {
      playerBBOX.x = playerBBOX.x + v.x * dt;
      playerBBOX.y = playerBBOX.y + v.y * dt;
      // Update position and bounding box
    } else {
      drawOrbit(prevCoords.x + v.x * dt, prevCoords.y + v.y * dt);
    }
    drawPlanet(c.xc, c.yc, c.r);
    // Background planets
    for (var i = 0; i < 5; i++) {
      drawPlanet(randomCoords[i].x, randomCoords[i].y, randomCoords[i].r,
       randomCoords[i].color, randomCoords[i].dotColor, elapsed);
    }
    // Home planet
    drawPlanet(homeX, homeY,30, "#6780A8", "#A49355");
    drawTimer();
    collisionHandling();
    collisionHandlingBlackHole();
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

  var resetTime = 0;

  function startSimulation(elapsed) {
    resetTime += 1;
    if (resetTime > (maxSteps)) {
      return;
    }
    requestAnimationFrame(startSimulation);
    tick(elapsed);
  }


  function drawOrbit(x, y) {
    if (tracing) {
      var ctx = lineCtx;
      ctx.lineWidth  = 1;
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = "#FFFFFF";
      ctx.moveTo(prevCoords.x, prevCoords.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      prevCoords.x = x;
      prevCoords.y = y;
    }
  }


  function drawPlanet(x, y, r, bgStyle, dotStyle, elapsed) {
    elapsed = elapsed || 0;
    ctx.beginPath();
    ctx.fillStyle = bgStyle || "#D58229";
    x += 2 * Math.cos(elapsed / 400);
    y += 7 * Math.sin(elapsed / 800);
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = dotStyle || "#F9AC49";
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
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 10;
    var lineCanvas = document.getElementById("trace");
    lineCanvas.width = canvas.width;
    lineCanvas.height = canvas.height;
    setupGame();
  };

  function setTraceMode(value) {
    tracing = true;
    maxSteps = 200;
    var thrustValue = document.getElementById("thrustRange");
    var maxStepsInput = document.getElementById("maxSteps");
    thrustValue.style.display = "block";
    maxStepsInput.style.display = "block";
  }

  function setMaxSteps() {
    var value = parseInt(document.getElementById("maxSteps").value);
    maxSteps = value;
    if (maxSteps < resetTime) {
      resetTime = 0;
    }
    startSimulation();
  }



function setThrust() {
 var thrustValue = document.getElementById("thrust");
 T = parseFloat(thrustValue.value);
 bob = document.getElementById("bob");
 resetTime = 0;
 init();
 if (tracing) {
  lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
  lineCanvas.width = lineCanvas.width + 0;
 }
 startSimulation();
}

function recomputeThrust() {
  var thrustValue = document.getElementById("thrustRange");
  T = parseFloat(thrustValue.value);
  bob = document.getElementById("bob");
  var thrustLabel = document.getElementById("thrustLabel");
  thrustLabel.innerHTML = T;
  resetTime = 0;
  init();
  lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
  lineCanvas.width = lineCanvas.width + 0;
 startSimulation();
}


function drawTimer() 
{
ctx.fillStyle = "#FFFFFF";
ctx.font="15px Arial";
ctx.fillText(resetTime, canvas.width-100, 100);
}

function collisionHandling()
{
	var x1=playerBBOX.x;
	var y1=playerBBOX.y;
	var x2= homeX - 30;
	var y2= homeY - 30;
	var h1= playerBBOX.h;
	var w1= playerBBOX.w;
	var h2 = 60;
	var w2 = 60;
        var cx1 = playerBBOX.x + playerBBOX.w / 2;
        var cy1 = playerBBOX.y + playerBBOX.h / 2;
        var cx2 = x2 + 30;
        var cy2 = y2 + 30;
        var r = Math.sqrt((cx1 - cx2) * (cx1 - cx2) + (cy1 - cy2) * (cy1 - cy2));
        if (r < (playerBBOX.w / 2 + 30)) {
		ctx.fillText("successfully reached Home", 150,150);
	
		resetTime = 7000;
        }
}
function collisionHandlingBlackHole()
{
	var cx1 = playerBBOX.x + playerBBOX.w / 2;
        var cy1 = playerBBOX.y + playerBBOX.h / 2;
        var cx2 = canvas.width / 2;
        var cy2 = canvas.height / 2;
        var r = Math.sqrt((cx1 - cx2) * (cx1 - cx2) + (cy1 - cy2) * (cy1 - cy2));
        if (r < (playerBBOX.w / 2 + 25)) {
		ctx.fillText("Killed", 150,150);
	
		resetTime = 7000;
        }
}



