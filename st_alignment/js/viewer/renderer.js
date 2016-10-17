'use strict';

(function() {
  
    var self;
    var Renderer = function(context, camera) {
        self = this;
        self.ctx = context;
        self.camera = camera;
        self.bgColor = 'pink';
        self.spotColor = 'hsla(0, 100%, 50%, 0.5)'; // red
        self.selectedSpotColor = 'hsla(120, 100%, 50%, 0.5)'; // green
        self.spotMiddleColor = 'black';
        self.ctx.textAlign = "center";
        self.ctx.font = "bold 48px Courier";
        self.fontColor = 'lightgray';
        self.fontOutlineColor = 'black';
        self.calibrationColor = {
            TL: 'cyan',
            BR: 'orange'
        }
        self.spotSize = 110;
        self.spotCentreSize = 4;
    };
  
    Renderer.prototype = {
        renderText: function(text) {
            self.ctx.fillStyle = self.fontColor;
            self.ctx.strokeStyle = self.fontOutlineColor;
            self.ctx.fillText(text, self.ctx.canvas.width / 2, self.ctx.canvas.height / 2);
            self.ctx.strokeText(text, self.ctx.canvas.width / 2, self.ctx.canvas.height / 2);
        },
        clearCanvas: function() {
            self.ctx.fillStyle = self.bgColor;
            self.ctx.fillRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
        },
        renderStartScreen: function() {
            self.renderText("Upload a Cy3 image to get started.");
        },
        renderLoadingScreen: function() {
            self.ctx.strokeStyle = self.fontOutlineColor;
            self.ctx.fillStyle = self.fontColor;
            self.ctx.fillText("Loading...", self.ctx.canvas.width / 2, self.ctx.canvas.height / 2);
            self.ctx.strokeText("Loading...", self.ctx.canvas.width / 2, self.ctx.canvas.height / 2);
        },
        renderErrorScreen: function() {
            self.ctx.fillStyle = self.fontColor;
            self.ctx.strokeStyle = self.fontOutlineColor;
            self.ctx.fillText("Error! Please select and upload a valid jpeg image.", self.ctx.canvas.width / 2, self.ctx.canvas.height / 2);
            self.ctx.strokeText("Error! Please select and upload a valid jpeg image.", self.ctx.canvas.width / 2, self.ctx.canvas.height / 2);
        },
        renderDetectingScreen: function() {
            self.ctx.fillStyle = self.fontColor;
            self.ctx.strokeStyle = self.fontOutlineColor;
            self.ctx.fillText("Detecting...", self.ctx.canvas.width / 2, self.ctx.canvas.height / 2);
            self.ctx.strokeText("Detecting...", self.ctx.canvas.width / 2, self.ctx.canvas.height / 2);
        },
        renderThumbnail: function(thumbnail) {
            self.camera.begin();
                self.ctx.drawImage(thumbnail, 0, 0, thumbnail.width * 20, thumbnail.height * 20);
            self.camera.end();
        },
        renderImages: function(images) {
            self.camera.begin();
                for(var i = 0; i < images.length; ++i) {
                    self.ctx.drawImage(images[i], images[i].renderPosition.x, images[i].renderPosition.y, images[i].scaledSize.x, images[i].scaledSize.y);
                }
            self.camera.end();
        },
        renderSpots: function(spots) {
            self.camera.begin();
                for(var i = 0; i < spots.length; ++i) {
                    var spot = spots[i];

                    self.ctx.beginPath();
                        if(spot.selected) {
                            self.ctx.fillStyle = self.selectedSpotColor;
                        }
                        else {
                            self.ctx.fillStyle = self.spotColor;
                        }
                        self.ctx.arc(spot.renderPosition.x, spot.renderPosition.y, self.spotSize, 0, Math.PI * 2);
                    self.ctx.closePath();
                    self.ctx.fill();

                    self.ctx.beginPath();
                        self.ctx.fillStyle = self.spotMiddleColor;
                        self.ctx.arc(spot.renderPosition.x, spot.renderPosition.y, self.spotCentreSize, 0, Math.PI * 2);
                    self.ctx.closePath();
                    self.ctx.fill();
                }
            self.camera.end();
        },
        renderSpotToAdd: function(spot) {
            self.camera.begin();
                self.ctx.beginPath();
                    self.ctx.fillStyle = self.selectedSpotColor;
                    self.ctx.arc(spot.renderPosition.x, spot.renderPosition.y, self.spotSize, 0, Math.PI * 2);
                self.ctx.closePath();
                self.ctx.fill();
            self.camera.end();
        },
        renderCalibrationPoints: function(data) {
            self.camera.begin();
                self.ctx.strokeStyle = self.calibrationColor.TL;
                self.ctx.lineWidth = 20.0;
                // TL
                self.ctx.beginPath();
                self.ctx.moveTo(data.TL.x, 0);
                self.ctx.lineTo(data.TL.x, 20000);
                self.ctx.moveTo(0, data.TL.y);
                self.ctx.lineTo(20000, data.TL.y);
                self.ctx.stroke();
                self.ctx.closePath();
                // BR
                self.ctx.strokeStyle = self.calibrationColor.BR;
                self.ctx.beginPath();
                self.ctx.moveTo(data.BR.x, 0);
                self.ctx.lineTo(data.BR.x, 20000);
                self.ctx.moveTo(0, data.BR.y);
                self.ctx.lineTo(20000, data.BR.y);
                self.ctx.stroke();
                self.ctx.closePath();
            self.camera.end();
        },
        renderSpotSelection: function(rectCoords) {
            self.ctx.strokeStyle = "rgba(30, 30, 30, 0.9)";
            self.ctx.setLineDash([4, 3]);
            self.ctx.strokeRect(rectCoords.TL.x, rectCoords.TL.y, rectCoords.WH.x, rectCoords.WH.y);
        }
  };

  this.Renderer = Renderer;
  
}).call(this);