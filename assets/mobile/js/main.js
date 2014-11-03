"use strict";
document.getElementById('rooms').innerHTML = '40';
var model = new Model();
document.getElementById('rooms').innerHTML = model;
var view = new View();
document.getElementById('rooms').innerHTML = '42';
var controller = new Controller();
document.getElementById('rooms').innerHTML = '43';
controller.init(model, view, socket, room);