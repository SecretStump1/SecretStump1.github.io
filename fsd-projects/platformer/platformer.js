$(function () {
  // initialize canvas and context when able to
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  window.addEventListener("load", loadJson);

  function setup() {
    if (firstTimeSetup) {
      halleImage = document.getElementById("player");
      projectileImage = document.getElementById("projectile");
      cannonImage = document.getElementById("cannon");
      $(document).on("keydown", handleKeyDown);
      $(document).on("keyup", handleKeyUp);
      firstTimeSetup = false;
      //start game
      setInterval(main, 1000 / frameRate);
    }

    // Create walls - do not delete or modify this code
    createPlatform(-50, -50, canvas.width + 100, 50); // top wall
    createPlatform(-50, canvas.height - 10, canvas.width + 100, 200, "navy"); // bottom wall
    createPlatform(-50, -50, 50, canvas.height + 500); // left wall
    createPlatform(canvas.width, -50, 50, canvas.height + 100); // right wall

    //////////////////////////////////
    // ONLY CHANGE BELOW THIS POINT //
    //////////////////////////////////

    // TODO 1 - Enable the Grid
    toggleGrid(true);


    // TODO 2 - Create Platforms
createPlatform(300, 620, 200, 10, "purple" );
createPlatform(600, 520, 200, 10, "purple");
createPlatform(900, 420, 200, 10, "purple");
createPlatform(500, 620, 10, 120);
createPlatform(800, 520, 10, 220);


    // TODO 3 - Create Collectables
createCollectable("diamond", 1000, 380);
createCollectable("diamond", 750, 700);
createCollectable("diamond", 450, 700);
    
    // TODO 4 - Create Cannons
createCannon("bottom", 200, 800, 50, 50);
createCannon("top", 600, 800, 50, 50);
createCannon("right", 350, 800, 50, 50);

    
    
    //////////////////////////////////
    // ONLY CHANGE ABOVE THIS POINT //
    //////////////////////////////////
  }

  registerSetup(setup);
});
