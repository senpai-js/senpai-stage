!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.senpaiStage={})}(this,function(t){var e=Math.PI,i=2*e;function n(t){return function(e){return 1-t(1-e)}}function o(t){var e=n(t);return function(i){return i<.5?.5*t(2*i):.5+.5*e(2*i-1)}}var r=function(t){return t},s=function(t){return t*t},a=n(s),h=o(s),l=function(t){return t*t*t},u=n(l),c=o(l),p=function(t){return t*t*t*t},d=n(p),f=o(p),v=function(t){return t*t*t*t*t},y=n(v),x=o(v),w=function(t){return Math.sin(t*e*.5)},g=n(w),m=o(g),P=function(t){return Math.pow(2,-10*t)*Math.sin((t-.075)*i/.3)+1},b=n(P),S=o(b),T={easeLinear:r,easeInQuad:s,easeOutQuad:a,easeInOutQuad:h,easeInCub:l,easeOutCub:u,easeInOutCub:c,easeInQuart:p,easeOutQuart:d,easeInOutQuart:f,easeInQuint:v,easeOutQuint:y,easeInOutQuint:x,easeOutSin:w,easeInSin:g,easeInOutSin:m,easeOutElastic:P,easeInElastic:b,easeInOutElastic:S},k=function(t,e){return(k=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])})(t,e)};function E(t,e){function i(){this.constructor=t}k(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}function C(t,e,i,n){return new(i||(i=Promise))(function(o,r){function s(t){try{h(n.next(t))}catch(t){r(t)}}function a(t){try{h(n.throw(t))}catch(t){r(t)}}function h(t){t.done?o(t.value):new i(function(e){e(t.value)}).then(s,a)}h((n=n.apply(t,e||[])).next())})}function z(t,e){var i,n,o,r,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return r={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(r[Symbol.iterator]=function(){return this}),r;function a(r){return function(a){return function(r){if(i)throw new TypeError("Generator is already executing.");for(;s;)try{if(i=1,n&&(o=2&r[0]?n.return:r[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,r[1])).done)return o;switch(n=0,o&&(r=[2&r[0],o.value]),r[0]){case 0:case 1:o=r;break;case 4:return s.label++,{value:r[1],done:!1};case 5:s.label++,n=r[1],r=[0];continue;case 7:r=s.ops.pop(),s.trys.pop();continue;default:if(!(o=(o=s.trys).length>0&&o[o.length-1])&&(6===r[0]||2===r[0])){s=0;continue}if(3===r[0]&&(!o||r[1]>o[0]&&r[1]<o[3])){s.label=r[1];break}if(6===r[0]&&s.label<o[1]){s.label=o[1],o=r;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(r);break}o[2]&&s.ops.pop(),s.trys.pop();continue}r=e.call(t,s)}catch(t){r=[6,t],n=0}finally{i=o=0}if(5&r[0])throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}([r,a])}}}function I(t){var e="function"==typeof Symbol&&t[Symbol.iterator],i=0;return e?e.call(t):{next:function(){return t&&i>=t.length&&(t=void 0),{value:t&&t[i++],done:!t}}}}var A=function(){function t(t,e){this.value=new Float64Array(M),this.immutable=!1,this.value=t||new Float64Array(M),this.immutable=e||this.immutable}return t.prototype.translate=function(e,i){if(this.immutable){var n=new t(this.value,!0);return H(e,i,this.value,n.value),n}return H(e,i,this.value,this.value),this},t.prototype.scale=function(e,i){if(this.immutable){var n=new t(this.value,!0);return D(e,i,this.value,n.value),n}return D(e,i,this.value,this.value),this},t.prototype.rotate=function(e){if(this.immutable){var i=new t(this.value,!0);return B(e,this.value,i.value),i}return B(e,this.value,this.value),this},t.prototype.skewX=function(e){if(this.immutable){var i=new t(this.value,!0);return U(e,this.value,i.value),i}return U(e,this.value,this.value),this},t.prototype.skewY=function(e){if(this.immutable){var i=new t(this.value,!0);return L(e,this.value,i.value),i}return L(e,this.value,this.value),this},t.prototype.transform=function(e){if(this.immutable){var i=new t(this.value,!0);return N(this.value,e,i.value),i}return N(this.value,e,this.value),this},t.prototype.reset=function(){return this.immutable?J():(R(this.value),this)},t.prototype.set=function(t){return Y(t,this.value),this},t.prototype.inverse=function(){if(this.immutable){var e=new t(this.value,!0);return _(this.value,e.value),e}return _(this.value,this.value),this},t}();function _(t,e){var i=t[0],n=t[1],o=t[2],r=t[3],s=t[4],a=t[5],h=1/(i*r-o*n);e[0]=r*h,e[1]=-n*h,e[2]=-o*h,e[3]=i*h,e[4]=(o*a-s*r)*h,e[5]=(s*n-i*a)*h}var M=new Float64Array([1,0,0,1,0,0]),O=new A(M,!0);function H(t,e,i,n){n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[0]*t+i[2]*e+i[4],n[5]=i[1]*t+i[3]*e+i[5]}function D(t,e,i,n){n[0]=i[0]*t,n[1]=i[1]*t,n[2]=i[2]*e,n[3]=i[3]*e,n[4]=i[4],n[5]=i[5]}function B(t,e,i){var n=Math.cos(t),o=Math.sin(t),r=e[0],s=e[1],a=e[2],h=e[3];i[0]=r*n+a*o,i[1]=s*n+h*o,i[2]=a*n-r*o,i[3]=h*n-s*o,i[4]=e[4],i[5]=e[5]}function U(t,e,i){var n=Math.tan(t);i[0]=e[0],i[1]=e[1],i[2]=e[2]+e[0]*n,i[3]=e[3]+e[1]*n,i[4]=e[4],i[5]=e[5]}function L(t,e,i){var n=Math.tan(t);i[0]=e[0]+e[2]*n,i[1]=e[1]+e[3]*n,i[2]=e[2],i[3]=e[3],i[4]=e[4],i[5]=e[5]}function N(t,e,i){var n=e[0],o=e[1],r=e[2],s=e[3],a=e[4],h=e[5],l=t[0],u=t[1],c=t[2],p=t[3],d=t[4],f=t[5];i[0]=l*n+c*o,i[1]=u*n+p*o,i[2]=l*r+c*s,i[3]=u*r+p*s,i[4]=l*a+c*h+d,i[5]=u*a+p*h+f}function X(t,e){t.tx=e[0]*t.x+e[2]*t.y+e[4],t.ty=e[1]*t.x+e[3]*t.y+e[5]}function Y(t,e){for(var i=0;i<t.length&&i<e.length;i++)t[i]=e[i]}function R(t){return Y(t,[1,0,0,1,0,0])}function J(t,e){return void 0===t&&(t=M),void 0===e&&(e=!1),new A(t,e)}var F,Q={Matrix:A,inverse:_,Identity:M,IdentityMatrix:O,translate:H,scale:D,rotate:B,skewX:U,skewY:L,transform:N,transformPoints:function(t,e){var i,n;try{for(var o=I(t),r=o.next();!r.done;r=o.next())X(r.value,e)}catch(t){i={error:t}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}},transformPoint:X,set:Y,reset:R,chain:J};function j(t,e){return C(this,void 0,void 0,function(){var i,n,o,r,s,a,h,l,u,c,p,d,f,v,y,x,w,g,m,P,b,S,T,k,E,C,A,_,M,O;return z(this,function(z){switch(z.label){case 0:return h={},[4,t];case 1:return l=z.sent(),[4,e];case 2:switch(u=z.sent(),l.kind){case F.JSON:return[3,3];case F.JSON_TP_Array:return[3,12];case F.JSON_TP_Hash:return[3,21]}return[3,30];case 3:c=l,z.label=4;case 4:z.trys.push([4,9,10,11]),p=I(c),d=p.next(),z.label=5;case 5:return d.done?[3,8]:(f=h,v=(C=d.value).name,[4,createImageBitmap(u,C.x,C.y,C.width,C.height)]);case 6:f[v]=z.sent(),z.label=7;case 7:return d=p.next(),[3,5];case 8:return[3,11];case 9:return y=z.sent(),i={error:y},[3,11];case 10:try{d&&!d.done&&(n=p.return)&&n.call(p)}finally{if(i)throw i.error}return[7];case 11:return[3,30];case 12:x=l,z.label=13;case 13:z.trys.push([13,18,19,20]),w=I(x.frames),g=w.next(),z.label=14;case 14:return g.done?[3,17]:(P=h,b=(m=g.value).filename,[4,createImageBitmap(u,m.x,m.y,m.w,m.h)]);case 15:P[b]=z.sent(),z.label=16;case 16:return g=w.next(),[3,14];case 17:return[3,20];case 18:return S=z.sent(),o={error:S},[3,20];case 19:try{g&&!g.done&&(r=w.return)&&r.call(w)}finally{if(o)throw o.error}return[7];case 20:return[3,30];case 21:T=l,z.label=22;case 22:z.trys.push([22,27,28,29]),k=I(Object.keys(T.frames)),E=k.next(),z.label=23;case 23:return E.done?[3,26]:(A=T.frames[C=E.value],_=h,M=C,[4,createImageBitmap(u,A.x,A.y,A.w,A.h)]);case 24:_[M]=z.sent(),z.label=25;case 25:return E=k.next(),[3,23];case 26:return[3,29];case 27:return O=z.sent(),s={error:O},[3,29];case 28:try{E&&!E.done&&(a=k.return)&&a.call(k)}finally{if(s)throw s.error}return[7];case 29:return[3,30];case 30:return[2,h]}})})}!function(t){t[t.JSON=0]="JSON",t[t.JSON_TP_Hash=1]="JSON_TP_Hash",t[t.JSON_TP_Array=2]="JSON_TP_Array"}(F||(F={}));var K,V,G,W,Z={get SpriteSheetKind(){return F},loadSpriteSheet:function(t,e){return C(this,void 0,void 0,function(){var i,n,o,r;return z(this,function(s){switch(s.label){case 0:return[4,fetch(t,e)];case 1:return[4,s.sent().json()];case 2:if(n=s.sent(),Array.isArray(n)){for((i={kind:F.JSON,length:n.length})[Symbol.iterator]=Array.prototype[Symbol.iterator],r=i,o=0;o<n.length;o++)r[o]=n[o];return[2,r]}if(!n.frames)throw new Error("Invalid spritesheet format.");return Array.isArray(n.frames)?[2,r={frames:n.frames,kind:F.JSON_TP_Array,meta:n.meta}]:[2,r={frames:n.frames,kind:F.JSON_TP_Hash,meta:n.meta}]}})})},createTextureMap:j,loadImage:function(t,e){return C(this,void 0,void 0,function(){var i;return z(this,function(n){switch(n.label){case 0:return[4,fetch(t,e)];case 1:return[4,n.sent().blob()];case 2:return i=n.sent(),[2,createImageBitmap(i)]}})})}};function q(t,e){return t.z-e.z}!function(t){t.left="left",t.right="right",t.center="center",t.start="start",t.end="end"}(K||(K={})),function(t){t.top="top",t.hanging="hanging",t.middle="middle",t.alphabetic="alphabetic",t.ideographic="ideographic",t.bottom="bottom"}(V||(V={})),function(t){t[t.Playing=0]="Playing",t[t.Paused=1]="Paused",t[t.Stopped=2]="Stopped"}(G||(G={})),function(t){t.auto="auto",t.default="default",t.none="none",t["context-menu"]="context-menu",t.help="help",t.pointer="pointer",t.progress="progress",t.wait="wait",t.cell="cell",t.crosshair="crosshair",t.text="text",t["vertical-text"]="vertical-text",t.alias="alias",t.copy="copy",t.move="move",t["no-drop"]="no-drop",t["not-allowed"]="not-allowed",t["e-resize"]="e-resize",t["n-resize"]="n-resize",t["ne-resize"]="ne-resize",t["nw-resize"]="nw-resize",t["s-resize"]="s-resize",t["se-resize"]="se-resize",t["sw-resize"]="sw-resize",t["w-resize"]="w-resize",t["ew-resize"]="ew-resize",t["ns-resize"]="ns-resize",t["nesw-resize"]="nesw-resize",t["nwse-resize"]="nwse-resize",t["col-resize"]="col-resize",t["row-resize"]="row-resize",t["all-scroll"]="all-scroll",t["zoom-in"]="zoom-in",t["zoom-out"]="zoom-out",t.grab="grab",t.grabbing="grabbing"}(W||(W={}));var $={zSort:q,get TextAlign(){return K},get TextBaseline(){return V},get PlayState(){return G},get Cursor(){return W}},tt=function(){function t(){this.callbacks=[]}return t.prototype.clear=function(){this.callbacks=[]},t.prototype.listen=function(t){var e=this;return this.callbacks.push(t),{dispose:function(){e.callbacks.includes(t)&&e.callbacks.splice(e.callbacks.indexOf(t),1)}}},t.prototype.promise=function(){var t=this;return new Promise(function(e,i){var n=t.listen(function(t){n.dispose(),e(t)})})},t.prototype.once=function(t){var e=this.listen(function(i){t(i),e.dispose()});return e},t.prototype.emit=function(t){var e,i;try{for(var n=I(this.callbacks.slice()),o=n.next();!o.done;o=n.next()){(0,o.value)(t)}}catch(t){e={error:t}}finally{try{o&&!o.done&&(i=n.return)&&i.call(n)}finally{if(e)throw e.error}}},t}(),et=function(){function t(t){this.id="",this.position=new Float64Array(6),this.previousPosition=new Float64Array(6),this.interpolatedPosition=new Float64Array(6),this.inverse=new Float64Array(6),this.alpha=1,this.interpolatedAlpha=1,this.previousAlpha=1,this.z=0,this.parent=null,this.container=null,this.wait=0,this.lastInterpolated=0,this.animationStart=0,this.ease=r,this.cursor=W.auto,this.animationLength=0,this.active=!1,this.hover=!1,this.down=!1,this.textures={},this.loaded=null,this.focused=!1,this.tabIndex=0,this.width=0,this.height=0,this.pointDownEvent=new tt,this.pointUpEvent=new tt,this.pointMoveEvent=new tt,this.pointClickEvent=new tt,this.keyDownEvent=new tt,this.keyUpEvent=new tt,this.loadedEvent=new tt,this.textureChangeEvent=new tt,this.id=t.id;var e=t.position||M;this.textures=t.textures?t.textures:this.textures,Y(this.position,e),Y(this.previousPosition,e),Y(this.interpolatedPosition,e),t.hasOwnProperty("alpha")&&(this.previousAlpha=this.alpha=this.interpolatedAlpha=t.alpha),t.hasOwnProperty("z")&&(this.z=t.z),t.source&&t.definition&&this.loadTexture(t.definition,t.source)}return t.prototype.broadPhase=function(t){return t.tx>=0&&t.tx<=this.width&&t.ty>=0&&t.ty<=this.height},t.prototype.narrowPhase=function(t){return this},t.prototype.pointCollision=function(t){return!0},t.prototype.isHovering=function(t,e){if(this.interpolate(e),X(t,this.inverse),this.broadPhase(t))return this.narrowPhase(t)},t.prototype.move=function(t){return this.previousPosition[0]=this.interpolatedPosition[0],this.previousPosition[1]=this.interpolatedPosition[1],this.previousPosition[2]=this.interpolatedPosition[2],this.previousPosition[3]=this.interpolatedPosition[3],this.previousPosition[4]=this.interpolatedPosition[4],this.previousPosition[5]=this.interpolatedPosition[5],this.position[0]=t[0],this.position[1]=t[1],this.position[2]=t[2],this.position[3]=t[3],this.position[4]=t[4],this.position[5]=t[5],this},t.prototype.setAlpha=function(t){return this.previousAlpha=this.interpolatedAlpha,this.alpha=t,this},t.prototype.setZ=function(t){return this.z=t,this},t.prototype.over=function(t,e,i){return void 0===e&&(e=0),void 0===i&&(i=this.ease),this.animationLength=t,this.animationStart=Date.now(),this.ease=i||this.ease,this.wait=e,this},t.prototype.skipAnimation=function(t){var e=t<this.animationLength+this.animationStart;return this.animationStart=t-this.animationLength,e},t.prototype.update=function(){},t.prototype.interpolate=function(t){if(!(t<=this.lastInterpolated)){this.lastInterpolated=t;var e=t-(this.animationStart+this.wait),i=e>=this.animationLength?1:e<=0?0:this.ease(e/this.animationLength);if(1===i)this.interpolatedPosition[0]=this.position[0],this.interpolatedPosition[1]=this.position[1],this.interpolatedPosition[2]=this.position[2],this.interpolatedPosition[3]=this.position[3],this.interpolatedPosition[4]=this.position[4],this.interpolatedPosition[5]=this.position[5],this.interpolatedAlpha=this.alpha;else if(0===i)this.interpolatedPosition[0]=this.previousPosition[0],this.interpolatedPosition[1]=this.previousPosition[1],this.interpolatedPosition[2]=this.previousPosition[2],this.interpolatedPosition[3]=this.previousPosition[3],this.interpolatedPosition[4]=this.previousPosition[4],this.interpolatedPosition[5]=this.previousPosition[5],this.interpolatedAlpha=this.previousAlpha;else{for(var n=0;n<6;n++)this.interpolatedPosition[n]=this.previousPosition[n]+i*(this.position[n]-this.previousPosition[n]);this.interpolatedAlpha=this.previousAlpha+i*(this.alpha-this.previousAlpha)}_(this.interpolatedPosition,this.inverse),this.parent&&(this.parent.interpolate(t),J(this.parent.inverse,!0).transform(this.inverse).set(this.inverse))}},t.prototype.setTexture=function(t){return this.texture=t,this.width=this.textures[this.texture].width,this.height=this.textures[this.texture].height,this},t.prototype.render=function(t){t.drawImage(this.textures[this.texture],0,0)},t.prototype.focus=function(t){t===this&&(this.focused=!0)},t.prototype.loadTexture=function(t,e){return C(this,void 0,void 0,function(){var i,n,o,r;return z(this,function(s){switch(s.label){case 0:return i=this,[4,j(t,e)];case 1:return i.textures=s.sent(),o=(n=this.loadedEvent).emit,r={},[4,t];case 2:return r.definition=s.sent(),r.eventType="SpriteLoaded",r.source=this,[4,e];case 3:return o.apply(n,[(r.spriteSource=s.sent(),r.stage=this.container,r)]),[2]}})})},t}(),it=function(t){function e(e){var i=t.call(this,e)||this;return i.selected=!1,i.font="monospace",i.fontColor="black",i.fontSize=12,i.text="",i.textAlign=K.center,i.textBaseline=V.middle,i.selected=e.selected||!1,i.font=e.font||i.font,i.fontColor=e.fontColor||i.fontColor,i.fontSize=e.fontSize||i.fontSize,i.text=e.text||i.text,i.textAlign=e.textAlign,i.textBaseline=e.textBaseline,i}return E(e,t),e.prototype.update=function(){this.setTexture((this.active?"Active":"Inactive")+"_"+(this.hover?"Hover":"NoHover")+"_"+(this.selected?"Selected":"Unselected")),this.cursor=this.hover?W.pointer:W.auto,t.prototype.update.call(this)},e.prototype.render=function(e){t.prototype.render.call(this,e),e.translate(.5*this.textures[this.texture].width,.5*this.textures[this.texture].height),e.textBaseline=V.middle,e.textAlign=K.center,e.font=this.fontSize+"px "+this.font,e.fillStyle=this.fontColor,e.fillText(this.text,0,0)},e.prototype.setText=function(t){return this.text=t,this},e}(et),nt=function(t){function e(e){var i=t.call(this,e)||this;return i.name="",i.displayName="",i.color="",i.name=e.name,i.displayName=e.displayName,i.color=e.color,i}return E(e,t),e}(et),ot=function(t){function e(e){var i=t.call(this,e)||this;return i.checked=!1,i.text="",i.font="monospace",i.fontColor="black",i.fontSize=12,i.textAlign=K.left,i.textBaseline=V.middle,i.toggleEvent=new tt,i.checked=Boolean(e.checked)||!1,i.text=e.text||i.text,i.font=e.font||i.font,i.fontColor=e.fontColor||i.fontColor,i.textAlign=e.textAlign||i.textAlign,i.textBaseline=e.textBaseline||i.textBaseline,i}return E(e,t),e.prototype.toggle=function(){return this.checked=!this.checked,this},e.prototype.pointCollision=function(e){return e.clicked&&e.active===this&&this.toggle(),t.prototype.pointCollision.call(this,e)},e.prototype.render=function(e){t.prototype.render.call(this,e),e.translate(1.1*this.width,this.height/2),e.textAlign=this.textAlign,e.textBaseline=this.textBaseline,e.fillStyle=this.fontColor,e.font=this.fontSize+"px "+this.font,e.fillText(this.text,0,0)},e.prototype.update=function(){this.setTexture((this.active?"Active":"Inactive")+"_"+(this.hover?"Hover":"NoHover")+"_"+(this.checked?"Checked":"Unchecked")),this.cursor=this.hover?W.pointer:W.auto,t.prototype.update.call(this)},e.prototype.setText=function(t){return this.text=t,this},e}(et),rt=function(t){function e(e){return t.call(this,e)||this}return E(e,t),e.prototype.update=function(){this.setTexture((this.active?"Active":"Inactive")+"_"+(this.hover?"Hover":"NoHover")),this.cursor=this.hover?W.pointer:W.auto,t.prototype.update.call(this)},e}(et),st=function(){function t(t){this.sprites=[],this.playables=[],this.points=[],this.audioContext=null,this.audioContext=t.audioContext||new AudioContext}return t.prototype.addSprite=function(t){return this.sprites.includes(t)||(this.sprites.push(t),t.container=this),this},t.prototype.removeSprite=function(t){return this.sprites.includes(t)&&(this.sprites.splice(this.sprites.indexOf(t),1),t.container=null),this},t.prototype.addPlayable=function(t){return this.playables.includes(t)||this.playables.push(t),this},t.prototype.removePlayable=function(t){return this.playables.includes(t)&&this.playables.splice(this.playables.indexOf(t),1),this},t.prototype.addPoint=function(t){return this.points.includes(t)||this.points.push(t),this},t.prototype.removePoint=function(t){return this.points.includes(t)&&this.points.splice(this.points.indexOf(t),1),this},t}(),at=function(t){function e(e){var i=t.call(this,e)||this;return i.canvas=null,i.ctx=null,i.touchPointIndex={},i.keyIndex={},i.mousePoint={active:null,captured:!1,clicked:!1,down:!1,firstDown:!1,hover:null,id:"mouse",tx:0,ty:0,type:"Mouse",x:0,y:0},i.pointDownEvent=new tt,i.pointUpEvent=new tt,i.pointMoveEvent=new tt,i.mouseDownEvent=new tt,i.mouseUpEvent=new tt,i.mouseMoveEvent=new tt,i.touchCancelEvent=new tt,i.touchEndEvent=new tt,i.touchMoveEvent=new tt,i.touchStartEvent=new tt,i.keyDownEvent=new tt,i.keyUpEvent=new tt,i.events=[{target:null,event:"mousedown",listener:function(t){return i.mouseDown(t)}},{target:document.body,event:"mouseup",listener:function(t){return i.mouseUp(t)}},{target:null,event:"mousemove",listener:function(t){return i.mouseMove(t)}},{target:null,event:"touchstart",listener:function(t){return i.touchStart(t)}},{target:document.body,event:"touchend",listener:function(t){return i.touchEnd(t)}},{target:null,event:"touchmove",listener:function(t){return i.touchMove(t)}},{target:document.body,event:"touchcancel",listener:function(t){return i.touchCancel(t)}}],i.keyboardEvents=[{target:document.body,event:"keydown",listener:function(t){return i.keyDown(t)}},{target:document.body,event:"keyup",listener:function(t){return i.keyUp(t)}}],i.canvas=e.canvas,i.canvas||(i.canvas=document.createElement("canvas"),document.body.appendChild(i.canvas)),i.canvas.width=e.width,i.canvas.height=e.height,i.ctx=i.canvas.getContext("2d"),i.hookEvents(),i.addPoint(i.mousePoint),i}return E(e,t),e.prototype.hookEvents=function(){var t=this;this.events.forEach(function(e){return(e.target||t.canvas).addEventListener(e.event,e.listener)}),this.keyboardEvents.forEach(function(e){return(e.target||t.canvas).addEventListener(e.event,e.listener)})},e.prototype.dispose=function(){var t=this;this.events.forEach(function(e){return(e.target||t.canvas).removeEventListener(e.event,e.listener)})},e.prototype.mouseDown=function(t){return this.mouseDownEvent.emit({down:!0,eventType:"MouseDown",rawEvent:t,source:this,stage:this,x:t.clientX,y:t.clientY}),this.pointDown(this.mousePoint,t)},e.prototype.mouseUp=function(t){return this.pointUp(this.mousePoint,t)},e.prototype.mouseMove=function(t){return this.pointMove(this.mousePoint,t)},e.prototype.touchStart=function(t){for(var e,i,n=0;n<t.changedTouches.length;n++)this.touchStartEvent.emit({down:!0,eventType:"TouchStart",rawEvent:t,source:this,stage:this,touch:e=t.changedTouches[n],x:e.clientX,y:e.clientY}),i=this.addTouchPoint(e),this.pointDown(i,e)},e.prototype.touchEnd=function(t){for(var e=null,i=0;i<t.changedTouches.length;i++)this.touchEndEvent.emit({down:!1,eventType:"TouchEnd",rawEvent:t,source:this,stage:this,touch:e=t.changedTouches[i],x:e.clientX,y:e.clientY}),this.pointUp(this.touchPointIndex[e.identifier],e),this.removeTouchPoint(e)},e.prototype.touchCancel=function(t){for(var e=null,i=0;i<t.changedTouches.length;i++)this.touchCancelEvent.emit({down:!1,eventType:"TouchCancel",rawEvent:t,source:this,stage:this,touch:e=t.changedTouches[i],x:null,y:null}),this.pointCancel(this.touchPointIndex[e.identifier],e),this.removeTouchPoint(e)},e.prototype.touchMove=function(t){for(var e=null,i=0;i<t.changedTouches.length;i++)this.touchMoveEvent.emit({down:!0,eventType:"TouchMove",rawEvent:t,source:this,stage:this,touch:e=t.changedTouches[i],x:e.clientX,y:e.clientY}),this.pointMove(this.touchPointIndex[e.identifier],e)},e.prototype.pointDown=function(t,e){var i=t.down;i||(t.down=!0,t.firstDown=!0);var n=t.x,o=t.y;this.pointMove(t,e),i||(t.hover&&(t.active=t.hover,t.active.down=!0,t.active.active=!0,this.setFocus(t.hover),t.active.pointDownEvent.emit({down:!0,eventType:"PointDown",point:t,previousX:n,previousY:o,source:t.active,stage:this,x:t.x,y:t.y})),this.pointDownEvent.emit({down:!0,eventType:"PointDown",point:t,previousX:n,previousY:o,source:t.active,stage:this,x:t.x,y:t.y}),t.firstDown=!1)},e.prototype.pointUp=function(t,e){var i=t.x,n=t.y,o=null;this.pointMove(t,e),t.down&&(t.down=!1,t.active&&(t.active.down=!1,t.active.active=!1,t.active.pointUpEvent.emit({down:!1,eventType:"PointUp",point:t,previousX:i,previousY:n,source:t.active,stage:this,x:t.x,y:t.x}),t.hover===t.active&&t.active.pointClickEvent.emit({down:!1,eventType:"PointClick",point:t,previousX:i,previousY:n,source:t.active,stage:this,x:t.x,y:t.x}),o=t.active,t.active=null),this.pointUpEvent.emit({down:!1,eventType:"PointUp",point:t,previousX:i,previousY:n,source:o||this,stage:this,x:t.x,y:t.x}))},e.prototype.pointMove=function(t,e){var i,n,o=Date.now(),r=this.canvas.getBoundingClientRect(),s=t.x,a=t.y;t.x=e.clientX-r.left,t.y=e.clientY-r.top,t.hover&&(t.hover.hover=!1,t.hover=null),this.sprites.sort(q);for(var h=this.sprites.length-1;h>=0;h--)if(n=(i=this.sprites[h]).isHovering(t,o)){n.hover=!0,t.hover=n,n.pointCollision(t),n.pointMoveEvent.emit({down:t.down,eventType:"PointMove",point:t,previousX:s,previousY:a,source:i,stage:this,x:t.x,y:t.y});break}this.pointMoveEvent.emit({down:t.down,eventType:"PointMove",point:t,previousX:s,previousY:a,source:i,stage:this,x:t.x,y:t.y})},e.prototype.pointCancel=function(t,e){t.active&&(t.active.active=!1,t.active=null),t.hover&&(t.hover.hover=!1,t.hover=null)},e.prototype.createInteractionPoint=function(t,e){return{active:null,captured:!1,clicked:!1,down:!1,firstDown:!1,hover:null,id:t,tx:0,ty:0,type:e,x:0,y:0}},e.prototype.addTouchPoint=function(t){var e=this.createInteractionPoint(t.identifier.toString(),"Touch");return this.addPoint(e),this.touchPointIndex[t.identifier]=e,e},e.prototype.removeTouchPoint=function(t){var e=this.touchPointIndex[t.identifier];delete this.touchPointIndex[t.identifier],this.removePoint(e)},e.prototype.hoverCheck=function(t){var e,i,n,o,r,s;try{for(var a=I(this.points),h=a.next();!h.done;h=a.next()){(r=h.value).hover&&(r.hover.hover=!1,r.hover=null);try{for(var l=I(this.sprites),u=l.next();!u.done;u=l.next())if((s=u.value).isHovering(r,t)){s.pointCollision(r),r.hover=s,s.hover=!0;break}}catch(t){n={error:t}}finally{try{u&&!u.done&&(o=l.return)&&o.call(l)}finally{if(n)throw n.error}}}}catch(t){e={error:t}}finally{try{h&&!h.done&&(i=a.return)&&i.call(a)}finally{if(e)throw e.error}}},e.prototype.keyUp=function(t){this.keyUpEvent.emit({down:!1,eventType:"KeyUp",key:t.key,source:this,stage:this}),this.keyIndex[t.key]=!1},e.prototype.keyDown=function(t){var e,i;this.keyIndex[t.key]=!0,this.keyDownEvent.emit({down:!0,eventType:"KeyDown",key:t.key,source:this,stage:this});try{for(var n=I(this.sprites),o=n.next();!o.done;o=n.next()){var r=o.value;r.focused&&r.keyDownEvent.emit({down:!0,eventType:"KeyDown",key:t.key,source:r,stage:this})}}catch(t){e={error:t}}finally{try{o&&!o.done&&(i=n.return)&&i.call(n)}finally{if(e)throw e.error}}},e.prototype.setFocus=function(t){var e,i;try{for(var n=I(this.sprites),o=n.next();!o.done;o=n.next()){o.value.focus(t)}}catch(t){e={error:t}}finally{try{o&&!o.done&&(i=n.return)&&i.call(n)}finally{if(e)throw e.error}}},e}(st),ht=document.createElement("canvas").getContext("2d"),lt=function(t){function e(e){var i=t.call(this,e)||this;return i.text="",i.font="monospace",i.fontSize=12,i.fontColor="black",i.textAlign=K.start,i.textBaseline=V.hanging,i.text=e.text||i.text,i.font=e.font||i.font,i.fontSize=e.fontSize||i.fontSize,i.fontColor=e.fontColor||i.fontColor,i.textBaseline=e.textBaseline||i.textBaseline,i.textAlign=e.textAlign||i.textAlign,i}return E(e,t),e.prototype.update=function(){this.height=this.fontSize,ht.font=this.fontSize+"px "+this.font,this.width=ht.measureText(this.text).width},e.prototype.render=function(t){t.translate(.5*this.textures[this.texture].width,.5*this.textures[this.texture].height),t.textBaseline=this.textBaseline,t.textAlign=this.textAlign,t.font=this.fontSize+"px "+this.font,t.fillStyle=this.fontColor,t.fillText(this.text,0,0)},e.prototype.setText=function(t){return this.text=t,this},e}(et),ut=function(t,e){return t.z-e.z},ct=function(t){function e(e){var i=t.call(this,e)||this;return i.sprites=[],i.sprites=e.sprites||i.sprites,i}return E(e,t),e.prototype.addSprite=function(t){return t.parent=this,this.sprites.push(t),this},e.prototype.interpolate=function(e){var i,n;if(!(e<=this.lastInterpolated)){t.prototype.interpolate.call(this,e);try{for(var o=I(this.sprites),r=o.next();!r.done;r=o.next()){r.value.interpolate(e)}}catch(t){i={error:t}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}}},e.prototype.removeSprite=function(t){return this.sprites.includes(t)&&(this.sprites.splice(this.sprites.indexOf(t),1),t.parent=null),this},e.prototype.broadPhase=function(e){var i,n;this.sprites.sort(ut);try{for(var o=I(this.sprites),r=o.next();!r.done;r=o.next()){var s=r.value;s.down=!1,s.hover=!1}}catch(t){i={error:t}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}return t.prototype.broadPhase.call(this,e)},e.prototype.narrowPhase=function(t){for(var e=null,i=null,n=this.sprites.length-1;n>=0;n--)if(X(t,(e=this.sprites[n]).inverse),e.broadPhase(t)&&(i=e.narrowPhase(t)))return i;return this},e.prototype.update=function(){var t,e;this.hover=!1;try{for(var i=I(this.sprites),n=i.next();!n.done;n=i.next()){var o=n.value;o.update(),o.hover&&(this.hover=o.hover,this.cursor=o.cursor)}}catch(e){t={error:e}}finally{try{n&&!n.done&&(e=i.return)&&e.call(i)}finally{if(t)throw t.error}}},e.prototype.render=function(e){var i,n;t.prototype.render.call(this,e),e.beginPath(),e.rect(0,0,this.width,this.height),e.clip();try{for(var o=I(this.sprites),r=o.next();!r.done;r=o.next()){var s=r.value;e.save(),e.transform(s.interpolatedPosition[0],s.interpolatedPosition[1],s.interpolatedPosition[2],s.interpolatedPosition[3],s.interpolatedPosition[4],s.interpolatedPosition[5]),e.globalAlpha*=s.interpolatedAlpha,s.render(e),e.restore()}}catch(t){i={error:t}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}},e.prototype.focus=function(e){var i,n;try{for(var o=I(this.sprites),r=o.next();!r.done;r=o.next()){r.value.focus(e)}}catch(t){i={error:t}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}t.prototype.focus.call(this,e)},e.prototype.skipAnimation=function(e){var i,n,o=t.prototype.skipAnimation.call(this,e);try{for(var r=I(this.sprites),s=r.next();!s.done;s=r.next()){o=s.value.skipAnimation(e)||o}}catch(t){i={error:t}}finally{try{s&&!s.done&&(n=r.return)&&n.call(r)}finally{if(i)throw i.error}}return o},e}(et),pt=function(){function t(t){this.started=0,this.length=0,this.start=0,this.end=0,this.loop=!1,this.state=G.Stopped,this.context=t.context,this.definition=t.definition,this.start=this.definition.spritemap[t.texture].start,this.end=this.definition.spritemap[t.texture].end,this.length=this.end-this.start,this.gain=t.context.createGain(),this.loaded=this.createSource(t.source,t.context),this.destination=t.context.destination}return t.prototype.play=function(){var t=this;return this.loaded.then(function(e){return t.createPlayInstance()}),this},t.prototype.stop=function(){return this},t.prototype.pause=function(){return this},t.prototype.setVolume=function(t){if(t<0||t>1)throw new Error("setVolume() accepts a number between 0 and 1; got "+t+".");return this.gain.gain.value=t,this},t.prototype.createSource=function(t,e){return C(this,void 0,void 0,function(){var i,n;return z(this,function(o){switch(o.label){case 0:return[4,t];case 1:return[4,o.sent().arrayBuffer()];case 2:return i=o.sent(),n=this,[4,e.decodeAudioData(i)];case 3:return n.source=o.sent(),[2]}})})},t.prototype.createPlayInstance=function(){var t=this.context.createBufferSource();t.buffer=this.source,t.loop=this.loop,t.connect(this.gain),t.start(0,this.start,this.length);var e=this.gain;t.addEventListener("ended",function i(n){t.disconnect(e),t.removeEventListener("ended",i)})},t}(),dt=function(t){function e(e){var i=t.call(this,e)||this;return i.value=0,i.max=1,i.min=0,i.width=100,i.valueChangeEvent=new tt,i.sliderPattern=null,i.pillTexture=null,i.height=e.textures.Pill_Hover.height,i.width=e.width,i.max=e.max||i.max,i.min=e.min||i.min,i.value=e.value||i.value,i.sliderPattern=document.createElement("canvas").getContext("2d").createPattern(e.textures.Line,"repeat-x"),i}return E(e,t),e.prototype.broadPhase=function(e){return!!this.active||t.prototype.broadPhase.call(this,e)},e.prototype.narrowPhase=function(t){if(this.active||t.firstDown)return this;var e=(this.width-this.textures.Pill_Hover.width)*((this.value-this.min)/(this.max-this.min));return t.ty<=this.textures.Pill_Hover.height&&t.ty>=0&&t.tx>=e&&t.tx<=e+this.textures.Pill_Hover.width?this:void 0},e.prototype.pointCollision=function(e){if(t.prototype.pointCollision.call(this,e),this.active&&e.active===this){var i=this.value,n=this.width-this.textures.Pill_Hover.width,o=Math.max(0,Math.min(e.tx-.5*this.textures.Pill_Hover.width,n));this.value=this.min+(this.max-this.min)*o/n,this.value!==i&&this.valueChangeEvent.emit({eventType:"ValueChange",previousValue:i,property:"value",source:this,stage:this.container,value:this.value})}return!0},e.prototype.update=function(){this.cursor=this.hover?W.pointer:W.auto,this.pillTexture=this.active?this.textures.Pill_Active:this.hover?this.textures.Pill_Hover:this.textures.Pill},e.prototype.render=function(t){t.drawImage(this.textures.Line_Cap_Left,0,0),t.drawImage(this.textures.Line_Cap_Right,this.width-this.textures.Line_Cap_Right.width,0),t.fillStyle=this.sliderPattern,t.fillRect(this.textures.Line_Cap_Left.width,0,this.width-this.textures.Line_Cap_Left.width-this.textures.Line_Cap_Right.width,this.textures.Line.height),t.drawImage(this.pillTexture,(this.width-this.textures.Pill_Hover.width)*((this.value-this.min)/(this.max-this.min)),0)},e}(et),ft=function(t){function e(e){var i=t.call(this,e)||this;return i.postInterpolateEvent=new tt,i.preInterpolateEvent=new tt,i.preHoverCheckEvent=new tt,i.postHoverCheckEvent=new tt,i.preUpdateEvent=new tt,i.postUpdateEvent=new tt,i.preRenderEvent=new tt,i.postRenderEvent=new tt,i}return E(e,t),e.prototype.update=function(){var t,e,i,n,o=Date.now();this.preInterpolateEvent.emit({eventType:"PreInterpolate",source:this,stage:this});try{for(var r=I(this.sprites),s=r.next();!s.done;s=r.next())s.value.interpolate(o)}catch(e){t={error:e}}finally{try{s&&!s.done&&(e=r.return)&&e.call(r)}finally{if(t)throw t.error}}this.postInterpolateEvent.emit({eventType:"PostInterpolate",source:this,stage:this}),this.preHoverCheckEvent.emit({eventType:"PreHoverCheck",source:this,stage:this}),this.hoverCheck(o),this.postHoverCheckEvent.emit({eventType:"PostHoverCheck",source:this,stage:this}),this.preUpdateEvent.emit({eventType:"PreUpdate",source:this,stage:this});try{for(var a=I(this.sprites),h=a.next();!h.done;h=a.next())h.value.update()}catch(t){i={error:t}}finally{try{h&&!h.done&&(n=a.return)&&n.call(a)}finally{if(i)throw i.error}}return this.postUpdateEvent.emit({eventType:"PostUpdate",source:this,stage:this}),this},e.prototype.render=function(){var t,e,i;this.preRenderEvent.emit({eventType:"PreRender",source:this,stage:this});var n=W.auto,o=this.ctx;o.clearRect(0,0,this.canvas.width,this.canvas.height);try{for(var r=I(this.sprites),s=r.next();!s.done;s=r.next())i=s.value,o.save(),o.setTransform(i.interpolatedPosition[0],i.interpolatedPosition[1],i.interpolatedPosition[2],i.interpolatedPosition[3],i.interpolatedPosition[4],i.interpolatedPosition[5]),o.globalAlpha=i.interpolatedPosition[6],i.render(o),o.restore(),n=n||i.hover&&i.cursor}catch(e){t={error:e}}finally{try{s&&!s.done&&(e=r.return)&&e.call(r)}finally{if(t)throw t.error}}return this.canvas.style.cursor=n,this.postRenderEvent.emit({eventType:"PostRender",source:this,stage:this}),this},e.prototype.skipAnimations=function(){var t,e,i=Date.now(),n=!1;try{for(var o=I(this.sprites),r=o.next();!r.done;r=o.next()){r.value.skipAnimation(i)&&(n=!0)}}catch(e){t={error:e}}finally{try{r&&!r.done&&(e=o.return)&&e.call(o)}finally{if(t)throw t.error}}return n},e}(at),vt=document.createElement("canvas").getContext("2d"),yt=function(t){function e(e){var i=t.call(this,e)||this;return i.text="",i.textSpeed=1,i.textIndex=0,i.padding={bottom:5,left:5,right:5,top:5},i.fontSize=12,i.font="monospace",i.fontColor="black",i.lineHeight=16,i.textAlign=K.left,i.textBaseline=V.hanging,i.interpolatedText=[""],i.text=e.text||i.text,i.textSpeed=e.textSpeed||i.textSpeed,e.hasOwnProperty("textIndex")&&(i.textIndex=e.textIndex),i.padding=e.padding||i.padding,i.fontSize=e.fontSize||i.fontSize,i.font=e.font||i.font,i.fontColor=e.fontColor||i.fontColor,i.lineHeight=e.lineHeight||i.lineHeight,i.setTexture("Texture"),i}return E(e,t),e.prototype.update=function(){var t,i,n=this.textures[this.texture].width-this.padding.left-this.padding.right;this.textIndex=Math.min(this.text.length,this.textIndex+this.textSpeed);var o=this.text.match(e.regex);this.interpolatedText=[""];var r=(this.textures[this.texture].height-this.padding.top-this.padding.bottom)/this.lineHeight,s="",a=0,h=this.textIndex;vt.font=this.fontSize+"px "+this.font;try{for(var l=I(o),u=l.next();!u.done;u=l.next()){var c=u.value;if("\n"!==c&&"\r\n"!==c&&"\r"!==c){if(s=this.interpolatedText[a],0===h)break;if(a+1>r)break;if(vt.measureText(s+=c).width>n&&(a=this.interpolatedText.push("")-1),this.interpolatedText[a]+=c,(h-=c.length)<0){this.interpolatedText[a]=this.interpolatedText[a].slice(0,h);break}}else this.interpolatedText.push(""),h-=c.length,a+=1}}catch(e){t={error:e}}finally{try{u&&!u.done&&(i=l.return)&&i.call(l)}finally{if(t)throw t.error}}},e.prototype.render=function(e){var i,n;t.prototype.render.call(this,e);var o=this.textures[this.texture].height-this.padding.top,r=this.padding.top;e.font=this.fontSize+"px "+this.font,e.fillStyle=this.fontColor,e.textAlign=this.textAlign,e.textBaseline=this.textBaseline,e.beginPath(),e.rect(this.padding.left,this.padding.bottom,this.width-this.padding.right,this.height-this.padding.top),e.clip();try{for(var s=I(this.interpolatedText),a=s.next();!a.done;a=s.next()){if(r+this.fontSize>o)break;e.fillText(a.value,this.padding.left,r),r+=this.lineHeight}}catch(t){i={error:t}}finally{try{a&&!a.done&&(n=s.return)&&n.call(s)}finally{if(i)throw i.error}}},e.prototype.setText=function(t){return t.startsWith(this.text)?(this.text=t,this):(this.text=t,this.interpolatedText=[""],this.textIndex=0,this)},e.prototype.appendText=function(t){return this.text+=t,this},e.prototype.skipAnimation=function(e){var i=t.prototype.skipAnimation.call(this,e)&&this.textIndex<this.text.length;return this.textIndex=this.text.length,i},e.regex=/\r\n|\r|\n|[^\t ]*[\t ]?/g,e}(et),xt=document.createElement("canvas").getContext("2d"),wt=function(t){function e(e){var i=t.call(this,e)||this;return i.text="",i.font="monospace",i.fontSize=12,i.fontColor="black",i.caretIndex=0,i.caretX=0,i.selection=[0,0],i.textScroll=0,i.padding=[2,2,2,2],i.frameCount=0,i.showCaret=!0,i.text=e.text||i.text,i.font=e.font||i.font,i.fontSize=e.fontSize||i.fontSize,i.fontColor=e.fontColor||i.fontColor,i.width=e.width||i.width,i.height=e.height||i.height,i}return E(e,t),e.prototype.update=function(){xt.font=this.fontSize+"px "+this.font;xt.measureText(this.text);this.caretX=xt.measureText(this.text.slice(0,this.caretIndex)).width;var t=this.caretX+this.textScroll,e=this.width-this.padding[0]-this.padding[1];t<0?(console.log("hit less than 0"),this.textScroll+=t):t>e&&(console.log("hit greater than"),this.textScroll-=t-e),this.frameCount+=1,this.frameCount>=30&&(this.frameCount=0,this.showCaret=!this.showCaret)},e.prototype.render=function(t){if(t.fillStyle="black",t.lineWidth=1,t.strokeRect(0,0,this.width,this.height),t.beginPath(),t.rect(this.padding[0],this.padding[2],this.width-this.padding[1]-this.padding[0],this.width-this.padding[3]),t.clip(),t.font=this.fontSize+"px "+this.font,t.fillStyle=this.fontColor,t.textBaseline=V.top,t.fillText(this.text,this.textScroll+this.padding[0],0),this.showCaret){var e=this.textScroll+this.padding[0]+this.caretIndex;t.beginPath(),t.moveTo(e,this.padding[2]),t.lineTo(e,this.height-this.padding[3]),t.stroke()}},e.prototype.setText=function(t){return this.text=t,this},e}(et);t.Matrix=Q,t.Ease=T,t.Util=$,t.Spritesheet=Z,t.Button=it,t.Character=nt,t.Checkbox=ot,t.Close=rt,t.Container=st,t.InteractionManager=at,t.Label=lt,t.Panel=ct,t.SFXSprite=pt,t.Slider=dt,t.Sprite=et,t.Stage=ft,t.Textbox=yt,t.TextInput=wt});
//# sourceMappingURL=senpai-stage.umd.js.map
