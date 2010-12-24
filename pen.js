Pen = function(tag) {
	this.angle = -90;
	this.x = 0;
	this.y = 0;
	
	this.tag = document.getElementById(tag) || tag;
	
	this.canvas = this.tag.getContext("2d");
	this.canvas.strokeStyle = "#000";
	this.lineWidth = this.canvas.lineWidth = 1;
	this.fillStyle = this.canvas.fillStyle = "";

	this.pen = true;
	
	this.canvas.beginPath();
};
Pen.prototype = {
	turn: function(deg) {
		this.angle += deg;
		this.angle = this.angle % 360;
		
		return this;
	},
	
	fillstyle: function(style) {
		this.fillStyle = this.canvas.fillStyle = style;

		return this;
	},
	
	go: function(r) {
		var a = this.toRad(this.angle);

		this.x += r * Math.cos(a);
		this.y += r * Math.sin(a);
		
		if (this.pen)
			this.canvas.lineTo(this.x, this.y);
		else
			this.canvas.moveTo(this.x, this.y);
		
		return this;
	},
	
	back: function(r) {
		this.turn(-180);
		this.go(r);
		this.turn(180);
		
		return this;
	},
	
	stroke: function() {
		this.canvas.stroke();

		return this;
	},
	
	fill: function() {
		this.canvas.fill();

		return this;
	},
	
	begin: function() {
		this.canvas.beginPath();

		return this;
	},
	
	close: function() {
		this.canvas.closePath();
	
		return this;
	},
	
	draw: function() {
		if (this.fillStyle)
			this.fill();
		if (this.lineWidth)
			this.stroke();

		return this.begin();
	},
	
	penup: function() {
		this.pen = false;
		
		return this;
	},
	
	pendown: function() {
		this.pen = true;
		
		return this;
	},
	
	goto: function(x, y) {
		this.x = x;
		this.y = y;

		if (!this.pen)
			this.canvas.moveTo(x, y);
		else
			this.canvas.lineTo(x, y);
		
		return this;
	},
	
	jump: function(x, y) {
		this.canvas.beginPath();
		
		var p = this.pen;
		this.pen = true;
		this.goto(x, y);
		this.pen = p;
		return this;
	},

	moveby: function(a, r) {
		var last = this.angle;

		this.angle = a;
		this.go(r);
		this.angle = last;

		return this;
	},
		
	up: function(r) {
		return this.goto(this.x, this.y - r);
	},
	
	down: function(r) {
		return this.goto(this.x, this.y + r);
	},
	
	left: function(r) {
		return this.goto(this.x - r, this.y);
	},
	
	right: function(r) {
		return this.goto(this.x + r, this.y);
	},
	
	rad: Math.PI / 180.0,
	
	toRad: function(d) {
		return d * this.rad;
	},
	
	repeat: function(call, count) {
		for (var i = 0; i < count; i++)
			call.call(this);
	},
	
	pensize: function(size) {
		this.lineWidth = this.canvas.lineWidth = size;
		return this;
	},
	
	penhsv: function(h, s, v) {
		this.canvas.strokeStyle = this.strokeStyle = hsvtorgb(h, s, v);
		
		return this;
	},
	
	text: function(str) {
		this.canvas.fillText(str, this.x, this.y);
		
		return this;
	},
	
	font: function(str) {
		this.canvas.font = str;
		return this;
	}
};

hsvtorgb = function(h, s, v) {
	if (s == 0)
		return format(v, v, v);

	h /= 60;

	var i = Math.floor(h);
	var f = h - i;
	var p = v * (1 - s);
	var q = v * (1 - s * f);
	var t = v * (1 - s * (1 - f));

	function format(r, g, b) {
		return "rgb(" + Math.round(r * 255) + "," + Math.round(g * 255) + "," + Math.round(b * 255) + ")";
	}

	switch(i) {
	case 0:
		r = v; g = t; b = p;
		break;

	case 1:
		r = q; g = v; b = p;
		break;

	case 2:
		r = p; g = v; b = t;
		break;

	case 3:
		r = p; g = q; b = v;
		break;

	case 4:
		r = t; g = p; b = v;
		break;

	default:
		r = v; g = p; b = q;
	}

	return format(r, g, b);
};