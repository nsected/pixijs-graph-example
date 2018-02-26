var width = 1200,
    height = 900;

var scale = 4;
var PIXI = require('pixi.js');
var d3 = require('d3');

var canvas = document.querySelector("#pixiCanvas");
var pixiCanvas = d3.select(canvas);
PIXI.settings.SCALE_MODE = 0;
PIXI.settings.RENDER_OPTIONS.antialias = true;
var renderer = new PIXI.autoDetectRenderer(width, height, {
    backgroundColor: 0xffffff,
    antialias: true,
    roundPixels: true,
    view: pixiCanvas.node() });

window.renderer = renderer;


d3.json("test.json", function(error, data) {
    window.graph = data;
    graphBuild()
});

function graphBuild() {
    document.body.appendChild(renderer.view);
    pixiCanvas.call(d3.zoom().scaleExtent([-scale, 1]).on("zoom", zoom));

    function zoom() {
        var transform = d3.event.transform;
        containerNodes.position.x = transform.x;
        containerNodes.position.y = transform.y;
        containerNodes.scale.set(transform.k, transform.k);

        containerLinks.position.x = transform.x;
        containerLinks.position.y = transform.y;
        containerLinks.scale.set(transform.k, transform.k);

        containerText.position.x = transform.x;
        containerText.position.y = transform.y;
        containerText.scale.set(transform.k, transform.k);
    }

// Create the main stage for your display objects
    var stage = new PIXI.Container();
    var containerNodes = new PIXI.particles.ParticleContainer();
    var containerLinks = new PIXI.particles.ParticleContainer();
    var containerText = new PIXI.particles.ParticleContainer();
// Start animating
    animate();
    function animate() {
        //Render the stage
        renderer.render(stage);
        requestAnimationFrame(animate);
    }

    fullDraw();
    function fullDraw() {
        drawLines();
        drawNodes();
        // drawText();
    }

    function drawLines() {
        var line = new PIXI.Graphics();
        line.lineStyle(2, 0x070006, 0.1);

        window.graph.links.forEach(function(d) {
            line.moveTo(d.source.x*scale, d.source.y*scale);
            line.lineTo(d.target.x*scale, d.target.y*scale);
        });

        var texture = renderer.generateTexture(line,0,1);
        var sprite = new PIXI.Sprite(texture);
        sprite.x = -width*scale;
        sprite.y = -height*scale;
        sprite.cacheAsBitmap = true;
        containerLinks.addChild(sprite);
        stage.addChild(containerLinks);
    }

    function drawNodes() {
        var style = new PIXI.TextStyle({
            fontWeight: 'bold',
            fontSize: 14,
            fill: '#000000',
            stroke: '#ffffff',
            strokeThickness: 6
        });
        var radius = 12;
        var circle = new PIXI.Graphics();
        circle.beginFill(0xe74c3c);
        circle.lineStyle(5, 0xffffff, 0.5);
        window.graph.nodes.forEach(function(d) {
            circle.drawCircle(d.x*scale, d.y*scale, radius);
            // var text = new PIXI.Text(d.url,style);
            // text.resolution = 2;
            // text.x = d.x*scale;
            // text.y = d.y*scale;
            // circle.addChild(text);
        });

        circle.endFill();
        var texture = renderer.generateTexture(circle,0,1);
        var sprite = new PIXI.Sprite(texture);
        sprite.x = -width*scale-radius;
        sprite.y = -height*scale-radius;
        sprite.cacheAsBitmap = true;
        containerNodes.addChild(sprite);
        stage.addChild(containerNodes);
    }

    function drawText() {
        var style = new PIXI.TextStyle({
            fontWeight: 'bold',
            fontSize: 12,
            fill: '#000000',
            stroke: '#ffffff',
            strokeThickness: 3
        });
        var textNode = new PIXI.Graphics();
        window.graph.nodes.forEach(function(d) {
            var text = new PIXI.Text(d.url);
            text.x = d.x*scale;
            text.y = d.y*scale;
            textNode.addChild(text);
        });
        var texture = renderer.generateTexture(textNode,0,1);
        var sprite = new PIXI.Sprite(texture);
        sprite.x = -width*scale;
        sprite.y = -height*scale;
        sprite.cacheAsBitmap = true;
        containerText.addChild(sprite);
        stage.addChild(containerText);
    }
}
