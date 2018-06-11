/* modified version of  https://github.com/robashton/camera */

import math from 'mathjs';

import Codes from './keycodes';
import Vec2 from './vec2';

import { mulVec2 } from '../utils';

const Camera = (function() {

    var self;
    var Camera = function(ctx, layerManager, initialPosition, initialScale) {
        self = this;
        self.context = ctx;
        self.layerManager = layerManager;
        self.position = initialPosition || Vec2.Vec2(0, 0);
        self.scale = initialScale || 0.05;
        self.positionOffset = self.calculateOffset();
        self.viewport = {
            l: 0, r: 0,
            t: 0, b: 0,
            width: 0,
            height: 0,
            scale: Vec2.Vec2(1, 1)
        };
        self.navFactor = 60;
        self.scaleFactor = 0.8;
        self.minScale = 0.03;
        self.maxScale = 1.00;
        self.positionBoundaries = {"minX": 0, "maxX": 20480, "minY": 0, "maxY": 20480};
        self.updateViewport();
    };

    Camera.prototype = {
        begin: function(context = self.context) {
            context.save();
            context.scale(self.scale, self.scale);
            context.translate(-self.viewport.l + self.positionOffset.x, -self.viewport.t + self.positionOffset.y);
        },
        end: function(context = self.context) {
            context.restore();
        },
        getTransform: function() {
            return math.matrix([
                [
                    self.scale,
                    0,
                    self.scale * (-self.position.x + self.positionOffset.x),
                ],
                [
                    0,
                    self.scale,
                    self.scale * (-self.position.y + self.positionOffset.y),
                ],
                [0, 0, 1],
            ]);
        },
        updateViewport: function() {
            self.clampValues();
            self.positionOffset = self.calculateOffset();
            self.aspectRatio = self.context.canvas.width / self.context.canvas.height;
            self.viewport.l = self.position.x - (self.viewport.width / 2.0);
            self.viewport.t = self.position.y - (self.viewport.height / 2.0);
            self.viewport.r = self.viewport.l + self.viewport.width;
            self.viewport.b = self.viewport.t + self.viewport.height;
        },
        zoomTo: function(z) {
            self.scale = z;
            self.updateViewport();
        },
        moveTo: function(pos) {
            self.position = pos;
            self.updateViewport();
        },
        navigate: function(dir, zoomCenter) {
            var canvasCenter = Vec2.Vec2(self.context.canvas.width / 2, self.context.canvas.height / 2);
            var center = zoomCenter || canvasCenter; // the position to which the camera will zoom towards
            var movement = Vec2.subtract(center, canvasCenter); // distance between position and canvas center

            var scaleFactor = 1.0;
            if(dir === Codes.keyEvent.left) {
                movement.x -= self.navFactor;
            }
            else if(dir === Codes.keyEvent.up) {
                movement.y -= self.navFactor;
            }
            else if(dir === Codes.keyEvent.right) {
                movement.x += self.navFactor;
            }
            else if(dir === Codes.keyEvent.down) {
                movement.y += self.navFactor;
            }
            else if(dir === Codes.keyEvent.zin) {
                scaleFactor = 1 / self.scaleFactor; // 1.05
            }
            else if(dir === Codes.keyEvent.zout) {
                scaleFactor = self.scaleFactor; // 0.95
            }

            // scaling it down for slight movement
            movement = Vec2.scale(movement, 1 - (1 / scaleFactor));

            if((scaleFactor > 1.0 && self.scale == self.maxScale) ||
               (scaleFactor < 1.0 && self.scale == self.minScale)) {
                   // if at min/max boundaries and trying to zoom in/out further, then do nothing
            }
            else {
                self.pan(movement);
                self.zoom(scaleFactor);
            }
        },
        pan: function(movement) {
            // takes an object {x, y} and moves the camera with that distance //
            movement = self.mouseToCameraScale(movement, 1 / self.scale);
            self.position = Vec2.add(self.position, movement);
            self.updateViewport();
        },
        zoom: function(scaleFactor) {
            self.scale *= scaleFactor;
            self.updateViewport();
        },
        calculateOffset: function() {
            var canvasMiddle = Vec2.Vec2(self.context.canvas.width / 2, self.context.canvas.height / 2);
            var offset = Vec2.scale(canvasMiddle, 1 / self.scale);
            return offset;
        },
        clampValues: function() {
            // keep the scale and position values within reasonable limits
            self.position = Vec2.clampX(self.position, self.positionBoundaries.minX, self.positionBoundaries.maxX);
            self.position = Vec2.clampY(self.position, self.positionBoundaries.minY, self.positionBoundaries.maxY);
            self.scale = Math.max(self.scale, self.minScale);
            self.scale = Math.min(self.scale, self.maxScale);
        },
        mouseToCameraPosition: function(position, layerName) {
            const cam = Vec2.subtract(self.position, self.positionOffset);
            const mouse = self.mouseToCameraScale(position, 1 / self.scale);
            const canvasPosition = Vec2.add(cam, mouse);
            try {
                return mulVec2(
                    math.inv(self.layerManager.getLayer(layerName).tmat),
                    canvasPosition,
                );
            } catch (e) {
                return canvasPosition;
            }
        },
        mouseToCameraScale: function(vector, layerName) {
            // this does not take the camera position into account, so it is ideal
            // for use with values such as difference/movement values
            const canvasScale = Vec2.scale(vector, 1 / self.scale);
            try {
                const tmat = math.inv(self.layerManager.getLayer(layerName).tmat);
                // remove translational offsets
                tmat.subset(math.index([0, 1], 2), [0, 0]);
                return mulVec2(tmat, canvasScale);
            } catch (e) {
                return canvasScale;
            }
        }
    };

    return Camera;

}());

export default Camera;
