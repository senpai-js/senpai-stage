!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("events")):"function"==typeof define&&define.amd?define(["exports","events"],e):e(t.senpaiStage={},t.events)}(this,function(t,e){var i=Math.PI,n=2*i;function o(t){return function(e){return 1-t(1-e)}}function r(t){var e=o(t);return function(i){return i<.5?.5*t(2*i):.5+.5*e(2*i-1)}}var s=function(t){return t},a=function(t){return t*t},h=o(a),l=r(a),u=function(t){return t*t*t},p=o(u),c=r(u),f=function(t){return t*t*t*t},d=o(f),v=r(f),x=function(t){return t*t*t*t*t},y=o(x),m=r(x),g=function(t){return Math.sin(t*i*.5)},w=o(g),P=r(w),b=function(t){return Math.pow(2,-10*t)*Math.sin((t-.075)*n/.3)+1},S=o(b),A=r(S),C={easeLinear:s,easeInQuad:a,easeOutQuad:h,easeInOutQuad:l,easeInCub:u,easeOutCub:p,easeInOutCub:c,easeInQuart:f,easeOutQuart:d,easeInOutQuart:v,easeInQuint:x,easeOutQuint:y,easeInOutQuint:m,easeOutSin:g,easeInSin:w,easeInOutSin:P,easeOutElastic:b,easeInElastic:S,easeInOutElastic:A},T=function(t,e){return(T=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])})(t,e)};function I(t,e){function i(){this.constructor=t}T(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}function k(t,e,i,n){return new(i||(i=Promise))(function(o,r){function s(t){try{h(n.next(t))}catch(t){r(t)}}function a(t){try{h(n.throw(t))}catch(t){r(t)}}function h(t){t.done?o(t.value):new i(function(e){e(t.value)}).then(s,a)}h((n=n.apply(t,e||[])).next())})}function _(t,e){var i,n,o,r,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return r={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(r[Symbol.iterator]=function(){return this}),r;function a(r){return function(a){return function(r){if(i)throw new TypeError("Generator is already executing.");for(;s;)try{if(i=1,n&&(o=2&r[0]?n.return:r[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,r[1])).done)return o;switch(n=0,o&&(r=[2&r[0],o.value]),r[0]){case 0:case 1:o=r;break;case 4:return s.label++,{value:r[1],done:!1};case 5:s.label++,n=r[1],r=[0];continue;case 7:r=s.ops.pop(),s.trys.pop();continue;default:if(!(o=(o=s.trys).length>0&&o[o.length-1])&&(6===r[0]||2===r[0])){s=0;continue}if(3===r[0]&&(!o||r[1]>o[0]&&r[1]<o[3])){s.label=r[1];break}if(6===r[0]&&s.label<o[1]){s.label=o[1],o=r;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(r);break}o[2]&&s.ops.pop(),s.trys.pop();continue}r=e.call(t,s)}catch(t){r=[6,t],n=0}finally{i=o=0}if(5&r[0])throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}([r,a])}}}function z(t){var e="function"==typeof Symbol&&t[Symbol.iterator],i=0;return e?e.call(t):{next:function(){return t&&i>=t.length&&(t=void 0),{value:t&&t[i++],done:!t}}}}var B=function(){function t(t,e){this.value=new Float64Array(E),this.immutable=!1,this.value=t||new Float64Array(E),this.immutable=e||this.immutable}return t.prototype.translate=function(e,i){if(this.immutable){var n=new t(this.value,!0);return H(e,i,this.value,n.value),n}return H(e,i,this.value,this.value),this},t.prototype.scale=function(e,i){if(this.immutable){var n=new t(this.value,!0);return L(e,i,this.value,n.value),n}return L(e,i,this.value,this.value),this},t.prototype.rotate=function(e){if(this.immutable){var i=new t(this.value,!0);return D(e,this.value,i.value),i}return D(e,this.value,this.value),this},t.prototype.skewX=function(e){if(this.immutable){var i=new t(this.value,!0);return Q(e,this.value,i.value),i}return Q(e,this.value,this.value),this},t.prototype.skewY=function(e){if(this.immutable){var i=new t(this.value,!0);return F(e,this.value,i.value),i}return F(e,this.value,this.value),this},t.prototype.transform=function(e){if(this.immutable){var i=new t(this.value,!0);return U(this.value,e,i.value),i}return U(this.value,e,this.value),this},t.prototype.reset=function(){return this.immutable?X():(j(this.value),this)},t.prototype.set=function(t){return R(t,this.value),this},t.prototype.inverse=function(){if(this.immutable){var e=new t(this.value,!0);return M(this.value,e.value),e}return M(this.value,this.value),this},t}();function M(t,e){var i=t[0],n=t[1],o=t[2],r=t[3],s=t[4],a=t[5],h=1/(i*r-o*n);e[0]=r*h,e[1]=-n*h,e[2]=-o*h,e[3]=i*h,e[4]=(o*a-s*r)*h,e[5]=(s*n-i*a)*h}var E=new Float64Array([1,0,0,1,0,0]),O=new B(E,!0);function H(t,e,i,n){n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[0]*t+i[2]*e+i[4],n[5]=i[1]*t+i[3]*e+i[5]}function L(t,e,i,n){n[0]=i[0]*t,n[1]=i[1]*t,n[2]=i[2]*e,n[3]=i[3]*e,n[4]=i[4],n[5]=i[5]}function D(t,e,i){var n=Math.cos(t),o=Math.sin(t),r=e[0],s=e[1],a=e[2],h=e[3];i[0]=r*n+a*o,i[1]=s*n+h*o,i[2]=a*n-r*o,i[3]=h*n-s*o,i[4]=e[4],i[5]=e[5]}function Q(t,e,i){var n=Math.tan(t);i[0]=e[0],i[1]=e[1],i[2]=e[2]+e[0]*n,i[3]=e[3]+e[1]*n,i[4]=e[4],i[5]=e[5]}function F(t,e,i){var n=Math.tan(t);i[0]=e[0]+e[2]*n,i[1]=e[1]+e[3]*n,i[2]=e[2],i[3]=e[3],i[4]=e[4],i[5]=e[5]}function U(t,e,i){var n=e[0],o=e[1],r=e[2],s=e[3],a=e[4],h=e[5],l=t[0],u=t[1],p=t[2],c=t[3],f=t[4],d=t[5];i[0]=l*n+p*o,i[1]=u*n+c*o,i[2]=l*r+p*s,i[3]=u*r+c*s,i[4]=l*a+p*h+f,i[5]=u*a+c*h+d}function N(t,e){t.tx=e[0]*t.x+e[2]*t.y+e[4],t.ty=e[1]*t.x+e[3]*t.y+e[5]}function R(t,e){for(var i=0;i<t.length&&i<e.length;i++)t[i]=e[i]}function j(t){return R(t,[1,0,0,1,0,0])}function X(t,e){return void 0===t&&(t=E),void 0===e&&(e=!1),new B(t,e)}var Y,G,V,q={Matrix:B,inverse:M,Identity:E,IdentityMatrix:O,translate:H,scale:L,rotate:D,skewX:Q,skewY:F,transform:U,transformPoints:function(t,e){var i,n;try{for(var o=z(t),r=o.next();!r.done;r=o.next())N(r.value,e)}catch(t){i={error:t}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}},transformPoint:N,set:R,reset:j,chain:X};function W(t,e){return k(this,void 0,void 0,function(){var i,n=this;return _(this,function(o){switch(o.label){case 0:return i={},[4,Promise.all(Object.entries(t.frames).map(function(t,o){var r=function(t,e){var i="function"==typeof Symbol&&t[Symbol.iterator];if(!i)return t;var n,o,r=i.call(t),s=[];try{for(;(void 0===e||e-- >0)&&!(n=r.next()).done;)s.push(n.value)}catch(t){o={error:t}}finally{try{n&&!n.done&&(i=r.return)&&i.call(r)}finally{if(o)throw o.error}}return s}(t,2),s=r[0],a=r[1];return k(n,void 0,void 0,function(){var t,n,o;return _(this,function(r){switch(r.label){case 0:return t=i,n=s,o=createImageBitmap,[4,e];case 1:return[4,o.apply(void 0,[r.sent(),a.frame.x,a.frame.y,a.frame.w,a.frame.h])];case 2:return t[n]=r.sent(),[2]}})})}))];case 1:return o.sent(),[2,i]}})})}function Z(t,e){return t.z-e.z}!function(t){t.left="left",t.right="right",t.center="center",t.start="start",t.end="end"}(Y||(Y={})),function(t){t.top="top",t.hanging="hanging",t.middle="middle",t.alphabetic="alphabetic",t.ideographic="ideographic",t.bottom="bottom"}(G||(G={})),function(t){t[t.Playing=0]="Playing",t[t.Paused=1]="Paused",t[t.Stopped=2]="Stopped"}(V||(V={}));var J={createTextureMap:W,loadImage:function(t){return k(this,void 0,void 0,function(){var e;return _(this,function(i){switch(i.label){case 0:return[4,fetch(t)];case 1:return[4,i.sent().blob()];case 2:return e=i.sent(),[4,createImageBitmap(e)];case 3:return[2,i.sent()]}})})},zSort:Z,get TextAlign(){return Y},get TextBaseline(){return G},get PlayState(){return V}},K=function(t){function e(e){var i=t.call(this)||this;i.id="",i.position=new Float64Array(6),i.previousPosition=new Float64Array(6),i.interpolatedPosition=new Float64Array(6),i.inverse=new Float64Array(6),i.alpha=1,i.interpolatedAlpha=1,i.previousAlpha=1,i.z=0,i.parent=null,i.wait=0,i.lastInterpolated=0,i.animationStart=0,i.ease=s,i.cursor="default",i.animationLength=0,i.active=!1,i.hover=!1,i.down=!1,i.textures={},i.texture=new Image,i.loaded=null,i.width=0,i.height=0,i.id=e.id;var n=e.position||E;return i.textures=e.textures?e.textures:i.textures,R(i.position,n),R(i.previousPosition,n),R(i.interpolatedPosition,n),e.hasOwnProperty("alpha")&&(i.previousAlpha=i.alpha=i.interpolatedAlpha=e.alpha),e.hasOwnProperty("z")&&(i.z=e.z),i.loaded=e.source?i.loadTexture(e.source,e.definition):Promise.resolve(),i}return I(e,t),e.prototype.broadPhase=function(t){return t.tx>=0&&t.tx<=this.width&&t.ty>=0&&t.ty<=this.height},e.prototype.narrowPhase=function(t){return this},e.prototype.pointCollision=function(t){return!0},e.prototype.isHovering=function(t,e){if(this.interpolate(e),N(t,this.inverse),this.broadPhase(t))return this.narrowPhase(t)},e.prototype.move=function(t){return this.previousPosition[0]=this.interpolatedPosition[0],this.previousPosition[1]=this.interpolatedPosition[1],this.previousPosition[2]=this.interpolatedPosition[2],this.previousPosition[3]=this.interpolatedPosition[3],this.previousPosition[4]=this.interpolatedPosition[4],this.previousPosition[5]=this.interpolatedPosition[5],this.position[0]=t[0],this.position[1]=t[1],this.position[2]=t[2],this.position[3]=t[3],this.position[4]=t[4],this.position[5]=t[5],this},e.prototype.setAlpha=function(t){return this.previousAlpha=this.interpolatedAlpha,this.alpha=t,this},e.prototype.setZ=function(t){return this.z=t,this},e.prototype.over=function(t,e,i){return void 0===e&&(e=0),void 0===i&&(i=this.ease),this.animationLength=t,this.animationStart=Date.now(),this.ease=i||this.ease,this.wait=e,this},e.prototype.keyStateChange=function(t){throw new Error("Not implemented.")},e.prototype.skipAnimation=function(t){var e=t<this.animationLength+this.animationStart;return this.animationStart=t-this.animationLength,e},e.prototype.update=function(){},e.prototype.interpolate=function(t){if(!(t<=this.lastInterpolated)){this.lastInterpolated=t;var e=t-(this.animationStart+this.wait),i=e>=this.animationLength?1:e<=0?0:this.ease(e/this.animationLength);if(1===i)this.interpolatedPosition[0]=this.position[0],this.interpolatedPosition[1]=this.position[1],this.interpolatedPosition[2]=this.position[2],this.interpolatedPosition[3]=this.position[3],this.interpolatedPosition[4]=this.position[4],this.interpolatedPosition[5]=this.position[5],this.interpolatedAlpha=this.alpha;else if(0===i)this.interpolatedPosition[0]=this.previousPosition[0],this.interpolatedPosition[1]=this.previousPosition[1],this.interpolatedPosition[2]=this.previousPosition[2],this.interpolatedPosition[3]=this.previousPosition[3],this.interpolatedPosition[4]=this.previousPosition[4],this.interpolatedPosition[5]=this.previousPosition[5],this.interpolatedAlpha=this.previousAlpha;else{for(var n=0;n<6;n++)this.interpolatedPosition[n]=this.previousPosition[n]+i*(this.position[n]-this.previousPosition[n]);this.interpolatedAlpha=this.previousAlpha+i*(this.alpha-this.previousAlpha)}M(this.interpolatedPosition,this.inverse),this.parent&&(this.parent.interpolate(t),X(this.parent.inverse,!0).transform(this.inverse).set(this.inverse))}},e.prototype.setTexture=function(t){var e=this.texture;return this.texture=this.textures[t],this.width=this.texture.width,this.height=this.texture.height,e!==this.texture&&this.emit("texture-change",this.texture),this},e.prototype.render=function(t){t.drawImage(this.texture,0,0)},e.prototype.loadTexture=function(t,e){return k(this,void 0,void 0,function(){var i,n;return _(this,function(o){switch(o.label){case 0:return[4,t];case 1:return[4,o.sent().blob()];case 2:return i=o.sent(),n=this,[4,W(e,createImageBitmap(i))];case 3:return n.textures=o.sent(),[2]}})})},e}(e.EventEmitter),$=function(t){function e(e){var i=t.call(this,e)||this;return i.selected=!1,i.font="monospace",i.fontColor="black",i.fontSize=12,i.text="",i.textAlign=Y.center,i.textBaseline=G.middle,i.selected=e.selected||!1,i.font=e.font||i.font,i.fontColor=e.fontColor||i.fontColor,i.fontSize=e.fontSize||i.fontSize,i.text=e.text||i.text,i.textAlign=e.textAlign,i.textBaseline=e.textBaseline,i}return I(e,t),e.prototype.update=function(){this.setTexture((this.active?"Active":"Inactive")+"_"+(this.hover?"Hover":"NoHover")+"_"+(this.selected?"Selected":"Unselected")),this.cursor=this.hover?"pointer":"default",t.prototype.update.call(this)},e.prototype.render=function(e){t.prototype.render.call(this,e),e.translate(.5*this.texture.width,.5*this.texture.height),e.textBaseline=G.middle,e.textAlign=Y.center,e.font=this.fontSize+"px "+this.font,e.fillStyle=this.fontColor,e.fillText(this.text,0,0)},e.prototype.setText=function(t){return this.text=t,this},e}(K),tt=function(t){function e(e){var i=t.call(this,e)||this;return i.name="",i.displayName="",i.color="",i.name=e.name,i.displayName=e.displayName,i.color=e.color,i}return I(e,t),e}(K),et=function(t){function e(e){var i=t.call(this,e)||this;return i.checked=!1,i.text="",i.font="monospace",i.fontColor="black",i.fontSize=12,i.textAlign=Y.left,i.textBaseline=G.middle,i.checked=Boolean(e.checked)||!1,i.text=e.text||i.text,i.font=e.font||i.font,i.fontColor=e.fontColor||i.fontColor,i.textAlign=e.textAlign||i.textAlign,i.textBaseline=e.textBaseline||i.textBaseline,i}return I(e,t),e.prototype.toggle=function(){return this.checked=!this.checked,this},e.prototype.pointCollision=function(e){return e.clicked&&e.active===this&&(this.toggle(),this.emit("toggle",e)),t.prototype.pointCollision.call(this,e)},e.prototype.render=function(e){t.prototype.render.call(this,e),e.translate(1.1*this.width,this.height/2),e.textAlign=this.textAlign,e.textBaseline=this.textBaseline,e.fillStyle=this.fontColor,e.font=this.fontSize+"px "+this.font,e.fillText(this.text,0,0)},e.prototype.update=function(){this.setTexture((this.active?"Active":"Inactive")+"_"+(this.hover?"Hover":"NoHover")+"_"+(this.checked?"Checked":"Unchecked")),this.cursor=this.hover?"pointer":"default",t.prototype.update.call(this)},e.prototype.setText=function(t){return this.text=t,this},e}(K),it=function(t){function e(e){return t.call(this,e)||this}return I(e,t),e.prototype.update=function(){this.setTexture((this.active?"Active":"Inactive")+"_"+(this.hover?"Hover":"NoHover")),this.cursor=this.hover?"pointer":"default",t.prototype.update.call(this)},e}(K),nt=function(t){function e(e){var i=t.call(this)||this;return i.sprites=[],i.playables=[],i.points=[],i.audioContext=null,i.audioContext=e.audioContext||new AudioContext,i}return I(e,t),e.prototype.addSprite=function(t){return this.sprites.includes(t)||this.sprites.push(t),this},e.prototype.removeSprite=function(t){return this.sprites.includes(t)&&this.sprites.splice(this.sprites.indexOf(t),1),this},e.prototype.addPlayable=function(t){return this.playables.includes(t)||this.playables.push(t),this},e.prototype.removePlayable=function(t){return this.playables.includes(t)&&this.playables.splice(this.playables.indexOf(t),1),this},e.prototype.addPoint=function(t){return this.points.includes(t)||this.points.push(t),this},e.prototype.removePoint=function(t){return this.points.includes(t)&&this.points.splice(this.points.indexOf(t),1),this},e}(e.EventEmitter),ot=function(t){function e(e){var i=t.call(this,e)||this;return i.canvas=null,i.ctx=null,i.touchPointIndex={},i.mousePoint={active:null,captured:!1,clicked:!1,down:!1,firstDown:!1,hover:null,id:"mouse",tx:0,ty:0,type:"Mouse",x:0,y:0},i.events=[{target:null,event:"mousedown",listener:function(t){return i.mouseDown(t)}},{target:document.body,event:"mouseup",listener:function(t){return i.mouseUp(t)}},{target:null,event:"mousemove",listener:function(t){return i.mouseMove(t)}},{target:null,event:"touchstart",listener:function(t){return i.touchStart(t)}},{target:document.body,event:"touchend",listener:function(t){return i.touchEnd(t)}},{target:null,event:"touchmove",listener:function(t){return i.touchMove(t)}},{target:document.body,event:"touchcancel",listener:function(t){return i.touchCancel(t)}}],i.canvas=e.canvas,i.canvas||(i.canvas=document.createElement("canvas"),document.body.appendChild(i.canvas)),i.canvas.width=e.width,i.canvas.height=e.height,i.ctx=i.canvas.getContext("2d"),i.hookEvents(),i.addPoint(i.mousePoint),i}return I(e,t),e.prototype.hookEvents=function(){var t=this;this.events.forEach(function(e){return(e.target||t.canvas).addEventListener(e.event,e.listener)})},e.prototype.dispose=function(){var t=this;this.events.forEach(function(e){return(e.target||t.canvas).removeEventListener(e.event,e.listener)})},e.prototype.mouseDown=function(t){return this.pointDown(this.mousePoint,t)},e.prototype.mouseUp=function(t){return this.pointUp(this.mousePoint,t)},e.prototype.mouseMove=function(t){return this.pointMove(this.mousePoint,t)},e.prototype.touchStart=function(t){for(var e,i,n=0;n<t.changedTouches.length;n++)i=this.addTouchPoint(e=t.changedTouches[n]),this.pointDown(i,e)},e.prototype.touchEnd=function(t){for(var e=null,i=0;i<t.changedTouches.length;i++)this.pointUp(this.touchPointIndex[(e=t.changedTouches[i]).identifier],e),this.removeTouchPoint(e)},e.prototype.touchCancel=function(t){for(var e=null,i=0;i<t.changedTouches.length;i++)this.pointCancel(this.touchPointIndex[(e=t.changedTouches[i]).identifier],e),this.removeTouchPoint(e)},e.prototype.touchMove=function(t){for(var e=null,i=0;i<t.changedTouches.length;i++)this.pointMove(this.touchPointIndex[(e=t.changedTouches[i]).identifier],e)},e.prototype.pointDown=function(t,e){this.pointMove(t,e),t.hover&&(t.active=t.hover,t.active.down=!0,t.active.active=!0,t.active.emit("down",t)),this.emit("firstdown",t)},e.prototype.pointUp=function(t,e){this.pointMove(t,e),t.active&&t.active.emit("up",t),t.active&&t.hover===t.active&&(t.active.emit("click",t),t.active.down=!1,t.active.active=!1,t.active=null),this.emit("click",t)},e.prototype.pointMove=function(e,i){var n,o=Date.now(),r=this.canvas.getBoundingClientRect();e.x=i.clientX-r.left,e.y=i.clientY-r.top,e.hover&&(e.hover.hover=!1,e.hover=null),this.sprites.sort(Z);for(var s=this.sprites.length-1;s>=0;s--)(n=this.sprites[s].isHovering(e,o))&&(n.hover=!0,e.hover=n,n.pointCollision(e),n.emit("point-move",e));t.prototype.emit.call(this,"point-move",e)},e.prototype.pointCancel=function(t,e){t.active&&(t.active.active=!1,t.active=null),t.hover&&(t.hover.hover=!1,t.hover=null)},e.prototype.addTouchPoint=function(t){var e={active:null,captured:!1,clicked:!1,down:!1,firstDown:!1,hover:null,id:t.identifier.toString(),tx:0,ty:0,type:"Touch",x:0,y:0};return this.touchPointIndex[t.identifier]=e,this.points.push(e),e},e.prototype.removeTouchPoint=function(t){var e=this.touchPointIndex[t.identifier];delete this.touchPointIndex[t.identifier],this.removePoint(e)},e.prototype.hoverCheck=function(t){var e,i,n,o,r,s;try{for(var a=z(this.points),h=a.next();!h.done;h=a.next()){(r=h.value).hover&&(r.hover.hover=!1,r.hover=null);try{for(var l=z(this.sprites),u=l.next();!u.done;u=l.next())if((s=u.value).isHovering(r,t)){s.pointCollision(r),r.hover=s,s.hover=!0;break}}catch(t){n={error:t}}finally{try{u&&!u.done&&(o=l.return)&&o.call(l)}finally{if(n)throw n.error}}}}catch(t){e={error:t}}finally{try{h&&!h.done&&(i=a.return)&&i.call(a)}finally{if(e)throw e.error}}},e}(nt),rt=document.createElement("canvas").getContext("2d"),st=function(t){function e(e){var i=t.call(this,e)||this;return i.text="",i.font="monospace",i.fontSize=12,i.fontColor="black",i.textAlign=Y.start,i.textBaseline=G.hanging,i.text=e.text||i.text,i.font=e.font||i.font,i.fontSize=e.fontSize||i.fontSize,i.fontColor=e.fontColor||i.fontColor,i.textBaseline=e.textBaseline||i.textBaseline,i.textAlign=e.textAlign||i.textAlign,i}return I(e,t),e.prototype.update=function(){this.height=this.fontSize,rt.font=this.fontSize+"px "+this.font,this.width=rt.measureText(this.text).width},e.prototype.render=function(t){t.translate(.5*this.texture.width,.5*this.texture.height),t.textBaseline=this.textBaseline,t.textAlign=this.textAlign,t.font=this.fontSize+"px "+this.font,t.fillStyle=this.fontColor,t.fillText(this.text,0,0)},e.prototype.setText=function(t){return this.text=t,this},e}(K),at=function(t,e){return t.z-e.z},ht=function(t){function e(e){var i=t.call(this,e)||this;return i.sprites=[],i.sprites=e.sprites||i.sprites,i}return I(e,t),e.prototype.addSprite=function(t){return t.parent=this,this.sprites.push(t),this},e.prototype.interpolate=function(e){var i,n;if(!(e<=this.lastInterpolated)){t.prototype.interpolate.call(this,e);try{for(var o=z(this.sprites),r=o.next();!r.done;r=o.next()){r.value.interpolate(e)}}catch(t){i={error:t}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}}},e.prototype.removeSprite=function(t){return this.sprites.includes(t)&&(this.sprites.splice(this.sprites.indexOf(t),1),t.parent=null),this},e.prototype.broadPhase=function(e){var i,n;this.sprites.sort(at);try{for(var o=z(this.sprites),r=o.next();!r.done;r=o.next()){var s=r.value;s.down=!1,s.hover=!1}}catch(t){i={error:t}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}return t.prototype.broadPhase.call(this,e)},e.prototype.narrowPhase=function(t){for(var e=null,i=null,n=this.sprites.length-1;n>=0;n--)if(N(t,(e=this.sprites[n]).inverse),e.broadPhase(t)&&(i=e.narrowPhase(t)))return i;return this},e.prototype.update=function(){var t,e;this.hover=!1;try{for(var i=z(this.sprites),n=i.next();!n.done;n=i.next()){var o=n.value;o.update(),o.hover&&(this.hover=o.hover,this.cursor=o.cursor)}}catch(e){t={error:e}}finally{try{n&&!n.done&&(e=i.return)&&e.call(i)}finally{if(t)throw t.error}}},e.prototype.render=function(e){var i,n;t.prototype.render.call(this,e),e.beginPath(),e.rect(0,0,this.width,this.height),e.clip();try{for(var o=z(this.sprites),r=o.next();!r.done;r=o.next()){var s=r.value;e.save(),e.transform(s.interpolatedPosition[0],s.interpolatedPosition[1],s.interpolatedPosition[2],s.interpolatedPosition[3],s.interpolatedPosition[4],s.interpolatedPosition[5]),e.globalAlpha*=s.interpolatedAlpha,s.render(e),e.restore()}}catch(t){i={error:t}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}},e.prototype.skipAnimation=function(e){var i,n,o=t.prototype.skipAnimation.call(this,e);try{for(var r=z(this.sprites),s=r.next();!s.done;s=r.next()){o=s.value.skipAnimation(e)||o}}catch(t){i={error:t}}finally{try{s&&!s.done&&(n=r.return)&&n.call(r)}finally{if(i)throw i.error}}return o},e}(K),lt=function(){function t(t){this.started=0,this.length=0,this.start=0,this.end=0,this.loop=!1,this.state=V.Stopped,this.context=t.context,this.definition=t.definition,this.start=this.definition.spritemap[t.texture].start,this.end=this.definition.spritemap[t.texture].end,this.length=this.end-this.start,this.gain=t.context.createGain(),this.loaded=this.createSource(t.source,t.context),this.destination=t.context.destination}return t.prototype.play=function(){var t=this;return this.loaded.then(function(e){return t.createPlayInstance()}),this},t.prototype.stop=function(){return this},t.prototype.pause=function(){return this},t.prototype.setVolume=function(t){if(t<0||t>1)throw new Error("setVolume() accepts a number between 0 and 1; got "+t+".");return this.gain.gain.value=t,this},t.prototype.createSource=function(t,e){return k(this,void 0,void 0,function(){var i,n;return _(this,function(o){switch(o.label){case 0:return[4,t];case 1:return[4,o.sent().arrayBuffer()];case 2:return i=o.sent(),n=this,[4,e.decodeAudioData(i)];case 3:return n.source=o.sent(),[2]}})})},t.prototype.createPlayInstance=function(){var t=this.context.createBufferSource();t.buffer=this.source,t.loop=this.loop,t.connect(this.gain),t.start(0,this.start,this.length);var e=this.gain;t.addEventListener("ended",function i(n){t.disconnect(e),t.removeEventListener("ended",i)})},t}(),ut=function(t){function e(e){var i=t.call(this,e)||this;return i.value=0,i.max=1,i.min=0,i.width=100,i.sliderPattern=null,i.pillTexture=null,i.height=e.textures.Pill_Hover.height,i.width=e.width,i.max=e.max||i.max,i.min=e.min||i.min,i.value=e.value||i.value,i.sliderPattern=document.createElement("canvas").getContext("2d").createPattern(e.textures.Line,"repeat-x"),i}return I(e,t),e.prototype.broadPhase=function(e){return!!this.active||t.prototype.broadPhase.call(this,e)},e.prototype.narrowPhase=function(t){if(this.active)return this;var e=(this.width-this.textures.Pill_Hover.width)*((this.value-this.min)/(this.max-this.min));return t.ty<=this.textures.Pill_Hover.height&&t.ty>=0&&t.tx>=e&&t.tx<=e+this.textures.Pill_Hover.width?this:void 0},e.prototype.pointCollision=function(e){if(t.prototype.pointCollision.call(this,e),this.active&&e.active===this){var i=this.value,n=this.width-this.textures.Pill_Hover.width,o=Math.max(0,Math.min(e.tx-.5*this.textures.Pill_Hover.width,n));this.value=this.min+(this.max-this.min)*o/n,this.value!==i&&t.prototype.emit.call(this,"value-change",this)}return!0},e.prototype.update=function(){this.cursor=this.hover?"pointer":"default",this.pillTexture=this.active?this.textures.Pill_Active:this.hover?this.textures.Pill_Hover:this.textures.Pill},e.prototype.render=function(t){t.drawImage(this.textures.Line_Cap_Left,0,0),t.drawImage(this.textures.Line_Cap_Right,this.width-this.textures.Line_Cap_Right.width,0),t.fillStyle=this.sliderPattern,t.fillRect(this.textures.Line_Cap_Left.width,0,this.width-this.textures.Line_Cap_Left.width-this.textures.Line_Cap_Right.width,this.textures.Line.height),t.drawImage(this.pillTexture,(this.width-this.textures.Pill_Hover.width)*((this.value-this.min)/(this.max-this.min)),0)},e}(K),pt=function(t){function e(e){return t.call(this,e)||this}return I(e,t),e.prototype.update=function(){var e,i,n,o,r=Date.now();t.prototype.emit.call(this,"pre-interpolate");try{for(var s=z(this.sprites),a=s.next();!a.done;a=s.next())a.value.interpolate(r)}catch(t){e={error:t}}finally{try{a&&!a.done&&(i=s.return)&&i.call(s)}finally{if(e)throw e.error}}t.prototype.emit.call(this,"post-interpolate"),t.prototype.emit.call(this,"pre-hover-check"),this.hoverCheck(r),t.prototype.emit.call(this,"post-hover-check"),t.prototype.emit.call(this,"pre-update");try{for(var h=z(this.sprites),l=h.next();!l.done;l=h.next())l.value.update()}catch(t){n={error:t}}finally{try{l&&!l.done&&(o=h.return)&&o.call(h)}finally{if(n)throw n.error}}return t.prototype.emit.call(this,"post-update"),this},e.prototype.render=function(){var e,i,n;t.prototype.emit.call(this,"pre-render");var o=!1,r=this.ctx;r.clearRect(0,0,this.canvas.width,this.canvas.height);try{for(var s=z(this.sprites),a=s.next();!a.done;a=s.next())n=a.value,r.save(),r.setTransform(n.interpolatedPosition[0],n.interpolatedPosition[1],n.interpolatedPosition[2],n.interpolatedPosition[3],n.interpolatedPosition[4],n.interpolatedPosition[5]),r.globalAlpha=n.interpolatedPosition[6],n.render(r),r.restore(),o=o||n.hover&&"pointer"===n.cursor}catch(t){e={error:t}}finally{try{a&&!a.done&&(i=s.return)&&i.call(s)}finally{if(e)throw e.error}}return this.canvas.style.cursor=o?"pointer":"default",t.prototype.emit.call(this,"post-render"),this},e.prototype.skipAnimations=function(){var t,e,i=Date.now(),n=!1;try{for(var o=z(this.sprites),r=o.next();!r.done;r=o.next()){r.value.skipAnimation(i)&&(n=!0)}}catch(e){t={error:e}}finally{try{r&&!r.done&&(e=o.return)&&e.call(o)}finally{if(t)throw t.error}}return n},e}(ot),ct=document.createElement("canvas").getContext("2d"),ft=function(t){function e(e){var i=t.call(this,e)||this;return i.text="",i.textSpeed=1,i.textIndex=0,i.padding={bottom:5,left:5,right:5,top:5},i.fontSize=12,i.font="monospace",i.fontColor="black",i.lineHeight=16,i.textAlign=Y.left,i.textBaseline=G.hanging,i.interpolatedText=[""],i.text=e.text||i.text,i.textSpeed=e.textSpeed||i.textSpeed,e.hasOwnProperty("textIndex")&&(i.textIndex=e.textIndex),i.padding=e.padding||i.padding,i.fontSize=e.fontSize||i.fontSize,i.font=e.font||i.font,i.fontColor=e.fontColor||i.fontColor,i.lineHeight=e.lineHeight||i.lineHeight,i.setTexture("Texture"),i}return I(e,t),e.prototype.update=function(){var t,i,n=this.texture.width-this.padding.left-this.padding.right;this.textIndex=Math.min(this.text.length,this.textIndex+this.textSpeed);var o=this.text.match(e.regex);this.interpolatedText=[""];var r=(this.texture.height-this.padding.top-this.padding.bottom)/this.lineHeight,s="",a=0,h=this.textIndex;ct.font=this.fontSize+"px "+this.font;try{for(var l=z(o),u=l.next();!u.done;u=l.next()){var p=u.value;if("\n"!==p&&"\r\n"!==p&&"\r"!==p){if(s=this.interpolatedText[a],0===h)break;if(a+1>r)break;if(ct.measureText(s+=p).width>n&&(a=this.interpolatedText.push("")-1),this.interpolatedText[a]+=p,(h-=p.length)<0){this.interpolatedText[a]=this.interpolatedText[a].slice(0,h);break}}else this.interpolatedText.push(""),h-=p.length,a+=1}}catch(e){t={error:e}}finally{try{u&&!u.done&&(i=l.return)&&i.call(l)}finally{if(t)throw t.error}}},e.prototype.render=function(e){var i,n;t.prototype.render.call(this,e);var o=this.texture.height-this.padding.top,r=this.padding.top;e.font=this.fontSize+"px "+this.font,e.fillStyle=this.fontColor,e.textAlign=this.textAlign,e.textBaseline=this.textBaseline,e.beginPath(),e.rect(this.padding.left,this.padding.bottom,this.width-this.padding.right,this.height-this.padding.top),e.clip();try{for(var s=z(this.interpolatedText),a=s.next();!a.done;a=s.next()){if(r+this.fontSize>o)break;e.fillText(a.value,this.padding.left,r),r+=this.lineHeight}}catch(t){i={error:t}}finally{try{a&&!a.done&&(n=s.return)&&n.call(s)}finally{if(i)throw i.error}}},e.prototype.setText=function(t){return t.startsWith(this.text)?(this.text=t,this):(this.text=t,this.interpolatedText=[""],this.textIndex=0,this)},e.prototype.appendText=function(t){return this.text+=t,this},e.prototype.skipAnimation=function(e){var i=t.prototype.skipAnimation.call(this,e)&&this.textIndex<this.text.length;return this.textIndex=this.text.length,i},e.regex=/\r\n|\r|\n|[^\t ]*[\t ]?/g,e}(K);t.Matrix=q,t.Ease=C,t.Util=J,t.Button=$,t.Character=tt,t.Checkbox=et,t.Close=it,t.Container=nt,t.InteractionManager=ot,t.Label=st,t.Panel=ht,t.SFXSprite=lt,t.Slider=ut,t.Sprite=K,t.Stage=pt,t.Textbox=ft});
//# sourceMappingURL=senpai-stage.umd.js.map
