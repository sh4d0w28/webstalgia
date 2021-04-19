
class LogPong {

    endpoints = {};
    sourceCallsY = {}
    endpointsY = {}
    sourceData = {}
    
    WIDTH = 0;
    STEPTIME = 20; // ms

    constructor() {
    }

    getNextEndpointY = function(self) {
        var dy = 30;
        var y = dy * Object.keys(self.endpointsY).length
        return y;
    }

    getCallSourceY = function(self) {
        var dy = 30;
        var y = dy * Object.keys(self.sourceCallsY).length
        return y;
    }

    addLogEntry = function(self, logEntry) {
        //TODO: get new XY
        let endpoint = logEntry.to;
        let callSource = logEntry.from
        let count = logEntry.count; // amount of calls
        let delay = logEntry.delay;

        if(self.endpointsY[endpoint] == null) {
            self.endpointsY[endpoint] = {};
            self.endpointsY[endpoint] = self.getNextEndpointY(self);
        }
        if(self.sourceCallsY[callSource] == null) {
            self.sourceCallsY[callSource] = {};
            self.sourceCallsY[callSource] = self.getCallSourceY(self);
        }
        if(self.endpoints[endpoint] == null) {
            self.endpoints[endpoint] = []; 
        }

        var ballColor = Math.floor(Math.random()*16777215).toString(16);
        
        if(count > 0) {
            for(var i = 0; i < count; i++) {
                var realDelay = ( delay - 1000 ) + Math.random() * delay * i / count;
                self.endpoints[endpoint].push({"ip":callSource, "progress":0, "delay": realDelay, "color":ballColor});    
            }
        }
        debugger;
    }

    updateProgress = function(self) {
        for (const endpoint in self.endpoints) {
            for(var i = 0; i < self.endpoints[endpoint].length; i++) {
                
                if(self.endpoints[endpoint][i].delay > 0) {
                    self.endpoints[endpoint][i].delay -= self.STEPTIME;
                    continue;
                }
                
                self.endpoints[endpoint][i].progress+= (50 / self.WIDTH);
                if(self.endpoints[endpoint][i].progress >= 100) {
                    self.endpoints[endpoint].shift();
                }
            }
            if(self.endpoints[endpoint].length == 0) {
                delete self.endpoints[endpoint];
            }
        }
    }

    render = function(ctx, self) {
        
        self.WIDTH = ctx.canvas.width;

        while(self.sourceData.length > 0) {
            self.addLogEntry(self, self.sourceData[0]);
            self.sourceData.shift();
        }
        setInterval(function() {   /// 50 times per second 
            self.step(ctx, self);
        }, self.STEPTIME);
    }
    
    step = function(ctx, self) {

        self.updateProgress(self);
        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (const endpoint in self.endpoints) {
          for(var i = 0; i < self.endpoints[endpoint].length; i++) {
              var sourceXY = {x:0, y:self.sourceCallsY[self.endpoints[endpoint][i].ip]};
              var destXY = {x:ctx.canvas.width - 200, y:self.endpointsY[endpoint]};

              ctx.font = "16px Arial";
              ctx.fillStyle = "#ffffff";
              ctx.fillText(self.endpoints[endpoint][i].ip, sourceXY.x, sourceXY.y);
              ctx.fillText(endpoint, destXY.x, destXY.y);
              self.drawBall(ctx, 150, sourceXY.y, destXY.x, destXY.y, self.endpoints[endpoint][i].progress, self.endpoints[endpoint][i].color);
          }
        }
    }

    drawBall = function(ctx, sourceX, sourceY, destX, destY, percent, color) {
        var realX = 0;
        var realY = 0;

        var reflectY = sourceY + (destY - sourceY) * 2;
        if(percent <= 50) {
            realX = sourceX + (destX - sourceX)*percent/50
            realY = sourceY + (destY - sourceY)*percent/50
        } else {
            realX = destX - (destX - sourceX)*(percent-50)/50
            realY = destY + (destY - sourceY)*(percent-50)/50
        }
      
        ctx.beginPath();
        ctx.arc(realX, realY, 3, 0, 2*Math.PI);
        ctx.fillStyle = "#" + color;
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#000"
    }
}

export default LogPong;
